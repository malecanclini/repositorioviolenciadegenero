import { Clock, PhoneCall } from 'lucide-react';
import { HOTLINES } from '../data/placesData';

export function HotlinesView() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 lg:pb-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#f0eef5] tracking-tight">
          Teléfonos de Emergencia
        </h2>
        <p className="text-sm text-[#9895a8] mt-1.5 max-w-2xl leading-relaxed">
          Líneas gratuitas y confidenciales en todo el Paraguay. Tocá cualquier tarjeta para llamar de forma directa desde tu celular.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOTLINES.map((item) => (
          <a
            key={item.number}
            href={item.telHref}
            className="group block bg-[#18181f] hover:bg-[#1e1e27] border border-[#2a2a36] hover:border-[#3e3e50] rounded-2xl p-5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className="font-mono-num text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: item.color }}
                >
                  {item.number}
                </div>
                <h3 className="font-display text-base font-bold text-[#f0eef5] mt-1">
                  {item.name}
                </h3>
              </div>

              <span
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center bg-[#23232f] group-hover:bg-[#e05c7a] text-[#f0eef5] transition-colors shrink-0"
                aria-hidden="true"
              >
                <PhoneCall className="w-5 h-5" />
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#b8b5c8] mt-2.5 leading-relaxed">
              {item.desc}
            </p>

            <div className="mt-3.5 pt-3 border-t border-[#252531] flex items-center gap-2 text-xs text-[#9895a8]">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{item.hours}</span>
              <span aria-hidden="true">·</span>
              <span>Servicio gratuito</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
