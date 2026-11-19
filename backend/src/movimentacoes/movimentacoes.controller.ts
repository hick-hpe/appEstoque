import {
  Controller,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import { MovimentacoesService } from './movimentacoes.service';
import { CreateMovimentacaoDto } from '../dto/create-movimentacao.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Movimentações')
@Controller('movimentacoes')
export class MovimentacoesController {
  constructor(private movimentacoesService: MovimentacoesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar movimentação de estoque' })
  @ApiResponse({
    status: 201,
    description: 'Movimentação registrada com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou estoque insuficiente.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  create(@Body() dto: CreateMovimentacaoDto) {
    return this.movimentacoesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as movimentações' })
  @ApiResponse({ status: 200, description: 'Lista de movimentações.' })
  findAll() {
    return this.movimentacoesService.findAll();
  }
}