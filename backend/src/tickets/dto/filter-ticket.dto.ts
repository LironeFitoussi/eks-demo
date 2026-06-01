import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TicketStatus, TicketPriority } from '../../common/schemas/ticket.schema';

export class FilterTicketDto {
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}
