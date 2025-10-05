/**
 * Utility functions for formatting currency in Rupiah (IDR)
 */

/**
 * Format a number as Rupiah currency
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatRupiah(
  value: number,
  options?: {
    compact?: boolean; // Use compact format (1.5M instead of 1.500.000)
    showSymbol?: boolean; // Show Rp symbol (default: true)
  }
): string {
  const { compact = false, showSymbol = true } = options || {};

  if (compact) {
    // Compact format for large numbers
    if (value >= 1000000000) {
      // Billions (Miliar)
      return `${showSymbol ? 'Rp ' : ''}${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      // Millions (Juta)
      return `${showSymbol ? 'Rp ' : ''}${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      // Thousands (Ribu)
      return `${showSymbol ? 'Rp ' : ''}${(value / 1000).toFixed(1)}K`;
    }
  }

  // Full format using Indonesian locale
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return showSymbol ? formatted : formatted.replace('Rp', '').trim();
}

/**
 * Parse a Rupiah string back to a number
 * @param value - The formatted Rupiah string
 * @returns The parsed number
 */
export function parseRupiah(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d,.]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
