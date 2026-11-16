import { BookOpen, List, Map as MapIcon, Phone } from 'lucide-react';
import { ActiveTab } from '../types/places';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  filteredCount: number;
}

export function MobileBottomNav({
  activeTab,
  onSelectTab,
  filteredCount,
}: MobileBottomNavProps) {
  const tabs: {
    id: ActiveTab;
    label: string;
    icon: typeof MapIcon;
    badge?: number;
  }[] = [
    { id: 'mapa', label: 'Mapa', icon: MapIcon },
    { id: 'centros', label: 'Listado', icon: List, badge: filteredCount },
    { id: 'telefonos', label: 'Teléfonos', icon: Phone },
    { id: 'info', label: 'Guía', icon: BookOpen },
  ];

  return (
    <nav
      aria-label="Navegación móvil"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#14141b]/95 backdrop-blur-md border-t border-[#2a2a36] pb-safe"
    >
      <div className="grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[54px] py-1.5 px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e05c7a] ${
                isActive ? 'text-[#e05c7a]' : 'text-[#9895a8] hover:text-[#f0eef5]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#e05c7a]" />
              )}
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="ml-1 font-mono-num text-[10px] opacity-80">
                    ({tab.badge > 999 ? '999+' : tab.badge})
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
