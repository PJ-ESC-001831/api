import { images } from '@database/schema/images';

export type Image = typeof images.$inferInsert;
