import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatPrice(price: number | string | undefined): string {
  if (price === undefined || price === null) return '0';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return Math.round(numPrice).toLocaleString('es-CL');
}
