import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { FoodDeal } from '../types';

// Fix Leaflet default marker icons for Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CITY_CENTERS: Record<string, [number, number]> = {
  'Eastside Seattle': [47.6101, -122.2015],
  'Columbia SC': [34.0007, -81.0348],
};

const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795]; // US center

// Seeded random offset so markers don't stack
function offsetForDeal(index: number, total: number): [number, number] {
  const angle = (2 * Math.PI * index) / Math.max(total, 1);
  const radius = 0.006 + (index % 3) * 0.003;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
}

// Re-center the map when city changes
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

interface MapViewProps {
  deals: FoodDeal[];
  selectedCity: string;
  onSelectDeal: (deal: FoodDeal) => void;
}

export default function MapView({ deals, selectedCity, onSelectDeal }: MapViewProps) {
  const center = CITY_CENTERS[selectedCity] ?? DEFAULT_CENTER;

  const markers = useMemo(() => {
    return deals.map((deal, i) => {
      const [latOff, lngOff] = offsetForDeal(i, deals.length);
      return {
        deal,
        position: [center[0] + latOff, center[1] + lngOff] as [number, number],
      };
    });
  }, [deals, center]);

  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={13}
        className="w-full rounded-xl shadow-md z-0"
        style={{ height: 'calc(100vh - 280px)', minHeight: '350px' }}
        scrollWheelZoom={true}
      >
        <RecenterMap center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(({ deal, position }) => (
          <Marker key={deal.id} position={position}>
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-bold text-sm text-gray-900 mb-1">{deal.restaurant_name}</p>
                <p className="text-xs text-gray-600 mb-1">{deal.deal_description}</p>
                {deal.deal_price != null && (
                  <p className="text-sm font-semibold text-orange-600 mb-2">
                    ${deal.deal_price.toFixed(2)}
                    {deal.regular_price != null && (
                      <span className="text-gray-400 line-through ml-1 text-xs font-normal">
                        ${deal.regular_price.toFixed(2)}
                      </span>
                    )}
                  </p>
                )}
                <button
                  onClick={() => onSelectDeal(deal)}
                  className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <p className="text-[10px] text-gray-400 text-center mt-1">
        📍 Locations are approximate
      </p>
    </div>
  );
}
