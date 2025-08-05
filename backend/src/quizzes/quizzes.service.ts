import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateQuizDto) {
    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        questions: {
          create: dto.questions.map((question) => ({
            title: question.title,
            type: question.type,
            correctAnswer: question.correctAnswer,
            options: question.options?.length
              ? {
                  create: question.options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async findAll() {
    const res = await this.prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    return res.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      question_count: quiz._count.questions,
    }));
  }

  async findOne(id: string) {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.quiz.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Quiz not found');
    }

    return this.prisma.quiz.delete({
      where: { id },
    });
  }
}
