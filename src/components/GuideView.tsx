import { Info, PhoneCall, ShieldCheck } from 'lucide-react';
import { DENUNCIA_STEPS } from '../data/placesData';

interface GuideViewProps {
  onGoToMap: () => void;
  onOpenSources: () => void;
}

export function GuideView({ onGoToMap, onOpenSources }: GuideViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 lg:pb-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#f0eef5] tracking-tight">
          ¿Cómo hacer una denuncia?
        </h2>
        <p className="text-sm text-[#9895a8] mt-1.5 leading-relaxed">
          Guía rápida de orientación y derechos amparados por la Ley N° 5777/16 de Protección Integral a las Mujeres contra toda forma de Violencia.
        </p>
      </div>

      <div className="space-y-3.5">
        {DENUNCIA_STEPS.map((item) => (
          <section
            key={item.step}
            className="bg-[#18181f] border border-[#2a2a36] rounded-2xl p-5"
          >
            <div className="flex items-start gap-4">
              <span
                className="font-mono-num text-sm font-bold px-2.5 py-1 rounded-lg bg-[#22222d] shrink-0"
                style={{ color: item.accent }}
              >
                {item.step}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold text-[#f0eef5]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#b8b5c8] mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 bg-[#18181f] border border-[#2f2f3d] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#2ecc71] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-[#d6d3e3] leading-relaxed">
            En ningún caso se puede rechazar la recepción de una denuncia ni exigir documento de identidad para tomarla. Todas las actuaciones son reservadas y gratuitas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:137"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#d63042] hover:bg-[#ff4757] text-white text-xs font-semibold inline-flex items-center gap-2 whitespace-nowrap transition-colors"
          >
            <PhoneCall className="w-4 h-4" aria-hidden="true" />
            <span>Llamar 137</span>
          </a>
          <button
            type="button"
            onClick={onGoToMap}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#252532] hover:bg-[#313144] text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
          >
            Ver mapa
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 text-xs text-[#9895a8]">
        <span>
          Fuente principal: Visor Geoestadístico del INE - Paraguay · Noviembre 2026
        </span>
        <button
          type="button"
          onClick={onOpenSources}
          className="inline-flex items-center gap-1.5 text-[#f0a0b0] hover:text-white font-medium self-start sm:self-auto cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-[#e05c7a]" aria-hidden="true" />
          <span>Ver detalle de fuente de datos</span>
        </button>
      </div>
    </div>
  );
}
