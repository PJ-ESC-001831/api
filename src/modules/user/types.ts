import { users } from '@database/schema/users';

export type User = typeof users.$inferInsert;
