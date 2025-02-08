import { users } from '@database/schema/users';
import { buyers } from '@src/database/schema/buyers';
import { sellers } from '@src/database/schema/sellers';

export type User = typeof users.$inferInsert;
export type Seller = typeof sellers.$inferInsert;
export type Buyer = typeof buyers.$inferInsert;


export type UserWithToken = User & { tokenId?: string };
