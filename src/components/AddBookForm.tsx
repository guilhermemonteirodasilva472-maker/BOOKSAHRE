/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book } from '../types';
import { COVER_GRADIENTS, COVER_ICONS } from '../data';
import LucideIcon from './LucideIcon';

interface AddBookFormProps {
  onAddBook: (newBook: Book) => void;
  onClose: () => void;
}

export default function AddBookForm({ onAddBook, onClose }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<'Indicação' | 'Leitura Atual' | 'Obra Autoral'>('Indicação');
  const [curatorName, setCuratorName] = useState('');
  const [curatorRole, setCuratorRole] = useState('');
  const [comment, setComment] = useState('');
  const [stars, setStars] = useState(5);
  
  // Cover custom choices
  const [gradIndex, setGradIndex] = useState(0);
  const [isAuthored, setIsAuthored] = useState(false);
  const [iconChoice, setIconChoice] = useState('BookOpen');

  const selectedGradient = COVER_GRADIENTS[gradIndex];

  // Auto detect if the user selected category "Obra Autoral" to toggle isAuthored
  React.useEffect(() => {
    if (category === 'Obra Autoral') {
      setIsAuthored(true);
    } else {
      setIsAuthored(false);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !curatorName.trim() || !comment.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const newBook: Book = {
      id: String(Date.now()),
      title: title.trim(),
      author: author.trim(),
      isAuthored: category === 'Obra Autoral',
      category,
      curatorName: curatorName.trim(),
      curatorRole: curatorRole.trim() || undefined,
      comment: comment.trim(),
      likes: 1, // Start with 1 like for motivation!
      stars,
      coverStyle: {
        gradientStart: selectedGradient.start,
        gradientEnd: selectedGradient.end,
        iconName: iconChoice,
        textColor: selectedGradient.start === '#F3C430' ? '#111827' : '#FFFFFF'
      },
      commentsList: [],
      createdAt: new Date().toISOString()
    };

    onAddBook(newBook);
  };

  return (
    <div className="bg-white border border-[#F3F4F6] rounded-[32px] p-6 sm:p-8 shadow-xl relative">
      {/* Decorative close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-[#111827] bg-[#FDFCFB] border border-[#E5E7EB] p-2.5 rounded-full cursor-pointer transition-transform duration-200 active:scale-90"
        title="Fechar formulário"
      >
        <LucideIcon name="X" size={16} />
      </button>

      <div className="mb-6 pr-6">
        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#111827] tracking-tight">
          📚 Compartilhar uma Leitura ou Escrita
        </h3>
        <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 font-sans">
          Mostre para a comunidade o que tem feito seus olhos brilharem. Publique de forma minimalista!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cover Live Preview */}
        <div className="lg:col-span-4 flex flex-col items-center bg-[#FDFCFB] p-6 rounded-2xl border border-dashed border-[#E5E7EB]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#4B5563] mb-3">
            Prévia da Capa
          </span>

          <div 
            className="book-cover-wrap w-[140px] h-[200px] flex flex-col justify-between p-4 text-left relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${selectedGradient.start}, ${selectedGradient.end})`,
              color: selectedGradient.start === '#F3C430' ? '#111827' : '#FFFFFF'
            }}
          >
            <div className="book-cover-spine" />
            <div className="absolute top-2.5 right-2.5 opacity-35">
              <LucideIcon name="Bookmark" size={20} strokeWidth={1.5} />
            </div>

            <div className="z-10 mt-1">
              <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border border-current opacity-85">
                {category === 'Obra Autoral' ? 'Autoral' : 'Indicação'}
              </span>
            </div>

            <div className="z-10 my-auto py-2">
              <h4 className="font-display font-bold text-sm leading-tight tracking-tight drop-shadow-sm line-clamp-3">
                {title || 'Título do Livro'}
              </h4>
              <p className="text-[10px] mt-1.5 font-mono opacity-90 line-clamp-1">
                por {author || 'Nome do Autor'}
              </p>
            </div>

            <div className="z-10 flex justify-between items-center mt-1 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="text-[9px] font-mono opacity-80">BookShare</span>
              <LucideIcon name={iconChoice} size={14} />
            </div>
          </div>

          {/* Color swatch selector */}
          <div className="w-full mt-5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#4B5563] block mb-2 text-center">
              Estilo da Paleta
            </label>
            <div className="flex flex-wrap justify-center gap-1.5">
              {COVER_GRADIENTS.map((g, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setGradIndex(index)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    gradIndex === index ? 'border-[#8B5CF6] scale-120 shadow-sm' : 'border-transparent hover:scale-110'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${g.start}, ${g.end})` }}
                  title={g.name}
                />
              ))}
            </div>
          </div>

          {/* Decorative Icon Selector */}
          <div className="w-full mt-4 border-t border-[#F3F4F6] pt-3">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#4B5563] block mb-2 text-center">
              Ícone de Destaque
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {COVER_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIconChoice(ic)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    iconChoice === ic 
                      ? 'border-[#8B5CF6] bg-[#EDE9FE] text-[#8B5CF6]' 
                      : 'border-[#E5E7EB] bg-white text-slate-400 hover:text-[#111827]'
                  }`}
                  title={ic}
                >
                  <LucideIcon name={ic} size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Information form fields */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                Título do Livro <span className="text-[#F97316]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: O Menino que Desenhava Mundos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all"
                maxLength={45}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                Autor(a) da Obra <span className="text-[#F97316]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Júlio Verne, Clarice Lispector"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all"
                maxLength={40}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                Tipo de Recomendação <span className="text-[#F97316]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all font-sans"
              >
                <option value="Indicação">📌 Indicação de Favorito</option>
                <option value="Leitura Atual">📖 Lendo Atualmente</option>
                <option value="Obra Autoral">✨ Minha Obra Autoral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                Sua Avaliação Sincera
              </label>
              <div className="flex items-center gap-1.5 h-[44px]">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStars(i + 1)}
                    className="cursor-pointer transition-transform duration-150 hover:scale-120"
                  >
                    <LucideIcon
                      name="Star"
                      size={24}
                      className={i < stars ? "text-amber-400 fill-amber-400" : "text-gray-200"}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono text-slate-400 ml-2">
                  ({stars} / 5)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                Seu Nome ou Apelido <span className="text-[#F97316]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Beatriz Santos"
                value={curatorName}
                onChange={(e) => setCuratorName(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all"
                maxLength={25}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
                Sua Mini Biografia / "Tag"
              </label>
              <input
                type="text"
                placeholder="Ex: Amante de Biografias, Escritor Amador"
                value={curatorRole}
                onChange={(e) => setCuratorRole(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all"
                maxLength={45}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1.5 uppercase tracking-wider">
              Seu Breve Balão de Comentário <span className="text-[#F97316]">*</span>
            </label>
            <textarea
              placeholder="Ex: Este livro tem mudado minha forma de ver o mundo, a escrita foca em passagens divertidas e me emocionei no final!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all h-24 resize-none"
              maxLength={220}
              required
            />
            <div className="text-[10px] text-right font-mono text-slate-400 mt-1">
              {comment.length} / 220 caracteres
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="fun-button-secondary font-bold uppercase tracking-wider text-xs px-5 py-2.5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#8B5CF6] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#7C3AED] transition-all duration-200 cursor-pointer shadow-lg shadow-purple-100 flex items-center gap-1.5"
            >
              Publicar no Feed 🚀
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
