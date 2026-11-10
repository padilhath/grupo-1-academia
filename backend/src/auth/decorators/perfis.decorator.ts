import { SetMetadata } from '@nestjs/common';
export const PERFIS = ['admin', 'atendente', 'consulta'] as const;
export type Perfil = (typeof PERFIS)[number];
export const PERFIS_KEY = 'perfis';
export const Perfis = (...perfis: Perfil[]) => SetMetadata(PERFIS_KEY, perfis);
