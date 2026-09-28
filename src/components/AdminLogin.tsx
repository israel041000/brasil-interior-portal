import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AdminLoginProps {
  onSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const { loginAdmin, setActiveView } = useNews();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password) {
      setErrorMsg('Informe o usuário/e-mail e a senha de acesso.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(username, password, rememberMe);
      setIsLoading(false);

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'Credenciais inválidas.');
      }
    }, 400);
  };

  const handleFillDemoCreds = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMsg(null);
  };

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Página Principal</span>
        </button>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 p-6 text-white text-center border-b border-stone-800 relative">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold block mb-1">
            Área de Acesso Restrito
          </span>
          <h2 className="text-xl font-bold font-editorial text-white">
            Redação &amp; Administração
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
            Faça login com suas credenciais para gerenciar, editar e publicar notícias
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Usuário ou E-mail
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Ex: admin ou seu e-mail"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                  autoFocus
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Senha de Acesso
                </label>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 dark:text-stone-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-700 focus:ring-emerald-700/30"
                />
                <span>Lembrar login neste navegador</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <span>Autenticando sessão...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Acessar Painel de Controle</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Quick-Fill helper */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Credenciais de Administrador:
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoCreds}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold text-[11px] cursor-pointer"
                >
                  Preencher dados
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-600 dark:text-stone-400">
                <div>Usuário: <strong className="text-stone-900 dark:text-stone-200 font-bold">admin</strong></div>
                <div>Senha: <strong className="text-stone-900 dark:text-stone-200 font-bold">admin123</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="px-6 py-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sessão protegida por token de verificação e auditoria de redação</span>
        </div>
      </div>
    </div>
  );
};
