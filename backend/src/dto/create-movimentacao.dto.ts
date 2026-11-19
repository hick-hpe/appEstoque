import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsEnum } from 'class-validator';
import { TipoMovimentacao } from '@prisma/client';

export class CreateMovimentacaoDto {
  @ApiProperty({
    enum: TipoMovimentacao,
    example: TipoMovimentacao.ENTRADA,
  })
  @IsEnum(TipoMovimentacao)
  tipo: TipoMovimentacao;

  @ApiProperty({ example: 10 })
  @IsInt()
  @IsPositive()
  quantidade: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  produtoId: number;
}