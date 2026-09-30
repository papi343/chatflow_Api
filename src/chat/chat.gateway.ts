import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards, UseFilters, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { WsExceptionFilter } from '../common/filters/ws-exception.filter';
import { MessagesService } from '../messages/messages.service';
import { ChatService } from './chat.service';
import { SendMessageDto } from '../messages/dto/send-message.dto';

@UseFilters(WsExceptionFilter)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger = new Logger(ChatGateway.name);

    constructor(
        private messagesService: MessagesService,
        private chatService: ChatService,
        private jwtService: JwtService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token =
                client.handshake?.auth?.token ||
                (client.handshake?.headers?.authorization as string)?.split(' ')[1];

            if (!token) {
                client.disconnect();
                return;
            }

            // Réutilise la même vérification que le Guard, mais ici manuellement
            // car handleConnection s'exécute AVANT que les Guards s'appliquent aux messages
            const payload = this.verifyToken(token);
            client.data.user = { id: payload.sub, username: payload.username };

            await this.chatService.setOnline(payload.sub);
            client.broadcast.emit('userOnline', { userId: payload.sub });

            this.logger.log(`Client connecté : ${payload.username}`);
        } catch {
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        const user = client.data.user;
        if (!user) return;

        await this.chatService.setOffline(user.id);
        client.broadcast.emit('userOffline', { userId: user.id });

        this.logger.log(`Client déconnecté : ${user.username}`);
    }

    @SubscribeMessage('joinConversation')
    handleJoinConversation(
        @MessageBody() data: { conversationId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`conversation:${data.conversationId}`);
    }

    @SubscribeMessage('leaveConversation')
    handleLeaveConversation(
        @MessageBody() data: { conversationId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(`conversation:${data.conversationId}`);
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() dto: SendMessageDto,
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.messagesService.sendMessage(client.data.user.id, dto);

        this.server
            .to(`conversation:${dto.conversationId}`)
            .emit('newMessage', message);

        return message;
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('typing')
    handleTyping(
        @MessageBody() data: { conversationId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.to(`conversation:${data.conversationId}`).emit('userTyping', {
            userId: client.data.user.id,
            username: client.data.user.username,
        });
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('stopTyping')
    handleStopTyping(
        @MessageBody() data: { conversationId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.to(`conversation:${data.conversationId}`).emit('userStoppedTyping', {
            userId: client.data.user.id,
        });
    }

    private verifyToken(token: string): any {
        return this.jwtService.verify(token);
    }
}