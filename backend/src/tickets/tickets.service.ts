import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument } from '../common/schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { UserRole } from '../common/schemas/user.schema';

interface AuthUser {
  _id: string | Types.ObjectId;
  role: UserRole;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async findAll(filter: FilterTicketDto) {
    const query: Record<string, unknown> = {};
    if (filter.status) query.status = filter.status;
    if (filter.priority) query.priority = filter.priority;
    if (filter.department) query.department = filter.department;
    if (filter.assignedTo) query.assignedTo = new Types.ObjectId(filter.assignedTo);
    return this.ticketModel
      .find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean();
  }

  async findOne(id: string) {
    const ticket = await this.ticketModel
      .findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean();
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async create(dto: CreateTicketDto, user: AuthUser) {
    const ticket = await this.ticketModel.create({
      ...dto,
      createdBy: new Types.ObjectId(user._id.toString()),
    });
    return ticket.populate(['createdBy', 'assignedTo']);
  }

  async update(id: string, dto: UpdateTicketDto, user: AuthUser) {
    const ticket = await this.ticketModel.findById(id);
    if (!ticket) throw new NotFoundException('Ticket not found');

    if (user.role === UserRole.EMPLOYEE) {
      throw new ForbiddenException('Employees cannot update tickets');
    }

    const updateData: Record<string, unknown> = { ...dto };
    if (dto.assignedTo) {
      updateData.assignedTo = new Types.ObjectId(dto.assignedTo);
    }

    const updated = await this.ticketModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean();
    return updated;
  }

  async remove(id: string) {
    const ticket = await this.ticketModel.findByIdAndDelete(id);
    if (!ticket) throw new NotFoundException('Ticket not found');
    return { deleted: true };
  }
}
