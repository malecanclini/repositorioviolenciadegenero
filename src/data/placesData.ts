import { CategoryId, CuratedPlace, Hotline } from '../types/places';

export const CAT_COLORS: Record<Exclude<CategoryId, 'all'>, string> = {
  emergencia: '#ff4757',
  legal: '#7c6af7',
  psicologico: '#2ecc71',
  albergue: '#f39c12',
  policial: '#3498db',
};

export const CAT_LABELS: Record<CategoryId, string> = {
  all: 'Todos',
  emergencia: 'Emergencia',
  legal: 'Legal',
  psicologico: 'Psicológico y Salud',
  albergue: 'Albergue',
  policial: 'Policial',
};

export const CAT_SHORT_LABELS: Record<Exclude<CategoryId, 'all'>, string> = {
  emergencia: 'Emergencia',
  legal: 'Legal',
  psicologico: 'Salud / Psicológico',
  albergue: 'Albergue',
  policial: 'Policial',
};

export const PLACES: CuratedPlace[] = [
  {
    id: 1,
    name: 'SEDAMUR — Ministerio de la Mujer',
    category: 'legal',
    address: 'Pte. Franco c/ Ayolas, Edif. Ayfra, Planta Baja, Asunción',
    phone: '(021) 452-060 / 452-061',
    hours: 'Lun–Vie: 07:00 – 18:00',
    email: 'atencion@mujer.gov.py',
    services: ['Orientación legal', 'Apoyo psicológico', 'Seguimiento de casos', 'Derivación'],
    lat: -25.2865,
    lng: -57.6378,
    city: 'Asunción',
    departamento: 'ASUNCION',
  },
  {
    id: 2,
    name: 'Centro Ciudad Mujer',
    category: 'psicologico',
    address: 'Virgen del Carmen entre 16 de Julio y Avda. Von Poleski, Villa Elisa',
    phone: '(021) 412-4000',
    hours: 'Lun/Mar/Jue: 06:00–17:30 · Mié/Vie: 07:00–14:30',
    email: 'ciudadmujer@mujer.gov.py',
    services: ['Atención integral', 'Salud sexual', 'Empleo', 'Prevención VBG', 'Guardería'],
    lat: -25.3519,
    lng: -57.5748,
    city: 'Villa Elisa',
    departamento: 'CENTRAL',
  },
  {
    id: 3,
    name: 'CRM Ciudad del Este',
    category: 'legal',
    address: 'Campo Vía casi América, Área 4, Ciudad del Este',
    phone: '(061) 507-531',
    hours: 'Lun–Vie: 07:00 – 15:00',
    services: ['Atención jurídica', 'Apoyo psicológico', 'Trabajo social', 'Seguimiento'],
    lat: -25.5102,
    lng: -54.6136,
    city: 'Ciudad del Este',
    departamento: 'ALTO PARANA',
  },
  {
    id: 4,
    name: 'CRM Pedro Juan Caballero',
    category: 'legal',
    address: 'Pedro Juan Caballero, Amambay',
    phone: '(0336) 275-611',
    hours: 'Lun–Vie: 07:00 – 15:00',
    services: ['Atención jurídica', 'Apoyo psicológico', 'Trabajo social'],
    lat: -22.5386,
    lng: -55.7314,
    city: 'Pedro Juan Caballero',
    departamento: 'AMAMBAY',
  },
  {
    id: 5,
    name: 'CRM Filadelfia',
    category: 'legal',
    address: 'Filadelfia, Boquerón',
    phone: '(0491) 432-370',
    hours: 'Lun–Vie: 07:00 – 15:00',
    services: ['Atención jurídica', 'Apoyo psicológico', 'Trabajo social'],
    lat: -22.3535,
    lng: -60.0353,
    city: 'Filadelfia',
    departamento: 'BOQUERON',
  },
  {
    id: 6,
    name: 'CRM Curuguaty',
    category: 'legal',
    address: 'Curuguaty, Canindeyú',
    phone: '(048) 210-515',
    hours: 'Lun–Vie: 07:00 – 15:00',
    services: ['Atención jurídica', 'Apoyo psicológico', 'Trabajo social'],
    lat: -24.4773,
    lng: -55.6966,
    city: 'Curuguaty',
    departamento: 'CANINDEYU',
  },
  {
    id: 7,
    name: 'Policía Nacional — Central Asunción',
    category: 'policial',
    address: 'Asunción — llamar al 911 o acudir a la comisaría más cercana',
    phone: '911',
    hours: '24 horas, todos los días',
    services: ['Denuncia formal', 'Medidas de protección', 'Intervención de emergencia'],
    lat: -25.2917,
    lng: -57.6419,
    city: 'Asunción',
    departamento: 'ASUNCION',
  },
  {
    id: 8,
    name: 'Ministerio Público — Fiscalía Asunción',
    category: 'legal',
    address: 'Nuestra Señora de la Asunción 737, Asunción',
    phone: '(021) 415-3000',
    hours: 'Lun–Vie: 07:00 – 15:00',
    services: ['Denuncia penal', 'Proceso judicial', 'Acompañamiento legal'],
    lat: -25.2941,
    lng: -57.6423,
    city: 'Asunción',
    departamento: 'ASUNCION',
  },
  {
    id: 9,
    name: 'Defensoría Pública — Atención a Víctimas',
    category: 'legal',
    address: 'Asunción, Paraguay',
    phone: '133',
    hours: 'Lun–Vie: 07:00 – 15:00',
    services: ['Patrocinio legal gratuito', 'Ley 5777/16', 'Asesoramiento'],
    lat: -25.2884,
    lng: -57.646,
    city: 'Asunción',
    departamento: 'ASUNCION',
  },
  {
    id: 10,
    name: 'Oficina de Atención Permanente — Poder Judicial',
    category: 'legal',
    address: 'Palacio de Justicia, Asunción',
    phone: '(021) 424-2000',
    hours: '24 horas (fuera de horario de juzgados y fines de semana)',
    services: ['Medidas de protección urgente', 'Juzgado de Paz', 'Denuncia fuera de horario'],
    lat: -25.2911,
    lng: -57.6369,
    city: 'Asunción',
    departamento: 'ASUNCION',
  },
  {
    id: 11,
    name: 'Albergue del Ministerio de la Mujer',
    category: 'albergue',
    address: 'Dirección reservada por seguridad — contactar al 137',
    phone: '137',
    hours: '24 horas, todos los días',
    services: ['Alojamiento temporal', 'Seguridad personal', 'Apoyo psicológico', 'Asistencia legal', 'Atención médica'],
    lat: -25.298,
    lng: -57.651,
    city: 'Asunción',
    departamento: 'ASUNCION',
  },
  {
    id: 12,
    name: 'Femi Unidas Paraguay',
    category: 'psicologico',
    address: 'Asunción, Paraguay',
    phone: '0984 349-893',
    hours: 'Lun–Vie: 09:00 – 19:00',
    services: ['Información sobre derechos', 'Orientación gratuita', 'Red de voluntarias', 'Acompañamiento'],
    lat: -25.301,
    lng: -57.637,
    city: 'Asunción',
    departamento: 'ASUNCION',
  },
  {
    id: 13,
    name: 'Comisaría 3ª Metropolitana',
    category: 'policial',
    address: 'Asunción',
    phone: '911',
    hours: '24 horas, todos los días',
    services: ['Recepción de denuncias', 'Protección policial'],
    lat: -25.286,
    lng: -57.635,
    city: 'Asunción',
    departamento: 'ASUNCION',
  },
];

export const HOTLINES: Hotline[] = [
  {
    number: '137',
    telHref: 'tel:137',
    name: 'SOS Mujer — Ministerio de la Mujer',
    color: '#ff4757',
    desc: 'Línea nacional gratuita de atención a mujeres víctimas de violencia. Atención confidencial desde cualquier teléfono.',
    hours: '24hs / 365 días',
    isFree: true,
  },
  {
    number: '911',
    telHref: 'tel:911',
    name: 'Policía Nacional — Emergencias',
    color: '#3498db',
    desc: 'Para situaciones de riesgo inmediato. Cualquier persona puede llamar aunque no sea la víctima.',
    hours: '24hs / 365 días',
    isFree: true,
  },
  {
    number: '133',
    telHref: 'tel:133',
    name: 'Defensoría Pública',
    color: '#7c6af7',
    desc: 'Patrocinio legal gratuito para mujeres en situación de violencia bajo la Ley N° 5777/16.',
    hours: 'Lun–Vie, horario de oficina',
    isFree: true,
  },
  {
    number: '147',
    telHref: 'tel:147',
    name: 'Fono Ayuda — Niñez y Adolescencia',
    color: '#f39c12',
    desc: 'Atención especializada a niñas, niños y adolescentes víctimas de violencia o abuso.',
    hours: '24hs / 365 días',
    isFree: true,
  },
  {
    number: '(021) 452-060',
    telHref: 'tel:+59521452060',
    name: 'SEDAMUR',
    color: '#e05c7a',
    desc: 'Servicio de Atención a la Mujer: orientación legal, contención psicológica y trabajo social gratuitos.',
    hours: 'Lun–Vie: 07:00 – 18:00',
    isFree: true,
  },
  {
    number: '(021) 412-4000',
    telHref: 'tel:+595214124000',
    name: 'Centro Ciudad Mujer (Villa Elisa)',
    color: '#2ecc71',
    desc: 'Atención integral para mujeres: prevención y atención VBG, salud, empoderamiento y guardería.',
    hours: 'Lun–Vie: 06:00 – 17:30',
    isFree: true,
  },
];

export const DENUNCIA_STEPS = [
  {
    step: '01',
    title: 'Llamá al 137 (SOS Mujer)',
    accent: '#ff4757',
    description:
      'Línea gratuita y confidencial las 24 horas desde cualquier línea baja o celular. Te orientarán de inmediato sobre las medidas de protección y los pasos a seguir.',
  },
  {
    step: '02',
    title: 'Acudí a la comisaría más cercana',
    accent: '#3498db',
    description:
      'No necesitás cédula de identidad para denunciar ni tenés que acudir sola. Cualquier persona que conozca el hecho puede presentar la denuncia.',
  },
  {
    step: '03',
    title: 'Ministerio Público o Juzgado de Paz',
    accent: '#7c6af7',
    description:
      'Podés radicar la denuncia en cualquier sede fiscal del país o en el Juzgado de Paz local para solicitar medidas urgentes de protección (exclusión del hogar, prohibición de acercamiento).',
  },
  {
    step: '04',
    title: 'SEDAMUR o Centros Regionales (CRM)',
    accent: '#2ecc71',
    description:
      'Brindan contención psicológica, asesoramiento jurídico y seguimiento gratuito del caso en Asunción, Villa Elisa, Ciudad del Este, Pedro Juan Caballero, Filadelfia y Curuguaty.',
  },
  {
    step: '05',
    title: 'Defensoría Pública (133)',
    accent: '#f39c12',
    description:
      'Si necesitás representación y patrocinio legal gratuito en el proceso judicial, llamá al 133 amparada en la Ley N° 5777/16 de Protección Integral a las Mujeres.',
  },
];

const ACCENT_MAP: Record<string, string> = {
  CONCEPCION: 'Concepción',
  'SAN PEDRO': 'San Pedro',
  CORDILLERA: 'Cordillera',
  GUAIRA: 'Guairá',
  CAAGUAZU: 'Caaguazú',
  CAAZAPA: 'Caazapá',
  ITAPUA: 'Itapúa',
  MISIONES: 'Misiones',
  PARAGUARI: 'Paraguarí',
  'ALTO PARANA': 'Alto Paraná',
  CENTRAL: 'Central',
  ÑEEMBUCU: 'Ñeembucú',
  AMAMBAY: 'Amambay',
  CANINDEYU: 'Canindeyú',
  'PRESIDENTE HAYES': 'Presidente Hayes',
  BOQUERON: 'Boquerón',
  'ALTO PARAGUAY': 'Alto Paraguay',
  ASUNCION: 'Asunción',
};

export function formatDepartmentName(raw: string): string {
  const upper = raw.trim().toUpperCase();
  if (ACCENT_MAP[upper]) return ACCENT_MAP[upper];
  return toTitleCase(raw);
}

export function toTitleCase(input: string): string {
  if (!input) return '';
  const lowercaseWords = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'en', 'a', 'c/', 'nro']);
  return input
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, idx) => {
      if (idx > 0 && lowercaseWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

export function extractCallableHref(phone: string): string | null {
  const cleaned = phone.split('/')[0].trim();
  const digits = cleaned.replace(/[^\d]/g, '');
  if (!digits) return null;
  if (digits.length <= 4) return `tel:${digits}`;
  if (digits.startsWith('0')) return `tel:+595${digits.slice(1)}`;
  return `tel:${digits}`;
}
