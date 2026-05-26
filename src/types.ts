/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  isAuthored: boolean; // Indica se é uma obra autoral
  category: 'Thriller Psicológico' | 'Dark Romance' | 'Suspense Policial' | 'Terror Mentis';
  discount?: number; // Porcentagem do desconto (ex: 15 para 15% de desconto)
  coverImage?: string; // Capa em formato Base64 DataURL ou URL
  coverStyle: {
    gradientStart: string;
    gradientEnd: string;
    iconName: string; // Ícone temático da Lucide
    textColor: string;
  };
  likes: number;
  stars: number; // Avaliação de 1 a 5 estrelas
  commentsList: Comment[];
  createdAt: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  cep: string;
  items: {
    bookId: string;
    title: string;
    quantity: number;
    price: number;
  }[];
  shippingCost: number;
  total: number;
  metodoEnvio: string;
  status: string; // 'Avaliando Evidências' | 'Preparando Lacre Kraft' | 'Despachado em Sigilo' | 'Entregue'
}

export interface FAQQuestion {
  id: string;
  userName: string;
  question: string;
  date: string;
  replied: boolean;
  replyText?: string;
}

export interface GoogleSheetsRowFormat {
  dataHora: string;
  idPedido: string;
  nomeCliente: string;
  cep: string;
  livrosComprados: string;
  valorProdutos: string;
  valorFrete: string;
  valorTotal: string;
  metodoEnvio: string;
}
