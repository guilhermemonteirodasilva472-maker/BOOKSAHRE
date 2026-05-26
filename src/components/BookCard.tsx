/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, Comment } from '../types';
import LucideIcon from './LucideIcon';

interface BookCardProps {
  key?: string;
  book: Book;
  onLike: (id: string) => void;
  onAddComment: (bookId: string, author: string, text: string) => void;
  onAddToCart: (book: Book) => void;
  isAdmin: boolean;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
}

export default function BookCard({ 
  book, 
  onLike, 
  onAddComment, 
  onAddToCart, 
  isAdmin, 
  onEdit, 
  onDelete,
  onMoveUp,
  onMoveDown
}: BookCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [userStars, setUserStars] = useState(book.stars);

  const discountedPrice = book.discount 
    ? book.price * (1 - book.discount / 100) 
    : book.price;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim()) return;
    
    onAddComment(book.id, newCommentAuthor.trim(), newCommentText.trim());
    setNewCommentText('');
    try {
      localStorage.setItem('magical_bookstore_nickname', newCommentAuthor.trim());
    } catch (err) {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('magical_bookstore_nickname');
      if (saved) {
        setNewCommentAuthor(saved);
      }
    } catch (e) {}
  }, []);

  const handleStarClick = (idx: number) => {
    setUserStars(idx + 1);
  };

  return (
    <article 
      className="book-card-magic flex flex-col md:flex-row p-5 sm:p-6 gap-6 relative"
    >
      {/* Dynamic Ribbon for Discount tags */}
      {book.discount && book.discount > 0 ? (
        <div className="bookmark-ribbon" title={`${book.discount}% de desconto`}>
          <span>{book.discount}%</span>
          <div className="text-[10px] font-bold leading-none tracking-tighter">OFF</div>
        </div>
      ) : null}

      {/* Book Cover Design Cover */}
      <div className="flex-shrink-0 flex justify-center items-start md:block">
        <div 
          className="book-card-magic w-[145px] h-[215px] flex flex-col justify-between p-4.5 text-left relative overflow-hidden shadow-lg select-none"
          style={{
            background: book.coverImage 
              ? 'none' 
              : `linear-gradient(135deg, ${book.coverStyle.gradientStart}, ${book.coverStyle.gradientEnd})`,
            color: '#FFFFFF'
          }}
        >
          {book.coverImage && (
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Aesthetic Book Spine overlay */}
          <div className="book-bound-spine" />
          <div className="book-pages-stack" />
          
          <div className="absolute top-2.5 right-2.5 opacity-30 z-10">
            <LucideIcon name="Bookmark" size={20} strokeWidth={1.5} />
          </div>

          <div className="z-10">
            <span 
              className="text-[8px] uppercase tracking-widest font-mono px-2 py-0.5 rounded-full bg-black/45 border border-white/20"
            >
              {book.category}
            </span>
          </div>

          <div className="z-10 my-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.85)]">
            <h4 className="font-serif font-bold text-xs sm:text-sm leading-snug tracking-normal line-clamp-3">
              {book.title}
            </h4>
            <p className="text-[9px] mt-1 font-mono opacity-90 line-clamp-1">
              por {book.author || 'Mago Secreto'}
            </p>
          </div>

          <div className="z-10 flex justify-between items-center border-t border-white/20 pt-1.5 mt-1">
            <span className="text-[8px] font-mono opacity-80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">Dossiê Oculto</span>
            <LucideIcon 
              name={book.coverStyle.iconName || 'BookOpen'} 
              size={13} 
              className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" 
            />
          </div>
        </div>
      </div>

      {/* Book details & Commentary */}
      <div className="flex-grow flex flex-col justify-between relative z-10">
        <div>
          {/* Header row: Categories, Rating stars */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FAF4E0] border border-amber-900/15 text-amber-950 font-serif">
                📖 {book.category}
              </span>
              
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleStarClick(i)}
                    className="cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    title={`Avaliação: ${i + 1} estrelas`}
                  >
                    <LucideIcon 
                      name="Star" 
                      size={12} 
                      className={i < userStars ? "text-amber-500 fill-amber-500" : "text-amber-900/10"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {book.isAuthored && (
              <span className="text-[9px] font-mono font-bold tracking-wider text-amber-800 bg-[#FEF8E7] border border-amber-300 rounded-md px-1.5 py-0.5" title="Publicação própria de mestre escritor">
                ⭐ OBRA AUTORAL
              </span>
            )}
          </div>

          {/* Book Title & Description */}
          <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-950 leading-tight">
            {book.title}
          </h3>
          <p className="text-xs text-amber-900/60 font-mono mt-0.5">por {book.author}</p>
          
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2.5 italic">
            "{book.description}"
          </p>

          {/* Prices block */}
          <div className="mt-4 flex items-baseline gap-2.5">
            {book.discount ? (
              <>
                <span className="text-base sm:text-lg font-serif font-bold text-amber-950">
                  R$ {discountedPrice.toFixed(2)}
                </span>
                <span className="text-xs line-through text-slate-400">
                  R$ {book.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-serif font-bold text-amber-950">
                R$ {book.price.toFixed(2)}
              </span>
            )}
            <span className="text-[9px] font-mono text-amber-700/65">(ou 3x moedas de prata)</span>
          </div>
        </div>

        {/* Action Row: Comments toggler, likes, and ADD TO BASKET */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-900/10 pt-4 mt-4">
          
          <div className="flex items-center gap-1.5">
            {/* Likes count action */}
            <button
              onClick={() => onLike(book.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-amber-900/20 hover:bg-red-50 text-red-500 font-medium text-xs transition-all cursor-pointer active:scale-95"
              title="Curtir e Recomendar"
            >
              <LucideIcon name="Heart" size={14} className="text-red-500 fill-rose-100 hover:fill-rose-500" />
              <span className="font-mono text-xs font-bold text-slate-300">{book.likes}</span>
            </button>

            {/* Comments button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-amber-900/20 ${
                showComments ? 'bg-red-950/20 border-red-900/30 text-red-400' : 'text-slate-400 hover:text-slate-200'
              } font-medium text-xs transition-all cursor-pointer`}
              title="Ver Avaliações e Notas"
            >
              <LucideIcon name="MessageSquare" size={14} />
              <span className="font-mono text-xs font-bold text-slate-300">
                {book.commentsList.length}
              </span>
            </button>
          </div>

          {/* E-commerce buy vs Admin operations */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-1.5 bg-amber-50 rounded-xl p-1 border border-amber-900/15">
                {onMoveUp && (
                  <button
                    onClick={() => onMoveUp(book.id)}
                    className="p-1.5 rounded-lg text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Mover acima no grid"
                  >
                    <LucideIcon name="ArrowUp" size={12} />
                  </button>
                )}
                {onMoveDown && (
                  <button
                    onClick={() => onMoveDown(book.id)}
                    className="p-1.5 rounded-lg text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Mover abaixo no grid"
                  >
                    <LucideIcon name="ArrowDown" size={12} />
                  </button>
                )}
                <button
                  onClick={() => onEdit(book)}
                  className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-900/30 transition-colors cursor-pointer"
                  title="Editar dados"
                >
                  <LucideIcon name="Edit" size={12} />
                </button>
                <button
                  onClick={() => onDelete(book.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-950/30 transition-colors cursor-pointer"
                  title="Remover do Catálogo"
                >
                  <LucideIcon name="Trash2" size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(book)}
                className="button-magic-primary text-[10px] py-2 px-4 shadow-sm"
              >
                <LucideIcon name="ShoppingBag" size={12} />
                <span>Adicionar ao Dossiê (Comprar)</span>
              </button>
            )}
          </div>

        </div>

        {/* Dynamic Expandable comments section */}
        {showComments && (
          <div className="mt-4 border-t border-dashed border-zinc-800 pt-4">
            <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <LucideIcon name="Users" size={13} className="text-red-500" />
              Depoimentos & Notas Clínicas ({book.commentsList.length})
            </h5>

            {/* List existing comments replies */}
            <div className="space-y-2 max-h-40 overflow-y-auto mb-3 pr-1">
              {book.commentsList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Nenhum depoimento catalogado ainda. Deixe suas impressões psicológicas sobre este enredo! 💭
                </p>
              ) : (
                book.commentsList.map((comm) => (
                  <div key={comm.id} className="bg-black/40 rounded-lg p-2.5 border border-[#2C2E3A]">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-slate-200">{comm.author}</span>
                      <span className="text-[9px] font-mono text-slate-500">{comm.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{comm.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add new comment */}
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-1.5 bg-[#1A1C24] p-2.5 rounded-xl border border-[#2C2E3A]">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Seu pseudônimo..."
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  className="bg-black/40 border border-[#2C2E3A] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-700 w-full sm:w-1/3 text-slate-100 font-sans"
                  maxLength={25}
                  required
                />
                <input
                  type="text"
                  placeholder="Deixe uma análise ou crítica da leitura..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="bg-black/40 border border-[#2C2E3A] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-700 flex-grow text-slate-100 font-sans"
                  maxLength={180}
                  required
                />
                <button
                  type="submit"
                  className="bg-red-800 hover:bg-red-700 text-red-50 font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg cursor-pointer transition-colors border border-red-900"
                >
                  Registar em Ata
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </article>
  );
}
