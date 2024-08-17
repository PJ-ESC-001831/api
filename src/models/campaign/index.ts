import { Schema, Document, Model, model, Connection } from 'mongoose';

/**
 * Interface representing a Campaign document in MongoDB.
 */
export interface ICampaign extends Document {
  title: string;
  description: string;
  cost: {
    base: number;
  };
  sellerId: Schema.Types.ObjectId;
  createdAt: Date;
  variants: Array<{
    title: string;
    options: string[];
  }>;
  checkoutLink: string;
  images: string[];
  transactions: Array<{
    id: string;
    transactionId: string;
    buyerId: Schema.Types.ObjectId;
    createdAt: Date;
    reference: string;
    state: string;
    balance: string;
    updatedAt: Date;
    allocations: Array<{
      id: string;
      state: string;
      updatedAt: Date;
    }>;
  }>;
}

/**
 * Mongoose schema for the Campaign model.
 */
const campaignSchema: Schema<ICampaign> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cost: {
      base: {
        type: Number,
        required: true,
      },
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    variants: [
      {
        title: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
    checkoutLink: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    transactions: [
      {
        id: {
          type: String,
          required: true,
        },
        transactionId: {
          type: String,
          required: true,
        },
        buyerId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        reference: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        balance: {
          type: String,
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        allocations: [
          {
            id: {
              type: String,
              required: true,
            },
            state: {
              type: String,
              required: true,
            },
            updatedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

/**
 * Factory function to create a Campaign model using a specific Mongoose connection.
 * @param {Connection} conn The Mongoose connection to use.
 * @return {Model<ICampaign>} The Campaign model.
 */
export function createModel(conn: Connection): Model<ICampaign> {
  return conn.model<ICampaign>('Campaign', campaignSchema);
}
