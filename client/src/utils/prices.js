export const PRICES = {
  'Cuci Kering': { unit: 'kg', price: 7000, label: 'Rp 7.000/kg' },
  'Cuci Setrika': { unit: 'kg', price: 10000, label: 'Rp 10.000/kg' },
  'Dry Clean': { unit: 'item', price: 15000, label: 'Rp 15.000/item' },
  'Bed Cover': { unit: 'item', price: 25000, label: 'Rp 25.000/item' },
};
export const PICKUP_FEE = 5000;
export const SERVICE_TYPES = ['Cuci Kering', 'Cuci Setrika', 'Dry Clean', 'Bed Cover'];

export function calculateSubtotal(serviceType, weight) {
  const s = PRICES[serviceType];
  if (!s) return 0;
  const qty = s.unit === 'kg' ? (parseFloat(weight) || 0) : 1;
  return qty * s.price;
}

export function calculateTotal(serviceType, weight, pickup) {
  return calculateSubtotal(serviceType, weight) + (pickup ? PICKUP_FEE : 0);
}
