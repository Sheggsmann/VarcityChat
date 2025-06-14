import { IConversationDocument } from '@chat/interfaces/chat.interface';
import { addConversationSchema } from '@chat/schemes/chat.scheme';
import { validator } from '@global/decorators/joi-validation-decorator';
import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { ioInstance } from '@root/shared/sockets/user';
import { chatService } from '@service/db/chat.service';
import { notificationService } from '@service/db/notification.service';
import { userService } from '@service/db/user.service';
import { ChatCache } from '@service/redis/chat.cache';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const chatCache = new ChatCache();

class Add {
  @validator(addConversationSchema)
  public async conversation(req: Request, res: Response): Promise<void> {
    const { targetUserId } = req.body;
    if (!targetUserId) throw new BadRequestError('userId is required');

    const targetUser = await userService.getUserById(targetUserId);
    if (!targetUser) throw new NotFoundError('Target User does not exist');

    const currentAuthUser = await userService.getUserById(req.currentUser!.userId);

    const conversation: IConversationDocument = await chatService.initializeConversation(
      req.currentUser!.userId,
      targetUserId
    );

    await notificationService.saveNotificationToDb(
      targetUserId,
      {
        body: `${currentAuthUser?.firstname}: sent you a new message request`,
        title: 'New Message Request'
      },
      `${req.currentUser!.userId}`
    );

    ioInstance.to(targetUserId).emit('new-message-request', {
      conversationId: conversation._id,
      targetUserId,
      targetUser,
      fromUser: currentAuthUser
    });

    ioInstance.to(targetUserId).emit('new-notification', {
      conversationId: conversation._id,
      targetUserId,
      targetUser,
      fromUser: currentAuthUser
    });

    // Add user to conversation partners
    await chatCache.addUserConversationPartner(req.currentUser!.userId, {
      _id: conversation._id.toString(),
      user1: req.currentUser!.userId,
      user2: targetUserId,
      status: conversation.status
    });

    // Send push notification to user
    await notificationService.sendNotificationToUser(targetUserId, {
      title: 'New Message Request',
      body: `${currentAuthUser?.firstname}: sent you a new message request`
    });

    res.status(HTTP_STATUS.CREATED).json({ message: 'Conversation created', conversation });
  }
}

export const createChat: Add = new Add();
