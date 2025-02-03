import { users } from '@database/schema/users';

export type User = typeof users.$inferInsert;

export type UserWithToken = User & { tokenId?: string };
