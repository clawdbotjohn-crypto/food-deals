const DEFAULT_CITY = 'Columbia SC';

// Known cities and their approximate coordinates for matching
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Eastside Seattle': { lat: 47.6101, lng: -122.2015 },
  'Columbia SC': { lat: 34.0007, lng: -81.0348 },
};

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function matchNearestCity(
  lat: number,
  lng: number,
  availableCities: string[],
): string {
  // Build lookup from available cities + known coords
  let bestCity = DEFAULT_CITY;
  let bestDist = Infinity;

  for (const city of availableCities) {
    const coords = CITY_COORDS[city];
    if (!coords) continue;
    const dist = haversineDistance(lat, lng, coords.lat, coords.lng);
    if (dist < bestDist) {
      bestDist = dist;
      bestCity = city;
    }
  }

  // If no known coords matched, check via reverse-geocoded name
  return bestCity;
}

export async function detectUserCity(
  availableCities: string[],
): Promise<string> {
  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000, // 5 min cache
        });
      },
    );

    const { latitude, longitude } = position.coords;

    // Try reverse geocoding via Nominatim
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`,
        { headers: { 'User-Agent': 'FoodDealsApp/1.0' } },
      );
      if (resp.ok) {
        const data = await resp.json();
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.county ||
          '';

        // Check for direct name match first
        for (const ac of availableCities) {
          if (
            ac.toLowerCase().includes(city.toLowerCase()) ||
            city.toLowerCase().includes(ac.toLowerCase().replace(' sc', '').replace(' wa', ''))
          ) {
            return ac;
          }
        }
      }
    } catch {
      // Nominatim failed, fall through to coordinate matching
    }

    // Fall back to coordinate-based matching
    return matchNearestCity(latitude, longitude, availableCities);
  } catch {
    // Geolocation denied or failed — default
    return DEFAULT_CITY;
  }
}

export { DEFAULT_CITY };
