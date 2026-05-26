/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { COVER_GRADIENTS, COVER_ICONS } from '../data';
import LucideIcon from './LucideIcon';

interface AddBookFormProps {
  onAddBook: (newBook: Book) => void;
  onEditBook?: Book | null; // If passed, we are in edit mode
  onSaveEditedBook?: (updatedBook: Book) => void;
  onClose: () => void;
}

export default function AddBookForm({ onAddBook, onEditBook, onSaveEditedBook, onClose }: AddBookFormProps) {
  const isEditing = !!onEditBook;
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState<number>(29.90);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Thriller Psicológico' | 'Dark Romance' | 'Suspense Policial' | 'Terror Mentis'>('Thriller Psicológico');
  const [discount, setDiscount] = useState<number>(0);
  
  // Cover styling options
  const [gradIndex, setGradIndex] = useState(0);
  const [iconChoice, setIconChoice] = useState('Brain');
  const [coverImage, setCoverImage] = useState<string>(''); // Base64 image
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize fields if we are in Edit Mode
  useEffect(() => {
    if (onEditBook) {
      setTitle(onEditBook.title);
      setAuthor(onEditBook.author);
      setPrice(onEditBook.price);
      setDescription(onEditBook.description);
      setCategory(onEditBook.category);
      setDiscount(onEditBook.discount || 0);
      setCoverImage(onEditBook.coverImage || '');
      
      // Match gradient if possible
      const matchGrad = COVER_GRADIENTS.findIndex(
        (g) => g.start === onEditBook.coverStyle.gradientStart
      );
      if (matchGrad !== -1) setGradIndex(matchGrad);
      
      setIconChoice(onEditBook.coverStyle.iconName || 'Brain');
    }
  }, [onEditBook]);

  const selectedGradient = COVER_GRADIENTS[gradIndex];

  // Base64 file reader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 1.5 * 1024 * 1024) {
        alert('Por favor, selecione uma imagem menor que 1.5MB para que caiba no banco de dados local!');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedImage = () => {
    setCoverImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !description.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios da obra!');
      return;
    }

    if (price <= 0) {
      alert('Toda obra tem seu valor! Insira um valor maior que R$ 0,00.');
      return;
    }

    const bookStyle = {
      gradientStart: selectedGradient.start,
      gradientEnd: selectedGradient.end,
      iconName: iconChoice,
      textColor: '#FFFFFF'
    };

    if (isEditing && onEditBook && onSaveEditedBook) {
      const updatedBook: Book = {
        ...onEditBook,
        title: title.trim(),
        author: author.trim(),
        price: Number(price),
        description: description.trim(),
        category,
        discount: discount > 0 ? Number(discount) : undefined,
        coverImage: coverImage || undefined,
        coverStyle: bookStyle,
      };
      onSaveEditedBook(updatedBook);
    } else {
      const newBook: Book = {
        id: String(Date.now()),
        title: title.trim(),
        author: author.trim(),
        price: Number(price),
        description: description.trim(),
        isAuthored: true, // Novos livros cadastrados são assumidos como autorais do proprietário
        category,
        discount: discount > 0 ? Number(discount) : undefined,
        coverImage: coverImage || undefined,
        coverStyle: bookStyle,
        likes: 0,
        stars: 5,
        commentsList: [],
        createdAt: new Date().toISOString()
      };
      onAddBook(newBook);
    }
  };

  return (
    <div className="parchment-sheet p-6 sm:p-8 relative">
      {/* Decorative close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white bg-[#12131A] border border-zinc-800 p-2.5 rounded-full cursor-pointer transition-transform duration-200 active:scale-90 z-20"
        title="Fechar Painel"
      >
        <LucideIcon name="X" size={16} />
      </button>

      <div className="mb-6 pr-6">
        <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <span>{isEditing ? '🔍 Atualizar Dossiê Criminal' : '🕵️‍♂️ Catalogar Novo Dossiê / Suspense'}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {isEditing 
            ? 'Altere os metadados, preço e sinopse do livro de suspense/romance. Os dados serão atualizados no dossiê.' 
            : 'Preencha as informações literárias para arquivar e exibir uma nova obra autoral em nossa vitrine investigativa.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Cover Live Preview */}
        <div className="lg:col-span-4 flex flex-col items-center bg-[#12131A] p-5 rounded-xl border border-zinc-800">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-3 font-semibold">
            ✦ Dossiê Visual (Capa) ✦
          </span>

          <div 
            className="book-card-magic w-[140px] h-[210px] flex flex-col justify-between p-4 text-left relative overflow-hidden"
            style={{
              background: coverImage 
                ? 'none' 
                : `linear-gradient(135deg, ${selectedGradient.start}, ${selectedGradient.end})`,
              color: '#FFFFFF'
            }}
          >
            {coverImage && (
              <img 
                src={coverImage} 
                alt="Uploaded Cover" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            
            {/* Aesthetics book binders */}
            <div className="book-bound-spine" />
            <div className="book-pages-stack" />

            {/* Simulated discounts tag bookmark ribbon */}
            {discount > 0 && (
              <div className="bookmark-ribbon text-[9px] font-black w-[30px] h-[45px] right-[8px] pt-1.5 leading-none">
                -{discount}%
              </div>
            )}

            <div className="absolute top-2.5 right-2.5 opacity-35 z-10">
              <LucideIcon name="Bookmark" size={20} strokeWidth={1.5} />
            </div>

            <div className="z-10 mt-1">
              <span className="text-[8px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-black/45 border border-white/20">
                {category}
              </span>
            </div>

            <div className="z-10 my-auto py-2">
              <h4 className="font-serif font-bold text-xs sm:text-sm leading-tight tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] line-clamp-3">
                {title || 'Título do Livro'}
              </h4>
              <p className="text-[9px] mt-1 font-mono opacity-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] line-clamp-1">
                por {author || 'Autor da Obra'}
              </p>
            </div>

            <div className="z-10 flex justify-between items-center mt-1 pt-1 border-t border-white/20">
              <span className="text-[8px] font-mono opacity-80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                R$ {(price || 0).toFixed(2)}
              </span>
              <LucideIcon name={iconChoice} size={13} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
            </div>
          </div>

          {/* Base64 Upload component */}
          <div className="w-full mt-4 border-t border-zinc-800 pt-3 flex flex-col items-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-semibold text-center">
              Inserir Imagem Oficial de Capa
            </span>
            <div className="flex flex-col items-center gap-2 w-full">
              <label className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-700 hover:bg-red-600 text-white text-[11px] font-semibold font-mono rounded-lg cursor-pointer transition-all border border-zinc-800 shadow-sm">
                <LucideIcon name="Upload" size={12} />
                Carregar Imagem Real
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  onChange={handleImageFileChange} 
                  className="hidden" 
                />
              </label>
              
              {coverImage && (
                <button
                  type="button"
                  onClick={clearUploadedImage}
                  className="text-[9px] font-bold text-red-400 hover:underline"
                >
                  Remover Imagem & Usar Capa Padrão
                </button>
              )}
            </div>
          </div>

          {!coverImage && (
            <>
              {/* Color swatch selector */}
              <div className="w-full mt-4 border-t border-zinc-800 pt-3">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5 text-center font-semibold">
                  Cor de Capa Padrão
                </label>
                <div className="flex flex-wrap justify-center gap-1">
                  {COVER_GRADIENTS.map((g, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setGradIndex(index)}
                      className={`w-5.5 h-5.5 rounded-full border transition-transform cursor-pointer ${
                        gradIndex === index ? 'border-red-500 scale-120 ring-1 ring-red-500' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ background: `linear-gradient(135deg, ${g.start}, ${g.end})` }}
                      title={g.name}
                    />
                  ))}
                </div>
              </div>

              {/* Decorative Icon Selector */}
              <div className="w-full mt-3 border-t border-zinc-800 pt-2.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5 text-center font-semibold">
                  Ícone Temático de Capa
                </label>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {COVER_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIconChoice(ic)}
                      className={`p-1 rounded-md border transition-all cursor-pointer ${
                        iconChoice === ic 
                          ? 'border-red-650 bg-red-900 text-white shadow-inner' 
                          : 'border-zinc-850 bg-[#1C1E26] text-slate-400 hover:text-white hover:bg-zinc-800'
                      }`}
                      title={ic}
                    >
                      <LucideIcon name={ic} size={12} />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Right Column: Information form fields */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-100 mb-1 uppercase tracking-wider">
                Título da Obra <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Noites de Psicose"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-100"
                maxLength={45}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-100 mb-1 uppercase tracking-wider">
                Autor / Pseudônimo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Evelyn Cross"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-100"
                maxLength={40}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-100 mb-1 uppercase tracking-wider">
                Gênero Literário <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-100 font-serif"
              >
                <option value="Thriller Psicológico">🧠 Thriller Psicológico</option>
                <option value="Dark Romance">🌹 Dark Romance</option>
                <option value="Suspense Policial">🕵️‍♂️ Suspense Policial</option>
                <option value="Terror Mentis">👁️ Terror Mentis</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-100 mb-1 uppercase tracking-wider">
                Preço Sugerido (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                placeholder="29.90"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-100 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-100 mb-1 uppercase tracking-wider">
                Desconto do Dossiê (%)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                placeholder="Ex: 15"
                value={discount || ''}
                onChange={(e) => setDiscount(Math.min(90, Math.max(0, Number(e.target.value))))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-100 mb-1 uppercase tracking-wider font-sans">
              Sinopse do Enredo & Ganchos Finais <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Escreva a sinopse oficial da obra. Insira os ganchos mentais e detalhes psicológicos que convencerão os leitores de forma instigante."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all h-28 resize-none text-slate-100"
              maxLength={280}
              required
            />
            <div className="text-[10px] text-right font-mono text-slate-500 mt-1 font-semibold">
              {description.length} / 280 caracteres
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-1 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="button-magic-secondary font-bold text-xs uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button-magic-primary flex items-center gap-1.5"
            >
              <span>{isEditing ? 'Salvar Alterações' : 'Arquivar no Dossiê Store 🕵️‍♂️'}</span>
              <LucideIcon name="Shield" size={14} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
