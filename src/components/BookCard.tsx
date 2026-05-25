/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, Comment } from '../types';
import LucideIcon from './LucideIcon';

interface BookCardProps {
  key?: string;
  book: Book;
  onLike: (id: string) => void;
  onAddComment: (bookId: string, author: string, text: string) => void;
}

export default function BookCard({ book, onLike, onAddComment }: BookCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [userStars, setUserStars] = useState(book.stars);

  const handleShare = () => {
    const simulatedLink = `${window.location.origin}/book/${book.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(simulatedLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim()) return;
    
    onAddComment(book.id, newCommentAuthor.trim(), newCommentText.trim());
    setNewCommentText('');
    try {
      localStorage.setItem('bookshare_nickname', newCommentAuthor.trim());
    } catch (err) {}
  };

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('bookshare_nickname');
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
      id={`book-card-${book.id}`}
      className="interactive-card flex flex-col md:flex-row p-6 bg-white gap-6 text-[#111827]"
    >
      {/* Book Cover Design */}
      <div className="flex-shrink-0 flex justify-center md:block">
        <div 
          className="book-cover-wrap w-[150px] h-[220px] flex flex-col justify-between p-5 text-left relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${book.coverStyle.gradientStart}, ${book.coverStyle.gradientEnd})`,
            color: book.coverStyle.textColor || '#FFFFFF'
          }}
        >
          {/* Aesthetic Book Spine overlay */}
          <div className="book-cover-spine" />
          
          <div className="absolute top-3 right-3 opacity-30">
            <LucideIcon name="Bookmark" size={22} strokeWidth={1.5} />
          </div>

          <div className="z-10">
            <span 
              className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border border-current opacity-85"
              style={{ borderColor: 'currentColor' }}
            >
              {book.isAuthored ? 'Autoral' : 'Indicação'}
            </span>
          </div>

          <div className="z-10 my-auto">
            <h4 className="font-display font-bold text-base leading-tight tracking-tight drop-shadow-sm line-clamp-3">
              {book.title}
            </h4>
            <p className="text-[11px] mt-1.5 font-mono opacity-90 line-clamp-1">
              por {book.author}
            </p>
          </div>

          <div className="z-10 flex justify-between items-center border-t border-transparent pt-2" style={{ borderTopColor: 'rgba(255,255,255,0.2)' }}>
            <span className="text-[9px] font-mono opacity-80">BookShare</span>
            <LucideIcon name={book.coverStyle.iconName} size={15} />
          </div>
        </div>
      </div>

      {/* Book details & Speech bubble */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          {/* Tag & Curator info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3.5 py-1 rounded-full border ${
                book.category === 'Obra Autoral' ? 'bg-[#EDE9FE] text-[#8B5CF6] border-[#DDD6FE]' :
                book.category === 'Leitura Atual' ? 'bg-[#D1FAE5] text-[#10B981] border-[#A7F3D0]' :
                'bg-[#FFEFD6] text-[#F97316] border-[#FED7AA]'
              }`}>
                {book.category === 'Obra Autoral' ? '✨ Obra Autoral' :
                 book.category === 'Leitura Atual' ? '📖 Leitura Atual' :
                 '📌 Recomendado'}
              </span>
              
              <div className="flex items-center gap-0.5 ml-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleStarClick(i)}
                    className="cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    title={`Avaliar com ${i + 1} estrelas`}
                  >
                    <LucideIcon 
                      name="Star" 
                      size={14} 
                      className={i < userStars ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center font-bold text-xs uppercase border border-[#8B5CF6]/25">
                {book.curatorName.substring(0, 2)}
              </div>
              <div className="text-left leading-none">
                <p className="text-xs font-bold font-display text-[#111827]">{book.curatorName}</p>
                {book.curatorRole && (
                  <p className="text-[10px] text-[#4B5563] font-mono mt-0.5">{book.curatorRole}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sincere Speechbubble Commentary */}
          <div className="relative bg-[#FDFCFB] border border-[#E5E7EB] rounded-2xl p-4 mb-4">
            {/* Speech bubble pin */}
            <div className="absolute top-[-6px] right-8 w-2.5 h-2.5 bg-[#FDFCFB] border-t border-l border-[#E5E7EB] transform rotate-45" />
            
            <p className="text-sm font-sans text-[#4B5563] italic leading-relaxed">
              "{book.comment}"
            </p>
          </div>
        </div>

        {/* Toolbar Interaction counters */}
        <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-3.5 mt-2">
          <div className="flex items-center gap-2">
            {/* Like count action button */}
            <button
              onClick={() => onLike(book.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-[#F3F4F6] hover:bg-[#FCECE9] text-[#F97316] font-medium text-xs transition-all cursor-pointer active:scale-95"
              title="Curtir indicação"
            >
              <LucideIcon name="Heart" size={16} className="fill-current" />
              <span className="font-mono text-xs font-bold text-[#111827]">{book.likes}</span>
            </button>

            {/* Comments toggle action button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-[#F3F4F6] ${
                showComments ? 'bg-[#EDE9FE] border-[#EDE9FE] text-[#8B5CF6]' : 'text-[#8B5CF6]'
              } font-medium text-xs transition-all cursor-pointer`}
              title="Ver discussões"
            >
              <LucideIcon name="MessageSquare" size={16} className="text-current" />
              <span className="font-mono text-xs font-bold text-[#111827]">
                {book.commentsList.length}
              </span>
            </button>
          </div>

          <div>
            {/* Share action button with copied link status */}
            <button
              onClick={handleShare}
              className="fun-button-secondary py-1.5 px-4 flex items-center gap-1.5 text-xs font-semibold cursor-pointer relative"
              title="Copiar link do livro"
            >
              <LucideIcon name="Share2" size={14} />
              <span>{copied ? 'Copiado! 🎉' : 'Compartilhar'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Expandable comments block */}
        {showComments && (
          <div className="mt-4 border-t border-dashed border-[#E5E7EB] pt-4">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-[#4B5563] mb-3 flex items-center gap-1.5">
              <LucideIcon name="Users" size={14} />
              Discussão da Comunidade ({book.commentsList.length})
            </h5>

            {/* List existing replies */}
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1">
              {book.commentsList.length === 0 ? (
                <p className="text-xs text-[#4B5563] italic py-2">
                  Nenhum comentário ainda. Seja o primeiro a puxar conversa! 💭
                </p>
              ) : (
                book.commentsList.map((comm) => (
                  <div key={comm.id} className="bg-[#FDFCFB] rounded-2xl p-3.5 border border-[#F3F4F6]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-[#111827]">{comm.author}</span>
                      <span className="text-[10px] font-mono text-[#4B5563]">{comm.date}</span>
                    </div>
                    <p className="text-xs text-[#4B5563] leading-relaxed">{comm.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add new inline comment form */}
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 bg-[#FDFCFB] p-3 rounded-2xl border border-[#E5E7EB]">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Seu nome..."
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#8B5CF6] w-full sm:w-1/3"
                  maxLength={25}
                  required
                />
                <input
                  type="text"
                  placeholder="Diga o que você achou desta leitura..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#8B5CF6] flex-grow"
                  maxLength={180}
                  required
                />
                <button
                  type="submit"
                  className="bg-[#111827] hover:bg-[#8B5CF6] text-white font-semibold text-[11px] uppercase tracking-wider py-2 px-4 rounded-xl cursor-pointer transition-colors"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
