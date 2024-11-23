import type { Prisma } from '@prisma/client';

export type ParticipantWithAssignments = Prisma.ParticipantGetPayload<{
  include: {
    assignments: true;
  };
}>;

export type AdjectiveWithCategory = Prisma.AdjectiveGetPayload<{
  include: {
    category: true;
  };
}>;

export type AssignmentWithRelations = Prisma.AssignmentGetPayload<{
  include: {
    gifter: true;
    receiver: true;
    adjective1: true;
    adjective2: true;
    adjective3: true;
    gameRoom: true;
  };
}>;

export type CreateAssignmentData = {
  gifterId: string;
  receiverId: string;
  adjective1Id: string;
  adjective2Id: string;
  adjective3Id: string;
  gameRoomId: string;
};
