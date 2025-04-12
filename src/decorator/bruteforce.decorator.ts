import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_METADATA_KEY = 'brute_force_options';

export interface BruteForceLimitOptions {
  blockDuration: number;
  requestLimit: number;
  timeLimit: number;
  keyType: 'LOGIN' | 'IP' | 'EMAIL' | 'TOKEN';
  isForError?: boolean;
}

export const UseBruteForceLimit = (options: BruteForceLimitOptions) => SetMetadata(RATE_LIMIT_METADATA_KEY, options);
