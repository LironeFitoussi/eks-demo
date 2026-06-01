import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttachmentDocument = Attachment & Document;

@Schema({ timestamps: true })
export class Attachment {
  @Prop({ type: Types.ObjectId, ref: 'Ticket', required: true })
  ticketId: Types.ObjectId;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  s3Key: string;

  @Prop({ required: true })
  s3Url: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
