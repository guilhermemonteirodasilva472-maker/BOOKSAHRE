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
      title: '1. Indique seu favorito',
      desc: 'Compartilhe aquele livro extraordinário que mudou sua perspectiva ou que te fez sorrir nos domingos frios.',
      icon: 'Bookmark',
      pastelBg: 'bg-[#EDE9FE]', // Lavender pastel
      accentColor: 'text-[#8B5CF6]', // Lavender active
      borderColor: 'border-[#EDE9FE]'
    },
    {
      id: 2,
      title: '2. Comente o que achou',
      desc: 'Puxe conversa fiada ou profunda! Espaço livre de críticas rebuscadas e focado em opiniões sinceras e acolhedoras.',
      icon: 'MessageSquare',
      pastelBg: 'bg-[#D1FAE5]', // Mint pastel
      accentColor: 'text-[#10B981]', // Mint active
      borderColor: 'border-[#D1FAE5]'
    },
    {
      id: 3,
      title: '3. Compartilhe sua própria escrita',
      desc: 'É autor independente ou gosta de arriscar poemas na gaveta? Aqui você ganha destaque e leitores curiosos de verdade.',
      icon: 'Feather',
      pastelBg: 'bg-[#FFEFD6]', // Coral/Yellow pastel
      accentColor: 'text-[#F97316]', // Orange active
      borderColor: 'border-[#FFEFD6]'
    }
  ];

  return (
    <section id="features" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8B5CF6] bg-[#EDE9FE] px-4 py-2 rounded-full inline-block">
          Como Funciona
        </span>
        <h2 className="text-3xl font-display font-extrabold text-[#111827] mt-4 tracking-tight leading-tight sm:text-4xl">
          Um espaço sutil para inspirar leituras reais
        </h2>
        <p className="text-sm text-[#4B5563] mt-3 font-sans leading-relaxed">
          Sem rankings de velocidade ou metas sufocantes. Apenas a alegria simples de recomendar e descobrir leituras memoráveis de forma descontraída.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div 
            key={item.id}
            className="interactive-card bg-white p-8 flex flex-col items-start gap-4 transition-all duration-300 relative overflow-hidden"
          >
            {/* Background icon container visually balanced */}
            <div className={`w-14 h-14 rounded-2xl ${item.pastelBg} ${item.accentColor} flex items-center justify-center border border-transparent shadow-sm`}>
              <LucideIcon name={item.icon} size={24} strokeWidth={2.5} />
            </div>

            <h3 className="font-display font-extrabold text-lg text-[#111827]">
              {item.title}
            </h3>
            
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {item.desc}
            </p>

            {/* Subtle giant back numbered indicator */}
            <span className="absolute bottom-[-15px] right-[-10px] text-[110px] font-sans font-black select-none pointer-events-none text-slate-100/60 leading-none">
              {item.id}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
