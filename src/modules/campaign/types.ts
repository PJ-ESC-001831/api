import { campaigns } from '@database/schema/campaigns';

export type Campaign = typeof campaigns.$inferInsert;
