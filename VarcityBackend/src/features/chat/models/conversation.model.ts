import { IConversationDocument } from '@chat/interfaces/conversation.interface';
import { Model, Schema, model } from 'mongoose';

const conversationSchema = new Schema<IConversationDocument>(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    lastMessageTimestamp: { type: Date, default: null },
    unreadCountUser1: { type: Number, default: 0 },
    unreadCountUser2: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>(
  'Conversation',
  conversationSchema,
  'Conversation'
);
