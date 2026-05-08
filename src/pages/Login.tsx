import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TecgasLogo } from '../components/TecgasLogo';
import { signInWithGoogle, loginWithEmail, auth, signInAnonymousUser } from '../lib/firebase';
import { Loader2, ShieldCheck, Mail, Lock, Chrome, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Chave Mestra do Criador
      if (formData.login === 'bresdrasalmox' && formData.password === 'Bresdras7507@') {
         localStorage.setItem('master_bypass', 'true');
         navigate('/app/dashboard');
         return;
      }

      // Login normal (email real)
      if (formData.login.includes('@')) {
        localStorage.removeItem('master_bypass');
        await loginWithEmail(formData.login, formData.password);
        navigate('/app/dashboard');
      } else {
        setError('Por favor, insira um e-mail válido ou use a Chave Mestra.');
      }
    } catch (err: any) {
      setError('Falha no login. Verifique suas credenciais.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('master_bypass');
      await signInWithGoogle();
      navigate('/app/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-4">
      <div className="w-full max-w-md space-y-8 bg-[hsl(var(--card))] p-8 rounded-2xl border border-[hsl(var(--border))] shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12">
              <TecgasLogo />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">Acesso ao Almox pro</h2>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">
            Entre para gerenciar sua operação
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition"
                placeholder="E-mail ou Login Mestre"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="block w-full pl-10 pr-10 py-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition"
                placeholder="Sua senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-lg font-semibold shadow-lg shadow-black/20"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[hsl(var(--border))]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))]">Ou continue com</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-11 flex items-center justify-center gap-2 border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              <Chrome className="h-5 w-5" />
              <span>Entrar com Google</span>
            </>
          )}
        </Button>

        <div className="mt-8 text-center">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Proteção de dados garantida pela infraestrutura Google Cloud & Firebase.
          </p>
        </div>
      </div>
    </div>
  );
}
