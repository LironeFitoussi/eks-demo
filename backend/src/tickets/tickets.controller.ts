import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/schemas/user.schema';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  findAll(@Query() filter: FilterTicketDto) {
    return this.ticketsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.EMPLOYEE, UserRole.AGENT, UserRole.ADMIN)
  create(@Body() dto: CreateTicketDto, @Request() req: { user: { _id: string; role: UserRole } }) {
    return this.ticketsService.create(dto, req.user);
  }

  @Put(':id')
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @Request() req: { user: { _id: string; role: UserRole } },
  ) {
    return this.ticketsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
