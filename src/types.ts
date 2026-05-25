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
  isAuthored: boolean; // Indica se é uma obra autoral de um usuário
  category: 'Indicação' | 'Leitura Atual' | 'Obra Autoral';
  curatorName: string; // Quem indicou / escreveu
  curatorRole?: string; // Ex: "Amante de Sci-Fi", "Escritor Aspirante", etc.
  comment: string; // Comentário principal em formato de balão
  likes: number; // Quantidade de likes
  stars: number; // Avaliação de 1 a 5 estrelas
  coverStyle: {
    gradientStart: string;
    gradientEnd: string;
    iconName: string; // Nome do ícone da Lucide
    textColor: string; // Ex: '#FFFFFF' ou '#1F2226'
  };
  commentsList: Comment[];
  createdAt: string;
}

export interface CommunityStat {
  label: string;
  value: string | number;
  colorClass: string;
}
