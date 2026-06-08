export const LAUNDRY_LAT = -5.2011;
export const LAUNDRY_LNG = 119.4870;

export const PRICES = {
  'Cuci Kering': { unit: 'kg', price: 7000, label: 'Rp 7.000/kg' },
  'Cuci Setrika': { unit: 'kg', price: 10000, label: 'Rp 10.000/kg' },
  'Dry Clean': { unit: 'item', price: 15000, label: 'Rp 15.000/item' },
  'Bed Cover': { unit: 'item', price: 25000, label: 'Rp 25.000/item' },
};

export const SERVICE_TYPES = ['Cuci Kering', 'Cuci Setrika', 'Dry Clean', 'Bed Cover'];

export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getPickupDistance(lat, lng) {
  if (lat == null || lng == null) return 0;
  return haversineDistance(LAUNDRY_LAT, LAUNDRY_LNG, lat, lng);
}

export function getPickupFee(lat, lng) {
  const dist = getPickupDistance(lat, lng);
  if (dist === 0) return 5000;
  return 5000 + Math.max(0, Math.ceil(dist - 3)) * 2000;
}
