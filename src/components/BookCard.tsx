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
  onSelect?: (book: Book) => void;
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
  onMoveDown,
  onSelect
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
      className="book-card-magic flex flex-col md:flex-row p-6 sm:p-7 gap-6 relative border border-[#2D303D] bg-[#12131A] min-h-[290px]"
    >
      {/* Dynamic Ribbon for Discount tags */}
      {book.discount && book.discount > 0 ? (
        <div className="bookmark-ribbon" title={`${book.discount}% de desconto`}>
          <span>{book.discount}%</span>
          <div className="text-[10px] font-bold leading-none tracking-tighter">OFF</div>
        </div>
      ) : null}

      {/* Book Cover Design Cover */}
      <div className="flex-shrink-0 flex justify-center items-start md:block cursor-pointer" onClick={() => onSelect?.(book)}>
        <div 
          className="book-card-magic w-[150px] h-[225px] flex flex-col justify-between p-5 text-left relative overflow-hidden shadow-xl select-none hover:scale-105 transition-transform duration-300"
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
              className="text-[8.5px] uppercase tracking-widest font-mono px-2 py-0.5 rounded-full bg-black/55 border border-white/20 text-[#EF4444] font-bold"
            >
              {book.category}
            </span>
          </div>

          <div className="z-10 my-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            <h4 className="font-serif font-black text-xs sm:text-sm leading-snug tracking-normal line-clamp-3 text-white">
              {book.title}
            </h4>
            <p className="text-[9px] mt-1 font-mono text-slate-300 opacity-90 line-clamp-1">
              por {book.author || 'Investigador Anônimo'}
            </p>
          </div>

          <div className="z-10 flex justify-between items-center border-t border-white/20 pt-1.5 mt-1">
            <span className="text-[8px] font-mono text-slate-300 opacity-80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">Dossiê Oculto</span>
            <LucideIcon 
              name={book.coverStyle.iconName || 'BookOpen'} 
              size={13} 
              className="text-[#EF4444] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" 
            />
          </div>
        </div>
      </div>

      {/* Book details & Commentary */}
      <div className="flex-grow flex flex-col justify-between relative z-10 text-left">
        <div>
          {/* Header row: Categories, Rating stars */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-red-950/40 border border-red-900/30 text-red-400 font-mono">
                🕵️‍♂️ {book.category}
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
                      className={i < userStars ? "text-amber-400 fill-amber-400" : "text-zinc-600"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {book.isAuthored && (
              <span className="text-[8px] font-mono font-black tracking-widest text-[#EF4444] bg-[#2E1414] border border-[#EF4444]/30 rounded px-1.5 py-0.5" title="Publicação autoral sob escrutínio forense">
                ESTILO AUTORAL
              </span>
            )}
          </div>

          {/* Book Title & Description */}
          <h3 
            className="font-serif font-black text-lg sm:text-xl text-slate-100 hover:text-red-400 cursor-pointer transition-colors leading-tight"
            onClick={() => onSelect?.(book)}
          >
            {book.title}
          </h3>
          <p className="text-xs text-red-400/80 font-mono mt-1">por <span className="font-bold underline">{book.author}</span></p>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3 italic bg-zinc-950/40 p-3 rounded-lg border border-zinc-800 font-sans">
            "{book.description}"
          </p>

          {/* Prices block */}
          <div className="mt-4 flex items-baseline gap-2.5">
            {book.discount ? (
              <>
                <span className="text-base sm:text-lg font-mono font-black text-amber-400">
                  R$ {discountedPrice.toFixed(2)}
                </span>
                <span className="text-xs line-through text-zinc-500 font-mono">
                  R$ {book.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-mono font-black text-amber-400">
                R$ {book.price.toFixed(2)}
              </span>
            )}
            <span className="text-[9px] font-mono text-zinc-400">em faturamento único</span>
          </div>
        </div>

        {/* Action Row: Comments toggler, likes, and ADD TO BASKET */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2D303D] pt-4 mt-4">
          
          <div className="flex items-center gap-1.5">
            {/* Likes count action */}
            <button
              onClick={() => onLike(book.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800 bg-[#1A1C24]/60 hover:bg-[#2A1C1C] hover:border-red-900/40 text-red-500 font-medium text-xs transition-all cursor-pointer active:scale-95"
              title="Curtir e Recomendar"
            >
              <LucideIcon name="Heart" size={14} className="text-[#EF4444] fill-red-900/10 hover:fill-[#EF4444]" />
              <span className="font-mono text-xs font-bold text-slate-300">{book.likes}</span>
            </button>

            {/* Comments button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800 bg-[#1A1C24]/60 ${
                showComments ? 'bg-red-950/30 border-red-500/30 text-red-400' : 'text-slate-300 hover:text-white hover:border-zinc-700'
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
              <div className="flex items-center gap-1.5 bg-[#12131A] rounded-xl p-1 border border-zinc-800">
                {onMoveUp && (
                  <button
                    onClick={() => onMoveUp(book.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                    title="Mover acima no grid"
                  >
                    <LucideIcon name="ArrowUp" size={12} />
                  </button>
                )}
                {onMoveDown && (
                  <button
                    onClick={() => onMoveDown(book.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
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
                className="button-magic-primary text-[10px] py-2 px-4 shadow-md bg-red-800 hover:bg-red-700 hover:border-red-600 rounded-lg text-white font-mono uppercase font-bold"
              >
                <LucideIcon name="ShoppingBag" size={12} />
                <span>Adicionar ao Dossiê</span>
              </button>
            )}
          </div>

        </div>

        {/* Dynamic Expandable comments section */}
        {showComments && (
          <div className="mt-4 border-t border-dashed border-[#2D303D] pt-4">
            <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <LucideIcon name="Users" size={13} className="text-[#EF4444]" />
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
                  <div key={comm.id} className="bg-black/40 rounded-lg p-2.5 border border-[#2D303D] text-left">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-slate-200">{comm.author}</span>
                      <span className="text-[9px] font-mono text-zinc-500">{comm.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{comm.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add new comment */}
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-1.5 bg-[#1C1E26] p-2.5 rounded-xl border border-[#2D303D]">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Seu pseudônimo..."
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  className="bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#EF4444] w-full sm:w-1/3 text-slate-100 font-sans"
                  maxLength={25}
                  required
                />
                <input
                  type="text"
                  placeholder="Deixe uma análise ou crítica da leitura..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#EF4444] flex-grow text-slate-100 font-sans"
                  maxLength={180}
                  required
                />
                <button
                  type="submit"
                  className="bg-[#EF4444] hover:bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg cursor-pointer transition-colors border border-red-700 font-mono"
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
