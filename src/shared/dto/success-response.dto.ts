import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty()
  message!: string;
}