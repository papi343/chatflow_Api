import { ArrayMaxSize, IsArray, IsString, IsEnum, IsOptional, IsNotEmpty } from "class-validator";




export enum ConversationTypeDto {
    private = 'private',
    group = 'group',

}


export class CreateConversationDto {
    @IsEnum(ConversationTypeDto)
    type: ConversationTypeDto;

    @IsOptional()
    @IsString()
    name?: string;

    @IsArray()
    @ArrayMaxSize(1)
    participantIds: string[];

}
