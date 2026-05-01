// Tipos compartidos para web_data.json

export type Senal = {
  direccion: string;
  conviccion: number;
  razonamiento: string;
  horizonte?: string;
  indicador_clave?: string;
  interaccion_macro?: string;
};

export type SenalCombinada = {
  activo: string;
  macro: Senal | null;
  tecnico: Senal | null;
  consenso: 'CONVERGENTE' | 'DIVERGENTE' | 'PARCIAL' | 'SIN_DATOS';
};

export type WebData = {
  metadata: {
    generado: string;
    fecha: string;
    tesis_macro_fecha: string | null;
    tesis_tecnica_fecha: string | null;
  };
  regimen: {
    clasificacion: string;
    confianza: number;
    razonamiento: string;
  };
  tesis_principal: string;
  indicadores_clave: Record<string, { valor: number; fecha: string }>;
  tecnicos: {
    activos: Record<string, Record<string, unknown>>;
    mercado: Record<string, unknown>;
  };
  senales: SenalCombinada[];
  eventos_clave: string[];
  invalidadores: string[];
  invalidadores_tecnicos: string[];
  performance: {
    total_senales?: number;
    senales_evaluadas?: number;
    senales_activas?: number;
    hit_rate_global?: number | null;
  };
  confianza_macro: number | null;
  confianza_tecnica: number | null;
  confianza_consolidada: number | null;
};

// Funcion compartida para cargar el JSON
export async function loadWebData(): Promise<WebData> {
  const response = await fetch('/web_data.json');
  if (!response.ok) throw new Error('Could not load web_data.json');
  return response.json();
}

// Helpers de formateo
export function formatNumber(val: number | undefined | null, decimals = 2): string {
  if (val === null || val === undefined) return '—';
  return Number(val).toFixed(decimals);
}

export function formatPercent(val: number | undefined | null, decimals = 1): string {
  if (val === null || val === undefined) return '—';
  return Number(val).toFixed(decimals) + '%';
}