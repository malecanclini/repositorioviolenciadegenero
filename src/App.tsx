import { useCallback, useState } from 'react';
import { DetailSheet } from './components/DetailSheet';
import { DirectoryList } from './components/DirectoryList';
import { GuideView } from './components/GuideView';
import { Header } from './components/Header';
import { HotlinesView } from './components/HotlinesView';
import { MapView } from './components/MapView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { useParaguayData } from './hooks/useParaguayData';
import {
  ActiveTab,
  CategoryId,
  LayerVisibility,
  UnifiedPoint,
  UserLocation,
} from './types/places';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mapa');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    curated: true,
    policial: true,
    salud: true,
  });

  const [selectedPoint, setSelectedPoint] = useState<UnifiedPoint | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    nonce: number;
  } | null>(null);

  const {
    loadingGeo,
    geoError,
    departments,
    filteredPoints,
    filteredCurated,
    sortedListPoints,
    superclusterIndexes,
    counts,
  } = useParaguayData({
    categoryFilter,
    departmentFilter,
    searchQuery,
    layerVisibility,
    userLocation,
  });

  const handleToggleLayer = useCallback((layer: keyof LayerVisibility) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  }, []);

  const handleSelectPoint = useCallback((point: UnifiedPoint) => {
    setSelectedPoint(point);
    setActiveTab('mapa');
    setFlyToTarget({
      lat: point.lat,
      lng: point.lng,
      zoom: 15,
      nonce: Date.now(),
    });
  }, []);

  const handleRequestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no admite geolocalización.');
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: UserLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setUserLocation(loc);
        setLocating(false);
        setFlyToTarget({
          lat: loc.lat,
          lng: loc.lng,
          zoom: 13,
          nonce: Date.now(),
        });
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Permiso de ubicación denegado. Podés filtrar por departamento.');
        } else {
          setLocationError('No se pudo obtener tu ubicación actual.');
        }
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 }
    );
  }, []);

  const isMapOrDirectory = activeTab === 'mapa' || activeTab === 'centros';

  return (
    <div className="min-h-dvh h-dvh flex flex-col bg-[#0f0f13] text-[#f0eef5] overflow-hidden">
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="flex-1 min-h-0 relative">
        {isMapOrDirectory && (
          <div className="h-full max-w-[1440px] mx-auto flex flex-col lg:flex-row">
            {/* Sidebar en desktop; en móvil se muestra a pantalla completa cuando activeTab === 'centros' */}
            <aside
              className={`${
                activeTab === 'centros'
                  ? 'block w-full h-full'
                  : 'hidden lg:block lg:w-[400px] lg:shrink-0 lg:h-full'
              } border-r border-[#2a2a36] min-h-0`}
            >
              <DirectoryList
                items={sortedListPoints}
                departments={departments}
                departmentFilter={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedUid={selectedPoint?.uid ?? null}
                onSelectPoint={handleSelectPoint}
                userLocation={userLocation}
                locating={locating}
                onRequestLocation={handleRequestLocation}
                loadingGeo={loadingGeo}
                geoError={geoError}
              />
            </aside>

            {/* Mapa: siempre montado cuando isMapOrDirectory en desktop, y en móvil cuando activeTab === 'mapa' */}
            <section
              aria-label="Mapa interactivo de recursos en Paraguay"
              className={`${
                activeTab === 'mapa'
                  ? 'flex-1 h-full pb-[60px] lg:pb-0'
                  : 'hidden lg:block lg:flex-1 lg:h-full'
              } relative min-w-0`}
            >
              <MapView
                filteredCurated={filteredCurated}
                filteredPoints={filteredPoints}
                superclusterIndexes={superclusterIndexes}
                selectedPoint={selectedPoint}
                onSelectPoint={(pt) => setSelectedPoint(pt)}
                userLocation={userLocation}
                locating={locating}
                locationError={locationError}
                onRequestLocation={handleRequestLocation}
                layerVisibility={layerVisibility}
                onToggleLayer={handleToggleLayer}
                departmentFilter={departmentFilter}
                departments={departments}
                onDepartmentChange={setDepartmentFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                flyToTarget={flyToTarget}
                loadingGeo={loadingGeo}
                isVisible={activeTab === 'mapa'}
                counts={counts}
              />
            </section>
          </div>
        )}

        {activeTab === 'telefonos' && (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <HotlinesView />
          </div>
        )}

        {activeTab === 'info' && (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <GuideView onGoToMap={() => setActiveTab('mapa')} />
          </div>
        )}

        {/* Drawer / Bottom Sheet de detalle cuando se selecciona un punto en el mapa */}
        {activeTab === 'mapa' && (
          <DetailSheet
            point={selectedPoint}
            userLocation={userLocation}
            onClose={() => setSelectedPoint(null)}
          />
        )}
      </main>

      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        filteredCount={counts.totalFiltered}
      />
    </div>
  );
}
