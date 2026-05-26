import React, { useState } from 'react';
import { Book } from '../types';
import { DIGA_SEU_NOME_COVER } from '../data';
import LucideIcon from './LucideIcon';

interface ThreeDLaunchBookProps {
  onAddToCart: (book: Book) => void;
  onOpenBookDetails?: (book: Book) => void;
}

export const LAUNCH_BOOK: Book = {
  id: 'launch-spec-1',
  title: 'Diga Seu Nome',
  author: 'guigoto monteiro',
  price: 54.00,
  description: 'Um crime insolúvel, uma fita amarela da polícia e pistas sádicas meticulosamente deixadas para trás. Diante de um quebra-cabeça mortal focado no passado, desvendar sua verdadeira identidade é a única chance de sobrevivência.',
  isAuthored: true,
  category: 'Thriller Psicológico',
  discount: 25, // 25% OFF
  coverImage: DIGA_SEU_NOME_COVER,
  coverStyle: {
    gradientStart: '#0F031E',
    gradientEnd: '#05010B',
    iconName: 'Eye',
    textColor: '#FFFFFF'
  },
  likes: 450,
  stars: 5,
  commentsList: [
    { id: 'lc1', author: 'Detetive Castro', text: 'O suspense perfeito! Cada revelação sobre a mente e as pistas criminais é de arrepiar.', date: 'Hoje' }
  ],
  createdAt: new Date().toISOString()
};

export default function ThreeDLaunchBook({ onAddToCart, onOpenBookDetails }: ThreeDLaunchBookProps) {
  const [copied, setCopied] = useState(false);
  const discountPrice = LAUNCH_BOOK.price * (1 - (LAUNCH_BOOK.discount || 0) / 100);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`Destaque Literário: ${LAUNCH_BOOK.title} por apenas R$ ${discountPrice.toFixed(2)} no Dossiê Psique!`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#12131A] to-[#1E202B] border-2 border-[#2C2E3A] p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
      
      {/* Decorative Corner Borders */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#374151]/40 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#374151]/40 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#374151]/40 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#374151]/40 rounded-br-xl pointer-events-none" />

      {/* Background dark red/crimson aura glow for dark mystery */}
      <div className="absolute right-0 top-0 w-56 h-56 bg-gradient-to-br from-[#881337]/15 to-[#3B0764]/15 rounded-full filter blur-3xl pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity duration-500" />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Information & Cart Actions */}
        <div className="md:col-span-7 text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#881337]/15 border border-[#881337]/35 rounded-full text-red-400 text-[10px] font-mono uppercase tracking-wider font-extrabold animate-magical-float">
            <LucideIcon name="Shield" size={12} className="text-red-500" />
            <span>LANÇAMENTO AUTORAL DESTAQUE 🕵️‍♂️</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-100 leading-tight">
            {LAUNCH_BOOK.title}
          </h3>

          <p className="text-slate-400 text-xs font-mono">
            por <span className="font-serif font-bold text-red-500">{LAUNCH_BOOK.author}</span>
          </p>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-normal">
            {LAUNCH_BOOK.description}
          </p>

          {/* Pricing Box */}
          <div className="flex items-center gap-3 bg-[#111218]/90 p-3.5 rounded-xl border border-[#2C2E3A] max-w-sm">
            <div className="relative">
              <span className="text-[10px] font-mono uppercase text-slate-500 block line-through">
                R$ {LAUNCH_BOOK.price.toFixed(2)}
              </span>
              <span className="text-xl font-bold font-mono text-slate-100">
                R$ {discountPrice.toFixed(2)}
              </span>
            </div>
            
            <div className="bg-[#991B1B] text-red-50 text-[10px] font-bold px-2 py-1 font-mono rounded border border-red-700 shrink-0 uppercase tracking-wide">
              {LAUNCH_BOOK.discount}% DESCONTO
            </div>
          </div>

          {/* Buttons actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onAddToCart(LAUNCH_BOOK)}
              className="button-magic-primary text-xs py-3.5 px-6 rounded-full flex items-center gap-2 shadow-lg"
              id="btn-add-launch-book"
            >
              <LucideIcon name="ShoppingBag" size={14} />
              <span>Adicionar ao Dossiê (Comprar)</span>
            </button>

            <button
              onClick={() => onOpenBookDetails && onOpenBookDetails(LAUNCH_BOOK)}
              className="button-magic-secondary text-xs py-3 px-4 rounded-full flex items-center gap-1.5"
            >
              <LucideIcon name="Search" size={13} />
              <span>Investigar Obra</span>
            </button>

            <button
              onClick={handleShare}
              className="p-3 text-slate-400 hover:text-slate-100 bg-[#1A1C24] hover:bg-[#232631] border border-[#2D303D] rounded-full transition-all"
              title="Copiar link de recomendação de leitura"
            >
              <LucideIcon name={copied ? 'Check' : 'Share2'} size={14} className={copied ? 'text-emerald-500' : ''} />
            </button>
          </div>
        </div>

        {/* Right Side: The 3D Book Container */}
        <div className="md:col-span-5 flex justify-center py-6">
          <div 
            onClick={() => onOpenBookDetails && onOpenBookDetails(LAUNCH_BOOK)}
            className="three-d-book-container cursor-pointer select-none"
            title="Investigar capa em 3D de lançamento!"
          >
            <div className="three-d-book">
              
              {/* Back Cover */}
              <div 
                className="three-d-book-cover-back"
                style={{
                  background: `linear-gradient(225deg, ${LAUNCH_BOOK.coverStyle.gradientEnd}, ${LAUNCH_BOOK.coverStyle.gradientStart})`
                }}
              />
              
              {/* Paper Stack Thickness Layer */}
              <div className="three-d-book-page-block" />

              {/* Spine edge wrapping */}
              <div 
                className="three-d-book-spine"
                style={{
                  background: `linear-gradient(to bottom, ${LAUNCH_BOOK.coverStyle.gradientStart}, ${LAUNCH_BOOK.coverStyle.gradientEnd})`
                }}
              >
                <div className="w-full h-full opacity-35 bg-repeat-y bg-cover" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.5) 100%)` }} />
              </div>

              {/* Front Cover Card */}
              <div 
                className="three-d-book-cover-front p-4 flex flex-col justify-between"
                style={{
                  background: `linear-gradient(135deg, ${LAUNCH_BOOK.coverStyle.gradientStart}, ${LAUNCH_BOOK.coverStyle.gradientEnd})`,
                  color: LAUNCH_BOOK.coverStyle.textColor
                }}
              >
                {/* Embedded Spine Highlight inside cover */}
                <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-r from-black/25 to-transparent z-10" />

                {/* Cover Header Badge */}
                <div className="flex justify-between items-start z-10">
                  <span className="text-[7.5px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-red-400">
                    {LAUNCH_BOOK.category}
                  </span>
                  <div className="text-red-500">
                    <LucideIcon name="Eye" size={12} className="animate-pulse" />
                  </div>
                </div>

                {/* Central Illustration Area with glowing stamp */}
                <div className="my-auto py-2 flex flex-col items-center justify-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-2.5 shadow-inner">
                    <LucideIcon name={LAUNCH_BOOK.coverStyle.iconName} size={22} className="text-red-500 animate-pulse" />
                  </div>
                  
                  <h4 className="font-serif font-black text-center text-xs sm:text-xs leading-snug tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-h-12 overflow-hidden line-clamp-3">
                    {LAUNCH_BOOK.title}
                  </h4>
                  
                  <p className="text-[8px] mt-1 font-mono opacity-80 uppercase tracking-widest text-center line-clamp-1">
                    {LAUNCH_BOOK.author}
                  </p>
                </div>

                {/* Footer seal */}
                <div className="flex justify-between items-center text-[7px] font-mono border-t border-white/15 pt-1.5 z-10">
                  <span className="opacity-70">DOSSIÊ IMPORTADO</span>
                  <span className="text-red-400 font-bold">25% OFF</span>
                </div>

                {/* Dynamic bookmark ribbon in 3D */}
                <div className="bookmark-ribbon text-[8px] font-black w-[24px] h-[36px] right-[10px] top-[-2px] pt-1 leading-none shadow-md bg-red-800">
                  NEW
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
