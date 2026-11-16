import { Crosshair, MapPin, Phone, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  CAT_COLORS,
  CAT_LABELS,
  CAT_SHORT_LABELS,
  extractCallableHref,
  formatDepartmentName,
  formatDistance,
} from '../data/placesData';
import { CategoryId, UnifiedPoint, UserLocation } from '../types/places';

interface DirectoryListProps {
  items: { point: UnifiedPoint; distanceKm: number | null }[];
  departments: string[];
  departmentFilter: string;
  onDepartmentChange: (dept: string) => void;
  categoryFilter: CategoryId;
  onCategoryChange: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedUid: string | null;
  onSelectPoint: (point: UnifiedPoint) => void;
  userLocation: UserLocation | null;
  locating: boolean;
  onRequestLocation: () => void;
  loadingGeo: boolean;
  geoError: string | null;
}

const PAGE_SIZE = 50;

export function DirectoryList({
  items,
  departments,
  departmentFilter,
  onDepartmentChange,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  selectedUid,
  onSelectPoint,
  userLocation,
  locating,
  onRequestLocation,
  loadingGeo,
  geoError,
}: DirectoryListProps) {
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleLimit(PAGE_SIZE);
  }, [departmentFilter, categoryFilter, searchQuery, items.length]);

  const categories: CategoryId[] = [
    'all',
    'legal',
    'psicologico',
    'policial',
    'albergue',
  ];

  const visibleItems = items.slice(0, visibleLimit);
  const remaining = Math.max(0, items.length - visibleLimit);

  return (
    <div className="flex flex-col h-full bg-[#18181f] text-[#f0eef5]">
      {/* Controles de búsqueda y filtro */}
      <div className="p-4 border-b border-[#2a2a36] space-y-2.5 shrink-0">
        <div className="flex items-center gap-2 bg-[#1f1f28] border border-[#2e2e3c] focus-within:border-[#e05c7a] rounded-xl px-3 min-h-[44px] transition-colors">
          <Search className="w-4 h-4 text-[#9895a8] shrink-0" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, distrito o ciudad..."
            aria-label="Buscar centros y comisarías"
            className="w-full bg-transparent text-sm text-[#f0eef5] placeholder:text-[#8a8799] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              className="p-1.5 text-[#9895a8] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            aria-label="Filtrar por departamento"
            className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#2e2e3c] bg-[#1f1f28] text-sm text-[#f0eef5] focus:outline-none focus:border-[#e05c7a] cursor-pointer"
          >
            <option value="all">Todos los departamentos ({departments.length})</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {formatDepartmentName(dep)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onRequestLocation}
            disabled={locating}
            title="Ordenar por distancia desde mi ubicación"
            className={`min-h-[42px] px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              userLocation
                ? 'bg-[#e05c7a]/20 border-[#e05c7a] text-[#ff9bb0]'
                : 'bg-[#1f1f28] border-[#2e2e3c] text-[#d6d3e3] hover:text-white hover:border-[#444457]'
            }`}
          >
            <Crosshair className="w-4 h-4" aria-hidden="true" />
            <span>{userLocation ? 'Cercanos' : 'Ubicarme'}</span>
          </button>
        </div>

        {/* Botones de filtro por categoría */}
        <div
          role="group"
          aria-label="Filtrar por tipo de servicio"
          className="flex items-center gap-1.5 flex-wrap pt-0.5"
        >
          {categories.map((cat) => {
            const active = categoryFilter === cat;
            const accent = cat === 'all' ? '#e05c7a' : CAT_COLORS[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  active
                    ? 'text-white border-transparent'
                    : 'bg-[#1f1f28] text-[#b8b5c8] border-[#2c2c3a] hover:text-white'
                }`}
                style={active ? { backgroundColor: accent } : undefined}
              >
                {cat === 'psicologico' ? 'Salud / Psic.' : CAT_LABELS[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="px-4 py-2.5 border-b border-[#252531] flex items-center justify-between text-xs text-[#9895a8] shrink-0">
        <span>
          Mostrando{' '}
          <strong className="font-mono-num text-[#f0eef5]">
            {items.length.toLocaleString('es-PY')}
          </strong>{' '}
          {items.length === 1 ? 'lugar' : 'lugares'}
          {userLocation && ' · ordenados por cercanía'}
        </span>
        {loadingGeo && <span className="text-[#e05c7a]">Actualizando...</span>}
      </div>

      {geoError && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-[#2a171c] border border-[#ff4757]/30 text-xs text-[#ffd5d9]">
          {geoError}
        </div>
      )}

      {/* Lista de lugares */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#252531] pb-24 lg:pb-6">
        {items.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="font-display text-sm font-bold text-[#f0eef5]">
              Sin resultados para este filtro
            </p>
            <p className="text-xs text-[#9895a8]">
              Probá cambiar el departamento, la categoría o limpiar la búsqueda.
            </p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onDepartmentChange('all');
                onCategoryChange('all');
              }}
              className="mt-2 inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-xl bg-[#252532] hover:bg-[#303042] text-xs font-semibold text-white cursor-pointer"
            >
              Ver todos los puntos
            </button>
          </div>
        ) : (
          <>
            {visibleItems.map(({ point, distanceKm }) => {
              const color = CAT_COLORS[point.category];
              const isSelected = selectedUid === point.uid;
              const callable = extractCallableHref(point.phone);

              return (
                <article
                  key={point.uid}
                  className={`px-4 py-3.5 transition-colors ${
                    isSelected ? 'bg-[#232330]' : 'hover:bg-[#1f1f29]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectPoint(point)}
                    className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a] rounded-lg cursor-pointer"
                  >
                    {/* Kicker limpio sin pills */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#9895a8] mb-1">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                      <span className="font-medium" style={{ color }}>
                        {CAT_SHORT_LABELS[point.category]}
                      </span>
                      {point.isPriority && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#f0a0b0] font-medium">
                            Centro especializado
                          </span>
                        </>
                      )}
                      {distanceKm !== null && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num text-[#f0eef5] font-medium">
                            {formatDistance(distanceKm)}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-[14px] font-bold text-[#f0eef5] leading-snug">
                      {point.name}
                    </h3>

                    <p className="text-xs text-[#9895a8] mt-1 leading-relaxed">
                      {point.address || formatDepartmentName(point.departamento)}
                    </p>

                    <p className="text-xs text-[#b8b5c8] mt-1.5 line-clamp-1">
                      {point.services.slice(0, 3).join(' · ')}
                    </p>
                  </button>

                  <div className="mt-2.5 flex items-center justify-between gap-3">
                    <span className="font-mono-num text-xs font-medium text-[#d6d3e3]">
                      {point.phone}
                    </span>

                    <div className="flex items-center gap-2">
                      {callable && (
                        <a
                          href={callable}
                          className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#252532] hover:bg-[#313144] text-xs font-medium text-[#f0eef5] inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Llamar</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectPoint(point)}
                        className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#252532] hover:bg-[#e05c7a] text-xs font-medium text-[#f0eef5] inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Ver en mapa</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {remaining > 0 && (
              <div className="p-4 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleLimit((prev) => prev + PAGE_SIZE)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#22222d] hover:bg-[#2c2c3a] border border-[#323244] text-xs font-semibold text-[#f0eef5] transition-colors cursor-pointer"
                >
                  Mostrar más ({remaining.toLocaleString('es-PY')} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
