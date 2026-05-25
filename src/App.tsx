/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Book, Comment } from './types';
import { INITIAL_BOOKS } from './data';
import BookCard from './components/BookCard';
import AddBookForm from './components/AddBookForm';
import Features from './components/Features';
import LucideIcon from './components/LucideIcon';

export default function App() {
  // Persistence with LocalStorage
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const savedBooks = localStorage.getItem('bookshare_books');
      return savedBooks ? JSON.parse(savedBooks) : INITIAL_BOOKS;
    } catch (e) {
      return INITIAL_BOOKS;
    }
  });

  // UI States
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bookshare_books', JSON.stringify(books));
    } catch (error) {
      console.warn('Erro ao salvar os livros no localStorage', error);
    }
  }, [books]);

  // Toast utilities
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Interactions callbacks
  const handleLike = (id: string) => {
    setBooks(prevBooks => 
      prevBooks.map(book => {
        if (book.id === id) {
          triggerNotification(`Você curtiu "${book.title}"! ❤️`);
          return { ...book, likes: book.likes + 1 };
        }
        return book;
      })
    );
  };

  const handleAddComment = (bookId: string, author: string, text: string) => {
    const newComment: Comment = {
      id: String(Date.now()),
      author,
      text,
      date: 'Agora mesmo'
    };

    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === bookId) {
          triggerNotification(`Comentário adicionado em "${book.title}"! 💭`);
          return {
            ...book,
            commentsList: [newComment, ...book.commentsList]
          };
        }
        return book;
      })
    );
  };

  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    setIsFormOpen(false);
    triggerNotification(`"${newBook.title}" foi publicado com sucesso! 📚🚀`);
    
    // Smooth scroll down to the feed area
    setTimeout(() => {
      const feed = document.getElementById('books-feed');
      if (feed) {
        feed.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleReset = () => {
    if (window.confirm('Deseja mesmo restaurar as recomendações originais do BookShare? Suas alterações locais serão removidas.')) {
      setBooks(INITIAL_BOOKS);
      triggerNotification('Recomendações originais restauradas! 🔄');
    }
  };

  // Filtering Logic
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Category filter
      const matchesCategory = 
        selectedCategory === 'Todas' ||
        (selectedCategory === 'Indicações' && book.category === 'Indicação') ||
        (selectedCategory === 'Leituras Atuais' && book.category === 'Leitura Atual') ||
        (selectedCategory === 'Obras Autorais' && book.category === 'Obra Autoral');

      // Search filter
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.curatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.comment.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  // Overall Statistics calculated dynamically
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const totalLikes = books.reduce((sum, b) => sum + b.likes, 0);
    const totalComments = books.reduce((sum, b) => sum + b.commentsList.length, 0);
    const autoralCount = books.filter(b => b.isAuthored).length;

    return {
      totalBooks,
      totalLikes,
      totalComments,
      autoralCount
    };
  }, [books]);

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-[#EDE9FE] selection:text-[#8B5CF6]">
      
      {/* Background Decorative Blobs */}
      <div className="bg-blob-lavender top-[12%] left-[-100px]" />
      <div className="bg-blob-mint top-[42%] right-[-120px]" />
      <div className="bg-blob-coral bottom-[18%] left-[20%]" />

      {/* Dynamic Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3.5 rounded-2xl border border-white/20 shadow-xl shadow-purple-900/10 flex items-center gap-3 animate-bounce">
          <span className="text-lg">📢</span>
          <p className="text-xs sm:text-sm font-sans font-bold">{notification}</p>
        </div>
      )}

      {/* Main Header navigation */}
      <header className="sticky top-0 z-40 bg-[#FDFCFB]/85 backdrop-blur-md border-b border-[#F0EBE5] py-4 px-4 sm:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] text-white flex items-center justify-center font-bold shadow-lg shadow-purple-100">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-base sm:text-lg text-[#111827] leading-none tracking-tight">
                BookShare
              </h1>
              <span className="text-[9px] font-mono tracking-wider font-semibold text-[#8B5CF6] uppercase">
                Comunidade de Leitores
              </span>
            </div>
          </div>

          {/* Quick links & action buttons */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#4B5563] hover:text-[#8B5CF6] transition-colors">
              Como funciona
            </a>
            <a href="#explore" className="text-sm font-medium text-[#4B5563] hover:text-[#8B5CF6] transition-colors">
              Explorar Feed
            </a>
            <button
              onClick={() => {
                setIsFormOpen(true);
                setTimeout(() => {
                  document.getElementById('share-form-container')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-medium text-[#4B5563] hover:text-[#8B5CF6] transition-colors cursor-pointer"
            >
              🚀 Compartilhar Livro
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Soft stats badges in header */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#E5E7EB] text-xs font-mono text-[#4B5563]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>{stats.totalBooks} Ativas</span>
            </div>

            {/* Mobile primary CTA */}
            <button
              onClick={() => {
                setIsFormOpen(true);
                setTimeout(() => {
                  const el = document.getElementById('share-form-container');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold rounded-full shadow-md shadow-purple-100 transition-all duration-200 cursor-pointer"
            >
              + Adicionar
            </button>
          </div>

        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow z-10">

        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 text-center max-w-4xl mx-auto overflow-hidden">
          {/* Animated decorative geometric icon background */}
          <div className="absolute top-[8%] right-[4%] text-[#10B981]/20 animate-spin-slow pointer-events-none">
            <LucideIcon name="Sparkles" size={54} strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-[22%] left-[4%] text-[#F97316]/15 animate-float pointer-events-none">
            <LucideIcon name="Compass" size={64} strokeWidth={1.5} />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-bold uppercase tracking-wider mb-6">
            <span>✨</span>
            <span>Nova Comunidade Literária</span>
            <span>✨</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-[#111827] tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Leia, escreva & <span className="text-[#8B5CF6]">conecte-se.</span>
          </h2>

          <p className="text-[#6B7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed font-sans">
            Sua comunidade literária minimalista e moderna. Compartilhe recomendações sinceras, interaja em balões rápidos e apoie autores locais.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            {/* Primary Action is Emerald matching the design button */}
            <button
              onClick={() => {
                setIsFormOpen(true);
                setTimeout(() => {
                  document.getElementById('share-form-container')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
              className="px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 transition-all transform hover:scale-105 duration-250 cursor-pointer text-sm"
            >
              Começar a Compartilhar
            </button>

            {/* Secondary Action */}
            <a
              href="#explore"
              className="px-8 py-4 bg-white hover:bg-[#FDFCFB] border-2 border-[#E5E7EB] text-[#374151] font-bold rounded-2xl transition-all duration-200 text-sm"
            >
              📖 Explorar Feed
            </a>
          </div>

          {/* Quick Real Stats Dashboard Widget */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 p-5 sm:p-6 bg-white border border-[#F3F4F6] rounded-[32px] shadow-sm">
            
            <div className="text-center p-2 border-r border-[#F3F4F6] last:border-0">
              <p className="text-2xl sm:text-3xl font-display font-black text-[#111827]">
                {stats.totalBooks}
              </p>
              <p className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider mt-1.5 font-bold">
                Livros Compartilhados
              </p>
            </div>

            <div className="text-center p-2 md:border-r border-[#F3F4F6] last:border-0">
              <p className="text-2xl sm:text-3xl font-display font-black text-[#F97316]">
                {stats.totalLikes}
              </p>
              <p className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider mt-1.5 font-bold">
                Apoio & Likes ❤️
              </p>
            </div>

            <div className="text-center p-2 border-r border-[#F3F4F6] last:border-0">
              <p className="text-2xl sm:text-3xl font-display font-black text-[#8B5CF6]">
                {stats.totalComments}
              </p>
              <p className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider mt-1.5 font-bold">
                Interações Chat 💬
              </p>
            </div>

            <div className="text-center p-2 last:border-0">
              <p className="text-2xl sm:text-3xl font-display font-black text-[#10B981]">
                {stats.autoralCount}
              </p>
              <p className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider mt-1.5 font-bold">
                Autores Locais ✨
              </p>
            </div>

          </div>

        </section>

        {/* Features Section */}
        <Features />

        {/* Share Form container toggled */}
        <div id="share-form-container" className="max-w-4xl mx-auto px-4 py-8">
          {isFormOpen ? (
            <AddBookForm 
              onAddBook={handleAddBook}
              onClose={() => setIsFormOpen(false)}
            />
          ) : (
            <div className="bg-[#EDE9FE] border border-dashed border-[#8B5CF6] rounded-[32px] p-8 text-center shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#8B5CF6] flex items-center justify-center mx-auto mb-4 border border-[#DDD6FE] shadow-sm">
                <LucideIcon name="Feather" size={24} />
              </div>
              <h3 className="font-display font-black text-xl text-[#111827] tracking-tight">
                Que tal compartilhar o que você leu por último?
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-2 mb-5 max-w-md mx-auto leading-relaxed">
                Escolha uma paleta de cores moderna, desenhe a capa virtual e deixe uma nota rápida para a comunidade.
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-purple-100 cursor-pointer flex items-center gap-1.5 mx-auto transition-all"
              >
                Simular Nova Recomendação
                <LucideIcon name="Plus" size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Explore & Feed Grid Section */}
        <section id="explore" className="py-16 bg-[#FDFCFB] border-t border-[#F0EBE5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-12">
            
            {/* Header Feed */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              
              <div>
                <span id="books-feed" className="font-mono text-xs font-bold uppercase tracking-widest text-[#F97316] bg-[#FFEFD6] px-3.5 py-1.5 rounded-full inline-block">
                  Feed da Comunidade
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#111827] mt-4 tracking-tight">
                  Descubra novas leituras quentinhas
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 font-sans">
                  Use os filtros rápidos abaixo para navegar pelas contribuições reais dos amigos do BookShare.
                </p>
              </div>

              {/* Dynamic Search Box */}
              <div className="w-full md:w-80 relative">
                <input
                  type="text"
                  placeholder="Pesquisar título, autor ou crítico..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-full py-2.5 pl-10 pr-4 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] shadow-sm transition-all"
                />
                <div className="absolute left-3.5 top-3.5 text-slate-400">
                  <LucideIcon name="Search" size={14} />
                </div>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-3 text-slate-400 hover:text-[#111827] text-xs font-semibold cursor-pointer"
                  >
                    limpar
                  </button>
                )}
              </div>

            </div>

            {/* Filter buttons toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-[#F0EBE5] pb-5">
              <span className="text-xs font-bold font-mono text-[#6B7280] mr-2">Filtrar por:</span>
              
              {['Todas', 'Indicações', 'Leituras Atuais', 'Obras Autorais'].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-pill text-xs font-bold ${
                      isActive 
                        ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-md shadow-purple-100' 
                        : 'bg-white hover:bg-[#FDFCFB] text-[#111827] border-[#E5E7EB]'
                    }`}
                  >
                    {cat === 'Todas' ? '📚 Todas' :
                     cat === 'Indicações' ? '📌 Indicações' :
                     cat === 'Leituras Atuais' ? '📖 Leituras Atuais' :
                     '✨ Obras Autorais'}
                  </button>
                );
              })}
            </div>

            {/* Cards Feed Grid output */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-[#E5E7EB] rounded-[32px] p-8 max-w-md mx-auto">
                <div className="text-3xl mb-3">🔍</div>
                <h4 className="font-display font-extrabold text-[#111827] text-base">
                  Nenhuma recomendação encontrada
                </h4>
                <p className="text-xs text-[#6B7280] mt-2 font-sans">
                  Não encontramos nada com as buscas "{searchQuery}" para a categoria selecionada. Tente limpar os filtros ou faça uma nova recomendação você mesmo!
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todas');
                  }}
                  className="mt-4 text-xs font-bold text-[#8B5CF6] hover:underline"
                >
                  Reiniciar filtros de busca
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredBooks.map((book) => (
                  <BookCard 
                    key={book.id}
                    book={book}
                    onLike={handleLike}
                    onAddComment={handleAddComment}
                  />
                ))}
              </div>
            )}

            {/* Quick stats note under grid */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between text-[#6B7280] text-xs font-mono border-t border-[#F0EBE5] pt-6 gap-4">
              <p>Mostrando {filteredBooks.length} de {books.length} leituras recomendadas na comunidade.</p>
              
              <button 
                onClick={handleReset}
                className="text-[#F97316] hover:underline flex items-center gap-1.5 cursor-pointer font-bold"
                title="Limpar localStorage"
              >
                <LucideIcon name="Trash2" size={13} />
                Restaurar feed inicial padrão
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Sleek Dark Mode Footer mimicking the Geometric Balance footer */}
      <footer className="mt-auto">
        <div className="px-6 sm:px-12 py-8 bg-[#1F2937] text-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#F0EBE5]">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
            
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#8B5CF6] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight text-white font-display">BookShare</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#4B5563] flex items-center justify-center text-xs">
                  <svg className="w-3.5 h-3.5 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-xs text-[#9CA3AF]">Indicar favoritos</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#4B5563] flex items-center justify-center text-xs">
                  <svg className="w-3.5 h-3.5 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                </div>
                <span className="text-xs text-[#9CA3AF]">Comentar leituras</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#4B5563] flex items-center justify-center text-xs">
                  <svg className="w-3.5 h-3.5 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </div>
                <span className="text-xs text-[#9CA3AF]">Publique Autorais</span>
              </div>
            </div>

          </div>

          <div className="flex gap-6 text-[10px] text-[#9CA3AF] uppercase tracking-widest font-bold">
            <a href="#privacy" className="hover:text-white transition-colors">Política</a>
            <a href="#terms" className="hover:text-white transition-colors">Termos</a>
            <span>© 2026 BookShare</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
