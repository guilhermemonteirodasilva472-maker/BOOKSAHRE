/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'O Eco das Estrelas',
    author: 'Camila Albuquerque',
    isAuthored: true,
    category: 'Obra Autoral',
    curatorName: 'Camila A.',
    curatorRole: 'Escritora Autoral',
    comment: 'Escrevi esta ficção científica soft inspirada na imensidão do universo e na busca humana por pertencimento. Espero que essa jornada espacial toque o coração de vocês!',
    likes: 42,
    stars: 5,
    coverStyle: {
      gradientStart: '#8E7BE3', // Lavender
      gradientEnd: '#4A3E92',
      iconName: 'Sparkles',
      textColor: '#FFFFFF'
    },
    commentsList: [
      {
        id: 'c1',
        author: 'Thiago Mendes',
        text: 'A escrita da Camila é extremamente poética! Recomendo muito o capítulo 3 sobre as canções estelares.',
        date: 'Há 2 dias'
      },
      {
        id: 'c2',
        author: 'Marcos R.',
        text: 'Instigante e sensível. Parabéns pela obra!',
        date: 'Há 1 dia'
      }
    ],
    createdAt: '2026-05-24T10:00:00Z'
  },
  {
    id: '2',
    title: 'Páginas ao Vento',
    author: 'Valéria Drummond',
    isAuthored: false,
    category: 'Indicação',
    curatorName: 'Thiago Mendes',
    curatorRole: 'Poeta & Devorador de Livros',
    comment: 'Uma coletânea de crônicas aconchegante sobre viagens, café quente e a beleza das pequenas coisas cotidianas. É um abraço em forma de leitura!',
    likes: 29,
    stars: 5,
    coverStyle: {
      gradientStart: '#F76F5E', // Coral
      gradientEnd: '#B83A2A',
      iconName: 'Compass',
      textColor: '#FFFFFF'
    },
    commentsList: [
      {
        id: 'c3',
        author: 'Marina Souza',
        text: 'Fiquei com vontade de ler só pela recomendação do Thiago. Já adicionei na lista!',
        date: 'Há 3 dias'
      }
    ],
    createdAt: '2026-05-23T14:30:00Z'
  },
  {
    id: '3',
    title: 'A Arte de Focar no Agora',
    author: 'Dr. Arthur Mendes',
    isAuthored: false,
    category: 'Leitura Atual',
    curatorName: 'Marina Souza',
    curatorRole: 'Designer de Interação',
    comment: 'Estou lendo este ensaio incrível sobre o poder da presença na era digital. Um lembrete prático sobre a urgência de respirar, desconectar e focar no real.',
    likes: 35,
    stars: 4,
    coverStyle: {
      gradientStart: '#41C7A5', // Mint
      gradientEnd: '#1F846B',
      iconName: 'Brain',
      textColor: '#FFFFFF'
    },
    commentsList: [],
    createdAt: '2026-05-25T09:15:00Z'
  },
  {
    id: '4',
    title: 'O Clube dos Sonhadores',
    author: 'Gabriel Silva',
    isAuthored: true,
    category: 'Obra Autoral',
    curatorName: 'Gabriel S.',
    curatorRole: 'Educador & Escritor',
    comment: 'Esta é minha coleção juvenil de contos sobre resgatar a imaginação, resolver enigmas divertidos e cultivar amizades sinceras. Perfeito para aquecer o coração!',
    likes: 18,
    stars: 5,
    coverStyle: {
      gradientStart: '#F3C430', // Yellow/Gold
      gradientEnd: '#AF8B15',
      iconName: 'Compass',
      textColor: '#1F2226'
    },
    commentsList: [
      {
        id: 'c4',
        author: 'Alice Vieira',
        text: 'Meus afilhados adoraram o conto das chaves voadoras! Parabéns, professor Gabriel!',
        date: 'Ontem'
      }
    ],
    createdAt: '2026-05-22T08:00:00Z'
  }
];

// List of vibrant gradients and icons for user-created book covers
export const COVER_GRADIENTS = [
  { start: '#8E7BE3', end: '#4A3E92', name: 'Roxo Estelar' },
  { start: '#F76F5E', end: '#B83A2A', name: 'Coral Quente' },
  { start: '#41C7A5', end: '#1F846B', name: 'Menta Fresca' },
  { start: '#F3C430', end: '#AF8B15', name: 'Amarelo Radiante' },
  { start: '#EF4444', end: '#991B1B', name: 'Vermelho Intenso' },
  { start: '#3B82F6', end: '#1D4ED8', name: 'Azul Abissal' },
  { start: '#EC4899', end: '#9D174D', name: 'Rosa Chiclete' },
  { start: '#10B981', end: '#065F46', name: 'Verde Floresta' }
];

export const COVER_ICONS = [
  'BookOpen',
  'Sparkles',
  'Compass',
  'Brain',
  'Rocket',
  'Flame',
  'Crown',
  'Heart',
  'Feather',
  'Bookmark'
];
