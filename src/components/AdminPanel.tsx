import React, { useState, useEffect, useMemo } from 'react';
import { useNews } from '../context/NewsContext';
import { Article, NewsCategory, ScopeType } from '../types';
import { BRAZIL_STATES } from '../data/brazilLocations';
import { getMunicipiosPorEstado, getMunicipiosSync } from '../services/ibgeService';
import { AdminLogin } from './AdminLogin';
import { InsertInlineImageModal } from './InsertInlineImageModal';
import { ArticleContentRenderer } from './ArticleContentRenderer';
import { 
  PlusCircle, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  AlertCircle, 
  Image as ImageIcon,
  Tag, 
  MapPin, 
  Bold, 
  Italic, 
  Heading, 
  Quote, 
  List, 
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Search,
  RefreshCw,
  LogOut,
  ShieldCheck,
  KeyRound,
  Lock,
  Layers,
  LayoutTemplate,
  Star,
  X
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Agronegócio & Campo', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Meio Ambiente & Rios', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cidades & Inovação', url: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cultura & Patrimônio', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
];

const CATEGORIES: NewsCategory[] = [
  'Geral',
  'Nacional',
  'Economia',
  'Agronegócio',
  'Política',
  'Cidades',
  'Meio Ambiente',
  'Cultura',
  'Tecnologia',
];

export const AdminPanel: React.FC = () => {
  const { 
    articles, 
    addArticle, 
    updateArticle, 
    deleteArticle, 
    setLeadArticle,
    openArticle, 
    setActiveView,
    isAdminAuthenticated,
    adminUser,
    logoutAdmin,
    updateAdminPassword
  } = useNews();

  // If user is not logged in, show the secure Admin Login
  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  // Active sub-tab in Admin: New/Edit post vs Management table
  const [activeAdminTab, setActiveAdminTab] = useState<'form' | 'table'>('form');

  // Form mode: edit text vs preview
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');

  // Inline Image Modal State
  const [isInlineImageModalOpen, setIsInlineImageModalOpen] = useState(false);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80');
  const [category, setCategory] = useState<NewsCategory>('Agronegócio');
  const [scope, setScope] = useState<ScopeType>('Municipal');
  const [selectedStateSigla, setSelectedStateSigla] = useState('SP');
  const [selectedCityName, setSelectedCityName] = useState('Campinas');
  const [customCity, setCustomCity] = useState('');
  const [authorName, setAuthorName] = useState(adminUser?.name || 'Redação Brasil & Interior');
  const [authorRole, setAuthorRole] = useState(adminUser?.role || 'Repórter Regional');
  const [tagInput, setTagInput] = useState('Interior, Desenvolvimento, Regional');
  const [readTimeMinutes, setReadTimeMinutes] = useState(4);
  const [isLead, setIsLead] = useState(false);

  // Success / error banner
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Management table search & filters
  const [tableSearch, setTableSearch] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState<'todos' | 'publicado' | 'rascunho'>('todos');

  // Available municipalities for selected state
  const [availableMunicipalities, setAvailableMunicipalities] = useState<string[]>(() => {
    return getMunicipiosSync(selectedStateSigla);
  });
  const [loadingMun, setLoadingMun] = useState(false);
  const [cityFilterTerm, setCityFilterTerm] = useState('');

  // Find current state object for cascading cities
  const currentStateObj = BRAZIL_STATES.find(s => s.sigla === selectedStateSigla) || BRAZIL_STATES[0];

  useEffect(() => {
    setLoadingMun(true);
    getMunicipiosPorEstado(selectedStateSigla, (list) => {
      setAvailableMunicipalities(list);
      setLoadingMun(false);
    }).finally(() => {
      setLoadingMun(false);
    });
  }, [selectedStateSigla]);

  const handleStateChange = (newSigla: string) => {
    setSelectedStateSigla(newSigla);
    const syncList = getMunicipiosSync(newSigla);
    setAvailableMunicipalities(syncList);
    if (syncList.length > 0) {
      setSelectedCityName(syncList[0]);
    }
    setCustomCity('');
    setCityFilterTerm('');
  };

  const handleInsertRichText = (tagType: 'bold' | 'italic' | 'h2' | 'quote' | 'list') => {
    let snippet = '';
    switch (tagType) {
      case 'bold':
        snippet = ' **texto em destaque** ';
        break;
      case 'italic':
        snippet = ' *texto itálico* ';
        break;
      case 'h2':
        snippet = '\n\n## Subtítulo da Seção\n';
        break;
      case 'quote':
        snippet = '\n\n> "Declaração ou citação do entrevistado"\n\n';
        break;
      case 'list':
        snippet = '\n- Ponto principal 1\n- Ponto principal 2\n- Ponto principal 3\n';
        break;
    }
    setContent(prev => prev + snippet);
  };

  // Insertion of inline image into text at cursor position
  const handleInsertInlineImage = (markdownSnippet: string) => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement | null;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = content;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const updated = before + markdownSnippet + after;
      setContent(updated);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + markdownSnippet.length, start + markdownSnippet.length);
      }, 50);
    } else {
      setContent(prev => prev + markdownSnippet);
    }
    setNotification({
      type: 'success',
      message: 'Fotografia inserida com sucesso no meio do texto da reportagem!'
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Detect inline images in content to provide quick visual management
  const detectedInlineImages = useMemo(() => {
    const regex = /!\[(.*?)\]\((.*?)\)/g;
    const matches: { caption: string; url: string; raw: string }[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        caption: match[1],
        url: match[2],
        raw: match[0],
      });
    }
    return matches;
  }, [content]);

  const handleRemoveInlineImage = (rawString: string) => {
    setContent(prev => prev.replace(rawString, '').trim());
    setNotification({
      type: 'success',
      message: 'Foto removida do meio do texto.',
    });
    setTimeout(() => setNotification(null), 2500);
  };

  const handleStartEdit = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setSubtitle(article.subtitle);
    setContent(article.content);
    setCoverImage(article.coverImage);
    setCategory(article.category);
    setScope(article.scope);
    if (article.stateSigla) setSelectedStateSigla(article.stateSigla);
    if (article.cityName) setSelectedCityName(article.cityName);
    setAuthorName(article.author.name);
    setAuthorRole(article.author.role);
    setTagInput(article.tags.join(', '));
    setReadTimeMinutes(article.readTimeMinutes);
    setIsLead(Boolean(article.isLead));
    setActiveAdminTab('form');
    setEditorMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80');
    setCategory('Agronegócio');
    setScope('Municipal');
    setSelectedStateSigla('SP');
    setSelectedCityName('Campinas');
    setCustomCity('');
    setAuthorName(adminUser?.name || 'Redação Brasil & Interior');
    setAuthorRole(adminUser?.role || 'Repórter Regional');
    setTagInput('Interior, Desenvolvimento, Regional');
    setReadTimeMinutes(4);
    setIsLead(false);
    setEditorMode('edit');
  };

  const handleSubmit = async (status: 'publicado' | 'rascunho') => {
    if (!title.trim() || !subtitle.trim() || !content.trim()) {
      setNotification({
        type: 'error',
        message: 'Por favor, preencha o Título, o Resumo e o Conteúdo da reportagem.',
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const stateObj = BRAZIL_STATES.find(s => s.sigla === selectedStateSigla);
    const finalCity = customCity.trim() || selectedCityName;

    const tagsArray = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const articleData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      content: content.trim(),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
      category,
      scope,
      stateSigla: scope !== 'Nacional' ? selectedStateSigla : undefined,
      stateName: scope !== 'Nacional' ? stateObj?.nome : undefined,
      cityName: scope === 'Municipal' ? finalCity : undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['Brasil', 'Interior'],
      readTimeMinutes: Number(readTimeMinutes) || 4,
      author: {
        name: authorName.trim() || 'Redação Regional',
        role: authorRole.trim() || 'Repórter',
      },
      status,
      isLead,
    };

    if (editingId) {
      await updateArticle(editingId, articleData);
      setNotification({
        type: 'success',
        message: `Reportagem atualizada com sucesso como "${status === 'publicado' ? 'Publicada' : 'Rascunho'}"!`,
      });
      setEditingId(null);
    } else {
      await addArticle(articleData);
      setNotification({
        type: 'success',
        message: `Nova reportagem cadastrada com sucesso como "${status === 'publicado' ? 'Publicada' : 'Rascunho'}"!`,
      });
    }

    resetForm();
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError('Preencha todos os campos da alteração de senha.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('A nova senha e a confirmação não coincidem.');
      return;
    }

    const res = updateAdminPassword(oldPassword, newPassword);
    if (res.success) {
      setIsPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNotification({
        type: 'success',
        message: 'Senha de administrador alterada com sucesso!',
      });
      setTimeout(() => setNotification(null), 4000);
    } else {
      setPassError(res.message || 'Erro ao alterar senha.');
    }
  };

  // Filtered management list
  const filteredArticles = articles.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      (a.cityName && a.cityName.toLowerCase().includes(tableSearch.toLowerCase())) ||
      (a.stateSigla && a.stateSigla.toLowerCase().includes(tableSearch.toLowerCase()));
    const matchesStatus =
      tableStatusFilter === 'todos' || a.status === tableStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner of Admin with Security Session Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        {/* Navigation & Session Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Portal Público</span>
          </button>

          {/* Logged in admin badge & actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conectado: <strong>{adminUser?.name || 'Administrador'}</strong> ({adminUser?.role})</span>
            </div>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-2.5 py-1 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
              title="Alterar senha de acesso"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Alterar Senha</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Deseja realmente encerrar a sessão administrativa?')) {
                  logoutAdmin();
                }
              }}
              className="px-2.5 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-red-200 dark:border-red-900/60 font-semibold"
              title="Encerrar sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Title and Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-stone-100">
              Painel Administrativo &amp; Redação
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Publicação de notícias, fotos no meio do texto, cobertura municipal encadeada e gestão editorial
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
            <button
              onClick={() => setActiveAdminTab('form')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeAdminTab === 'form'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>{editingId ? 'Editar Publicação' : 'Nova Notícia'}</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('table')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeAdminTab === 'table'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Gerenciar Publicações ({articles.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* TAB 1: FORMULÁRIO DE CADASTRO / EDIÇÃO */}
      {activeAdminTab === 'form' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200 dark:border-stone-800 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold font-editorial text-stone-900 dark:text-stone-100">
                {editingId ? 'Editar Reportagem Existente' : 'Cadastrar Nova Reportagem'}
              </h2>
              <p className="text-xs text-stone-500">
                Preencha os campos abaixo, adicione fotos ilustrativas no meio do texto e defina a localidade
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Editor Mode vs Live Preview */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setEditorMode('edit')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    editorMode === 'edit'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modo Edição</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    editorMode === 'preview'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Prévia da Notícia Diagramada</span>
                </button>
              </div>

              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-red-600 border border-stone-300 dark:border-stone-700 rounded-lg cursor-pointer"
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </div>

          {/* If Editor Mode is PREVIEW */}
          {editorMode === 'preview' ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                <span>Esta é a diagramação exata que os leitores verão no portal público, incluindo a imagem de capa e as fotos inseridas no meio do texto.</span>
                <button
                  onClick={() => setEditorMode('edit')}
                  className="font-bold underline cursor-pointer ml-2"
                >
                  Voltar a editar
                </button>
              </div>

              {/* Simulated Article Reader Preview */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-10 bg-white dark:bg-stone-900 max-w-3xl mx-auto shadow-sm">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase">{category}</span>
                    <span>·</span>
                    <span>{scope === 'Municipal' ? `${customCity || selectedCityName} (${selectedStateSigla})` : scope}</span>
                    <span>·</span>
                    <span>{readTimeMinutes} min de leitura</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-stone-100">
                    {title || 'Título da reportagem'}
                  </h1>

                  <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                    {subtitle || 'Resumo ou subtítulo da matéria jornalística.'}
                  </p>

                  <div className="py-3 border-y border-stone-200 dark:border-stone-800 text-xs text-stone-500 flex items-center justify-between">
                    <span>Por {authorName} ({authorRole})</span>
                    <span>Edição Digital</span>
                  </div>
                </div>

                {/* Cover image preview */}
                <div className="mb-8 rounded-xl overflow-hidden aspect-video bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                  <img src={coverImage} alt="Capa" className="w-full h-full object-cover" />
                </div>

                {/* Body Content with Inline Images */}
                <ArticleContentRenderer content={content} enableDropCap={true} />
              </div>
            </div>
          ) : (
            /* Standard FORM */
            <form onSubmit={e => e.preventDefault()} className="space-y-6">
              {/* Título da Notícia */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Título da Notícia (Manchete) *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Polo de irrigação sustentável gera 2 mil empregos no interior de Goiás"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              {/* Resumo / Subtítulo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Resumo / Subtítulo (Deck Jornalístico) *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Parceria entre cooperativas e centros de pesquisa impulsiona safras de grãos com certificação verde."
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              {/* Categoria & Abrangência Regional Encadeada */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 bg-stone-50/70 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800">
                {/* Categoria */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Editoria / Categoria
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as NewsCategory)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Abrangência: Nacional vs Estadual/Municipal */}
                <div className="md:col-span-8 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Abrangência Geográfica da Reportagem
                  </label>
                  
                  <div className="flex items-center gap-3">
                    {(['Municipal', 'Estadual', 'Nacional'] as ScopeType[]).map(sc => (
                      <label
                        key={sc}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                          scope === sc
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="scope"
                          checked={scope === sc}
                          onChange={() => setScope(sc)}
                          className="sr-only"
                        />
                        <span>{sc}</span>
                      </label>
                    ))}
                  </div>

                  {/* Seletor Encadeado de Estado e Município */}
                  {scope !== 'Nacional' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* Seletor de Estado */}
                      <div>
                        <span className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                          1º Passo: Escolha o Estado (UF)
                        </span>
                        <select
                          value={selectedStateSigla}
                          onChange={e => handleStateChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                        >
                          {BRAZIL_STATES.map(st => (
                            <option key={st.sigla} value={st.sigla}>
                              {st.sigla} - {st.nome} ({st.regiao})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Seletor Encadeado de Município com busca */}
                      {scope === 'Municipal' && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="block text-[11px] font-bold text-stone-600 dark:text-stone-400">
                              2º Passo: Município ({selectedStateSigla})
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {loadingMun ? 'Buscando IBGE...' : `${availableMunicipalities.length} municípios`}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                              <input
                                type="text"
                                placeholder="Filtrar lista de cidades..."
                                value={cityFilterTerm}
                                onChange={e => setCityFilterTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                              />
                            </div>

                            <select
                              value={selectedCityName}
                              onChange={e => {
                                setSelectedCityName(e.target.value);
                                setCustomCity('');
                              }}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-medium"
                            >
                              {availableMunicipalities
                                .filter(m => !cityFilterTerm || m.toLowerCase().includes(cityFilterTerm.toLowerCase()))
                                .map(mun => (
                                  <option key={mun} value={mun}>
                                    {mun}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div className="pt-1">
                            <input
                              type="text"
                              placeholder="Ou digite outro município / distrito específico..."
                              value={customCity}
                              onChange={e => setCustomCity(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-dashed border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Conteúdo Completo com Barra de Ferramentas Rich Text e Inserção de Imagens */}
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Conteúdo Completo da Reportagem *
                  </label>

                  {/* Toolbar for rich text formatting and inline images */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Botão de destaque: Inserir Foto no Texto */}
                    <button
                      type="button"
                      onClick={() => setIsInlineImageModalOpen(true)}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      title="Inserir fotografia com legenda fotográfica no meio do texto"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Inserir Foto no Texto</span>
                    </button>

                    <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleInsertRichText('bold')}
                        className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300"
                        title="Negrito"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertRichText('italic')}
                        className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300"
                        title="Itálico"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertRichText('h2')}
                        className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300"
                        title="Subtítulo H2"
                      >
                        <Heading className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertRichText('quote')}
                        className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300"
                        title="Citação"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertRichText('list')}
                        className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded text-stone-700 dark:text-stone-300"
                        title="Lista"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <textarea
                  id="content-textarea"
                  rows={9}
                  placeholder="Escreva os parágrafos da reportagem. Use o botão '+ Inserir Foto no Texto' para diagramar fotos entre os parágrafos..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 leading-relaxed font-sans"
                />

                {/* Inline Images Inspector in Text */}
                {detectedInlineImages.length > 0 && (
                  <div className="mt-3 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fotografias diagramadas no meio desta matéria ({detectedInlineImages.length}):</span>
                      </span>
                      <span className="text-[11px] text-stone-500 font-normal">Aparecerão entre os parágrafos</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {detectedInlineImages.map((img, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={img.url}
                              alt="Miniatura"
                              className="w-10 h-10 rounded object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                                {img.caption || 'Sem legenda informada'}
                              </p>
                              <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Foto #{i + 1} no corpo do texto</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveInlineImage(img.raw)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded cursor-pointer"
                            title="Remover esta foto do texto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload / URL de Imagem de Capa */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Imagem Principal de Capa (Header da Matéria)
                </label>

                {/* Preset images buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setCoverImage(preset.url)}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer ${
                        coverImage === preset.url
                          ? 'border-emerald-600 ring-2 ring-emerald-600/30 scale-[1.02]'
                          : 'border-stone-200 dark:border-stone-800 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-stone-950/40 flex items-end p-2">
                        <span className="text-[11px] font-semibold text-white leading-tight">
                          {preset.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* URL Custom Input */}
                <div className="relative">
                  <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Ou cole a URL direta da imagem de capa..."
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Autor, Tempo de Leitura e Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nome do Autor / Repórter
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={e => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Tempo Estimado (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={readTimeMinutes}
                    onChange={e => setReadTimeMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Opção de Destaque: Manchete Principal de Capa */}
              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isLead}
                    onChange={e => setIsLead(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 font-bold cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 uppercase tracking-wider">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>Definir como Manchete Principal de Capa</span>
                    </span>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                      Ao marcar esta opção, esta notícia assumirá a primeira posição em destaque principal da home page (substituindo a manchete anterior).
                    </p>
                  </div>
                </label>
              </div>

              {/* Ações: Publicar Notícia vs Salvar Rascunho */}
              <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl cursor-pointer flex items-center gap-1.5 border border-stone-300 dark:border-stone-700"
                >
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Ver Prévia Diagramada</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 rounded-xl cursor-pointer"
                  >
                    Limpar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmit('rascunho')}
                    className="px-5 py-2.5 text-xs font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Salvar Rascunho
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmit('publicado')}
                    className="px-6 py-2.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingId ? 'Atualizar e Publicar' : 'Publicar Notícia'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: TABELA DE GERENCIAMENTO DE NOTÍCIAS */}
      {activeAdminTab === 'table' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="text-xl font-bold font-editorial text-stone-900 dark:text-stone-100">
                Gerenciamento de Publicações
              </h2>
              <p className="text-xs text-stone-500">
                Visualize, filtre, edite ou exclua reportagens cadastradas no portal
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs">
                {(['todos', 'publicado', 'rascunho'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setTableStatusFilter(st)}
                    className={`px-3 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                      tableStatusFilter === st
                        ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Filtrar por título ou cidade..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                className="px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-800 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Título &amp; Região</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Abrangência</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredArticles.map(article => (
                  <tr key={article.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4 max-w-xs sm:max-w-sm">
                      <p className="font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {article.cityName ? `${article.cityName} - ${article.stateSigla}` : article.stateSigla ? `Estado ${article.stateSigla}` : 'Nacional'}
                      </p>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {article.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-stone-600 dark:text-stone-400">
                        {article.scope}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            article.status === 'publicado'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {article.status}
                        </span>

                        {article.isLead ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-stone-950 shadow-2xs">
                            <Star className="w-3 h-3 fill-stone-950" />
                            <span>Manchete Principal</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setLeadArticle(article.id);
                              setNotification({
                                type: 'success',
                                message: `Notícia "${article.title}" definida como manchete principal da capa!`,
                              });
                              setTimeout(() => setNotification(null), 3500);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 transition-colors cursor-pointer"
                            title="Destacar esta notícia como a manchete principal na capa do portal"
                          >
                            <Star className="w-3 h-3 text-amber-600" />
                            <span>Tornar Manchete</span>
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-stone-500 font-mono tabular-nums">
                      {new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => openArticle(article)}
                        className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-emerald-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                        title="Visualizar reportagem"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleStartEdit(article)}
                        className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-blue-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                        title="Editar reportagem"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja excluir a notícia "${article.title}"?`)) {
                            deleteArticle(article.id);
                          }
                        }}
                        className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-red-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                        title="Excluir reportagem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Inserir Foto no Meio do Texto */}
      <InsertInlineImageModal
        isOpen={isInlineImageModalOpen}
        onClose={() => setIsInlineImageModalOpen(false)}
        onInsert={handleInsertInlineImage}
      />

      {/* Modal: Alterar Senha de Acesso */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-base font-bold font-editorial text-stone-900 dark:text-stone-100">
                  Alterar Senha do Administrador
                </h3>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">
                {passError}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Senha Atual (Padrão: admin123)
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
                  placeholder="Digite a senha atual"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nova Senha (Mínimo 6 caracteres)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
                  placeholder="Digite a nova senha"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
                  placeholder="Repita a nova senha"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 cursor-pointer"
                >
                  Salvar Nova Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
