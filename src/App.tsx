import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { Shipments } from "./pages/Shipments";
import { Suppliers } from "./pages/Suppliers";
import { Employees } from "./pages/Employees";
import { Settings } from "./pages/Settings";
import { Button } from "./components/ui/button";
import { Plus, Construction } from "lucide-react";
import { ThemeProvider } from "./components/ThemeProvider";
import { auth, signInWithGoogle } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { TecgasLogo } from "./components/TecgasLogo";

function UnderConstruction() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-[hsl(var(--muted-foreground))] p-6 relative">
      <div className="absolute top-0 right-0 p-4">
        <Button onClick={() => alert("Funcionalidade de adição estará disponível em breve!")}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-16 h-16 bg-[hsl(var(--muted))] rounded-2xl flex items-center justify-center mb-6">
          <Construction className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-[hsl(var(--foreground))]">Página em Construção</h2>
        <p className="mb-8">Este módulo ainda está sendo desenvolvido para suportar todas as operações logísticas da TECGAS.</p>
        <Button variant="outline" onClick={() => alert("Funcionalidade de adição estará disponível em breve!")}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Novo Registro
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="altec-theme">
        <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-4">
          <div className="max-w-md w-full text-center bg-[hsl(var(--card))] p-10 rounded-2xl shadow-2xl border border-[hsl(var(--border))] flex flex-col items-center">
            <div className="w-32 h-32 mb-6 shadow-xl rounded-full overflow-hidden">
              <TecgasLogo />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Login</h2>
              <p className="text-[hsl(var(--muted-foreground))] mt-2 mb-8">Gestão de Estoque e Logística</p>
            </div>
            <Button onClick={signInWithGoogle} className="w-full h-12 text-md font-semibold" size="lg">
              Entrar com Google
            </Button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="altec-theme">
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<UnderConstruction />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

