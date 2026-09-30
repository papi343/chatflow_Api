import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';


@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Req() req, @Body() createMessageDto: SendMessageDto) {
    return this.messagesService.sendMessage(req.user.id, createMessageDto);
  }

  @Get('conversation/:conversationId')
  findForConversation(@Req() req, @Param('conversationId') conversationId: string,
    @Query('cursor') cursor?: string) {
    return this.messagesService.findForConversation(req.user.id, conversationId, cursor);
  }


  @Post('conversation/:conversationId/read')
  markAsRead(
    @Req() req,
    @Param('conversationId') conversationId: string) {
    return this.messagesService.markAsRead(req.user.id, conversationId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.messagesService.remove(+id);
  // }
}
