import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Plus, 
  Check, 
  Sparkles, 
  HelpCircle,
  Eye
} from 'lucide-react';

import agroImg from '../assets/images/manchete_brasil_agro_1790556949836.jpg';
import ecologiaImg from '../assets/images/interior_ecologia_1790556964616.jpg';
import cidadesImg from '../assets/images/cidades_inovacao_1790556974278.jpg';
import culturaImg from '../assets/images/cultura_patrimonio_1790556983643.jpg';

interface PresetItem {
  label: string;
  url: string;
  suggestedCaption: string;
}

const PRESET_GALLERY: PresetItem[] = [
  {
    label: 'Agronegócio & Campo',
    url: agroImg,
    suggestedCaption: 'Complexo agroindustrial com armazéns e painéis solares no interior de Mato Grosso. Foto: Divulgação',
  },
  {
    label: 'Meio Ambiente & Rios',
    url: ecologiaImg,
    suggestedCaption: 'Barco de monitoramento comunitário e pesquisa ambiental ao entardecer no Pantanal. Foto: Acervo',
  },
  {
    label: 'Cidades & Inovação',
    url: cidadesImg,
    suggestedCaption: 'Corredores de mobilidade urbana sustentável com arborização de ipês no interior. Foto: Arquivo',
  },
  {
    label: 'Cultura & Tradição',
    url: culturaImg,
    suggestedCaption: 'Celebração cultural e artesanato secular em centro histórico do interior colonial. Foto: Reportagem',
  },
];

interface InsertInlineImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (markdownSnippet: string) => void;
}

export const InsertInlineImageModal: React.FC<InsertInlineImageModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(PRESET_GALLERY[0].url);
  const [caption, setCaption] = useState<string>(PRESET_GALLERY[0].suggestedCaption);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'presets' | 'url'>('presets');

  if (!isOpen) return null;

  const currentEffectiveUrl = activeTab === 'url' && customUrlInput.trim() ? customUrlInput.trim() : selectedUrl;

  const handleSelectPreset = (preset: PresetItem) => {
    setSelectedUrl(preset.url);
    if (!caption || PRESET_GALLERY.some(p => p.suggestedCaption === caption)) {
      setCaption(preset.suggestedCaption);
    }
  };

  const handleConfirmInsert = () => {
    if (!currentEffectiveUrl) return;

    const cleanCaption = caption.trim() || 'Registro fotográfico da reportagem';
    const markdown = `\n\n![${cleanCaption}](${currentEffectiveUrl})\n\n`;
    onInsert(markdown);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-editorial text-stone-900 dark:text-stone-100">
                Inserir Foto no Meio da Reportagem
              </h3>
              <p className="text-xs text-stone-500">
                A foto será diagramada com legenda fotográfica exatamente na posição escolhida
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Method tabs */}
          <div className="flex items-center gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Galeria Editorial (Alta Resolução)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Inserir URL de Imagem Externa
            </button>
          </div>

          {/* Preset gallery */}
          {activeTab === 'presets' && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block">
                Selecione a Fotografia Regional:
              </span>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_GALLERY.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(item)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer group text-left ${
                      selectedUrl === item.url
                        ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md'
                        : 'border-stone-200 dark:border-stone-800 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-xs font-semibold text-white leading-tight">
                        {item.label}
                      </span>
                    </div>
                    {selectedUrl === item.url && (
                      <div className="absolute top-2 right-2 p-1 bg-emerald-600 text-white rounded-full">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* External URL input */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block">
                Link direto da Imagem (HTTPS):
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com.br/fotos/reportagem-interior.jpg"
                value={customUrlInput}
                onChange={e => setCustomUrlInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-mono"
              />
              <p className="text-[11px] text-stone-400">
                Dica: Cole links diretos de imagens JPG, PNG ou WebP de bancos de imagens ou agências de notícias.
              </p>
            </div>
          )}

          {/* Caption / Legenda */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
              Legenda da Imagem &amp; Crédito Fotográfico:
            </label>
            <input
              type="text"
              placeholder="Ex: Vista panorâmica do porto seco em Goiás. Foto: Agência Regional / João Silva"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
            />
          </div>

          {/* Live Preview Box */}
          {currentEffectiveUrl && (
            <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                <Eye className="w-3.5 h-3.5" />
                <span>Pré-visualização de como aparecerá no texto:</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700">
                <img
                  src={currentEffectiveUrl}
                  alt="Prévia"
                  referrerPolicy="no-referrer"
                  className="w-full max-h-40 object-cover"
                />
                <div className="p-2 text-[11px] bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 italic flex items-center gap-1">
                  <span>📷</span>
                  <span className="truncate">{caption || 'Sem legenda'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmInsert}
            disabled={!currentEffectiveUrl}
            className="px-5 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Inserir Imagem no Texto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
