import { TRPCError } from '@trpc/server';

export enum AssignmentStatus {
  PENDING_GIFT_IDEAS = 'PENDING_GIFT_IDEAS',
  PENDING_IMAGES = 'PENDING_IMAGES',
  COMPLETED = 'COMPLETED'
}

export class AppError extends Error {
  public readonly code: TRPCError['code'];

  constructor(code: 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR' | 'FORBIDDEN', message: string) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }

  public toTRPC(): TRPCError {
    return new TRPCError({
      code: this.code,
      message: this.message,
    });
  }
}

export function handlePrismaError(error: unknown): never {
  const baseError = new Error('An unexpected database error occurred');

  // Handle Prisma's unique constraint violations
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const prismaError = error as { code: string; meta?: { target?: string[]; field_name?: string } };
    
    switch (prismaError.code) {
      case 'P2002':
        throw new AppError(
          'BAD_REQUEST',
          `A record with this ${prismaError.meta?.target?.[0] ?? 'value'} already exists`
        );
      case 'P2003':
        throw new AppError(
          'BAD_REQUEST',
          `Referenced record not found: ${prismaError.meta?.field_name}`
        );
      case 'P2011':
        throw new AppError(
          'BAD_REQUEST',
          `Required field missing: ${prismaError.meta?.target?.[0]}`
        );
      case 'P2025':
        throw new AppError(
          'NOT_FOUND',
          'Record not found'
        );
      default:
        throw new AppError(
          'INTERNAL_SERVER_ERROR',
          baseError.message
        );
    }
  }

  throw new AppError('INTERNAL_SERVER_ERROR', baseError.message);
}

export function handleOpenAIError(error: unknown): never {
  const baseError = new Error('Failed to generate content using OpenAI');

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const openAIError = error as { response?: { data?: { error?: { message?: string } } } };
    throw new AppError(
      'BAD_REQUEST',
      `OpenAI API error: ${openAIError.response?.data?.error?.message ?? baseError.message}`
    );
  }

  throw new AppError('INTERNAL_SERVER_ERROR', baseError.message);
}
