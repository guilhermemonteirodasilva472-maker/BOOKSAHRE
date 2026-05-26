/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import LucideIcon from './LucideIcon';

export default function Features() {
  const items = [
    {
      id: 1,
      title: '🕵️‍♂️ Envio sob Custódia Silenciosa',
      desc: 'Enviamos suas investigações literárias e thrillers para todo o Brasil de forma segura e discreta! Calcule o transporte fornecendo seu CEP. Embalagem confidencial resistente com rastreamento logístico em tempo real.',
      icon: 'Send',
      bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-950/30',
      numColor: 'text-emerald-950/20'
    },
    {
      id: 2,
      title: '🔒 Prontuário Altamente Confidencial',
      desc: 'Sua privacidade é inviolável. Nosso ambiente de checkout integra camadas certificadas de criptografia avançada. Seus dados de simulação e dados pessoais são tratados sob sigilo absoluto e protegidos.',
      icon: 'ShieldCheck',
      bgClass: 'bg-blue-500/10 text-blue-400 border-blue-950/30',
      numColor: 'text-blue-950/20'
    },
    {
      id: 3,
      title: '📊 Relatórios & Atas Automatizadas',
      desc: 'Exporte facilmente suas despesas! Ao fechar seu carrinho de evidências, nosso sistema compila todos os metadados de compra em linhas estruturadas prontas para visualização direta no Google Sheets.',
      icon: 'TableProperties',
      bgClass: 'bg-amber-500/10 text-amber-400 border-amber-950/30',
      numColor: 'text-amber-950/20'
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 relative z-10">
      
      {/* Whimsical Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-950/30 px-3.5 py-1.5 rounded-full inline-block border border-red-900/20">
          🕵️‍♂️ Protocolos Operacionais 🕵️‍♂️
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#F1F5F9] mt-4 tracking-tight leading-tight">
          Investigação, Sigilo & Logística
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 font-sans max-w-md mx-auto">
          Tratamos cada livro como uma evidência valiosa: embalagens reforçadas opacas e seguras que garantem que suas leituras psicológicas cheguem perfeitamente lacradas ao seu destino.
        </p>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div 
            key={item.id}
            className="book-card-magic bg-[#12131A] border border-[#2D303D] p-7 sm:p-8 flex flex-col items-start gap-4 transition-all duration-300 relative overflow-hidden"
          >
            {/* Background symbol */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.bgClass} shadow-sm z-10`}>
              <LucideIcon name={item.icon} size={20} strokeWidth={2.5} />
            </div>

            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-100 z-10">
              {item.title}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed z-10 font-sans">
              {item.desc}
            </p>

            {/* Huge decorative behind-number label */}
            <span className={`absolute bottom-[-15px] right-[-10px] text-[100px] font-mono font-black select-none pointer-events-none ${item.numColor} leading-none z-0`}>
              0{item.id}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
