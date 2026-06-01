import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AttachmentsService } from './attachments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { IsString } from 'class-validator';

class UploadAttachmentDto {
  @IsString()
  ticketId: string;
}

@Controller('attachments')
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
  constructor(private attachmentsService: AttachmentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadAttachmentDto,
    @Request() req: { user: { _id: string } },
  ) {
    return this.attachmentsService.upload(body.ticketId, file, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentsService.findOne(id);
  }
}
