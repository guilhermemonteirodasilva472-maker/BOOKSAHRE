/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Book, Comment, CartItem, Order, FAQQuestion, GoogleSheetsRowFormat } from './types';
import { INITIAL_BOOKS } from './data';
import BookCard from './components/BookCard';
import AddBookForm from './components/AddBookForm';
import Features from './components/Features';
import LucideIcon from './components/LucideIcon';
import ThreeDLaunchBook, { LAUNCH_BOOK } from './components/ThreeDLaunchBook';

export default function App() {
  // Persistence with LocalStorage
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const savedBooks = localStorage.getItem('forense_bookstore_books');
      return savedBooks ? JSON.parse(savedBooks) : INITIAL_BOOKS;
    } catch (e) {
      return INITIAL_BOOKS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('magical_bookstore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  // UI / Navigation & view router
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'tracking' | 'faq' | 'book-detail'>('home');
  const [selectedBookForPage, setSelectedBookForPage] = useState<Book | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'admin' | 'user' } | null>(() => {
    try {
      const saved = localStorage.getItem('forense_bookstore_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Simulated Orders list for tracker
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('forense_bookstore_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // FAQ entries with dynamic local reactivity
  const [faqQuestions, setFaqQuestions] = useState<FAQQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('forense_bookstore_faq');
      if (saved) return JSON.parse(saved);
      
      const defaultFAQ: FAQQuestion[] = [
        {
          id: '1',
          userName: 'Investigadora Beatriz',
          question: 'Como as obras do acervo Dossiê Psique são seladas confidencialmente?',
          date: '25/05/2026',
          replied: true,
          replyText: 'Cada exemplar é acondicionado sob sigilo absoluto em envelope Kraft rígido anti-impacto, lacrado com fita fosca e carimbo de cera, sem elementos externos que exponham seu teor investigativo ou de crime.'
        },
        {
          id: '2',
          userName: 'Perita Criminal Clarice',
          question: 'O faturamento integrado realmente gera simulação para Google Sheets?',
          date: '24/05/2026',
          replied: true,
          replyText: 'Sim! Toda compra concluída dispara a estruturação de metadados em formato de colunas prontas do Google Sheets, visíveis tanto no resumo final do pedido quanto na aba de Rastreamento.'
        }
      ];
      return defaultFAQ;
    } catch (e) {
      return [];
    }
  });

  // UI / Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Computed admin mode status based on logged-in session role
  const isAdminMode = currentUser?.role === 'admin';

  // Checkout Form States
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  
  const [shippingCEP, setShippingCEP] = useState('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingDays, setShippingDays] = useState(0);
  const [shippingType, setShippingType] = useState<'coruja' | 'vassoura'>('coruja');

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerBairro, setCustomerBairro] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerUF, setCustomerUF] = useState('SP');

  // Completed Order Details for Sheets rendering
  const [completedOrder, setCompletedOrder] = useState<GoogleSheetsRowFormat | null>(null);

  // Track scroll position to trigger sticky floating launcher
  const [showStickyLaunch, setShowStickyLaunch] = useState(false);
  const [selectedDetailBook, setSelectedDetailBook] = useState<Book | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyLaunch(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync state variables to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('forense_bookstore_books', JSON.stringify(books));
    } catch (error) {
      console.warn('Erro ao salvar os livros no localStorage', error);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('magical_bookstore_cart', JSON.stringify(cart));
    } catch (error) {
      console.warn('Erro ao salvar o carrinho no localStorage', error);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('forense_bookstore_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('forense_bookstore_faq', JSON.stringify(faqQuestions));
    } catch (e) {}
  }, [faqQuestions]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('forense_bookstore_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('forense_bookstore_user');
      }
    } catch (e) {}
  }, [currentUser]);

  // Toast utilities
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3800);
  };

  // Likes handle
  const handleLike = (id: string) => {
    setBooks(prev => 
      prev.map(book => {
        if (book.id === id) {
          triggerNotification(`Você enviou uma faísca de carinho para "${book.title}"! ❤️`);
          return { ...book, likes: book.likes + 1 };
        }
        return book;
      })
    );
  };

  // Comments handle
  const handleAddComment = (bookId: string, author: string, text: string) => {
    const newComment: Comment = {
      id: String(Date.now()),
      author,
      text,
      date: 'Agora mesmo'
    };

    setBooks(prev =>
      prev.map(book => {
        if (book.id === bookId) {
          triggerNotification(`Sussurro arquivado com sucesso em "${book.title}"! 💬`);
          return {
            ...book,
            commentsList: [newComment, ...book.commentsList]
          };
        }
        return book;
      })
    );
  };

  // Add Book (Admin)
  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    setIsFormOpen(false);
    triggerNotification(`"${newBook.title}" foi conjurado com sucesso na loja! 🔮📚`);
    
    // Scroll to catalog area
    setTimeout(() => {
      document.getElementById('bookshelf-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  // Edit Book Trigger
  const handleTriggerEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
    
    // Scroll to form
    setTimeout(() => {
      document.getElementById('form-container-box')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Prepopulate book details from cover image upload scanner
  const handleOpenPrepopulatedBook = (initialData: Partial<Book>) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setCurrentUser({ name: 'Comandante Forense', role: 'admin' });
    }
    setIsFormOpen(true);
    setEditingBook({
      id: 'temp-magic-prefill-' + Date.now(),
      title: initialData.title || '',
      author: 'Mestre Autor',
      price: initialData.price || 39.90,
      description: initialData.description || '',
      isAuthored: true,
      category: 'Grimório',
      coverImage: initialData.coverImage,
      coverStyle: {
        gradientStart: '#7C3AED',
        gradientEnd: '#311068',
        iconName: 'Sparkles',
        textColor: '#FFFFFF'
      },
      likes: 0,
      stars: 5,
      commentsList: [],
      createdAt: new Date().toISOString()
    });
    
    // Scroll to form smoothly
    setTimeout(() => {
      document.getElementById('form-container-box')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Save Edited Book (Admin)
  const handleSaveEditedBook = (updatedBook: Book) => {
    if (updatedBook.id && updatedBook.id.startsWith('temp-magic-prefill')) {
      // It is actually a new book pre-populated from scanning!
      const finalNewBook: Book = {
        ...updatedBook,
        id: String(Date.now()) // Generate a permanent, real ID
      };
      handleAddBook(finalNewBook);
      return;
    }

    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
    setIsFormOpen(false);
    setEditingBook(null);
    triggerNotification(`As propriedades mágicas de "${updatedBook.title}" foram reescritas! ✍️✨`);
  };

  // Delete Book (Admin)
  const handleDeleteBook = (id: string) => {
    const bookName = books.find(b => b.id === id)?.title || 'Livro';
    if (window.confirm(`Tem certeza de que deseja desintegrar o livro "${bookName}" permanentemente do grimório?`)) {
      setBooks(prev => prev.filter(b => b.id !== id));
      // Remove from cart if present
      setCart(prev => prev.filter(item => item.book.id !== id));
      triggerNotification(`"${bookName}" desintegrado com sucesso.`);
    }
  };

  // Reorder books in Grid
  const handleMoveUp = (id: string) => {
    const idx = books.findIndex(b => b.id === id);
    if (idx > 0) {
      const updated = [...books];
      const temp = updated[idx];
      updated[idx] = updated[idx - 1];
      updated[idx - 1] = temp;
      setBooks(updated);
      triggerNotification('Posição do item reordenada com sucesso no grid! ⬆️');
    }
  };

  const handleMoveDown = (id: string) => {
    const idx = books.findIndex(b => b.id === id);
    if (idx !== -1 && idx < books.length - 1) {
      const updated = [...books];
      const temp = updated[idx];
      updated[idx] = updated[idx + 1];
      updated[idx + 1] = temp;
      setBooks(updated);
      triggerNotification('Posição do item reordenada com sucesso no grid! ⬇️');
    }
  };

  // Restore Default books
  const handleResetCatalog = () => {
    if (window.confirm('Deseja mesmo resetar toda a loja e recarregar os volumes clássicos sagrados? Suas alterações locais de admin serão perdidas.')) {
      setBooks(INITIAL_BOOKS);
      setCart([]);
      triggerNotification('Catálogo original restabelecido pela alta cúpula! 🔄📘');
    }
  };

  // Shopping Cart Operations
  const handleAddToCart = (book: Book) => {
    setCart(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        triggerNotification(`Mais um volume de "${book.title}" adicionado!`);
        return prev.map(item => 
          item.book.id === book.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      triggerNotification(`"${book.title}" adicionado à sua sacola de pergaminhos! 🛒`);
      return [...prev, { book, quantity: 1 }];
    });
    setCheckoutStep('cart');
    setIsCartOpen(true); // Auto opens drawer for great conversion
  };

  const handleUpdateCartQuantity = (bookId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(bookId);
      return;
    }
    setCart(prev => prev.map(item => item.book.id === bookId ? { ...item, quantity: qty } : item));
  };

  const handleRemoveFromCart = (bookId: string) => {
    const item = cart.find(i => i.book.id === bookId);
    if (item) {
      setCart(prev => prev.filter(i => i.book.id !== bookId));
      triggerNotification(`"${item.book.title}" removido da sacola.`);
    }
  };

  // FREIGHT CORREIOS SIMULATOR (Calculo de Frete)
  const handleCalculateShipping = () => {
    if (!shippingCEP || !/^\d{5}-?\d{3}$/.test(shippingCEP)) {
      alert('Por favor, informe um CEP válido (Formato: 00000-000 ou 8 números)!');
      return;
    }

    setIsCalculatingShipping(true);

    setTimeout(() => {
      const cleanCep = shippingCEP.replace('-', '').trim();
      const firstDigit = cleanCep[0];
      
      let cost = 12.00;
      let days = 5;
      let regionStr = 'SP';

      switch (firstDigit) {
        case '0':
        case '1':
          cost = 8.50;
          days = 2;
          regionStr = 'São Paulo (Capital e Grande SP)';
          break;
        case '2':
          cost = 12.90;
          days = 4;
          regionStr = 'Rio de Janeiro / Espírito Santo';
          break;
        case '3':
          cost = 13.50;
          days = 4;
          regionStr = 'Minas Gerais';
          break;
        case '4':
        case '5':
          cost = 18.00;
          days = 7;
          regionStr = 'Bahia & Estados do Nordeste';
          break;
        case '8':
        case '9':
          cost = 14.90;
          days = 5;
          regionStr = 'Paraná, Santa Catarina e RS';
          break;
        default:
          cost = 21.50;
          days = 8;
          regionStr = 'Regiões Norte e Centro-Oeste';
          break;
      }

      setShippingCost(cost);
      setShippingDays(days);
      setShippingCalculated(true);
      setIsCalculatingShipping(false);
      triggerNotification(`Envio para ${regionStr} sintonizado com sucesso! 🦉`);
    }, 800);
  };

  // Dynamic calculations for Cart Drawer
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const priceAtSale = item.book.discount 
        ? item.book.price * (1 - item.book.discount / 100) 
        : item.book.price;
      return sum + (priceAtSale * item.quantity);
    }, 0);
  }, [cart]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const activeShippingCost = useMemo(() => {
    if (!shippingCalculated) return 0;
    // Base scale weight calculation (weight of multiple books)
    const multiplier = 1 + (totalCartItems - 1) * 0.15; // +15% per additional book
    const baseCost = shippingCost * Math.max(0.6, multiplier);
    return baseCost + (shippingType === 'vassoura' ? 15.00 : 0);
  }, [shippingCalculated, shippingCost, shippingType, totalCartItems]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + activeShippingCost;
  }, [cartSubtotal, activeShippingCost]);

  // COMPLETE PACT CHECKOUT & DISPATCH TO GOOGLE SHEETS
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !shippingCEP.trim() || !customerAddress.trim()) {
      alert('Por favor, preencha todos os dados místico-cadastrais para que a coruja encontre seu lar!');
      return;
    }

    const orderId = 'SOPRO-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleString('pt-BR');

    // Generate formatted description columns
    const booksFormattedText = cart.map(item => {
      const finalItemPrice = item.book.discount 
        ? item.book.price * (1 - item.book.discount / 100) 
        : item.book.price;
      return `${item.quantity}x ${item.book.title} (unid: R$ ${finalItemPrice.toFixed(2)})`;
    }).join('; ');

    // Sheets column schema format mapping
    const sheetsDataPayload: GoogleSheetsRowFormat = {
      dataHora: dateStr,
      idPedido: orderId,
      nomeCliente: customerName.trim(),
      cep: shippingCEP,
      livrosComprados: booksFormattedText,
      valorProdutos: `R$ ${cartSubtotal.toFixed(2)}`,
      valorFrete: `R$ ${activeShippingCost.toFixed(2)}`,
      valorTotal: `R$ ${cartTotal.toFixed(2)}`,
      metodoEnvio: shippingType === 'vassoura' ? 'Custódia Expressa Aérea' : 'Custódia Padrão Segura'
    };

    // Simulated API execution dispatcher
    console.log("📊 [GOOGLE SHEETS GATEWAY API] ENTRADA DE FILA ADICIONADA:", sheetsDataPayload);

    // Save actual Order details into simulated database for tracking
    const newOrder: Order = {
      id: orderId,
      date: dateStr,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      cep: shippingCEP,
      items: cart.map(item => ({
        bookId: item.book.id,
        title: item.book.title,
        quantity: item.quantity,
        price: item.book.discount ? item.book.price * (1 - item.book.discount / 100) : item.book.price
      })),
      shippingCost: activeShippingCost,
      total: cartTotal,
      metodoEnvio: shippingType === 'vassoura' ? 'Custódia Expressa Aérea' : 'Custódia Padrão Segura',
      status: 'Avaliando Evidências'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCompletedOrder(sheetsDataPayload);
    setCheckoutStep('success');
  };

  // Final Close / Complete action
  const handleFinishedSucceedOrder = () => {
    // Reset Cart & shipping
    setCart([]);
    setShippingCalculated(false);
    setShippingCEP('');
    setCompletedOrder(null);
    setCheckoutStep('cart');
    setIsCartOpen(false);
    
    // Smooth reset fields
    setCustomerName('');
    setCustomerEmail('');
    setCustomerAddress('');
    setCustomerNumber('');
    setCustomerBairro('');
    setCustomerCity('');
    
    triggerNotification('Espaço místico limpo! Esperamos que sua leitura desperte horizontes mágicos.');
  };

  // Searching / filtering lists
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Category selection mapping
      const matchesCategory = 
        selectedCategory === 'Todas' ||
        book.category === selectedCategory;

      const text = searchQuery.toLowerCase();
      const matchesSearch = 
        book.title.toLowerCase().includes(text) ||
        book.author.toLowerCase().includes(text) ||
        book.description.toLowerCase().includes(text);

      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-amber-100 selection:text-amber-950">
      
      {/* Viewport Floating Sticky 3D Launcher Badge (preso a lateral direita da tela) */}
      {showStickyLaunch && (
        <div 
          onClick={() => {
            const el = document.getElementById('launch-book-container');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              setSelectedDetailBook(LAUNCH_BOOK);
            }
          }}
          className="fixed right-0 top-[35%] z-40 transform translate-x-2 hover:translate-x-0 transition-transform duration-300 max-w-[80px] bg-gradient-to-br from-[#1E1B4B] to-[#4338CA] text-stone-100 p-2.5 rounded-l-2xl shadow-2xl cursor-pointer border-l-2 border-y border-amber-400 select-none flex flex-col items-center gap-1 animate-magical-float"
          title="Ver Livro de Lançamento em 3D!"
        >
          <div className="text-amber-300 animate-pulse">
            <LucideIcon name="Crown" size={14} />
          </div>
          <span className="text-[7.5px] uppercase font-mono font-black tracking-widest text-[#FFF] writing-vertical text-center leading-none mt-1">
            LANÇAMENTO
          </span>
          <div className="w-[30px] h-[45px] relative mt-1 rounded shadow-md overflow-hidden bg-gradient-to-br from-[#1E1B4B] to-[#312E81] border border-white/20 select-none">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-1 left-1.5 right-1.5 bottom-1 flex items-center justify-center">
              <LucideIcon name="Sparkles" size={10} className="text-amber-200 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Selected Book Details Modal Popup */}
      {selectedDetailBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="parchment-sheet max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl relative my-8 text-left">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedDetailBook(null)}
              className="absolute top-4 right-4 text-amber-900/60 hover:text-amber-950 bg-[#FCFAF2] border border-amber-900/20 p-2 rounded-full cursor-pointer transition-transform duration-200 active:scale-95 z-20"
              title="Fechar Detalhes"
            >
              <LucideIcon name="X" size={16} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-4">
              
              {/* Cover Column */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div 
                  className="book-card-magic w-[140px] h-[210px] flex flex-col justify-between p-4 relative overflow-hidden select-none"
                  style={{
                    background: selectedDetailBook.coverImage 
                      ? 'none' 
                      : `linear-gradient(135deg, ${selectedDetailBook.coverStyle.gradientStart}, ${selectedDetailBook.coverStyle.gradientEnd})`,
                    color: '#FFFFFF'
                  }}
                >
                  {selectedDetailBook.coverImage && (
                    <img src={selectedDetailBook.coverImage} alt={selectedDetailBook.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="book-bound-spine" />
                  <div className="book-pages-stack" />
                  
                  <div>
                    <span className="text-[7px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-black/45 border border-white/20">
                      {selectedDetailBook.category}
                    </span>
                  </div>

                  <div className="my-auto py-2">
                    <h4 className="font-serif font-black text-xs sm:text-sm leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                      {selectedDetailBook.title}
                    </h4>
                    <p className="text-[9px] mt-1 font-mono opacity-90 drop-shadow">
                      por {selectedDetailBook.author}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[8px] font-mono border-t border-white/20 pt-1">
                    <span>R$ {selectedDetailBook.price.toFixed(2)}</span>
                    <LucideIcon name={selectedDetailBook.coverStyle.iconName || 'Sparkles'} size={12} />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs font-mono text-stone-500">
                  <span>Classificação:</span>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        <LucideIcon 
                          name="Star" 
                          size={12} 
                          className={i < selectedDetailBook.stars ? 'fill-current' : 'opacity-30'} 
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Details Column */}
              <div className="md:col-span-7 space-y-4">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-800 bg-[#FAF4E0] border border-amber-900/10 px-2 py-0.5 rounded inline-block">
                  {selectedDetailBook.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-serif font-black text-amber-950 leading-tight">
                  {selectedDetailBook.title}
                </h3>

                <p className="text-xs font-mono text-stone-400">
                  Escrito por <span className="text-amber-900 font-bold">{selectedDetailBook.author}</span>
                </p>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                  {selectedDetailBook.description}
                </p>

                <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono block">PREÇO DE AQUISIÇÃO</span>
                    <span className="text-lg font-black font-mono text-amber-950">
                      R$ {selectedDetailBook.discount 
                        ? (selectedDetailBook.price * (1 - selectedDetailBook.discount / 100)).toFixed(2) 
                        : selectedDetailBook.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(selectedDetailBook);
                      setSelectedDetailBook(null); // Close modal
                    }}
                    className="button-magic-primary text-xs py-2.5 px-5"
                  >
                    <LucideIcon name="ShoppingBag" size={12} />
                    <span>Adicionar à Sacola</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Comments/Sussurros Reviews inside Details Modal */}
            <div className="mt-6 pt-4 border-t border-amber-900/10">
              <h4 className="font-serif font-bold text-amber-950 text-xs mb-3 flex items-center gap-1">
                <LucideIcon name="MessageSquare" size={13} strokeWidth={2.5} />
                <span>Sussurros & Opiniões de Leitores ({selectedDetailBook.commentsList.length})</span>
              </h4>

              {/* Read existing comments */}
              <div className="space-y-2 mb-4 max-h-[150px] overflow-y-auto pr-2">
                {selectedDetailBook.commentsList.length === 0 ? (
                  <p className="text-[10px] text-stone-400 italic">Nenhum sussurro ecoou sobre este tomo ainda. Seja o primeiro a opinar!</p>
                ) : (
                  selectedDetailBook.commentsList.map((comm) => (
                    <div key={comm.id} className="bg-[#FAF4E0]/40 border border-amber-900/5 p-2 rounded-lg text-[10.5px]">
                      <div className="flex justify-between text-[9px] font-mono text-amber-900 font-bold mb-1">
                        <span>{comm.author}</span>
                        <span className="opacity-60">{comm.date}</span>
                      </div>
                      <p className="text-stone-700 leading-snug">{comm.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit simple comment in modal */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const author = (fd.get('nickname') as string || '').trim();
                  const text = (fd.get('text') as string || '').trim();
                  if (!author || !text) return;
                  
                  // call handleAddComment
                  handleAddComment(selectedDetailBook.id, author, text);
                  
                  // Update commentsList in active modal state directly for instant mapping
                  setSelectedDetailBook(prev => {
                    if (!prev) return null;
                    const commentObj = {
                      id: String(Date.now()),
                      author,
                      text,
                      date: 'Agora mesmo'
                    };
                    return {
                      ...prev,
                      commentsList: [commentObj, ...prev.commentsList]
                    };
                  });

                  e.currentTarget.reset();
                }}
                className="space-y-2"
              >
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    name="nickname"
                    type="text" 
                    placeholder="Seu Apelido Místico" 
                    required
                    className="col-span-1 bg-white border border-amber-900/15 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-amber-800"
                  />
                  <input 
                    name="text"
                    type="text" 
                    placeholder="Escreva seu sussurro literário sobre esta obra..." 
                    required
                    className="col-span-2 bg-white border border-amber-900/15 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-amber-800"
                  />
                </div>
                <div className="text-right">
                  <button 
                    type="submit"
                    className="bg-amber-950 hover:bg-amber-900 text-amber-50 rounded-lg px-3 py-1 font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                  >
                    Enviar Sussurro ✦
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}
      
      {/* Background Decorative magical glowing orbs */}
      <div className="bg-blob-lavender top-[15%] left-[-150px]" />
      <div className="bg-blob-mint top-[50%] right-[-150px]" />
      <div className="bg-blob-coral bottom-[15%] left-[25%]" />

      {/* Floating Sparkle Elements */}
      <div className="absolute top-[8%] left-[8%] text-[#C09228]/25 animate-magical-sparkle pointer-events-none z-0">
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z"/>
        </svg>
      </div>
      <div className="absolute top-[45%] left-[90%] text-[#8B5CF6]/20 animate-magical-sparkle pointer-events-none z-0" style={{ animationDelay: '1.5s' }}>
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z"/>
        </svg>
      </div>

      {/* Dynamic Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-950 text-amber-50 px-5 py-3.5 rounded-2xl border border-amber-900/40 shadow-xl flex items-center gap-3 animate-bounce">
          <span className="text-base">✨</span>
          <p className="text-xs sm:text-sm font-sans font-bold">{notification}</p>
        </div>
      )}

      {/* Main Header / Navigation bar */}
      <header className="sticky top-0 z-40 bg-[#12131C]/90 backdrop-blur-md border-b border-[#242735] py-4 px-4 sm:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Charming Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentView('home'); setSelectedBookForPage(null); }}>
            <div className="w-9 h-9 rounded-xl bg-red-900 text-white flex items-center justify-center font-serif font-black shadow-md border border-red-950">
              Ψ
            </div>
            <div className="text-left">
              <h1 className="font-serif font-extrabold text-[#F1F5F9] text-base sm:text-lg leading-none tracking-tight">
                Dossiê Psique
              </h1>
              <span className="text-[9px] font-mono tracking-widest font-semibold text-red-500 uppercase block mt-1">
                Romance Psicológico & Suspense
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => { setCurrentView('home'); setSelectedBookForPage(null); }}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer font-mono ${currentView === 'home' ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-slate-400 hover:text-white pb-1'}`}
            >
              Início
            </button>
            <button 
              onClick={() => { setCurrentView('catalog'); setSelectedBookForPage(null); }}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer font-mono ${currentView === 'catalog' ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-slate-400 hover:text-white pb-1'}`}
            >
              Catálogo Exclusivo
            </button>
            <button 
              onClick={() => { setCurrentView('faq'); setSelectedBookForPage(null); }}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer font-mono ${currentView === 'faq' ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-slate-400 hover:text-white pb-1'}`}
            >
              FAQ / Dúvidas
            </button>
            <button 
              onClick={() => { setCurrentView('tracking'); setSelectedBookForPage(null); }}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer font-mono flex items-center gap-1.5 ${currentView === 'tracking' ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-slate-400 hover:text-white pb-1'}`}
            >
              <LucideIcon name="User" size={13} />
              <span>{currentUser ? (currentUser.role === 'admin' ? '👤 Admin' : `👤 ${currentUser.name}`) : 'Entrar / Rastrear'}</span>
            </button>
          </nav>

          {/* Shopping bag count details */}
          <div className="flex items-center gap-3">
            
            {/* Toggle switch for Admin in small mobile resolutions */}
            <button
              onClick={() => {
                setCurrentView('tracking');
                setSelectedBookForPage(null);
                triggerNotification('Acesse o Painel para Logon.');
              }}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-zinc-800"
              title="Acesso de Conta / Login"
            >
              <LucideIcon name="User" size={18} />
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-red-950/25 hover:bg-red-950/40 border border-[#2D303D] transition-colors cursor-pointer flex items-center gap-2 px-3 py-2"
              title="Abrir sacola de compras"
            >
              <LucideIcon name="ShoppingBag" className="text-red-400" size={18} />
              <div className="text-left leading-none">
                <span className="text-[9px] font-mono text-slate-400 block select-none uppercase font-bold">Dossiê</span>
                <span className="text-xs font-serif font-bold text-slate-200">R$ {cartSubtotal.toFixed(2)}</span>
              </div>

              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#EF4444] text-white min-w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center font-bold px-1 animate-pulse border border-zinc-950">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Body Core container */}
      <main className="flex-grow">
        
        {/* Dynamic Floating detail card if activated from ThreeDLaunchBook */}
        {selectedDetailBook && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-[#12131A] border-2 border-[#EF4444]/40 max-w-xl w-full p-6 rounded-2xl relative shadow-2xl text-left">
              <button 
                onClick={() => setSelectedDetailBook(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <LucideIcon name="X" size={20} />
              </button>
              <div className="flex flex-col sm:flex-row gap-5">
                <div 
                  className="w-32 h-44 shrink-0 mx-auto sm:mx-0 relative rounded-lg overflow-hidden border border-zinc-800 shadow cursor-pointer"
                  onClick={() => {
                    setSelectedBookForPage(selectedDetailBook);
                    setCurrentView('book-detail');
                    setSelectedDetailBook(null);
                  }}
                  style={{
                    background: selectedDetailBook.coverImage 
                      ? 'none' 
                      : `linear-gradient(135deg, ${selectedDetailBook.coverStyle.gradientStart}, ${selectedDetailBook.coverStyle.gradientEnd})`
                  }}
                >
                  {selectedDetailBook.coverImage && (
                    <img 
                      src={selectedDetailBook.coverImage} 
                      alt={selectedDetailBook.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="text-left flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase bg-red-950/40 text-red-400 px-2 py-0.5 rounded border border-red-900/20">{selectedDetailBook.category}</span>
                    <h4 
                      className="font-serif font-bold text-lg text-slate-100 mt-2 leading-tight hover:text-red-400 cursor-pointer"
                      onClick={() => {
                        setSelectedBookForPage(selectedDetailBook);
                        setCurrentView('book-detail');
                        setSelectedDetailBook(null);
                      }}
                    >
                      {selectedDetailBook.title}
                    </h4>
                    <p className="text-xs text-red-400 font-mono mt-0.5">por {selectedDetailBook.author}</p>
                    <p className="text-xs text-slate-300 mt-3 italic line-clamp-3">"{selectedDetailBook.description}"</p>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-800">
                    <span className="text-sm font-mono font-bold text-amber-400">R$ {selectedDetailBook.price.toFixed(2)}</span>
                    <button 
                      onClick={() => {
                        handleAddToCart(selectedDetailBook);
                        setSelectedDetailBook(null);
                      }}
                      className="px-4 py-2 bg-red-850 hover:bg-red-700 font-mono text-xxs font-bold uppercase rounded text-white cursor-pointer"
                    >
                      Adicionar à Sacola
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <>
            {/* Whimsical Hero Section */}
            <section className="relative py-16 sm:py-24 px-4 max-w-6xl mx-auto overflow-hidden text-center lg:text-left">
              <div className="absolute top-[5%] right-[2%] text-amber-900/10 pointer-events-none">
                <svg className="w-16 h-16 animate-magical-sparkle" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z"/>
                </svg>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Content Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/30 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-900/20">
                    <span>🕵️‍♂️</span>
                    <span>Dossiês de Romance Psicológico & Suspense</span>
                    <span>🕵️‍♂️</span>
                  </div>

                  <h2 className="text-4xl sm:text-6xl font-serif font-black text-slate-100 tracking-tight leading-[1.08]">
                    Entre na mente de personagens e <span className="text-red-500 block sm:inline font-serif italic font-normal">desvende segredos ocultos.</span>
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-lg max-w-xl leading-relaxed font-sans mx-auto lg:mx-0">
                    Explore nosso acervo curado sob medida com thrillers envolventes, suspense forense e dark romances obsessionais. Adicione faturas estruturadas diretamente para download integrado e exportação ao Google Sheets!
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <button
                      onClick={() => { setCurrentView('catalog'); window.scrollTo(0,0); }}
                      className="button-magic-primary px-8 py-4 text-xs font-semibold sm:text-sm tracking-wider shadow-lg bg-[#EF4444] hover:bg-red-700 hover:border-red-600 text-white rounded-lg cursor-pointer font-mono uppercase"
                    >
                      <span>Investigar Catálogo Completo 🔍</span>
                    </button>
                    
                    <button
                      onClick={() => { setCurrentView('faq'); window.scrollTo(0,0); }}
                      className="button-magic-secondary px-8 py-4 text-xs font-semibold sm:text-sm border border-zinc-700 bg-zinc-900/55 hover:bg-zinc-800 hover:text-white text-slate-300 rounded-lg cursor-pointer"
                    >
                      <span>Vozes Unidas: FAQ Operacional</span>
                    </button>
                  </div>

                  {/* Quick Stats Banner of Bookstore */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#12131A] border border-[#2D303D] rounded-[28px] shadow-sm relative z-10 text-center">
                    <div className="border-[#2D303D] border-r last:border-r-0 py-1">
                      <span className="text-xl sm:text-2xl font-serif font-black text-slate-100">{books.length}</span>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-0.5 font-bold">Casos</span>
                    </div>
                    <div className="border-[#2D303D] border-r last:border-r-0 py-1">
                      <span className="text-xl sm:text-2xl font-serif font-black text-emerald-500">100%</span>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-0.5 font-bold">Sigiloso</span>
                    </div>
                    <div className="border-[#2D303D] border-r last:border-r-0 py-1">
                      <span className="text-xl sm:text-2xl font-serif font-black text-[#D15525]">{books.reduce((val, b) => val + b.likes, 340)}</span>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-0.5 font-bold">Depoimentos</span>
                    </div>
                    <div className="py-1">
                      <span className="text-lg sm:text-xl font-mono font-black text-purple-400 block pt-1">SHEETS</span>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 mt-0.5 font-bold">Exportador</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: 3D interactive launching book side-attached */}
                <div id="launch-book-container" className="lg:col-span-5 w-full flex justify-center">
                  <ThreeDLaunchBook 
                    onAddToCart={handleAddToCart} 
                    onOpenBookDetails={(book) => { setSelectedBookForPage(book); setCurrentView('book-detail'); window.scrollTo(0,0); }} 
                  />
                </div>
              </div>

              {/* Divider Book Spine */}
              <div className="mt-14 w-32 h-1.5 bg-gradient-to-r from-transparent via-red-900/25 to-transparent mx-auto rounded-full" />
            </section>

            {/* Section Divider - SVG of turning book pages */}
            <div className="turning-page-divider" />

            {/* Features & Safe Transmutations Info */}
            <section id="how" className="py-12 bg-[#111218] border-t border-[#2D303D]">
              <Features />
            </section>

            {/* Clean call to action to visit catalog */}
            <section className="py-16 bg-[#12131A] border-t border-[#2D303D] text-center text-slate-100">
              <div className="max-w-xl mx-auto px-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#EF4444] font-black">Investigue as Evidências</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-100 mt-2">Dossiê Completo de Crime & Mistério</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-sans mt-3">Subimos novos lançamentos psicossociais e analisadores de comportamento sob custódia seleta. O catálogo exclusivo está focado unicamente no acervo livre de poluição visual.</p>
                <button
                  onClick={() => { setCurrentView('catalog'); window.scrollTo(0,0); }}
                  className="mt-6 px-6 py-3 bg-[#EF4444] hover:bg-red-700 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-lg transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  Abrir Páginas do Catálogo 📕
                </button>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: EXCLUSIVO CATALOG */}
        {currentView === 'catalog' && (
          <section id="bookshelf-grid" className="py-12 bg-[#FCFAF2] min-h-[75vh]">
            <div className="max-w-6xl mx-auto px-4 sm:px-12">
              
              {/* Optional Admin controls panel directly nested inside catalog page when ADM is logged in! */}
              {isAdminMode && (
                <div className="mb-10 p-6 bg-[#FAF4E0] border border-amber-900/15 rounded-3xl text-left">
                  <div className="bg-amber-950 text-amber-50 p-6 rounded-2xl border border-amber-900/20 shadow-md mb-6 relative overflow-hidden">
                    <div className="absolute right-6 top-6 opacity-10">
                      <LucideIcon name="Settings" size={80} />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#C09228]">🔑 Painel Diretor do Acervo (Acesso Único ADM)</span>
                        <h3 className="text-lg font-serif font-bold text-white mt-1">Bem-vindo, Administrador!</h3>
                        <p className="text-xs text-amber-150/70 mt-1">Sua conta exclusiva permite ditar novas evidências literárias, cadastrá-las no acervo ou faturar os dossiês.</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingBook(null);
                            setIsFormOpen(!isFormOpen);
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-100 text-amber-950 hover:bg-amber-200 text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <LucideIcon name={isFormOpen && !editingBook ? "BookX" : "Plus"} size={14} />
                          <span>{isFormOpen && !editingBook ? 'Fechar Cadastro' : 'Subir Novo Livro'}</span>
                        </button>

                        <button
                          onClick={handleResetCatalog}
                          className="px-4 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-200 border border-red-900/40 text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <LucideIcon name="RotateCcw" size={13} />
                          <span>Restaurar Padrão</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {isFormOpen && (
                    <div id="form-container-box" className="mb-8 p-0.5 bg-amber-900/5 rounded-3xl">
                      <AddBookForm 
                        onAddBook={handleAddBook}
                        onEditBook={editingBook}
                        onSaveEditedBook={handleSaveEditedBook}
                        onClose={() => {
                          setIsFormOpen(false);
                          setEditingBook(null);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Catalog Top bar Filters & Search inputs */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left">
                <div>
                  <span className="font-serif italic font-normal text-xs text-red-700 bg-red-50 border border-red-900/15 px-3 py-1 rounded-full inline-block">
                    📖 Catálogo Exclusivo e Limpo
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#12131C] mt-3 leading-tight">
                    Livros de Romance Psicológico & Suspense
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
                    Sem banners ou anúncios. Apenas literatura forense profunda organizada sob filtros.
                  </p>
                </div>

                {/* Search text filter bar */}
                <div className="w-full md:w-80 relative">
                  <input
                    type="text"
                    placeholder="Buscar livro, termo de crime, autor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-red-900/15 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-850 text-slate-900 font-mono shadow-inner"
                  />
                  <div className="absolute left-3.5 top-3.5 text-red-700/60">
                    <LucideIcon name="Search" size={14} />
                  </div>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-2.5 text-red-900/60 hover:text-red-950 text-xxs font-mono font-bold uppercase cursor-pointer"
                    >
                      limpar
                    </button>
                  )}
                </div>
              </div>

              {/* Filters selectors */}
              <div className="flex flex-wrap items-center gap-2.5 mb-8 pb-5 border-b border-zinc-200">
                <span className="text-[11px] font-mono font-black text-slate-500 mr-2 uppercase">Filtrar Categoria:</span>
                {['Todas', 'Thriller Psicológico', 'Dark Romance', 'Suspense Policial', 'Terror Mentis'].map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                        isActive 
                          ? 'bg-red-800 text-white border-red-800 shadow-md bg-gradient-to-r from-red-850 to-red-650' 
                          : 'bg-white hover:bg-slate-100 text-[#12131C] border-slate-300 shadow-xs'
                      }`}
                    >
                      {cat === 'Todas' && '📚 Todas as Obras'}
                      {cat === 'Thriller Psicológico' && '🧠 Thriller Psicológico'}
                      {cat === 'Dark Romance' && '🌹 Dark Romance'}
                      {cat === 'Suspense Policial' && '🕵️‍♂️ Suspense Policial'}
                      {cat === 'Terror Mentis' && '👁️ Terror Mentis'}
                    </button>
                  );
                })}
              </div>

              {/* Books block */}
              <div className="w-full">
                {filteredBooks.length === 0 ? (
                  <div className="text-center py-16 bg-[#12131A] border border-dashed border-zinc-800 rounded-2xl max-w-sm mx-auto p-8 relative">
                    <span className="text-4xl block mb-2 select-none">🕵️‍♂️</span>
                    <h4 className="font-serif font-black text-slate-100 text-base">Nenhuma obra localizada</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">Sem ocorrências registradas para "{searchQuery}". Altere os filtros acima para restaurar a lista.</p>
                    <button onClick={() => { setSearchQuery(''); setSelectedCategory('Todas'); }} className="mt-4 text-xs font-bold text-[#EF4444] hover:underline">Restaurar Filtros</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBooks.map((book) => (
                      <BookCard 
                        key={book.id}
                        book={book}
                        onLike={handleLike}
                        onAddComment={handleAddComment}
                        onAddToCart={handleAddToCart}
                        isAdmin={isAdminMode}
                        onEdit={handleTriggerEdit}
                        onDelete={handleDeleteBook}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        onSelect={(b) => { setSelectedBookForPage(b); setCurrentView('book-detail'); window.scrollTo(0,0); }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Page footer summary bar */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs font-mono pt-6 border-t border-slate-200 gap-4 text-left">
                <p>Mostrando {filteredBooks.length} de {books.length} obras registradas no arquivo de evidências do faturamento do acervo.</p>
                <button onClick={handleResetCatalog} className="text-[#EF4444] hover:underline font-bold flex items-center gap-1.5">
                  <LucideIcon name="BookOpen" size={13} />
                  <span>Restaurar catálogo inicial completo</span>
                </button>
              </div>

            </div>
          </section>
        )}

        {/* VIEW 3: LOGIN & TRACKING PROFILE */}
        {currentView === 'tracking' && (
          <section className="py-12 px-4 max-w-5xl mx-auto min-h-[75vh]">
            {currentUser ? (
              // Logged-in profile and order status tracker list!
              <div className="text-left grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Profile Card left */}
                <div className="bg-[#12131A] border border-[#2D303D] p-6 rounded-3xl h-fit shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-950/40 border border-[#EF4444]/30 flex items-center justify-center font-serif text-2xl text-[#EF4444] font-black">
                      {currentUser.name[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-red-950/40 text-red-500 border border-red-900/20 px-2.5 py-1 rounded inline-block font-bold">
                        {currentUser.role === 'admin' ? '🛡️ Comando Admin (ADMIN)' : '🕵️‍♂️ Investigador Autorizado'}
                      </span>
                      <h3 className="font-serif font-black text-slate-100 text-lg mt-1">{currentUser.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
                    Acesso estabelecido sob criptografia SSL. Seu pseudônimo está catalogado neste painel para consulta em tempo real ao andamento do pedido.
                  </p>

                  <div className="space-y-3 pt-4 border-t border-zinc-805">
                    <div className="text-xs flex justify-between">
                      <span className="text-slate-500 font-mono font-bold">Status do Acesso:</span>
                      <span className="text-emerald-400 font-bold font-mono">Conexão Ativa</span>
                    </div>
                    <div className="text-xs flex justify-between">
                      <span className="text-slate-500 font-mono font-bold">Banco de Dados:</span>
                      <span className="text-slate-300 font-mono">Simulador + Google Sheets</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      triggerNotification('Sessão encerrada com segurança.');
                    }}
                    className="w-full mt-8 py-2.5 bg-red-950/50 hover:bg-red-900/60 text-red-200 border border-red-500/20 rounded-xl font-mono text-xs uppercase font-bold cursor-pointer transition-colors"
                  >
                    Encerrar Investigação (Sair)
                  </button>
                </div>

                {/* Orders tracking list right (2/3 cols) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#12131A] border border-[#2D303D] p-6 rounded-3xl shadow-xl">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                      <h4 className="font-serif font-black text-slate-100 text-xl flex items-center gap-2">
                        <LucideIcon name="Package" className="text-[#EF4444]" />
                        <span>Andamento do Pedido & Rastreamento</span>
                      </h4>
                      <span className="text-xs font-mono text-slate-400">Total: {isAdminMode ? orders.length : orders.filter(o => o.customerName.toLowerCase() === currentUser.name.toLowerCase()).length} pedidos</span>
                    </div>

                    {/* Filter user orders list or show all orders if Admin is logged in */}
                    {(currentUser.role === 'admin' ? orders : orders.filter(o => o.customerName.toLowerCase() === currentUser.name.toLowerCase())).length === 0 ? (
                      <div className="text-center py-16">
                        <span className="text-4xl block mb-2">👁️</span>
                        <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto leading-relaxed text-center">Nenhum dossiê de faturamento associado neste terminal ainda. Adicione livros à sacola, finalize a compra e acompanhe seu rastreio aqui em tempo real!</p>
                        <button onClick={() => setCurrentView('catalog')} className="mt-4 text-xs font-mono font-bold uppercase text-[#EF4444] hover:underline">Abrir Catálogo</button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {(currentUser.role === 'admin' ? orders : orders.filter(o => o.customerName.toLowerCase() === currentUser.name.toLowerCase())).map((ord) => {
                          const stages = [
                            { name: '🔬 Avaliando Evidências', statusKey: 'Avaliando Evidências' },
                            { name: '📦 Lacre Kraft Preparado', statusKey: 'Preparando Lacre Kraft' },
                            { name: '✉️ Despachado em Sigilo', statusKey: 'Despachado em Sigilo' },
                            { name: '🏠 Dossiê Entregue', statusKey: 'Entregue' }
                          ];
                          
                          const activeIndex = stages.findIndex(s => s.statusKey === ord.status);

                          return (
                            <div key={ord.id} className="p-5 bg-black/40 border border-zinc-850 rounded-2xl relative overflow-hidden">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3 mb-4">
                                <div>
                                  <span className="text-[10px] font-mono text-slate-500 block">ID DO PEDIDO</span>
                                  <span className="text-sm font-mono font-bold text-amber-400">{ord.id}</span>
                                </div>
                                <div className="text-left sm:text-right">
                                  <span className="text-[10px] font-mono text-slate-500 block">DATA COMPRA</span>
                                  <span className="text-xs text-slate-300 font-mono">{ord.date}</span>
                                </div>
                                <div className="text-left sm:text-right">
                                  <span className="text-[10px] font-mono text-slate-500 block">DESTINATÁRIO</span>
                                  <span className="text-xs text-slate-100 font-bold font-sans">{ord.customerName} (CEP: {ord.cep})</span>
                                </div>
                              </div>

                              <div className="text-xs text-slate-300 font-sans mb-4 text-left">
                                <span className="font-bold text-slate-400 block mb-1 uppercase tracking-wider text-[10px] font-mono">Livros no Dossiê:</span>
                                <p className="leading-relaxed text-slate-200">
                                  {ord.items.map(it => `${it.quantity}x "${it.title}"`).join('; ')}
                                </p>
                              </div>

                              {/* Progress Track visual status */}
                              <div className="mt-5 bg-zinc-950/40 p-4 rounded-xl border border-zinc-800">
                                <span className="text-[10px] font-mono text-slate-400 block mb-3 uppercase tracking-wider font-bold">Progresso das Evidências (Siga as Fases):</span>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
                                  {stages.map((st, idx) => {
                                    const isCompleted = idx <= activeIndex;
                                    const isCurrent = idx === activeIndex;
                                    
                                    return (
                                      <div 
                                        key={st.name} 
                                        className={`p-2 rounded-lg border text-[10px] font-bold font-mono transition-all ${
                                          isCurrent 
                                            ? 'bg-red-950/40 border-[#EF4444] text-red-400 animate-pulse ring-2 ring-red-900/40' 
                                            : isCompleted 
                                              ? 'bg-zinc-950/80 border-slate-705 text-slate-300' 
                                              : 'bg-black/35 border-transparent text-slate-600'
                                        }`}
                                      >
                                        <span>{st.name}</span>
                                        {isCurrent && <span className="block text-[8px] text-[#EF4444]/75 mt-0.5">ESTÁGIO ATUAL</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Admin capability to change order status on the fly! */}
                              {isAdminMode && (
                                <div className="mt-5 border-t border-zinc-800 pt-4 flex items-center justify-between gap-4">
                                  <span className="text-xs text-[#EF4444] font-bold font-mono">🛠️ Comando Administrador: Atualizar Rastreio:</span>
                                  <select
                                    value={ord.status}
                                    onChange={(e) => {
                                      const updatedStatus = e.target.value;
                                      setOrders(prev => prev.map(o => o.id === ord.id ? { ...o, status: updatedStatus } : o));
                                      triggerNotification(`Status do pedido ${ord.id} atualizado para "${updatedStatus}"!`);
                                    }}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-[#EF4444]"
                                  >
                                    <option value="Avaliando Evidências">🔬 Avaliando Evidências</option>
                                    <option value="Preparando Lacre Kraft">📦 Preparando Lacre Kraft</option>
                                    <option value="Despachado em Sigilo">✉️ Despachado em Sigilo</option>
                                    <option value="Entregue">🏠 Entregue</option>
                                  </select>
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </div>

              </div>
            ) : (
              // Logged out: Multi-Tab elegant login form!
              <div className="bg-[#12131A] border border-[#2D303D] max-w-xl mx-auto rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="text-center mb-8">
                  <span className="w-12 h-12 rounded-2xl bg-red-950/40 border border-[#EF4444]/30 text-2xl flex items-center justify-center mx-auto mb-4 text-[#EF4444] font-serif font-black">
                    Ψ
                  </span>
                  <h3 className="font-serif font-black text-[#F1F5F9] text-2xl">Acesso Central Literário</h3>
                  <p className="text-xs text-slate-400 mt-2 font-sans max-w-sm mx-auto">Registre suas credenciais para verificar o andamento do pedido ou assumir privilégios diretivos de administrador.</p>
                </div>

                {/* Simulated login with standard credentials */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const userVal = (fd.get('username') as string)?.trim() || 'Leitor Comum';
                    const passVal = (fd.get('password') as string)?.trim() || '';

                    if (userVal.toLowerCase() === 'admin') {
                      if (passVal === 'admin') {
                        const adminUser = { name: 'Comandante Forense', role: 'admin' as const };
                        setCurrentUser(adminUser);
                        triggerNotification('🔑 Conexão estabelecida com sucesso! Painel Administrativo Ativado.');
                      } else {
                        alert('A senha do administrador é "admin"! Tente novamente ou entre no Acesso Comum removendo o login "admin".');
                      }
                    } else {
                      const clientUser = { name: userVal, role: 'user' as const };
                      setCurrentUser(clientUser);
                      triggerNotification(`🕵️‍♂️ Investigador "${userVal}" autenticado! Carregando andamento de pedidos...`);
                    }
                  }}
                  className="space-y-5 text-left"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 block uppercase">Insira seu Pseudônimo / Nome:</label>
                    <input 
                      type="text" 
                      name="username"
                      placeholder="Ex: Beatriz ou admin"
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#EF4444] font-mono leading-none"
                      required
                    />
                    <p className="text-[10px] text-zinc-500 font-mono">Use seu primeiro nome para criar um perfil livre de rastreio, ou use "admin" para ADM.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 block uppercase">Senha Mística (Livre para Usuário):</label>
                    <input 
                      type="password" 
                      name="password"
                      placeholder="Senha do usuário (ou 'admin' para ADM)"
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#EF4444] font-mono leading-none"
                    />
                    <div className="bg-[#1C1D24] p-2.5 rounded-lg border border-zinc-800 mt-2 flex items-center justify-between text-[10px] font-mono text-amber-400/85">
                      <span>🔑 CREDENCIAIS DO ADM EXCLUSIVO:</span>
                      <strong className="font-extrabold bg-zinc-950 px-2 py-0.5 rounded text-white border border-zinc-800">user: admin | senha: admin</strong>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-red-800 hover:bg-red-700 text-white font-mono text-xs uppercase font-extrabold tracking-wider rounded-xl transition-transform active:scale-98 shadow-lg cursor-pointer mt-2"
                  >
                    Homologar Credenciais e Acessar
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-500 font-sans">O acesso padrão de comprador é totalmente livre de registros extras. Digite seu nickname e clique no botão acima.</p>
                  </div>
                </form>
              </div>
            )}
          </section>
        )}

        {/* VIEW 4: FAQ (DÚVIDAS & RESPOSTAS INTERATIVAS) */}
        {currentView === 'faq' && (
          <section className="py-12 px-4 max-w-4xl mx-auto min-h-[75vh]">
            <div className="text-left bg-[#12131A] border border-[#2D303D] p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5 mb-8">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#EF4444] bg-[#2E1414] px-3 py-1 rounded inline-block border border-red-900/20 font-bold">FAQ DE RESPOSTAS</span>
                  <h3 className="font-serif font-black text-slate-100 text-3xl mt-2 leading-none">Dúvidas Forenses & Ajuda</h3>
                  <p className="text-xs text-slate-400 mt-2.5 font-sans">Esclarecemos suas dúvidas sobre embalagens, faturamentos, exportação do Sheets ou envios.</p>
                </div>
                <button
                  onClick={() => { setCurrentView('catalog'); }}
                  className="px-4 py-2 bg-[#1C1E26] hover:bg-zinc-850 text-slate-300 font-mono text-xs font-bold rounded-lg border border-zinc-800 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  Ir para Catálogo
                </button>
              </div>

              {/* FAQ items loop */}
              <div className="space-y-6">
                {faqQuestions.map((q) => (
                  <div key={q.id} className="p-5 bg-black/40 border border-zinc-805 rounded-2xl relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-200 font-sans flex items-center gap-1.5">
                        <span>🕵️‍♂️</span>
                        <span>{q.userName}</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{q.date}</span>
                    </div>

                    <h4 className="text-sm font-sans font-black text-amber-100 leading-relaxed text-left">
                      "{q.question}"
                    </h4>

                    {q.replied ? (
                      <div className="mt-3 bg-[#1C1E26] p-3.5 rounded-xl border border-zinc-800">
                        <span className="text-[9px] font-mono font-black text-red-500 block mb-1">RESPOSTA DO COMANDO ADM:</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{q.replyText}</p>
                      </div>
                    ) : (
                      <div className="mt-3 text-xs italic text-zinc-500 flex items-center gap-1.5 bg-black/35 p-2 rounded-lg border border-dashed border-zinc-800">
                        <LucideIcon name="Clock" size={12} className="text-amber-500 animate-spin" />
                        <span>Aguardando parecer técnico da gerência ADM para publicação pública.</span>
                      </div>
                    )}

                    {/* Admin answering interface inline! */}
                    {isAdminMode && !q.replied && (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const fd = new FormData(e.currentTarget);
                          const text = (fd.get('reply_text') as string)?.trim();
                          if (!text) return;
                          
                          setFaqQuestions(prev => prev.map(item => item.id === q.id ? {
                            ...item,
                            replied: true,
                            replyText: text
                          } : item));
                          triggerNotification('Resposta técnica cadastrada no FAQ com sucesso!');
                        }}
                        className="mt-4 pt-3 border-t border-zinc-800 flex flex-col gap-2"
                      >
                        <span className="text-[9px] font-mono font-bold text-red-400 text-left">Assumir Resposta (Privilégio ADM):</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="reply_text"
                            placeholder="Escreva sua resposta técnica..."
                            className="bg-[#1C1E26] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 flex-grow focus:outline-none focus:border-red-650 font-sans"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-[#EF4444] hover:bg-red-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-4 rounded-lg cursor-pointer"
                          >
                            Registrar Resposta
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>

              {/* User question submit form */}
              <div className="mt-12 bg-[#1C1E26] border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-serif font-bold text-lg text-slate-100 flex items-center gap-1.5 mb-2">
                  <LucideIcon name="MessageSquare" className="text-red-500" />
                  <span>Mandar pergunta ao FAQ</span>
                </h4>
                <p className="text-xs text-slate-400 font-sans mb-4">Tem alguma dúvida ou gostaria de relatar uma inconsistência técnica? Complete a ata e envie.</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const qAuthor = (fd.get('faq_author') as string)?.trim() || 'Comprador Anônimo';
                    const qText = (fd.get('faq_text') as string)?.trim() || '';

                    if (!qText) return;

                    const newQuestion: FAQQuestion = {
                      id: String(Date.now()),
                      userName: qAuthor,
                      question: qText,
                      date: new Date().toLocaleDateString('pt-BR'),
                      replied: false
                    };

                    setFaqQuestions(prev => [...prev, newQuestion]);
                    triggerNotification('Sua pergunta foi enviada ao Comando! Aguarde a homologação técnica da resposta.');
                    e.currentTarget.reset();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="faq_author"
                      placeholder="Seu pseudônimo..."
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-red-600 font-sans"
                      maxLength={40}
                      required
                    />
                    <span className="text-[10px] text-zinc-500 font-mono py-2 text-left sm:text-right">Sua pergunta constará nesta aba.</span>
                  </div>

                  <input
                    type="text"
                    name="faq_text"
                    placeholder="Sua pergunta / relato de dúvida técnica..."
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-red-650 font-sans"
                    maxLength={200}
                    required
                  />

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-800 hover:bg-red-700 text-white font-mono text-xs uppercase font-bold rounded-lg cursor-pointer shadow-md transition-colors"
                  >
                    Registrar Pergunta Forense
                  </button>
                </form>
              </div>

            </div>
          </section>
        )}

        {/* VIEW 5: SINGLE BOOK DETAIL PAGE */}
        {currentView === 'book-detail' && selectedBookForPage && (
          <section className="py-12 px-4 max-w-5xl mx-auto min-h-[75vh]">
            <div className="text-left bg-[#12131A] border border-[#2D303D] p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              
              {/* Back navigation bars */}
              <div className="flex items-center gap-2 mb-8 border-b border-zinc-800 pb-4">
                <button
                  onClick={() => { setCurrentView('catalog'); }}
                  className="flex items-center gap-1 text-xs font-mono font-bold text-red-500 hover:text-red-400 group cursor-pointer"
                >
                  <LucideIcon name="ChevronLeft" size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span>Voltar ao Catálogo</span>
                </button>
                <span className="text-[#2D303D] font-mono text-xs">/</span>
                <span className="text-xs text-slate-500 font-sans max-w-[200px] truncate">{selectedBookForPage.title}</span>
              </div>

              {/* Main detailed structure */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                
                {/* Book Cover Design */}
                <div className="md:col-span-4 flex justify-center items-start">
                  <div 
                    className="book-card-magic w-[220px] h-[320px] shrink-0 flex flex-col justify-between p-6 text-left relative overflow-hidden shadow-2xl select-none"
                    style={{
                      background: selectedBookForPage.coverImage 
                        ? 'none' 
                        : `linear-gradient(135deg, ${selectedBookForPage.coverStyle.gradientStart}, ${selectedBookForPage.coverStyle.gradientEnd})`,
                      color: '#FFFFFF'
                    }}
                  >
                    {selectedBookForPage.coverImage && (
                      <img 
                        src={selectedBookForPage.coverImage} 
                        alt={selectedBookForPage.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    <div className="book-bound-spine" />
                    <div className="book-pages-stack" />
                    <div className="absolute top-3 right-3 opacity-30 z-10">
                      <LucideIcon name="Bookmark" size={24} />
                    </div>

                    <div className="z-10">
                      <span className="text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-[#EF4444] font-bold">
                        {selectedBookForPage.category}
                      </span>
                    </div>

                    <div className="z-10 my-auto drop-shadow-[0_3px_5px_rgba(0,0,0,0.95)]">
                      <h4 className="font-serif font-black text-sm sm:text-base leading-snug tracking-normal line-clamp-3 text-white">
                        {selectedBookForPage.title}
                      </h4>
                      <p className="text-[10px] mt-1.5 font-mono text-slate-300 opacity-90">
                        por {selectedBookForPage.author}
                      </p>
                    </div>

                    <div className="z-10 flex justify-between items-center border-t border-white/20 pt-2 mt-1">
                      <span className="text-[9px] font-mono text-slate-300 opacity-80">Dossiê Exclusivo</span>
                      <LucideIcon name={selectedBookForPage.coverStyle.iconName || 'BookOpen'} size={15} className="text-[#EF4444]" />
                    </div>
                  </div>
                </div>

                {/* Cover Details information */}
                <div className="md:col-span-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                      <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-red-950/40 border border-red-900/30 text-red-400 font-mono">
                        🕵️‍♂️ {selectedBookForPage.category}
                      </span>
                      {selectedBookForPage.isAuthored && (
                        <span className="text-[9px] font-mono font-black tracking-widest text-[#EF4444] bg-[#2E1414] border border-[#EF4444]/30 rounded px-2.5 py-1" title="Publicação própria autografada">
                          ⭐ OBRA AUTORAL
                        </span>
                      )}
                      
                      {/* Rating visual */}
                      <span className="flex items-center gap-0.5 ml-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="inline-block">
                            <LucideIcon 
                              name="Star" 
                              size={14} 
                              className={i < selectedBookForPage.stars ? "text-amber-400 fill-amber-400" : "text-zinc-700"} 
                            />
                          </span>
                        ))}
                      </span>
                    </div>

                    <h2 className="font-serif font-black text-2xl sm:text-4xl text-slate-100 leading-tight">
                      {selectedBookForPage.title}
                    </h2>
                    <p className="text-sm font-mono text-red-500 mt-1">Escriturado sob custódia de <span className="underline font-bold text-slate-200">{selectedBookForPage.author}</span></p>

                    <div className="my-6 p-4 bg-zinc-950/40 rounded-xl border border-zinc-800">
                      <span className="text-[10px] font-mono font-bold text-slate-400 block mb-2 uppercase tracking-widest">RESUMO CLÍNICO / ANÁLISE DO LIVRO:</span>
                      <p className="text-sm text-slate-300 leading-relaxed font-sans italic">
                        "{selectedBookForPage.description}"
                      </p>
                    </div>

                    <div className="space-y-2 text-xs font-sans text-slate-400 pt-1">
                      <p className="flex items-center gap-2">
                        <span className="font-bold text-slate-500 font-mono w-28 block uppercase">ID do Produto:</span>
                        <span className="font-mono text-slate-300">{selectedBookForPage.id}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-bold text-slate-500 font-mono w-28 block uppercase">Categoria:</span>
                        <span className="text-slate-300">{selectedBookForPage.category}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-bold text-slate-500 font-mono w-28 block uppercase">Recomendações:</span>
                        <span className="text-red-400 font-black font-mono">{selectedBookForPage.likes} curtidores</span>
                      </p>
                    </div>

                    {/* Price with buy CTA */}
                    <div className="mt-8 flex items-baseline gap-3.5 border-t border-zinc-800 pt-6">
                      {selectedBookForPage.discount ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                            R$ {(selectedBookForPage.price * (1 - selectedBookForPage.discount / 100)).toFixed(2)}
                          </span>
                          <span className="text-sm line-through text-zinc-500 font-mono">
                            R$ {selectedBookForPage.price.toFixed(2)}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#EF4444] bg-[#2E1414] px-2 py-0.5 rounded border border-[#EF4444]/20">
                            {selectedBookForPage.discount}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                          R$ {selectedBookForPage.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-zinc-800">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedBookForPage);
                        triggerNotification(`"${selectedBookForPage.title}" adicionado à sua sacola.`);
                      }}
                      className="flex-grow sm:flex-grow-0 px-8 py-3.5 bg-[#EF4444] hover:bg-red-750 hover:border-red-600 rounded-xl text-white font-mono uppercase font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:translate-y-0.5 cursor-pointer"
                    >
                      <LucideIcon name="ShoppingBag" size={15} />
                      <span>Adicionar ao Dossiê (Comprar)</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLike(selectedBookForPage.id);
                        setBooks(prev => prev.map(item => item.id === selectedBookForPage.id ? { ...item, likes: item.likes + 1 } : item));
                        setSelectedBookForPage(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
                        triggerNotification('Obrigado pelo seu depoimento e voto!');
                      }}
                      className="px-6 py-3.5 bg-zinc-950/80 hover:bg-zinc-900 hover:text-white rounded-xl text-red-500 hover:border-zinc-800 font-mono text-xs uppercase font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
                    >
                      <LucideIcon name="Heart" size={15} className="fill-red-900/10" />
                      <span>Curtir Obra ({selectedBookForPage.likes})</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Dynamic Comments List directly nested at bottom of single book details */}
              <div className="mt-14 border-t border-[#2D303D] pt-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif font-black text-xl text-slate-100 flex items-center gap-2">
                    <LucideIcon name="MessageSquare" className="text-red-500" />
                    <span>Depoimentos & Análises Psíquicas ({selectedBookForPage.commentsList.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Espaço sob livre consulta do leitor</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: List existing reviews */}
                  <div className="lg:col-span-7 space-y-3 max-h-[380px] overflow-y-auto pr-2">
                    {selectedBookForPage.commentsList.length === 0 ? (
                      <div className="py-12 text-center bg-black/35 rounded-2xl border border-dashed border-zinc-800">
                        <p className="text-xs text-slate-400 italic font-sans">
                          Nenhuma análise registrada sobre este exemplar. Seja o primeiro a registrar suas impressões! 💭
                        </p>
                      </div>
                    ) : (
                      selectedBookForPage.commentsList.map((comm) => (
                        <div key={comm.id} className="bg-black/40 rounded-xl p-4 border border-zinc-805 text-left">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-bold font-sans text-slate-200">{comm.author}</span>
                            <span className="text-[9.5px] font-mono text-slate-500">{comm.date}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{comm.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right Column: Write a comment directly */}
                  <div className="lg:col-span-5 bg-[#1C1E26] p-5 rounded-2xl border border-zinc-800 text-left">
                    <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider mb-2">Registrar nova Ata de Leitura</h4>
                    <p className="text-xxs text-slate-500 leading-relaxed font-sans mb-4">Adicione suas impressões psicológicas e clínicas sobre este volume fictício.</p>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const pseud = (fd.get('pseudo') as string)?.trim() || 'Comprador';
                        const txt = (fd.get('criticas') as string)?.trim() || '';

                        if (!txt) return;

                        handleAddComment(selectedBookForPage.id, pseud, txt);
                        
                        const newComm: Comment = {
                          id: String(Date.now()),
                          author: pseud,
                          text: txt,
                          date: new Date().toLocaleDateString('pt-BR')
                        };

                        setSelectedBookForPage(prev => prev ? {
                          ...prev,
                          commentsList: [newComm, ...prev.commentsList]
                        } : null);

                        triggerNotification('Sua nota de leitura foi adicionada com sucesso!');
                        e.currentTarget.reset();
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Seu Pseudônimo:</label>
                        <input
                          type="text"
                          name="pseudo"
                          placeholder="Ex: Delegada Marina"
                          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-650 font-sans w-full"
                          maxLength={30}
                          required
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Nota / Crítica:</label>
                        <textarea
                          name="criticas"
                          placeholder="O que achou do enredo pscicossocial?"
                          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-650 font-sans w-full h-20 resize-none"
                          maxLength={190}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#EF4444] hover:bg-red-650 text-white font-mono text-xs uppercase font-extrabold tracking-wider rounded-xl transition-colors cursor-pointer"
                      >
                        Registrar Análise Clínico-Investigativa
                      </button>
                    </form>
                  </div>

                </div>
              </div>

            </div>
          </section>
        )}

      </main>

      {/* Footer styled as a dark magical tome */}
      <footer className="mt-auto relative z-10 bg-[#0B0C10] border-t-4 border-red-950 text-slate-400 py-12 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14 text-center md:text-left">
            <div>
              <h4 className="font-serif font-black text-white text-base">Dossiê Psique • Livraria</h4>
              <p className="text-xxs font-mono text-red-500 tracking-wider mt-1 uppercase">Livros Psicossociais & Dark Romance • Desde 2026</p>
              <p className="text-xs text-slate-400 mt-2.5 max-w-xs font-serif italic leading-relaxed">
                "Não há tormento de terra que resista ao aconchego das páginas e as lendas de uma boa pena."
              </p>
            </div>

            {/* Links lists */}
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold font-mono">
              <div className="flex items-center gap-2">
                <LucideIcon name="ShieldCheck" size={14} className="text-[#EF4444]" />
                <span>Custódia Discreta</span>
              </div>
              <div className="flex items-center gap-2">
                <LucideIcon name="Layers" size={14} className="text-[#34D399]" />
                <span>Planilhas de Evidências</span>
              </div>
              <div className="flex items-center gap-2">
                <LucideIcon name="Heart" size={14} className="text-rose-500" />
                <span>Trama Autoral</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <span className="text-[10px] font-mono tracking-wider font-bold text-slate-300">FEITO PARA MENTES CURIOSAS</span>
            <span className="text-[11px] text-slate-500">© 2026 Dossiê Psique. Todos os direitos de autor reservados à investigação.</span>
          </div>

        </div>
      </footer>

      {/* Interactive Shopping Cart Drawer sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            
            {/* Gray transparent overlay shadow backdrop */}
            <div 
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300" 
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              
              {/* Drawer Container Panel */}
              <div className="pointer-events-auto w-screen max-w-md slide-in-right bg-[#12131A] border-l border-zinc-800 shadow-2xl flex flex-col justify-between relative text-slate-100">
                
                {/* Book edge gold trim decor */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 via-red-600 to-red-950" />

                {/* Header of Cart drawer */}
                <div className="px-5 py-5 bg-[#1C1E26] border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <LucideIcon name="ShoppingBag" className="text-red-500" size={18} />
                    <h3 className="font-serif font-black text-slate-100 text-base sm:text-lg">Dossiê de Compras</h3>
                  </div>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 px-2 text-stone-400 hover:text-slate-100 hover:bg-stone-850/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <span className="text-xs uppercase font-mono font-bold tracking-wider">Fechar [X]</span>
                  </button>
                </div>

                {/* Body Content area of cart drawer */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
                  
                  {checkoutStep === 'success' && completedOrder ? (
                    
                    /* Success / Google Sheets extraction screen */
                    <div className="text-center py-6 animate-magical-float">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800 mb-4 border border-emerald-200">
                        <LucideIcon name="CheckCircle" size={32} />
                      </div>

                      <span className="font-mono text-[10px] font-black uppercase text-red-500">✦ Registro de Pedido Concluído ✦</span>
                      <h4 className="font-serif font-black text-slate-100 text-lg mt-1">Pedido Arquivado com Sucesso!</h4>
                      
                      <p className="text-xs text-slate-400 mt-2.5 max-w-xs mx-auto leading-relaxed font-sans">
                        Sua farsa comercial foi cadastrada! Os dados abaixo foram compilados no formato de colunas do <strong>Google Sheets</strong> e despachados via API. Verifique também o log no console da página!
                      </p>

                      {/* Code Box representational receipt parchment schema block */}
                      <div className="mt-5 p-4.5 bg-zinc-950 text-zinc-300 rounded-xl text-left border border-stone-800/80 shadow-md font-mono text-[10px] space-y-2 select-all max-h-[340px] overflow-y-auto">
                        <p className="text-emerald-400 font-bold border-b border-zinc-800 pb-1 flex items-center justify-between">
                          <span>📦 PLANILHA DE GOOGLE SHEETS</span>
                          <span className="text-[8px] font-mono select-none uppercase px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">Pushed API</span>
                        </p>
                        <p><strong className="text-white">A_DataHora:</strong> "{completedOrder.dataHora}"</p>
                        <p><strong className="text-white">B_ID_Pedido:</strong> "{completedOrder.idPedido}"</p>
                        <p><strong className="text-white">C_Cliente:</strong> "{completedOrder.nomeCliente}"</p>
                        <p><strong className="text-white">D_CEP:</strong> "{completedOrder.cep}"</p>
                        <p className="break-all"><strong className="text-white">E_Livros:</strong> <span className="text-amber-200">"{completedOrder.livrosComprados}"</span></p>
                        <p><strong className="text-white">F_Método:</strong> "{completedOrder.metodoEnvio}"</p>
                        <p><strong className="text-white">G_Subtotal:</strong> "{completedOrder.valorProdutos}"</p>
                        <p><strong className="text-white">H_Frete:</strong> "{completedOrder.valorFrete}"</p>
                        <p className="text-white text-xs border-t border-zinc-800 pt-1.5"><strong className="text-emerald-400">I_Total_Pedido:</strong> {completedOrder.valorTotal}</p>
                      </div>

                      <div className="mt-6 flex flex-col gap-2">
                        <button
                          onClick={handleFinishedSucceedOrder}
                          className="button-magic-primary w-full text-xs py-3 rounded-full"
                        >
                          Concluir e Voltar às Prateleiras
                        </button>
                        <p className="text-[10px] text-stone-400 font-mono">ID Único do Selo: {completedOrder.idPedido}</p>
                      </div>
                    </div>

                  ) : (
                    
                    /* Flow for normal checkout: Cart or Shipping details input */
                    <>
                      {checkoutStep === 'cart' ? (
                        
                        /* STAGE 1: Cart product grid lists */
                        <div className="space-y-4">
                          {cart.length === 0 ? (
                            
                            <div className="text-center py-12">
                              <span className="text-4xl block mb-2 select-none">🪵</span>
                              <p className="font-serif font-black text-amber-950 text-sm">Sua sacola está vazia</p>
                              <p className="text-[11px] text-slate-500 mt-1 max-w-xxs mx-auto font-serif">O que acha de folhear e escolher um novo romance ou grimório para aquecer os pensamentos?</p>
                              <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-xs font-bold text-[#D15525] hover:underline uppercase tracking-wide font-mono"
                              >
                                Voltar ao Acervo
                              </button>
                            </div>

                          ) : (
                            
                            <>
                              <div className="space-y-3">
                                {cart.map((item) => {
                                  const finalPrice = item.book.discount 
                                    ? item.book.price * (1 - item.book.discount / 100) 
                                    : item.book.price;
                                  return (
                                    <div key={item.book.id} className="bg-white p-3 sm:p-4 rounded-xl border border-amber-900/10 flex gap-4 items-center">
                                      
                                      {/* Miniature Book cover */}
                                      <div 
                                        className="w-[50px] h-[75px] rounded-md shrink-0 relative overflow-hidden flex flex-col justify-end p-1 shadow-sm select-none"
                                        style={{
                                          background: item.book.coverImage 
                                            ? 'none' 
                                            : `linear-gradient(135deg, ${item.book.coverStyle.gradientStart}, ${item.book.coverStyle.gradientEnd})`,
                                          color: '#FFFFFF'
                                        }}
                                      >
                                        {item.book.coverImage && (
                                          <img src={item.book.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                        )}
                                        <div className="book-bound-spine" />
                                        <h5 className="font-serif font-bold text-[6px] line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] leading-none z-10">{item.book.title}</h5>
                                      </div>

                                      {/* Details */}
                                      <div className="flex-grow">
                                        <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900 leading-tight line-clamp-1">{item.book.title}</h4>
                                        <p className="text-[10px] text-stone-400 font-mono">por {item.book.author}</p>
                                        <p className="text-xs font-bold text-amber-950 mt-1.5">
                                          R$ {finalPrice.toFixed(2)} <span className="font-mono text-[9px] font-normal text-stone-400">UN</span>
                                        </p>
                                      </div>

                                      {/* Quantity controls */}
                                      <div className="flex flex-col items-end gap-1.5">
                                        <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                                          <button
                                            onClick={() => handleUpdateCartQuantity(item.book.id, item.quantity - 1)}
                                            className="px-1.5 py-0.5 text-stone-600 hover:bg-stone-200 rounded text-xs font-bold font-mono cursor-pointer"
                                          >
                                            -
                                          </button>
                                          <span className="text-xs font-bold font-mono text-stone-800 px-1">{item.quantity}</span>
                                          <button
                                            onClick={() => handleUpdateCartQuantity(item.book.id, item.quantity + 1)}
                                            className="px-1.5 py-0.5 text-stone-600 hover:bg-stone-200 rounded text-xs font-bold font-mono cursor-pointer"
                                          >
                                            +
                                          </button>
                                        </div>

                                        <button
                                          onClick={() => handleRemoveFromCart(item.book.id)}
                                          className="text-[10px] text-red-500 hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer font-bold"
                                        >
                                          <LucideIcon name="Trash" size={10} />
                                          <span>remover</span>
                                        </button>
                                      </div>

                                    </div>
                                  );
                                })}
                              </div>

                              {/* FREIGHT CALC MODULE (Módulo de Frete Correios) */}
                              <div className="mt-6 bg-[#FAF4E0]/80 p-4 rounded-xl border border-amber-900/10">
                                <span className="text-[10px] font-mono uppercase font-black text-amber-800 block mb-1">🦉 Cálculo de Frete Correios</span>
                                <p className="text-[10px] text-stone-500 mb-2 leading-tight">Insira seu CEP para calcular o preço da caixa com fita selada de cera perfumada.</p>
                                
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Ex: 01310-100"
                                    value={shippingCEP}
                                    maxLength={9}
                                    onChange={(e) => setShippingCEP(e.target.value)}
                                    className="bg-white border border-amber-900/15 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-amber-800 w-full text-amber-950 font-mono"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleCalculateShipping}
                                    disabled={isCalculatingShipping}
                                    className="bg-amber-950 hover:bg-amber-900 disabled:bg-stone-400 text-amber-50 rounded-xl px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                                  >
                                    {isCalculatingShipping ? 'Cálculo...' : 'Calcular'}
                                  </button>
                                </div>

                                {shippingCalculated && (
                                  <div className="mt-3 bg-white/70 border border-amber-500/10 p-2.5 rounded-lg text-xs space-y-2">
                                    <p className="font-serif text-amber-950 flex justify-between">
                                      <span>Preço do Frete Postal:</span>
                                      <strong>R$ {shippingCost.toFixed(2)}</strong>
                                    </p>
                                    <p className="text-slate-400 text-[10px] flex justify-between select-none font-mono">
                                      <span>Prazo Estimado:</span>
                                      <span>{shippingDays} a {shippingDays + 2} dias úteis</span>
                                    </p>

                                    {/* Choice of shipping type */}
                                    <div className="pt-2 border-t border-zinc-800 flex flex-col gap-1">
                                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 [font-size:11px]">
                                        <input 
                                          type="radio" 
                                          name="col-shipping-type" 
                                          checked={shippingType === 'coruja'} 
                                          onChange={() => setShippingType('coruja')}
                                          className="text-red-500 focus:ring-0"
                                        />
                                        <span>Custódia Padrão Segura (R$ {shippingCost.toFixed(2)})</span>
                                      </label>
                                      
                                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 [font-size:11px]">
                                        <input 
                                          type="radio" 
                                          name="col-shipping-type" 
                                          checked={shippingType === 'vassoura'} 
                                          onChange={() => setShippingType('vassoura')}
                                          className="text-red-500 focus:ring-0"
                                        />
                                        <span className="font-bold text-red-500">Custódia Expressa Confidencial (+ R$ 15,00)</span>
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>

                          )}
                        </div>

                      ) : (
                        
                        /* STAGE 2: Add customer addresses for Google Sheets log */
                        <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                          <h4 className="font-serif font-black text-slate-100 text-sm uppercase tracking-wide border-b border-zinc-800 pb-1 flex items-center gap-1.5">
                            <LucideIcon name="Pencil" size={13} className="text-red-500" />
                            Preencher Destinatário de Entrega
                          </h4>
                          
                          <div className="space-y-2 text-xs">
                            <div>
                              <label className="block text-[10px] uppercase font-mono font-bold text-amber-900/80 mb-1">Nome Completo do Comprador *</label>
                              <input
                                type="text"
                                placeholder="Beatriz Santos"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full bg-white border border-amber-900/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-800 text-amber-950 font-serif"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-mono font-bold text-amber-900/80 mb-1">E-mail para Despacho Místico *</label>
                              <input
                                type="email"
                                placeholder="comprador@escola-mar.com"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                className="w-full bg-white border border-amber-900/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-800 text-amber-950 font-mono"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-2">
                                <label className="block text-[10px] uppercase font-mono font-bold text-amber-900/80 mb-1">Endereço Místico *</label>
                                <input
                                  type="text"
                                  placeholder="Rua das Runas, No 42"
                                  value={customerAddress}
                                  onChange={(e) => setCustomerAddress(e.target.value)}
                                  className="w-full bg-white border border-amber-900/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-800 text-amber-950"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-mono font-bold text-amber-900/80 mb-1">Bairro *</label>
                                <input
                                  type="text"
                                  placeholder="Colina Alta"
                                  value={customerBairro}
                                  onChange={(e) => setCustomerBairro(e.target.value)}
                                  className="w-full bg-white border border-amber-900/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-800 text-amber-950"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-2">
                                <label className="block text-[10px] uppercase font-mono font-bold text-amber-900/80 mb-1">Cidade Destinatária *</label>
                                <input
                                  type="text"
                                  placeholder="Porto Mágico"
                                  value={customerCity}
                                  onChange={(e) => setCustomerCity(e.target.value)}
                                  className="w-full bg-white border border-amber-900/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-800 text-amber-950"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase font-mono font-bold text-amber-900/80 mb-1">Estado (UF) *</label>
                                <input
                                  type="text"
                                  placeholder="SP"
                                  value={customerUF}
                                  onChange={(e) => setCustomerUF(e.target.value.toUpperCase())}
                                  className="w-full bg-white border border-amber-900/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-800 text-amber-950 font-mono text-center"
                                  maxLength={2}
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-mono font-bold text-amber-900/80 mb-1">CEP de Entrega (Simulado)</label>
                              <input
                                type="text"
                                value={shippingCEP}
                                disabled
                                className="w-full bg-stone-100 border border-amber-900/15 rounded-xl px-3 py-2 text-stone-500 font-mono"
                              />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-amber-900/10 flex justify-between gap-2.5">
                            <button
                              type="button"
                              onClick={() => setCheckoutStep('cart')}
                              className="button-magic-secondary text-xs"
                            >
                              Voltar
                            </button>
                            <button
                              type="submit"
                              className="button-magic-primary text-xs flex-grow"
                            >
                              <span>Finalizar Compra 🚀</span>
                              <LucideIcon name="ShieldCheck" size={13} />
                            </button>
                          </div>
                        </form>

                      )}
                    </>

                  )}

                </div>

                {/* Footer and final checkout calculators of cart drawer */}
                {checkoutStep !== 'success' && cart.length > 0 && (
                  <div className="p-4 bg-[#FAF4E0] border-t border-amber-900/15 space-y-3.5 z-10">
                    
                    {/* Sum of prices */}
                    <div className="space-y-1.5 text-xs font-serif bg-white/50 p-3 rounded-lg border border-amber-900/10">
                      <div className="flex justify-between text-stone-700">
                        <span>Produtos Selecionados:</span>
                        <strong>R$ {cartSubtotal.toFixed(2)}</strong>
                      </div>
                      
                      <div className="flex justify-between text-slate-300">
                        <span>Frete de Envio:</span>
                        <strong>
                          {shippingCalculated 
                            ? `R$ ${activeShippingCost.toFixed(2)}` 
                            : 'Insira o CEP acima'}
                        </strong>
                      </div>

                      {shippingCalculated && (
                        <p className="text-[10px] text-red-400 font-mono border-t border-zinc-800 pt-1">
                          Método de Custódia: {shippingType === 'vassoura' ? '✈️ Custódia Expressa Confidencial' : '🚚 Custódia Padrão Segura'}
                        </p>
                      )}

                      <div className="flex justify-between text-base font-black text-slate-100 border-t border-zinc-800 pt-2.5">
                        <span>Faturamento Total Simulado:</span>
                        <strong>R$ {cartTotal.toFixed(2)}</strong>
                      </div>
                    </div>

                    {checkoutStep === 'cart' && (
                      <button
                        onClick={() => {
                          if (!shippingCalculated) {
                            alert('Por favor, digite seu CEP e calcule o frete dos Correios antes de avançar para a entrega!');
                            return;
                          }
                          setCheckoutStep('shipping');
                        }}
                        disabled={!shippingCalculated}
                        className="button-magic-primary w-full text-xs font-bold uppercase py-3 rounded-full flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-stone-300 disabled:border-stone-300 disabled:shadow-none select-none disabled:text-stone-500"
                      >
                        <span>Avançar para Entrega</span>
                        <LucideIcon name="ArrowRight" size={14} />
                      </button>
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
