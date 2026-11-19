import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsInt, IsPositive } from 'class-validator';

export class CreateProdutoDto {
  @ApiProperty({ example: 'Teclado' }) // usado pelo Swagger para documentar o campo, mostrando exemplos e informações na documentação
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 150.50 })
  @IsNumber()
  @IsPositive()
  preco: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  categoriaId: number;
}