import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) { }


  async create(userId: string, createConversationDto: CreateConversationDto) {
    // Ensure participantIds is an array and has at least the creator
    const participantIds = Array.from(new Set([...createConversationDto.participantIds, userId]));

    // Validate conversation type
    if (createConversationDto.type === 'private' && participantIds.length !== 2) {
      throw new BadRequestException("Private conversations must have exactly 2 participants");
    }

    return this.prisma.conversation.create({
      data: {
        type: createConversationDto.type,
        name: createConversationDto.type === 'group' ? createConversationDto.name : null,
        createdBy: userId,
        participants: {
          create: participantIds.map(id => ({ userId: id }))
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
              },
            },
          },
        },

      },
    });
  }


  async findAll(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }


  async findOne(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
      (p) => p.userId === userId
    );

    if (!isParticipant) {
      throw new ForbiddenException(
        "You are not a participant in this conversation"
      );
    }

    return conversation;
  }



}
