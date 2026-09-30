import { ForbiddenException, Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) { }

  async sendMessage(senderId: string, dto: SendMessageDto) {
    const { conversationId, content, attachmentUrl } = dto
    await this.ensureParticipant(senderId, conversationId)
    return this.prisma.message.create({
      data: {
        content: content,
        attachmentUrl: attachmentUrl,
        senderId: senderId,
        conversationId: conversationId,

      },
      include: {
        sender: {
          select: { id: true, username: true, avatar: true }
        },
      },
    });
  }

  async markAsRead(userId: string, conversationId: string) {
    await this.ensureParticipant(userId, conversationId)
    return this.prisma.conversationParticipant.updateMany({
      where: { userId, conversationId },
      data: { lastReadAt: new Date(), }
    })
  }


  async findForConversation(userId: string, conversationId: string, cursor?: string) {
    await this.ensureParticipant(userId, conversationId)
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      include: {
        sender: {
          select: { id: true, username: true, avatar: true }
        },
      },
    });
  }



  private async ensureParticipant(userId: string, conversationId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      include: { conversation: true }
    })
    if (!participant) {
      throw new ForbiddenException("you must be participant in conversation")
    }
  }
}
