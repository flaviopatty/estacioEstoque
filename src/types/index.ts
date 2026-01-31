
export enum Page {
  DASHBOARD = 'dashboard',
  PRODUCTS = 'products',
  INVENTORY = 'inventory',
  REPORTS = 'reports',
  USERS = 'users',
  SETTINGS = 'settings',
  AUTH = 'auth'
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  unit: 'Unidade' | 'Litro' | 'Quilo';
  category: string;
  status: 'ativo' | 'inativo';
  lastUpdated: string;
  expirationDate?: string;
}

export interface Movement {
  id: string;
  itemName: string;
  quantity: string;
  type: 'in' | 'out';
  date: string;
  responsible: string;
  destination?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  permissions: string[];
}
