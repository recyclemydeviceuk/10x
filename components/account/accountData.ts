'use client';

/* Account data — orders (from checkout) & saved addresses, in localStorage. */

export type OrderItem = { name: string; pack: string; qty: number; price: number };

export type Order = {
  id: string;
  date: string;
  status?: string;
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; gst: number; grandTotal: number };
  address?: Record<string, string>;
  payment?: string;
};

export type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
};

const ORDERS_KEY = '10x:orders';
const ADDR_KEY = '10x:addresses';

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  return parse<Order[]>(window.localStorage.getItem(ORDERS_KEY), []);
}

export function getAddresses(): Address[] {
  if (typeof window === 'undefined') return [];
  return parse<Address[]>(window.localStorage.getItem(ADDR_KEY), []);
}

function saveAddresses(list: Address[]): Address[] {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ADDR_KEY, JSON.stringify(list));
  }
  return list;
}

function makeId(index: number): string {
  return `addr-${Date.now().toString(36)}-${index}`;
}

export function upsertAddress(
  data: Omit<Address, 'id' | 'isDefault'> & { id?: string },
): Address[] {
  const list = getAddresses();
  if (data.id) {
    return saveAddresses(list.map((a) => (a.id === data.id ? { ...a, ...data, id: a.id } : a)));
  }
  const created: Address = { ...data, id: makeId(list.length), isDefault: list.length === 0 };
  return saveAddresses([...list, created]);
}

export function removeAddress(id: string): Address[] {
  const list = getAddresses().filter((a) => a.id !== id);
  if (list.length > 0 && !list.some((a) => a.isDefault)) list[0].isDefault = true;
  return saveAddresses(list);
}

export function setDefaultAddress(id: string): Address[] {
  return saveAddresses(getAddresses().map((a) => ({ ...a, isDefault: a.id === id })));
}
