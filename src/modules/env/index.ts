import { z } from 'zod';
import { InvalidNumberError } from './errors';

/**
 * Parses a string value to a number using the specified radix.
 * @param {string} val The string value to parse.
 * @param {number} [radix=10] The radix to use for parsing (default is 10).
 * @return {number} The parsed number.
 * @throws {InvalidNumberError} If the value cannot be parsed to a number.
 */
function parseEnvValueToNumber(val: string, radix: number = 10): number {
  const parsed = parseInt(val, radix);
  if (isNaN(parsed)) {
    throw new InvalidNumberError(val);
  }
  return parsed;
}

/**
 * The schema for the environment variables.
 *
 * **Note:** All environment variables are required, but have default values.
 * If you add a new environment variable to the .env file, make sure to add it
 * here as well.
 */
export const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z
    .string()
    .default('3000')
    .transform((val) => parseEnvValueToNumber(val)),

  // Clerk for authentication
  CLERK_PUBLISHABLE_KEY: z.string().default(''),
  CLERK_SECRET_KEY: z.string().default(''),

  // Postgres database
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z
    .string()
    .default('5432')
    .transform((val) => parseEnvValueToNumber(val)),
  POSTGRES_USER: z.string().default('user'),
  POSTGRES_PASSWORD: z.string().default('password'),
  POSTGRES_DB: z.string().default('database'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parses the environment variables and validates them against the schema.
 *
 * @return {Env} The validated environment variables.
 */
export default envSchema.parse(process.env);
