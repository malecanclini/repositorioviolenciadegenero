import L from 'leaflet';
import {
  Crosshair,
  Layers,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  Search,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Supercluster from 'supercluster';
import { CAT_COLORS, CAT_LABELS, formatDepartmentName } from '../data/placesData';
import {
  ClusterFeatureProperties,
  PointFeatureProperties,
} from '../hooks/useParaguayData';
import {
  CategoryId,
  LayerVisibility,
  MapTheme,
  UnifiedPoint,
  UserLocation,
} from '../types/places';

interface MapViewProps {
  filteredCurated: UnifiedPoint[];
  filteredPoints: UnifiedPoint[];
  superclusterIndex: Supercluster<
    PointFeatureProperties,
    { policialCount: number; saludCount: number }
  >;
  selectedPoint: UnifiedPoint | null;
  onSelectPoint: (point: UnifiedPoint) => void;
  userLocation: UserLocation | null;
  locating: boolean;
  locationError: string | null;
  onRequestLocation: () => void;
  layerVisibility: LayerVisibility;
  onToggleLayer: (layer: keyof LayerVisibility) => void;
  departmentFilter: string;
  departments: string[];
  onDepartmentChange: (dept: string) => void;
  categoryFilter: CategoryId;
  onCategoryChange: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  flyToTarget: { lat: number; lng: number; zoom: number; nonce: number } | null;
  loadingGeo: boolean;
  isVisible: boolean;
  counts: {
    curatedFiltered: number;
    policialTotal: number;
    saludTotal: number;
    totalFiltered: number;
  };
}

const PARAGUAY_CENTER: [number, number] = [-23.45, -58.0];
const PARAGUAY_DEFAULT_ZOOM = 6;

function createClusterIcon(
  count: number,
  policialCount: number,
  saludCount: number
): L.DivIcon {
  const total = Math.max(1, policialCount + saludCount);
  const polRatio = policialCount / total;

  let size = 36;
  if (count >= 500) size = 50;
  else if (count >= 100) size = 44;
  else if (count >= 25) size = 40;

  const hitSize = Math.max(44, size);
  const strokeWidth = 3.5;
  const r = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * r;
  const polDash = polRatio * circumference;
  const salDash = circumference - polDash;

  const label = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);

  const svg = `
    <div style="width:${hitSize}px;height:${hitSize}px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:#15151d;box-shadow:0 4px 16px rgba(0,0,0,0.55);">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0;transform:rotate(-90deg);">
          <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#2ecc71" stroke-width="${strokeWidth}" stroke-dasharray="${salDash} ${circumference}" stroke-dashoffset="-${polDash}" />
          <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#3498db" stroke-width="${strokeWidth}" stroke-dasharray="${polDash} ${circumference}" />
        </svg>
        <span style="position:relative;z-index:1;font-family:'JetBrains Mono',monospace;font-size:${size >= 44 ? 12 : 11}px;font-weight:700;color:#f4f2fa;letter-spacing:-0.03em;">${label}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [hitSize, hitSize],
    iconAnchor: [hitSize / 2, hitSize / 2],
  });
}

function createGeoPointIcon(
  category: UnifiedPoint['category'],
  isSelected: boolean,
  mapTheme: MapTheme
): L.DivIcon {
  const color = CAT_COLORS[category];
  const dotSize = isSelected ? 18 : 13;
  const border = isSelected
    ? '#ffffff'
    : mapTheme === 'dark'
    ? '#0f0f13'
    : '#ffffff';
  const halo = isSelected
    ? `box-shadow:0 0 0 5px ${color}44, 0 4px 12px rgba(0,0,0,0.6);`
    : `box-shadow:0 2px 6px rgba(0,0,0,0.45);`;

  return L.divIcon({
    className: '',
    html: `
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="width:${dotSize}px;height:${dotSize}px;border-radius:9999px;background:${color};border:2.5px solid ${border};${halo}transition:transform 0.16s ease;"></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

function createPriorityPinIcon(
  category: UnifiedPoint['category'],
  isSelected: boolean
): L.DivIcon {
  const color = CAT_COLORS[category];
  const size = isSelected ? 34 : 26;
  const hitSize = 44;

  return L.divIcon({
    className: '',
    html: `
      <div style="width:${hitSize}px;height:${hitSize}px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <div style="
          width:${size}px;
          height:${size}px;
          background:${color};
          border:2.5px solid ${isSelected ? '#ffffff' : '#0f0f13'};
          border-radius:50% 50% 50% 4px;
          transform:rotate(-45deg);
          box-shadow:${isSelected ? `0 0 0 5px ${color}55, 0 8px 20px rgba(0,0,0,0.65)` : '0 4px 12px rgba(0,0,0,0.55)'};
          display:flex;
          align-items:center;
          justify-content:center;
          transition:all 0.16s ease;
        ">
          <div style="width:${isSelected ? 9 : 7}px;height:${isSelected ? 9 : 7}px;border-radius:9999px;background:#ffffff;transform:rotate(45deg);"></div>
        </div>
      </div>
    `,
    iconSize: [hitSize, hitSize],
    iconAnchor: [hitSize / 2, hitSize / 2 + size * 0.2],
  });
}

function createUserLocationIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
        <div class="user-location-pulse" style="position:absolute;width:20px;height:20px;border-radius:9999px;background:rgba(224,92,122,0.45);"></div>
        <div style="position:relative;width:14px;height:14px;border-radius:9999px;background:#e05c7a;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export function MapView({
  filteredCurated,
  filteredPoints,
  superclusterIndex,
  selectedPoint,
  onSelectPoint,
  userLocation,
  locating,
  locationError,
  onRequestLocation,
  layerVisibility,
  onToggleLayer,
  departmentFilter,
  departments,
  onDepartmentChange,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  flyToTarget,
  loadingGeo,
  isVisible,
  counts,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geoLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const curatedLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [mapTheme, setMapTheme] = useState<MapTheme>('dark');
  const [hudOpen, setHudOpen] = useState(false);

  const onSelectPointRef = useRef(onSelectPoint);
  onSelectPointRef.current = onSelectPoint;

  const superclusterRef = useRef(superclusterIndex);
  superclusterRef.current = superclusterIndex;

  const selectedUidRef = useRef<string | null>(selectedPoint?.uid ?? null);
  selectedUidRef.current = selectedPoint?.uid ?? null;

  const mapThemeRef = useRef(mapTheme);
  mapThemeRef.current = mapTheme;

  const renderVisibleClusters = useCallback(() => {
    const map = mapRef.current;
    const group = geoLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    const bounds = map.getBounds();
    const zoom = Math.round(map.getZoom());

    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const clusters = superclusterRef.current.getClusters(bbox, zoom);

    clusters.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties;

      if ('cluster' in props && props.cluster) {
        const cProps = props as ClusterFeatureProperties;
        const marker = L.marker([lat, lng], {
          icon: createClusterIcon(
            cProps.point_count,
            cProps.policialCount || 0,
            cProps.saludCount || 0
          ),
          zIndexOffset: 100,
        });

        marker.on('click', () => {
          const expansionZoom = Math.min(
            superclusterRef.current.getClusterExpansionZoom(cProps.cluster_id),
            17
          );
          map.flyTo([lat, lng], expansionZoom, { duration: 0.45 });
        });

        marker.bindTooltip(
          `<div style="font-weight:600">${cProps.point_count} puntos en esta zona</div>
           <div style="color:#9895a8;font-size:11px;margin-top:2px">Tocá para acercar · ${cProps.policialCount} policial · ${cProps.saludCount} salud</div>`,
          { direction: 'top', offset: [0, -14], className: 'custom-map-tooltip' }
        );

        group.addLayer(marker);
      } else {
        const pProps = props as PointFeatureProperties;
        const pt = pProps.point;
        const isSelected = selectedUidRef.current === pt.uid;

        const marker = L.marker([lat, lng], {
          icon: createGeoPointIcon(pt.category, isSelected, mapThemeRef.current),
          zIndexOffset: isSelected ? 800 : 200,
        });

        marker.on('click', () => {
          onSelectPointRef.current(pt);
        });

        marker.bindTooltip(
          `<div style="font-weight:600">${pt.name}</div>
           <div style="color:#9895a8;font-size:11px">${pt.subCategory} · ${formatDepartmentName(pt.departamento)}</div>`,
          { direction: 'top', offset: [0, -10], className: 'custom-map-tooltip' }
        );

        group.addLayer(marker);
      }
    });
  }, []);

  // Inicializar Leaflet una sola vez
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: PARAGUAY_CENTER,
      zoom: PARAGUAY_DEFAULT_ZOOM,
      zoomControl: false,
      minZoom: 5,
      maxZoom: 18,
    });

    const tile = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    const geoGroup = L.layerGroup().addTo(map);
    const curatedGroup = L.layerGroup().addTo(map);

    mapRef.current = map;
    tileLayerRef.current = tile;
    geoLayerGroupRef.current = geoGroup;
    curatedLayerGroupRef.current = curatedGroup;

    map.on('moveend zoomend', () => {
      renderVisibleClusters();
    });

    // Asegurar tamaño correcto si el contenedor cambia de visibilidad en móvil/desktop
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      geoLayerGroupRef.current = null;
      curatedLayerGroupRef.current = null;
    };
  }, [renderVisibleClusters]);

  // Cambiar estilo de tiles Oscuro / Claro
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const url =
      mapTheme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tile = L.tileLayer(url, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tile;
    renderVisibleClusters();
  }, [mapTheme, renderVisibleClusters]);

  // Re-renderizar clusters cuando cambia el índice o el punto seleccionado
  useEffect(() => {
    renderVisibleClusters();
  }, [superclusterIndex, selectedPoint, renderVisibleClusters]);

  // Renderizar marcadores prioritarios (centros especializados)
  useEffect(() => {
    const group = curatedLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    filteredCurated.forEach((pt) => {
      const isSelected = selectedPoint?.uid === pt.uid;
      const marker = L.marker([pt.lat, pt.lng], {
        icon: createPriorityPinIcon(pt.category, isSelected),
        zIndexOffset: isSelected ? 1000 : 600,
      });

      marker.on('click', () => {
        onSelectPointRef.current(pt);
      });

      marker.bindTooltip(
        `<div style="font-weight:700;color:#fff">${pt.name}</div>
         <div style="color:#f0a0b0;font-size:11px;margin-top:2px">Centro especializado · Tel: ${pt.phone}</div>`,
        { direction: 'top', offset: [0, -18], className: 'custom-map-tooltip' }
      );

      group.addLayer(marker);
    });
  }, [filteredCurated, selectedPoint]);

  // Marcador de ubicación del usuario
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const m = L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserLocationIcon(),
        zIndexOffset: 900,
      })
        .bindTooltip('Tu ubicación actual', {
          direction: 'top',
          offset: [0, -14],
          className: 'custom-map-tooltip',
        })
        .addTo(map);
      userMarkerRef.current = m;
    }
  }, [userLocation]);

  // Ajustar encuadre al cambiar de departamento
  const prevDeptRef = useRef<string>(departmentFilter);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (prevDeptRef.current === departmentFilter) return;
    prevDeptRef.current = departmentFilter;

    if (departmentFilter === 'all') {
      map.flyTo(PARAGUAY_CENTER, PARAGUAY_DEFAULT_ZOOM, { duration: 0.6 });
      return;
    }

    if (filteredPoints.length > 0) {
      const latLngs = filteredPoints.map((p) => [p.lat, p.lng] as [number, number]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13, animate: true });
    }
  }, [departmentFilter, filteredPoints]);

  // Vuelo explícito cuando se elige un punto desde el listado o se ubica al usuario
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyToTarget) return;
    map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom, {
      duration: 0.65,
    });
  }, [flyToTarget]);

  // Recalcular dimensiones del mapa al volver a la pestaña Mapa en móvil
  useEffect(() => {
    if (!isVisible || !mapRef.current) return;
    const id = window.setTimeout(() => {
      mapRef.current?.invalidateSize({ animate: false });
      renderVisibleClusters();
    }, 60);
    return () => window.clearTimeout(id);
  }, [isVisible, renderVisibleClusters]);

  const handleResetView = () => {
    const map = mapRef.current;
    if (!map) return;
    if (departmentFilter !== 'all' && filteredPoints.length > 0) {
      const bounds = L.latLngBounds(filteredPoints.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13, animate: true });
    } else {
      map.flyTo(PARAGUAY_CENTER, PARAGUAY_DEFAULT_ZOOM, { duration: 0.6 });
    }
  };

  const categories: CategoryId[] = [
    'all',
    'legal',
    'psicologico',
    'policial',
    'albergue',
  ];

  return (
    <div className="relative w-full h-full bg-[#0d0e14] overflow-hidden">
      {/* Contenedor Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* HUD Móvil superior: Buscador + Departamento + Categorías (oculto en desktop donde vive el sidebar) */}
      <div className="lg:hidden absolute top-3 inset-x-3 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex-1 flex items-center gap-2 bg-[#14141b]/92 backdrop-blur-md border border-[#2c2c3a] rounded-xl px-3 min-h-[44px] shadow-lg">
            <Search className="w-4 h-4 text-[#9895a8] shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar ciudad, barrio o centro..."
              aria-label="Buscar centro o ciudad"
              className="w-full bg-transparent text-sm text-[#f0eef5] placeholder:text-[#8a8799] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Limpiar búsqueda"
                className="p-1 text-[#9895a8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setHudOpen((v) => !v)}
            aria-label="Capas y leyenda del mapa"
            aria-expanded={hudOpen}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border backdrop-blur-md shadow-lg transition-colors ${
              hudOpen
                ? 'bg-[#e05c7a] border-[#e05c7a] text-white'
                : 'bg-[#14141b]/92 border-[#2c2c3a] text-[#f0eef5]'
            }`}
          >
            <Layers className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Selector rápido de departamento + categorías en móvil */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-0.5">
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            aria-label="Filtrar por departamento"
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#14141b]/92 backdrop-blur-md border border-[#2c2c3a] text-xs font-medium text-[#f0eef5] focus:outline-none focus:border-[#e05c7a] shrink-0"
          >
            <option value="all">Todo Paraguay</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {formatDepartmentName(dep)}
              </option>
            ))}
          </select>

          {categories.map((cat) => {
            const active = categoryFilter === cat;
            const accent = cat === 'all' ? '#e05c7a' : CAT_COLORS[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border backdrop-blur-md transition-colors ${
                  active
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-[#14141b]/90 text-[#c7c4d6] border-[#2c2c3a]'
                }`}
                style={active ? { backgroundColor: accent } : undefined}
              >
                {cat === 'psicologico' ? 'Salud / Psic.' : CAT_LABELS[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel de Capas y Leyenda (visible siempre en desktop top-right, o al tocar Layers en móvil) */}
      <div
        className={`${
          hudOpen ? 'block' : 'hidden lg:block'
        } absolute top-[104px] lg:top-4 right-3 lg:right-4 z-20 w-[260px] bg-[#14141b]/95 backdrop-blur-xl border border-[#2c2c3a] rounded-2xl p-3.5 shadow-2xl shadow-black/50`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-display text-xs font-bold text-[#f0eef5]">
            Capas del mapa
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMapTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              title={mapTheme === 'dark' ? 'Cambiar a mapa claro' : 'Cambiar a mapa oscuro'}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1f1f28] hover:bg-[#2a2a36] text-[11px] font-medium text-[#d6d3e3] transition-colors cursor-pointer"
            >
              {mapTheme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#f39c12]" aria-hidden="true" />
                  <span>Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#7c6af7]" aria-hidden="true" />
                  <span>Oscuro</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setHudOpen(false)}
              aria-label="Cerrar capas"
              className="lg:hidden p-1 text-[#9895a8] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-[#1f1f28] cursor-pointer">
            <span className="flex items-center gap-2 min-w-0">
              <input
                type="checkbox"
                checked={layerVisibility.curated}
                onChange={() => onToggleLayer('curated')}
                className="accent-[#e05c7a] w-4 h-4 rounded cursor-pointer"
              />
              <span
                className="w-2.5 h-2.5 rotate-45 rounded-[2px] bg-[#e05c7a] shrink-0"
                aria-hidden="true"
              />
              <span className="text-[#f0eef5] truncate">Centros especializados</span>
            </span>
            <span className="font-mono-num text-[11px] text-[#9895a8]">
              {counts.curatedFiltered}
            </span>
          </label>

          <label className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-[#1f1f28] cursor-pointer">
            <span className="flex items-center gap-2 min-w-0">
              <input
                type="checkbox"
                checked={layerVisibility.policial}
                onChange={() => onToggleLayer('policial')}
                className="accent-[#3498db] w-4 h-4 rounded cursor-pointer"
              />
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#3498db] shrink-0"
                aria-hidden="true"
              />
              <span className="text-[#f0eef5] truncate">Comisarías y puestos</span>
            </span>
            <span className="font-mono-num text-[11px] text-[#9895a8]">
              {counts.policialTotal}
            </span>
          </label>

          <label className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-[#1f1f28] cursor-pointer">
            <span className="flex items-center gap-2 min-w-0">
              <input
                type="checkbox"
                checked={layerVisibility.salud}
                onChange={() => onToggleLayer('salud')}
                className="accent-[#2ecc71] w-4 h-4 rounded cursor-pointer"
              />
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#2ecc71] shrink-0"
                aria-hidden="true"
              />
              <span className="text-[#f0eef5] truncate">Centros de salud / USF</span>
            </span>
            <span className="font-mono-num text-[11px] text-[#9895a8]">
              {counts.saludTotal}
            </span>
          </label>
        </div>

        {/* Leyenda compacta de categorías */}
        <div className="mt-2.5 pt-2.5 border-t border-[#252531] grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-[#b8b5c8]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7c6af7]" aria-hidden="true" />
            <span>Legal / CRM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2ecc71]" aria-hidden="true" />
            <span>Salud / Psic.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3498db]" aria-hidden="true" />
            <span>Policial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f39c12]" aria-hidden="true" />
            <span>Albergue</span>
          </div>
        </div>
      </div>

      {/* Estado de carga o error de capas GeoJSON */}
      {loadingGeo && (
        <div className="absolute bottom-20 lg:bottom-4 left-3 lg:left-4 z-20 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#14141b]/92 backdrop-blur-md border border-[#2c2c3a] text-xs text-[#d6d3e3]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#e05c7a]" aria-hidden="true" />
          <span>Cargando puntos nacionales...</span>
        </div>
      )}

      {locationError && (
        <div className="absolute bottom-20 lg:bottom-4 left-3 lg:left-4 z-20 max-w-xs px-3 py-2 rounded-xl bg-[#2a171c]/95 border border-[#ff4757]/40 text-xs text-[#ffd5d9]">
          {locationError}
        </div>
      )}

      {/* Controles flotantes inferior derecha: Cerca de mí, Encuadre, Zoom */}
      <div className="absolute bottom-4 right-3 lg:right-4 z-20 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={onRequestLocation}
          disabled={locating}
          className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a] ${
            userLocation
              ? 'bg-[#e05c7a] border-[#e05c7a] text-white'
              : 'bg-[#14141b]/95 border-[#2c2c3a] text-[#f0eef5] hover:bg-[#1f1f28]'
          }`}
        >
          {locating ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Crosshair className="w-4 h-4" aria-hidden="true" />
          )}
          <span>Cerca de mí</span>
        </button>

        <div className="flex flex-col bg-[#14141b]/95 backdrop-blur-md border border-[#2c2c3a] rounded-xl overflow-hidden shadow-lg">
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            aria-label="Acercar mapa"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#f0eef5] hover:bg-[#22222d] border-b border-[#252531] cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            aria-label="Alejar mapa"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#f0eef5] hover:bg-[#22222d] border-b border-[#252531] cursor-pointer"
          >
            <Minus className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            aria-label="Centrar mapa"
            title="Ver todo el filtro actual"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#f0eef5] hover:bg-[#22222d] cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Contador discreto abajo izquierda en desktop */}
      {!loadingGeo && (
        <div className="hidden lg:flex items-center gap-2 absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-[#14141b]/90 backdrop-blur-md border border-[#2c2c3a] text-xs text-[#b8b5c8]">
          <span className="font-mono-num font-semibold text-white">
            {counts.totalFiltered.toLocaleString('es-PY')}
          </span>
          <span>puntos visibles en mapa</span>
        </div>
      )}
    </div>
  );
}
