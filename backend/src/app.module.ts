import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { CommentsModule } from './comments/comments.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/helpdesk'),
    AuthModule,
    UsersModule,
    TicketsModule,
    CommentsModule,
    AttachmentsModule,
    DashboardModule,
  ],
})
export class AppModule {}
