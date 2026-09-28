import React, { useEffect, useRef } from 'react';
import { useNews } from '../context/NewsContext';
import { Megaphone, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  location: 'header' | 'inFeed' | 'bottomArticle';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ location, className = '' }) => {
  const { adsenseSettings, isAdminAuthenticated } = useNews();
  const containerRef = useRef<HTMLDivElement>(null);

  const getAdCodeAndLabel = () => {
    switch (location) {
      case 'header':
        return {
          code: adsenseSettings.headerBannerCode,
          label: 'Anúncio Topo do Portal (728x90 Leaderboard / Responsivo)',
          aspect: 'h-24 sm:h-28 max-w-5xl',
        };
      case 'inFeed':
        return {
          code: adsenseSettings.inFeedBannerCode,
          label: 'Anúncio de Feed (Entre Seções da Capa)',
          aspect: 'h-28 sm:h-32 max-w-4xl',
        };
      case 'bottomArticle':
        return {
          code: adsenseSettings.bottomArticleBannerCode,
          label: 'Anúncio Final da Notícia (Rodapé da Matéria)',
          aspect: 'h-28 sm:h-32 max-w-2xl',
        };
      default:
        return { code: '', label: 'Espaço Publicitário', aspect: 'h-24' };
    }
  };

  const { code, label, aspect } = getAdCodeAndLabel();

  // Execute AdSense push when ad code contains adsbygoogle <ins>
  useEffect(() => {
    if (code && adsenseSettings.enabled && containerRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Handle potential AdSense re-initialization warnings silently
      }
    }
  }, [code, adsenseSettings.enabled]);

  if (!adsenseSettings.enabled) {
    return null;
  }

  // If user provided custom script or HTML code for this location
  if (code && code.trim().length > 0) {
    return (
      <div className={`my-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 dark:text-stone-500 mb-1">
          Publicidade
        </span>
        <div
          ref={containerRef}
          className="w-full flex justify-center"
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </div>
    );
  }

  // If placeholders are disabled for regular users and no code is configured, hide placeholder
  if (!adsenseSettings.showPlaceholders && !isAdminAuthenticated) {
    return null;
  }

  // Render elegant placeholder for monetization setup
  return (
    <div className={`my-6 mx-auto w-full flex flex-col items-center justify-center ${className}`}>
      <div className="w-full text-center mb-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Publicidade · Espaço Reservado AdSense
        </span>
      </div>
      <div
        className={`w-full ${aspect} bg-stone-100/80 dark:bg-stone-800/50 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl flex flex-col items-center justify-center p-4 text-center transition-all hover:border-emerald-500/50 group`}
      >
        <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1">
          <Megaphone className="w-4 h-4 text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold font-editorial text-stone-800 dark:text-stone-200">
            {label}
          </span>
        </div>
        <p className="text-[11px] text-stone-400 dark:text-stone-500 max-w-md">
          {adsenseSettings.clientScriptId ? (
            <span>Pronto para exibir anúncios do Google AdSense. Adicione o código do bloco no Painel ADM.</span>
          ) : (
            <span>Ative o ID do cliente AdSense (ca-pub-xxx) no Painel ADM para veicular anúncios automáticos.</span>
          )}
        </p>
      </div>
    </div>
  );
};
