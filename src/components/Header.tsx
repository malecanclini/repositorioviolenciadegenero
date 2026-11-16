import { PhoneCall } from 'lucide-react';
import { ActiveTab } from '../types/places';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export function Header({ activeTab, onSelectTab }: HeaderProps) {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'mapa', label: 'Mapa' },
    { id: 'centros', label: 'Centros' },
    { id: 'telefonos', label: 'Teléfonos' },
    { id: 'info', label: '¿Cómo denunciar?' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0f0f13]/95 backdrop-blur-md border-b border-[#2a2a36]">
      {/* Franja superior discreta de líneas gratuitas (visible en tablet/desktop) */}
      <div className="hidden sm:flex items-center justify-center gap-4 px-4 py-1.5 bg-[#16161d] border-b border-[#242430] text-xs text-[#c7c4d6]">
        <span>Servicios gratuitos y confidenciales en Paraguay</span>
        <span aria-hidden="true" className="text-[#565368]">·</span>
        <a
          href="tel:911"
          className="hover:text-white transition-colors font-mono-num"
        >
          Emergencias <strong className="text-white">911</strong>
        </a>
        <span aria-hidden="true" className="text-[#565368]">·</span>
        <a
          href="tel:137"
          className="hover:text-white transition-colors font-mono-num"
        >
          SOS Mujer <strong className="text-[#ff6b78]">137</strong> (24hs)
        </a>
        <span aria-hidden="true" className="text-[#565368]">·</span>
        <a
          href="tel:133"
          className="hover:text-white transition-colors font-mono-num"
        >
          Defensoría <strong className="text-white">133</strong>
        </a>
      </div>

      {/* Top Bar Contract: 3 zonas claras en desktop, ultra compacto en móvil */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-14 lg:h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zona 1: Wordmark de una línea */}
        <button
          type="button"
          onClick={() => onSelectTab('mapa')}
          className="font-display text-lg lg:text-xl font-extrabold tracking-tight text-[#f0eef5] whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a] rounded-md"
        >
          Dónde <span className="text-[#e05c7a]">Denunciar</span>
        </button>

        {/* Zona 2: Navegación de escritorio */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {navItems
            .filter((item) => item.id !== 'centros') // En desktop el listado vive junto al mapa
            .map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e05c7a] rounded-sm cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-[#9895a8] hover:text-[#f0eef5]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-[21px] h-0.5 bg-[#e05c7a]" />
                  )}
                </button>
              );
            })}
        </nav>

        {/* Zona 3: Acción primaria SOS 137 */}
        <div className="flex items-center shrink-0">
          <a
            href="tel:137"
            aria-label="Llamar a SOS Mujer 137 las 24 horas"
            className="inline-flex items-center gap-2 min-h-[44px] lg:min-h-[40px] px-3.5 lg:px-4 py-2 rounded-xl bg-[#d63042] hover:bg-[#ff4757] active:scale-[0.98] text-white text-xs lg:text-sm font-semibold whitespace-nowrap shrink-0 transition-all shadow-sm shadow-[#ff4757]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="font-mono-num font-bold">137</span>
            <span className="hidden sm:inline">SOS Mujer · 24hs</span>
            <span className="sm:hidden">SOS 24hs</span>
          </a>
        </div>
      </div>
    </header>
  );
}
