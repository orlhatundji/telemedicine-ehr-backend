import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Conversation, Message, Prisma, User } from '@prisma/client';

@Injectable()
export class MessagingService {
  constructor(private prismaService: PrismaService) {}
  async sendMessage(
    data: Prisma.MessageUncheckedCreateInput,
  ): Promise<Message> {
    const message = await this.prismaService.message.create({
      data,
    });
    return message;
  }

  async getUserConversations(
    userId,
  ): Promise<{ id: number; participants: Pick<User, 'email' | 'id'>[] }[]> {
    const conversations = await this.prismaService.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        identifier: true,
        participants: {
          where: {
            id: {
              not: userId,
            },
          },
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return conversations;
  }

  async getConversation(conversationId): Promise<Conversation> {
    const conversations = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: false,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
          select: {
            content: true,
          },
        },
      },
    });

    return conversations;
  }
}
