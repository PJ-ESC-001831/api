import { Document, Schema, Model, model, Connection } from 'mongoose';

/**
 * Interface representing a User document in MongoDB.
 */
export interface IUser extends Document {
  emailAddress: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for the User model.
 */
const userSchema: Schema<IUser> = new Schema(
  {
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

/**
 * Factory function to create a User model using a specific Mongoose connection.
 * @param {Connection} conn The Mongoose connection to use.
 * @return {Model<IUser>} The User model.
 */
export function createModel(conn: Connection): Model<IUser> {
  return conn.model<IUser>('User', userSchema);
}
