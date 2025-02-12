/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CONVERSATION_STATUS,
  IConversationDocument,
  IMessageData
} from '@chat/interfaces/chat.interface';
import { UserSocket } from './user';
import {
  ChatJobs,
  chatQueue,
  ConversationJobs,
  conversationQueue
} from '@service/queues/chat.queue';
import { chatService } from '@service/db/chat.service';
import { addChatSchema } from '@chat/schemes/chat.scheme';
import { config } from '@root/config';
import Logger from 'bunyan';
import Joi from 'joi';
import { ObjectId } from 'mongodb';

const log: Logger = config.createLogger('ChatSocket Handler');

export class ChatHandler {
  private socket: UserSocket;

  constructor(socket: UserSocket) {
    this.socket = socket;
  }

  handle(): void {
    this.socket.on('new-message', async (message: IMessageData, callback) => {
      console.log('\nMESSAGE COMING IN:', message);

      const error = await this.validateChatMessage(message);
      if (error) {
        log.error('Validation Error:', error.details);
        this.socket.emit('validation-error', {
          message: 'Validation Failed',
          details: error.details
        });
        callback({ success: false });
        return;
      }

      // Check if the conversation hasn't been accepted by the other user
      if (message.conversationStatus === CONVERSATION_STATUS.pending) {
        const conversation: IConversationDocument | null = await chatService.getConversationById(
          `${message.conversationId}`
        );
        if (!conversation) {
          return;
        }
      }

      const messageObjectID = new ObjectId();
      const sequence = await chatService.getNextSequence(`${message.conversationId}`);
      message.sequence = sequence;
      message.createdAt = new Date();

      conversationQueue.addConversationJob(ConversationJobs.updateConversationForNewMessage, {
        value: {
          sender: message.sender,
          receiver: message.receiver,
          lastMessageTimestamp: message.createdAt,
          lastMessage: `${messageObjectID}`
        }
      });
      chatQueue.addChatJob(ChatJobs.addChatMessageToDB, {
        value: { ...message, _id: messageObjectID }
      });

      // TODO: send notification to user using queue
      console.log('SENDING MESSAGE TO RECEIVER:', message.receiver);

      this.socket
        .to(`${message.receiver}`)
        .emit('new-message', { _id: messageObjectID, ...message });
      if (callback) {
        callback({ success: true, messageId: messageObjectID });
      }
    });

    this.socket.on('typing', (data) => {});

    this.socket.on('message-read', (data) => {});
  }

  validateChatMessage(message: IMessageData): Promise<Joi.ValidationError | undefined> {
    const { error } = addChatSchema.validate(message);
    return Promise.resolve(error);
  }
}
