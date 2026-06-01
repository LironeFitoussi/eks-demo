import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TicketPriority } from '../../common/schemas/ticket.schema';

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsString()
  department?: string;
}
