import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma.service';

@Controller('messaging')
export class MessagingController {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly prismaService: PrismaService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('send')
  async sendMessage(
    @Body()
    data: {
      content: string;
      receiverId: number;
      senderId: number;
      conversationId: number;
    },
  ) {
    if (!data.senderId && !data.receiverId) {
      return {
        error: 'Missing senderId or receiverId',
      };
    }
    const conversationIdA = `${data.senderId}-${data.receiverId}`;
    const conversationIdB = `${data.receiverId}-${data.senderId}`;

    // Try to find an existing conversation with either identifier
    try {
      let conversation = await this.prismaService.conversation.findFirst({
        where: {
          OR: [
            { identifier: conversationIdA },
            { identifier: conversationIdB },
          ],
        },
      });

      // If no conversation was found, create a new one
      if (!conversation) {
        conversation = await this.prismaService.conversation.create({
          data: {
            identifier: conversationIdA, // Use conversationIdA or conversationIdB here
            participants: {
              connect: [{ id: data.senderId }, { id: data.receiverId }],
            },
          },
        });
      }

      data.conversationId = conversation.id;
      return this.messagingService.sendMessage(data);
    } catch (error) {
      console.log(error);
      return {
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Get('conversations')
  async getConversations(@Req() req) {
    return this.messagingService.getUserConversations(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('conversation/:id')
  async getConversation(@Param('id') conversationId: number) {
    return this.messagingService.getConversation(+conversationId);
  }
}
