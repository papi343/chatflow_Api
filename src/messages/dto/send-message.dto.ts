import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";





export class SendMessageDto {
    @IsUUID()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    attachmentUrl?: string;
}
