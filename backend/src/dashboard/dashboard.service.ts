import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument, TicketStatus, TicketPriority } from '../common/schemas/ticket.schema';

interface AuthUser {
  _id: string | Types.ObjectId;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async getStats(user: AuthUser) {
    const userId = new Types.ObjectId(user._id.toString());

    const [openTickets, closedTickets, highPriority, assignedToMe] =
      await Promise.all([
        this.ticketModel.countDocuments({ status: TicketStatus.OPEN }),
        this.ticketModel.countDocuments({ status: TicketStatus.CLOSED }),
        this.ticketModel.countDocuments({
          priority: { $in: [TicketPriority.HIGH, TicketPriority.CRITICAL] },
          status: { $ne: TicketStatus.CLOSED },
        }),
        this.ticketModel.countDocuments({ assignedTo: userId }),
      ]);

    return { openTickets, closedTickets, highPriority, assignedToMe };
  }
}
