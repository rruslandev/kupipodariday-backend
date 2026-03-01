import type { ValueTransformer } from 'typeorm';

export const numericTransformer: ValueTransformer = {
  from: (v: string | null): number => (v === null ? 0 : Number(v)),
  to: (v: number): number => v,
};
