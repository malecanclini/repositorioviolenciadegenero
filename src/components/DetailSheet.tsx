import {
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Navigation,
  Phone,
  X,
} from 'lucide-react';
import {
  CAT_COLORS,
  CAT_SHORT_LABELS,
  extractCallableHref,
  formatDepartmentName,
  formatDistance,
  haversineDistanceKm,
} from '../data/placesData';
import { UnifiedPoint, UserLocation } from '../types/places';

interface DetailSheetProps {
  point: UnifiedPoint | null;
  userLocation: UserLocation | null;
  onClose: () => void;
}

export function DetailSheet({ point, userLocation, onClose }: DetailSheetProps) {
  if (!point) return null;

  const color = CAT_COLORS[point.category];
  const callableHref = extractCallableHref(point.phone);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
  const distanceKm = userLocation
    ? haversineDistanceKm(userLocation.lat, userLocation.lng, point.lat, point.lng)
    : null;

  return (
    <div
      className="fixed inset-x-0 bottom-[calc(60px+env(safe-area-inset-bottom))] lg:bottom-4 lg:left-auto lg:right-4 lg:w-[420px] z-[60] pointer-events-auto"
      role="dialog"
      aria-label={`Detalles de ${point.name}`}
    >
      <div className="bg-[#18181f]/98 backdrop-blur-xl border border-[#2f2f3d] rounded-t-3xl lg:rounded-2xl shadow-2xl shadow-black/60 max-h-[68vh] lg:max-h-[75vh] flex flex-col overflow-hidden">
        {/* Grab handle visible en móvil */}
        <div className="lg:hidden flex justify-center pt-2.5 pb-1">
          <span className="w-10 h-1 rounded-full bg-[#3a3a4a]" aria-hidden="true" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 lg:pt-4 pb-3 border-b border-[#252531] flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-[#9895a8] mb-1">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="font-medium" style={{ color }}>
                {CAT_SHORT_LABELS[point.category]}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{point.subCategory}</span>
              {distanceKm !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num text-[#f0eef5] font-medium shrink-0">
                    a {formatDistance(distanceKm)}
                  </span>
                </>
              )}
            </div>
            <h2 className="font-display text-base lg:text-lg font-bold text-[#f0eef5] leading-snug">
              {point.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de detalles"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-xl text-[#9895a8] hover:text-white hover:bg-[#252532] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto custom-scrollbar space-y-3.5 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#9895a8]">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Ubicación</span>
              </div>
              <p className="text-[#f0eef5] text-[13px] leading-relaxed">
                {point.address || formatDepartmentName(point.departamento)}
              </p>
              <p className="text-xs text-[#9895a8]">
                {point.distrito ? `${point.distrito} · ` : ''}
                {formatDepartmentName(point.departamento)}
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#9895a8]">
                <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Teléfono</span>
              </div>
              <p className="font-mono-num text-[13px] font-semibold" style={{ color }}>
                {point.phone}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#9895a8] pt-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Horario</span>
              </div>
              <p className="text-[#f0eef5] text-[13px] leading-snug">{point.hours}</p>
            </div>
          </div>

          {point.email && (
            <div className="flex items-center gap-2 text-xs text-[#b8b5c8]">
              <Mail className="w-3.5 h-3.5 text-[#9895a8] shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${point.email}`}
                className="hover:text-white underline decoration-[#444457] underline-offset-2"
              >
                {point.email}
              </a>
            </div>
          )}

          {point.services.length > 0 && (
            <div className="pt-1 border-t border-[#252531]">
              <p className="text-[11px] font-medium text-[#9895a8] mb-1.5">
                Servicios disponibles
              </p>
              <p className="text-xs text-[#d6d3e3] leading-relaxed">
                {point.services.join(' · ')}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-3 bg-[#14141b] border-t border-[#252531] flex items-center gap-2.5">
          {callableHref && (
            <a
              href={callableHref}
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#252532] hover:bg-[#303042] text-white text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a]"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Llamar</span>
            </a>
          )}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#e05c7a] hover:bg-[#c94d6a] text-white text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Navigation className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Cómo llegar</span>
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir ubicación en Google Maps"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-[#252532] hover:bg-[#303042] text-[#d6d3e3] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a]"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
