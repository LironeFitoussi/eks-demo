import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../common/schemas/comment.schema';
import { Ticket, TicketDocument } from '../common/schemas/ticket.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

interface AuthUser {
  _id: string | Types.ObjectId;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async findByTicket(ticketId: string) {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.commentModel
      .find({ ticketId: new Types.ObjectId(ticketId) })
      .populate('authorId', 'name email')
      .lean();
  }

  async create(ticketId: string, dto: CreateCommentDto, user: AuthUser) {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    const comment = await this.commentModel.create({
      ticketId: new Types.ObjectId(ticketId),
      authorId: new Types.ObjectId(user._id.toString()),
      message: dto.message,
    });
    return comment.populate('authorId', 'name email');
  }
}
