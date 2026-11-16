import { useEffect, useMemo, useState } from 'react';
import Supercluster from 'supercluster';
import {
  formatDepartmentName,
  haversineDistanceKm,
  PLACES,
  toTitleCase,
} from '../data/placesData';
import {
  CategoryId,
  LayerVisibility,
  UnifiedPoint,
  UserLocation,
} from '../types/places';

interface RawFeature {
  type: 'Feature';
  id?: string | number;
  geometry?: {
    type?: string;
    coordinates?: [number, number];
  };
  properties?: Record<string, unknown>;
}

interface RawFeatureCollection {
  type: 'FeatureCollection';
  features: RawFeature[];
}

export interface ClusterFeatureProperties {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string | number;
  policialCount: number;
  saludCount: number;
}

export interface PointFeatureProperties {
  cluster?: false;
  point: UnifiedPoint;
}

export type MapClusterFeature = GeoJSON.Feature<
  GeoJSON.Point,
  ClusterFeatureProperties | PointFeatureProperties
>;

function strProp(props: Record<string, unknown>, key: string): string {
  const val = props[key];
  return typeof val === 'string' ? val.trim() : '';
}

function normalizePolicialFeature(feature: RawFeature, index: number): UnifiedPoint | null {
  const coords = feature.geometry?.coordinates;
  if (!coords || coords.length < 2) return null;
  const [lng, lat] = coords;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const props = feature.properties || {};
  const rawName = strProp(props, 'nombref');
  const descRef = strProp(props, 'descref');
  const descClass = strProp(props, 'desc_class');
  const barloc = strProp(props, 'barlocdesc');
  const dist = strProp(props, 'distdesc');
  const dpto = strProp(props, 'dptodesc') || 'PARAGUAY';

  const baseTitle = descRef
    ? `${toTitleCase(descRef)}${rawName && !descRef.toLowerCase().includes(rawName.toLowerCase()) ? ` — ${toTitleCase(rawName)}` : ''}`
    : toTitleCase(rawName || 'Puesto Policial');

  const addressParts = [
    barloc ? toTitleCase(barloc) : '',
    dist ? toTitleCase(dist) : '',
    formatDepartmentName(dpto),
  ].filter(Boolean);

  return {
    uid: `pol-${props.ogc_fid ?? index}`,
    source: 'policial',
    name: baseTitle,
    category: 'policial',
    subCategory: toTitleCase(descClass || 'Puesto Policial'),
    address: addressParts.join(', '),
    distrito: toTitleCase(dist),
    departamento: dpto.toUpperCase(),
    phone: '911',
    hours: '24 horas (atención policial)',
    services: ['Recepción de denuncias', 'Intervención policial', 'Medidas de protección'],
    lat,
    lng,
    isPriority: false,
  };
}

function normalizeSaludFeature(feature: RawFeature, index: number): UnifiedPoint | null {
  const coords = feature.geometry?.coordinates;
  if (!coords || coords.length < 2) return null;
  const [lng, lat] = coords;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const props = feature.properties || {};
  const rawName = strProp(props, 'nombref') || strProp(props, 'nombre');
  const descCateg = strProp(props, 'desc_categ') || strProp(props, 'descref');
  const sector = strProp(props, 'desccodref');
  const barloc = strProp(props, 'barlocdesc') || strProp(props, 'direccion');
  const dist = strProp(props, 'distdesc');
  const dpto = strProp(props, 'dptodesc') || 'PARAGUAY';

  const labelType = toTitleCase(descCateg || 'Centro de Salud');
  const displayName = rawName ? `${labelType} — ${toTitleCase(rawName)}` : labelType;

  const addressParts = [
    barloc ? toTitleCase(barloc) : '',
    dist ? toTitleCase(dist) : '',
    formatDepartmentName(dpto),
  ].filter(Boolean);

  return {
    uid: `sal-${props.ogc_fid ?? index}`,
    source: 'salud',
    name: displayName,
    category: 'psicologico',
    subCategory: labelType + (sector ? ` · ${toTitleCase(sector)}` : ''),
    address: addressParts.join(', '),
    distrito: toTitleCase(dist),
    departamento: dpto.toUpperCase(),
    phone: '137 (orientación y derivación)',
    hours: 'Consultar horario del establecimiento',
    services: ['Atención primaria de salud', 'Contención y derivación', 'Constancia médica'],
    lat,
    lng,
    isPriority: false,
  };
}

export function useParaguayData(params: {
  categoryFilter: CategoryId;
  departmentFilter: string;
  searchQuery: string;
  layerVisibility: LayerVisibility;
  userLocation: UserLocation | null;
}) {
  const { categoryFilter, departmentFilter, searchQuery, layerVisibility, userLocation } = params;
  const [policialPoints, setPolicialPoints] = useState<UnifiedPoint[]>([]);
  const [saludPoints, setSaludPoints] = useState<UnifiedPoint[]>([]);
  const [loadingGeo, setLoadingGeo] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  const curatedPoints: UnifiedPoint[] = useMemo(
    () =>
      PLACES.map((p) => ({
        uid: `cur-${p.id}`,
        source: 'curated',
        curatedId: p.id,
        name: p.name,
        category: p.category,
        subCategory: 'Centro especializado',
        address: p.address,
        distrito: p.city,
        departamento: p.departamento,
        phone: p.phone,
        hours: p.hours,
        email: p.email,
        services: p.services,
        lat: p.lat,
        lng: p.lng,
        isPriority: true,
      })),
    []
  );

  useEffect(() => {
    let active = true;
    setLoadingGeo(true);
    setGeoError(null);

    Promise.all([
      fetch('/data/locales_policiales.geojson').then((r) => {
        if (!r.ok) throw new Error('Error al cargar locales policiales');
        return r.json() as Promise<RawFeatureCollection>;
      }),
      fetch('/data/locales_de_salud.geojson').then((r) => {
        if (!r.ok) throw new Error('Error al cargar centros de salud');
        return r.json() as Promise<RawFeatureCollection>;
      }),
    ])
      .then(([polData, salData]) => {
        if (!active) return;
        const pol = (polData.features || [])
          .map(normalizePolicialFeature)
          .filter((item): item is UnifiedPoint => item !== null);
        const sal = (salData.features || [])
          .map(normalizeSaludFeature)
          .filter((item): item is UnifiedPoint => item !== null);
        setPolicialPoints(pol);
        setSaludPoints(sal);
        setLoadingGeo(false);
      })
      .catch((err) => {
        if (!active) return;
        setGeoError(err instanceof Error ? err.message : 'No se pudieron cargar las capas geográficas.');
        setLoadingGeo(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const departments = useMemo(() => {
    const set = new Set<string>();
    curatedPoints.forEach((p) => set.add(p.departamento));
    policialPoints.forEach((p) => set.add(p.departamento));
    saludPoints.forEach((p) => set.add(p.departamento));
    return Array.from(set)
      .filter(Boolean)
      .sort((a, b) => formatDepartmentName(a).localeCompare(formatDepartmentName(b), 'es'));
  }, [curatedPoints, policialPoints, saludPoints]);

  const allPoints = useMemo(
    () => [...curatedPoints, ...policialPoints, ...saludPoints],
    [curatedPoints, policialPoints, saludPoints]
  );

  const filteredPoints = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allPoints.filter((pt) => {
      if (pt.source === 'curated' && !layerVisibility.curated) return false;
      if (pt.source === 'policial' && !layerVisibility.policial) return false;
      if (pt.source === 'salud' && !layerVisibility.salud) return false;

      if (categoryFilter !== 'all' && pt.category !== categoryFilter) {
        return false;
      }

      if (departmentFilter !== 'all' && pt.departamento !== departmentFilter) {
        return false;
      }

      if (q) {
        const haystack = `${pt.name} ${pt.address} ${pt.distrito} ${formatDepartmentName(pt.departamento)} ${pt.subCategory} ${pt.services.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [allPoints, categoryFilter, departmentFilter, searchQuery, layerVisibility]);

  const sortedListPoints = useMemo(() => {
    const withDist = filteredPoints.map((pt) => ({
      point: pt,
      distanceKm: userLocation
        ? haversineDistanceKm(userLocation.lat, userLocation.lng, pt.lat, pt.lng)
        : null,
    }));

    withDist.sort((a, b) => {
      if (userLocation && a.distanceKm !== null && b.distanceKm !== null) {
        // Priorizar distancia cuando hay geolocalización, con leve desempate a centros especializados
        if (Math.abs(a.distanceKm - b.distanceKm) > 0.35) {
          return a.distanceKm - b.distanceKm;
        }
      }
      if (a.point.isPriority !== b.point.isPriority) {
        return a.point.isPriority ? -1 : 1;
      }
      return a.point.name.localeCompare(b.point.name, 'es');
    });

    return withDist;
  }, [filteredPoints, userLocation]);

  // Separamos los centros especializados (siempre visibles sin quedar ocultos en clusters)
  // de los puntos GeoJSON masivos (agrupados con Supercluster)
  const filteredCurated = useMemo(
    () => filteredPoints.filter((p) => p.isPriority),
    [filteredPoints]
  );

  const filteredGeoPoints = useMemo(
    () => filteredPoints.filter((p) => !p.isPriority),
    [filteredPoints]
  );

  const superclusterIndex = useMemo(() => {
    const index = new Supercluster<PointFeatureProperties, { policialCount: number; saludCount: number }>({
      radius: 54,
      maxZoom: 15,
      minPoints: 3,
      map: (props) => ({
        policialCount: props.point.source === 'policial' ? 1 : 0,
        saludCount: props.point.source === 'salud' ? 1 : 0,
      }),
      reduce: (acc, props) => {
        acc.policialCount += props.policialCount;
        acc.saludCount += props.saludCount;
      },
    });

    const geoFeatures: GeoJSON.Feature<GeoJSON.Point, PointFeatureProperties>[] =
      filteredGeoPoints.map((pt) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [pt.lng, pt.lat],
        },
        properties: {
          cluster: false,
          point: pt,
        },
      }));

    index.load(geoFeatures);
    return index;
  }, [filteredGeoPoints]);

  const counts = useMemo(
    () => ({
      totalFiltered: filteredPoints.length,
      curatedTotal: curatedPoints.length,
      policialTotal: policialPoints.length,
      saludTotal: saludPoints.length,
      curatedFiltered: filteredCurated.length,
      geoFiltered: filteredGeoPoints.length,
    }),
    [
      filteredPoints.length,
      curatedPoints.length,
      policialPoints.length,
      saludPoints.length,
      filteredCurated.length,
      filteredGeoPoints.length,
    ]
  );

  return {
    loadingGeo,
    geoError,
    departments,
    filteredPoints,
    filteredCurated,
    filteredGeoPoints,
    sortedListPoints,
    superclusterIndex,
    counts,
    allPoints,
  };
}
