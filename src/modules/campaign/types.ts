import { campaigns } from '@database/schema/campaigns';
import { images } from '@database/schema/images';

export type Campaign = typeof campaigns.$inferInsert;
export type CampaignImages = typeof images.$inferInsert;
