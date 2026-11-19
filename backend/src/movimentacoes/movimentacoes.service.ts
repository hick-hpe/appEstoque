import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMovimentacaoDto } from '../dto/create-movimentacao.dto';
import { TipoMovimentacao } from '@prisma/client';

@Injectable()
export class MovimentacoesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovimentacaoDto) {
    return this.prisma.$transaction(async (tx) => {
      const produto = await tx.produto.findUnique({
        where: { id: dto.produtoId },
      });

      if (!produto) {
        throw new NotFoundException(
          `Produto ${dto.produtoId} não encontrado.`,
        );
      }

      if (
        dto.tipo === TipoMovimentacao.SAIDA &&
        produto.quantidade < dto.quantidade
      ) {
        throw new BadRequestException(
          'Quantidade insuficiente em estoque para realizar a saída.',
        );
      }

      const novaQuantidade =
        dto.tipo === TipoMovimentacao.ENTRADA
          ? produto.quantidade + dto.quantidade
          : produto.quantidade - dto.quantidade;

      await tx.produto.update({
        where: { id: dto.produtoId },
        data: {
          quantidade: novaQuantidade,
        },
      });

      return tx.movimentacao.create({
        data: {
          tipo: dto.tipo,
          quantidade: dto.quantidade,
          produtoId: dto.produtoId,
        },
        include: {
          produto: true,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.movimentacao.findMany({
      include: {
        produto: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }
}