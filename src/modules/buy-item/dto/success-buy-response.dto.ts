import { ApiProperty } from "@nestjs/swagger";

export class SuccessBuyResponseDto{
  @ApiProperty()
  remainingBalance!: number;
}