import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Attachment, AttachmentDocument } from '../common/schemas/attachment.schema';

interface AuthUser {
  _id: string | Types.ObjectId;
}

@Injectable()
export class AttachmentsService {
  private s3: S3Client;
  private bucket: string;

  constructor(
    @InjectModel(Attachment.name) private attachmentModel: Model<AttachmentDocument>,
  ) {
    this.s3 = new S3Client({ region: process.env.AWS_REGION ?? 'us-east-1' });
    this.bucket = process.env.S3_BUCKET_NAME ?? 'helpdesk-attachments';
  }

  async upload(
    ticketId: string,
    file: Express.Multer.File,
    user: AuthUser,
  ) {
    const s3Key = `tickets/${ticketId}/${Date.now()}-${file.originalname}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    const s3Url = `https://${this.bucket}.s3.${process.env.AWS_REGION ?? 'us-east-1'}.amazonaws.com/${s3Key}`;
    const attachment = await this.attachmentModel.create({
      ticketId: new Types.ObjectId(ticketId),
      fileName: file.originalname,
      s3Key,
      s3Url,
      uploadedBy: new Types.ObjectId(user._id.toString()),
    });
    return attachment;
  }

  async findOne(id: string) {
    const attachment = await this.attachmentModel
      .findById(id)
      .populate('uploadedBy', 'name email')
      .lean();
    if (!attachment) throw new NotFoundException('Attachment not found');

    const signedUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: attachment.s3Key }),
      { expiresIn: 3600 },
    );
    return { ...attachment, signedUrl };
  }
}
