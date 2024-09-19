import { Env, envSchema } from './index';

describe('envSchema', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    // Backup the original process.env
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    // Restore the original process.env
    process.env = originalEnv;
  });

  it('should use default values if environment variables are not set', () => {
    process.env = {};

    const env: Env = envSchema.parse(process.env);

    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3000);
    expect(env.CLERK_PUBLISHABLE_KEY).toBe('');
    expect(env.CLERK_SECRET_KEY).toBe('');
    expect(env.POSTGRES_HOST).toBe('localhost');
    expect(env.POSTGRES_PORT).toBe(5432);
    expect(env.POSTGRES_USER).toBe('user');
    expect(env.POSTGRES_PASSWORD).toBe('password');
    expect(env.POSTGRES_DB).toBe('database');
  });

  it('should correctly parse and validate environment variables', () => {
    process.env = {
      NODE_ENV: 'production',
      PORT: '4000',
      CLERK_PUBLISHABLE_KEY: 'pk_test_key',
      CLERK_SECRET_KEY: 'sk_test_key',
      POSTGRES_HOST: 'postgres',
      POSTGRES_PORT: '5433',
      POSTGRES_USER: 'admin',
      POSTGRES_PASSWORD: 'adminpass',
      POSTGRES_DB: 'testdb',
    };

    const env: Env = envSchema.parse(process.env);

    expect(env.NODE_ENV).toBe('production');
    expect(env.PORT).toBe(4000);
    expect(env.CLERK_PUBLISHABLE_KEY).toBe('pk_test_key');
    expect(env.CLERK_SECRET_KEY).toBe('sk_test_key');
    expect(env.POSTGRES_HOST).toBe('postgres');
    expect(env.POSTGRES_PORT).toBe(5433);
    expect(env.POSTGRES_USER).toBe('admin');
    expect(env.POSTGRES_PASSWORD).toBe('adminpass');
    expect(env.POSTGRES_DB).toBe('testdb');
  });

  it('should throw an error for invalid environment variables', () => {
    process.env = {
      NODE_ENV: 'production',
      PORT: 'invalid_port', // Invalid port
      CLERK_PUBLISHABLE_KEY: 'pk_test_key',
      CLERK_SECRET_KEY: 'sk_test_key',
      POSTGRES_HOST: 'postgres',
      POSTGRES_PORT: 'invalid_port', // Invalid port
      POSTGRES_USER: 'admin',
      POSTGRES_PASSWORD: 'adminpass',
      POSTGRES_DB: 'testdb',
    };

    expect(() => {
      try {
        const response = envSchema.parse(process.env);
        console.log(response);
      } catch (e) {
        throw e;
      }
    }).toThrow();
  });
});
