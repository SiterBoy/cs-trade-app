export interface IEnvironmentVariables {
  APP_PORT: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN:string;
  REDIS_URL: string;
  REDIS_PORT: number;
  REDIS_DB: number;
  REDIS_LOGIN: string | undefined;
  REDIS_PASSWORD:string | undefined
  PAIRS_WITH_MIN_PRICES_STORAGE_TIME_SECOND: number;
}