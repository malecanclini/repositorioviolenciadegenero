export type CategoryId =
  | 'all'
  | 'emergencia'
  | 'legal'
  | 'psicologico'
  | 'albergue'
  | 'policial';

export type PointSource = 'curated' | 'policial' | 'salud';

export type ActiveTab = 'mapa' | 'centros' | 'telefonos' | 'info';

export type MapTheme = 'dark' | 'light';

export interface CuratedPlace {
  id: number;
  name: string;
  category: Exclude<CategoryId, 'all'>;
  address: string;
  phone: string;
  hours: string;
  email?: string;
  services: string[];
  lat: number;
  lng: number;
  city: string;
  departamento: string;
}

export interface UnifiedPoint {
  uid: string;
  source: PointSource;
  curatedId?: number;
  name: string;
  category: Exclude<CategoryId, 'all'>;
  subCategory: string;
  address: string;
  distrito: string;
  departamento: string;
  phone: string;
  hours: string;
  email?: string;
  services: string[];
  lat: number;
  lng: number;
  isPriority: boolean;
}

export interface Hotline {
  number: string;
  telHref: string;
  name: string;
  color: string;
  desc: string;
  hours: string;
  isFree: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface LayerVisibility {
  curated: boolean;
  policial: boolean;
  salud: boolean;
}
