import { IMessageDocument, MEDIA_TYPE } from '@chat/interfaces/chat.interface';
import { Model, model, Schema } from 'mongoose';

const messageSchema: Schema = new Schema<IMessageDocument>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: false },
  audio: { type: String, required: false },
  mediaUrls: [String],
  mediaType: {
    type: String,
    required: false,
    enum: [MEDIA_TYPE.audio, MEDIA_TYPE.video, MEDIA_TYPE.image]
  },
  reply: {
    messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: false },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    mediaType: {
      type: String,
      enum: [MEDIA_TYPE.audio, MEDIA_TYPE.video, MEDIA_TYPE.image]
    },
    mediaUrl: String
  },
  seenAt: Date,
  readAt: Date,
  localId: String,
  sequence: { type: Number, required: true },
  localSequence: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const MessageModel: Model<IMessageDocument> = model<IMessageDocument>(
  'Message',
  messageSchema,
  'Message'
);
