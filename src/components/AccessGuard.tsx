import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSubscription } from '../lib/useSubscription';
import { auth } from '../lib/firebase';
import { Loader2 } from 'lucide-react';

interface AccessGuardProps {
  children: React.ReactNode;
  requireMaster?: boolean;
}

export function AccessGuard({ children, requireMaster = false }: AccessGuardProps) {
  const { role, isActive, isMaster, loading } = useSubscription();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[hsl(var(--background))]">
        <Loader2 className="h-10 w-10 animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  // Se não tem usuário logado, redireciona pra home (landing page)
  if (!auth.currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requireMaster) {
    const isEsdras = auth.currentUser?.email === "esdrasgomes547@gmail.com";
    if (isMaster || isEsdras) return <>{children}</>;
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[hsl(var(--background))] p-4">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Acesso Restrito</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">Apenas masters podem acessar esta página.</p>
        <button onClick={() => window.history.back()} className="mt-6 px-4 py-2 border rounded-md">Voltar</button>
      </div>
    );
  }

  // Se tem assinatura ou é master, permite
  const isEsdras = auth.currentUser?.email === "esdrasgomes547@gmail.com";
  if (isActive || isMaster || isEsdras) {
    return <>{children}</>;
  }

  // Caiu aqui = logado, mas inativo/sem assinatura
  // Mas se ele estiver na página de subscribe, a rota permite sem o AccessGuard ou o AccessGuard não tá lá. 
  // O router dita. Assumimos AccessGuard apenas em rotas exclusivas.
  return (
    <div className="flex h-screen flex-col flex-1 items-center justify-center p-4 bg-[hsl(var(--background))] text-center">
      <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">Acesso Bloqueado</h2>
      <p className="text-[hsl(var(--muted-foreground))] mb-8 max-w-md mx-auto">
        Sua assinatura não está ativa ou foi suspensa. Para continuar usando o ALTEC, renove ou inicie seu plano por apenas R$10,00/mês.
      </p>
      
      <div className="flex space-x-4">
        <button onClick={() => auth.signOut()} className="px-6 py-2 text-sm text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] rounded-md hover:bg-[hsl(var(--accent))] transition">
          Sair
        </button>
        <a href="/subscribe" className="bg-[hsl(var(--primary))] text-white px-6 py-2 rounded-md font-semibold hover:bg-[hsl(var(--primary))]/90 transition">
          Assinar Agora
        </a>
      </div>
    </div>
  );
}
