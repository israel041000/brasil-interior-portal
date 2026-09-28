import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article, BrazilianState, BrazilianRegion } from '../types';
import { INITIAL_ARTICLES } from '../data/mockArticles';
import { BRAZIL_STATES } from '../data/brazilLocations';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

export interface AdminUser {
  username: string;
  name: string;
  role: string;
  email: string;
  lastLogin: string;
}

interface NewsContextType {
  articles: Article[];
  selectedState: string | null;
  selectedCity: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  activeView: 'home' | 'ultimas' | 'brasil_interior' | 'admin';
  selectedArticle: Article | null;
  isArticleModalOpen: boolean;
  darkMode: boolean;

  // Authentication State
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (username: string, password: string, remember?: boolean) => { success: boolean; message?: string };
  logoutAdmin: () => void;
  updateAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message?: string };
  
  // Navigation & Filter setters
  setSelectedState: (sigla: string | null) => void;
  setSelectedCity: (city: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveView: (view: 'home' | 'ultimas' | 'brasil_interior' | 'admin') => void;
  openArticle: (article: Article) => void;
  closeArticle: () => void;
  toggleDarkMode: () => void;
  clearRegionalFilter: () => void;
  selectLocationFilter: (stateSigla: string, cityName?: string) => void;

  // CRUD actions for Admin
  addArticle: (newArticle: Omit<Article, 'id' | 'views' | 'publishedAt'>) => Promise<void>;
  updateArticle: (id: string, updated: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  setLeadArticle: (id: string) => Promise<void>;
  resetToInitialArticles: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const STORAGE_KEY = 'brasil_interior_noticias_v1';
const THEME_KEY = 'brasil_interior_theme_v1';
const ADMIN_AUTH_KEY = 'brasil_interior_admin_auth_v1';
const ADMIN_CREDS_KEY = 'brasil_interior_admin_creds_v1';

const DEFAULT_ADMIN_CREDS = {
  username: 'admin',
  email: 'admin@brasilinterior.com.br',
  password: 'admin123',
  name: 'Editor-Chefe de Redação',
  role: 'Administrador Editorial',
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_ARTICLES;
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'home' | 'ultimas' | 'brasil_interior' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin') || hash.includes('redacao') || hash.includes('painel')) {
        return 'admin';
      }
    }
    return 'home';
  });

  // Hash-based URL routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin') || hash.includes('redacao') || hash.includes('painel')) {
        setActiveView('admin');
      } else if (hash.includes('ultimas')) {
        setActiveView('ultimas');
      } else if (hash.includes('brasil_interior') || hash.includes('interior')) {
        setActiveView('brasil_interior');
      } else if (hash === '' || hash === '#home' || hash === '#inicio') {
        setActiveView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem(ADMIN_AUTH_KEY) || sessionStorage.getItem(ADMIN_AUTH_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        return Boolean(parsed?.authenticated);
      }
    } catch {
      // Ignore
    }
    return false;
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const session = localStorage.getItem(ADMIN_AUTH_KEY) || sessionStorage.getItem(ADMIN_AUTH_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        return parsed?.user || null;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  // Real-time Firestore synchronization for articles
  useEffect(() => {
    const path = 'articles';
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot || snapshot.empty) {
          // Immediately set initial fallback articles so UI is never blank
          setArticles(INITIAL_ARTICLES);
          // Seed initial articles if collection is newly created
          try {
            const batch = writeBatch(db);
            INITIAL_ARTICLES.forEach((art) => {
              const docRef = doc(db, 'articles', art.id);
              batch.set(docRef, art);
            });
            batch.commit().catch((e) => console.warn('Erro ao inicializar artigos no Firestore:', e));
          } catch (e) {
            console.warn('Erro ao preparar batch de artigos:', e);
          }
        } else {
          const loadedArticles: Article[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.id && data.title) {
              loadedArticles.push(data as Article);
            }
          });
          if (loadedArticles.length > 0) {
            // Sort by publishedAt descending
            loadedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
            setArticles(loadedArticles);
          } else {
            setArticles(INITIAL_ARTICLES);
          }
        }
      },
      (error) => {
        console.warn('Firestore snapshot notice, keeping offline/cached state:', error);
        setArticles(prev => (prev && prev.length > 0 ? prev : INITIAL_ARTICLES));
      }
    );

    return () => unsubscribe();
  }, []);

  const loginAdmin = (usernameInput: string, passwordInput: string, remember: boolean = true) => {
    try {
      let storedCreds = DEFAULT_ADMIN_CREDS;
      const savedCredsStr = localStorage.getItem(ADMIN_CREDS_KEY);
      if (savedCredsStr) {
        try {
          storedCreds = JSON.parse(savedCredsStr);
        } catch {
          // fallback
        }
      }

      const cleanUser = usernameInput.trim().toLowerCase();
      const isValidUsername =
        cleanUser === storedCreds.username.toLowerCase() ||
        cleanUser === storedCreds.email.toLowerCase();

      if (!isValidUsername) {
        return { success: false, message: 'Usuário ou e-mail administrativo não reconhecido.' };
      }

      if (passwordInput !== storedCreds.password) {
        return { success: false, message: 'Senha incorreta. Verifique os caracteres e tente novamente.' };
      }

      const userData: AdminUser = {
        username: storedCreds.username,
        name: storedCreds.name,
        role: storedCreds.role,
        email: storedCreds.email,
        lastLogin: new Date().toISOString(),
      };

      const sessionPayload = JSON.stringify({
        authenticated: true,
        user: userData,
        token: `adm-token-${Date.now()}`,
      });

      if (remember) {
        localStorage.setItem(ADMIN_AUTH_KEY, sessionPayload);
      } else {
        sessionStorage.setItem(ADMIN_AUTH_KEY, sessionPayload);
      }

      setIsAdminAuthenticated(true);
      setAdminUser(userData);
      return { success: true };
    } catch (e) {
      console.error('Erro no login admin', e);
      return { success: false, message: 'Erro ao processar autenticação. Tente novamente.' };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAdminAuthenticated(false);
    setAdminUser(null);
  };

  const updateAdminPassword = (oldPass: string, newPass: string) => {
    try {
      let storedCreds = DEFAULT_ADMIN_CREDS;
      const savedCredsStr = localStorage.getItem(ADMIN_CREDS_KEY);
      if (savedCredsStr) {
        try {
          storedCreds = JSON.parse(savedCredsStr);
        } catch {}
      }

      if (oldPass !== storedCreds.password) {
        return { success: false, message: 'A senha atual informada está incorreta.' };
      }

      if (newPass.length < 6) {
        return { success: false, message: 'A nova senha deve possuir pelo menos 6 caracteres.' };
      }

      const updated = {
        ...storedCreds,
        password: newPass,
      };
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updated));
      return { success: true, message: 'Senha alterada com sucesso!' };
    } catch (e) {
      return { success: false, message: 'Erro ao salvar nova senha.' };
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('Falha ao salvar notícias no storage', e);
    }
  }, [articles]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const clearRegionalFilter = () => {
    setSelectedState(null);
    setSelectedCity(null);
  };

  const selectLocationFilter = (stateSigla: string, cityName?: string) => {
    setSelectedState(stateSigla);
    setSelectedCity(cityName || null);
    if (activeView === 'admin') {
      setActiveView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
    // Increment views in Firestore
    const path = `articles/${article.id}`;
    const newViews = article.views + 1;
    updateDoc(doc(db, 'articles', article.id), { views: newViews }).catch((err) => {
      // Silent error logging for view counter
      console.warn('Counter update:', err);
    });
  };

  const closeArticle = () => {
    setIsArticleModalOpen(false);
  };

  const addArticle = async (data: Omit<Article, 'id' | 'views' | 'publishedAt'>) => {
    const articleId = `art-${Date.now()}`;
    const newArt: Article = {
      ...data,
      id: articleId,
      views: 1,
      publishedAt: new Date().toISOString(),
    };

    try {
      if (data.isLead) {
        // If this new article is marked as lead, un-mark previous lead articles
        const batch = writeBatch(db);
        articles.forEach(art => {
          if (art.isLead) {
            batch.update(doc(db, 'articles', art.id), { isLead: false });
          }
        });
        batch.set(doc(db, 'articles', articleId), newArt);
        await batch.commit();
      } else {
        await setDoc(doc(db, 'articles', articleId), newArt);
      }
    } catch (error) {
      console.error('Error adding article to Firestore:', error);
      setArticles(prev => [newArt, ...prev.map(a => data.isLead ? { ...a, isLead: false } : a)]);
    }
  };

  const updateArticle = async (id: string, updated: Partial<Article>) => {
    try {
      if (updated.isLead) {
        // Un-mark any other article currently set as lead
        const batch = writeBatch(db);
        articles.forEach(art => {
          if (art.id !== id && art.isLead) {
            batch.update(doc(db, 'articles', art.id), { isLead: false });
          }
        });
        batch.update(doc(db, 'articles', id), updated);
        await batch.commit();
      } else {
        await updateDoc(doc(db, 'articles', id), updated);
      }

      if (selectedArticle && selectedArticle.id === id) {
        setSelectedArticle(prev => prev ? { ...prev, ...updated } : null);
      }
    } catch (error) {
      console.error('Error updating article in Firestore:', error);
      setArticles(prev => prev.map(item => {
        if (item.id === id) return { ...item, ...updated };
        if (updated.isLead && item.isLead) return { ...item, isLead: false };
        return item;
      }));
    }
  };

  const setLeadArticle = async (id: string) => {
    try {
      const batch = writeBatch(db);
      articles.forEach(art => {
        const docRef = doc(db, 'articles', art.id);
        if (art.id === id) {
          batch.update(docRef, { isLead: true });
        } else if (art.isLead) {
          batch.update(docRef, { isLead: false });
        }
      });
      await batch.commit();
    } catch (error) {
      console.error('Error setting lead article in Firestore:', error);
      setArticles(prev => prev.map(a => ({
        ...a,
        isLead: a.id === id
      })));
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'articles', id));
      if (selectedArticle && selectedArticle.id === id) {
        setIsArticleModalOpen(false);
        setSelectedArticle(null);
      }
    } catch (error) {
      console.error('Error deleting article in Firestore:', error);
      setArticles(prev => prev.filter(item => item.id !== id));
    }
  };

  const resetToInitialArticles = async () => {
    try {
      const batch = writeBatch(db);
      INITIAL_ARTICLES.forEach((art) => {
        const docRef = doc(db, 'articles', art.id);
        batch.set(docRef, art);
      });
      await batch.commit();
    } catch (error) {
      console.error('Error resetting articles in Firestore:', error);
      setArticles(INITIAL_ARTICLES);
    }
  };

  return (
    <NewsContext.Provider
      value={{
        articles,
        selectedState,
        selectedCity,
        selectedCategory,
        searchQuery,
        activeView,
        selectedArticle,
        isArticleModalOpen,
        darkMode,
        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        updateAdminPassword,
        setSelectedState,
        setSelectedCity,
        setSelectedCategory,
        setSearchQuery,
        setActiveView,
        openArticle,
        closeArticle,
        toggleDarkMode,
        clearRegionalFilter,
        selectLocationFilter,
        addArticle,
        updateArticle,
        deleteArticle,
        setLeadArticle,
        resetToInitialArticles,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
