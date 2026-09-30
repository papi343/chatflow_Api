import { Catch, ArgumentsHost, WsExceptionFilter as IWsExceptionFilter } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const client = host.switchToWs().getClient();
        client.emit('error', {
            message: exception.message || 'Une erreur est survenue.',
        });
    }
}