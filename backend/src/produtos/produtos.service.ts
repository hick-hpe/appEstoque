import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProdutoDto) {
    return this.prisma.produto.create({
      data: {
        nome: dto.nome,
        preco: dto.preco,
        categoriaId: dto.categoriaId,
      },
    });
  }

  async findAll() {
    return this.prisma.produto.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });

    if (!produto) {
      throw new NotFoundException(`Produto ${id} não encontrado.`);
    }

    return produto;
  }

  async remove(id: number) {
    try {
      return await this.prisma.produto.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Produto ${id} não encontrado.`);
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'Não é possível remover este produto, pois existem movimentações vinculadas.',
        );
      }

      throw error;
    }
  }
}