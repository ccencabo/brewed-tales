import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
  IsUrl,
  MinLength,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @Matches(/^postgres(?:ql)?:\/\//, {
    message: 'DATABASE_URL must be a PostgreSQL connection string',
  })
  DATABASE_URL!: string;

  @IsUrl({ require_tld: false })
  FRONTEND_ORIGIN!: string;

  @IsString()
  @MinLength(32)
  JWT_SECRET!: string;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const values = {
    ...config,
    NODE_ENV: config.NODE_ENV ?? Environment.Development,
    PORT: config.PORT ?? 3000,
    FRONTEND_ORIGIN: config.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  };

  const validated = plainToInstance(EnvironmentVariables, values, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validated;
}
