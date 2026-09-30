import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async setOnline(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: 'online' },
        });
    }

    async setOffline(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: 'offline', lastSeenAt: new Date() },
        });
    }

    async getConversationParticipantIds(conversationId: string): Promise<string[]> {
        const participants = await this.prisma.conversationParticipant.findMany({
            where: { conversationId },
            select: { userId: true },
        });
        return participants.map((p) => p.userId);
    }
}