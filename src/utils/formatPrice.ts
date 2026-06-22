/**
 * Format a number as Pakistani Rupees
 * e.g., 5500 → "Rs. 5,500"
 */
export const formatPrice = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
};

/**
 * Format price with /mo suffix
 * e.g., 5500 → "Rs. 5,500/mo"
 */
export const formatPricePerMonth = (amount: number): string => {
  return `${formatPrice(amount)}/mo`;
};

/**
 * Get the lowest room price from a list of rooms
 */
export const getLowestPrice = (
  rooms: { price_per_month: number }[]
): number => {
  if (!rooms || rooms.length === 0) return 0;
  return Math.min(...rooms.map((r) => r.price_per_month));
};

/**
 * Get total available rooms across all types
 */
export const getTotalAvailable = (
  rooms: { available_count: number }[]
): number => {
  if (!rooms || rooms.length === 0) return 0;
  return rooms.reduce((sum, r) => sum + r.available_count, 0);
};

/**
 * Format a date string in a human-friendly way
 * e.g., "2024-04-26" → "April 26, 2024"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
