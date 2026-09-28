import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { REGIONS, BRAZIL_STATES } from '../data/brazilLocations';
import { Mail, Check, ShieldCheck, FileText, Globe, ArrowUp, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { selectLocationFilter, setActiveView } = useNews();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 dark:bg-stone-950 dark:text-stone-400 mt-20 border-t border-stone-800 transition-colors">
      {/* Newsletter Strip */}
      <div className="border-b border-stone-800/80 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Edição Matinal do Interior
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-editorial text-white">
              Receba o resumo regional do Brasil e dos municípios
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Despachos econômicos, sustentabilidade e inovação direto na sua caixa postal todas as manhãs.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="email"
                placeholder="Seu melhor e-mail institucional..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-800/90 border border-stone-700 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              Assinar Boletim
            </button>
          </form>
        </div>

        {newsletterSuccess && (
          <div className="max-w-7xl mx-auto mt-3 text-xs text-emerald-400 font-medium flex items-center justify-center lg:justify-end gap-1.5">
            <Check className="w-4 h-4" />
            <span>Inscrição confirmada com sucesso! Você receberá nosso boletim diário.</span>
          </div>
        )}
      </div>

      {/* Main Footer Links & Regional Directory */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-10 border-b border-stone-800">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-2xl font-bold tracking-tight text-white font-editorial">
              Brasil <span className="text-emerald-500">&amp;</span> Interior
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Portal dedicado à cobertura aprofundada dos polos municipais, do agronegócio sustentável, 
              das manifestações culturais autênticas e das transformações urbanas do interior brasileiro.
            </p>
            <div className="text-xs text-stone-500">
              <p>Membro da Associação Brasileira de Jornalismo Regional</p>
              <p>Redação Central: São Paulo e Brasília · Sucursais em todas as regiões</p>
            </div>
          </div>

          {/* Quick Regions Breakdown */}
          {REGIONS.slice(0, 4).map(reg => {
            const statesInReg = BRAZIL_STATES.filter(st => st.regiao === reg);
            return (
              <div key={reg} className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Região {reg}
                </h4>
                <ul className="space-y-1 text-xs text-stone-400">
                  {statesInReg.map(st => (
                    <li key={st.sigla}>
                      <button
                        onClick={() => selectLocationFilter(st.sigla)}
                        className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                      >
                        {st.nome} ({st.sigla})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Copyright, Terms, Privacy */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span>&copy; {new Date().getFullYear()} Brasil &amp; Interior Notícias Ltda. Todos os direitos reservados.</span>
            <span>·</span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Termos de Uso</span>
            <span>·</span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Política de Privacidade &amp; LGPD</span>
            <span>·</span>
            <a
              href="#admin"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('admin');
                window.location.hash = 'admin';
              }}
              className="hover:text-stone-300 transition-colors cursor-pointer inline-flex items-center gap-1 text-stone-400 font-medium hover:underline"
              title="Acesso à Redação e Gestão de Notícias"
            >
              <Lock className="w-3 h-3 text-stone-500" />
              <span>Acesso à Redação (ADM)</span>
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
