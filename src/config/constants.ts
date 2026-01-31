
import { InventoryItem, Movement, User } from '../types';

export const IMAGES = {
  SCHOOL_LOGO: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB0cBNUx8wf6cIpH_eNl9Mik4_-XOnM6-cKR5_aiObzoU0QLbQn_mYYhW61hyToJF8Q4HkaJEJU3o3OZ-5Rh0URC4RxCBHSqsXV1WAhlHlZWeqqowPGM09wu-C_lss-_nP3izTHs8vSAylzJlIvV54tSoQVOoEqMKhI6KIKzjRl1imZr20AfEsX-yWiMYMzSavZgOGuoLbq31slpyNNUawxrB1RXZYugKYDrcYDQM-pMxdBKxkvE7hvuLixlhwSTFEbfypq8K1GA",
  ADMIN_AVATAR: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_yxNwO5Ic9JOBv2Epuz7t3dRxih-uX3csawEg-t59v_vHQ9VGGXskii7D4_qHf6C4yRDZ4WuszVc-qHnmJik5p5XBk9BONMYLs4Jk7vPc87uOWmihLo3xWqGymV2in_ZKOfvRgdJ9HZwvxSO6T_PhhLzdIwcpzzC4VNTpLlEjYb_FRgmXYv9HboV2C7WznrO5jEN4VfVkfIux7mqvpWaZ8ie8m2KTe73l6WtdymjnE9JDX4i2Vs3QhwP247a0OJX0y1cWbtlbhA",
  PREFEITURA_LOGO: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEJoFIFAfsvvL88Zx8jkEJZot0QUz09-4WcZm6Hn5TbL312mb-GDps3XXSd4g0aGXwdkspsJ6L0e4Lga5aJQkIYwd74xcZRYcta60-l_3wMihehtjxUp3IlCCT4UhD2NyXXsiPStyd9vtZyWDZK7WOveWSzHrL_xjNFnUYTtPa4BjfzIUm5h1YvzMIaM_SgrJWDJz10EvMNccAYFnXE15o4ebqbaE0u7S-NbQbNlYgdk29XJtx-yQX_oGHNBm21jc_Z5CF1FTsmg"
};

export const INITIAL_PRODUCTS: InventoryItem[] = [
  { id: '1', name: 'Feijão', category: 'Alimento', unit: 'Quilo', quantity: 4.00, minStock: 10, status: 'ativo', lastUpdated: '2023-10-27', expirationDate: '2024-05-15' },
  { id: '2', name: 'Água Mineral', category: 'Bebidas', unit: 'Litro', quantity: 0.00, minStock: 20, status: 'ativo', lastUpdated: '2023-10-27', expirationDate: '2025-12-01' },
  { id: '3', name: 'Copos Descartáveis', category: 'Descartáveis', unit: 'Unidade', quantity: 0, minStock: 100, status: 'ativo', lastUpdated: '2023-10-27' },
  { id: '4', name: 'Açúcar', category: 'Alimentos', unit: 'Quilo', quantity: 0.00, minStock: 15, status: 'ativo', lastUpdated: '2023-10-27', expirationDate: '2024-11-20' },
  { id: '5', name: 'Papel Toalha', category: 'Limpeza', unit: 'Unidade', quantity: 0, minStock: 50, status: 'ativo', lastUpdated: '2023-10-27' }
];

export const INITIAL_MOVEMENTS: Movement[] = [
  { id: '1', itemName: 'Arroz Polido (Merenda)', quantity: '500 KG', type: 'in', date: '14/10/2023', responsible: 'João Silva' },
  { id: '2', itemName: 'Papel A4 Premium', quantity: '20 CX', type: 'in', date: '13/10/2023', responsible: 'Ana Paula' },
  { id: '3', itemName: 'Leite Integral', quantity: '48 LT', type: 'out', date: '15/10/2023', responsible: 'Roberto S.', destination: 'Cozinha Principal' }
];

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'João Silva', email: 'joao.silva@escola.gov.br', role: 'Administrador', status: 'active', permissions: ['all'] },
  { id: '2', name: 'Maria Oliveira', email: 'maria.o@escola.gov.br', role: 'Almoxarife', status: 'active', permissions: ['inventory_in', 'inventory_out'] }
];
