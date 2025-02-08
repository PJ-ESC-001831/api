import { campaigns } from '@database/schema/campaigns';
import { images } from '@database/schema/images';
import { Seller } from '../user/types';
import { User } from '@clerk/clerk-sdk-node';

export type Campaign = typeof campaigns.$inferInsert;
export type CampaignImages = typeof images.$inferInsert;

export type CampaignWithSeller = {
  campaigns: Campaign;
  sellers: Seller;
  users: User;
};
