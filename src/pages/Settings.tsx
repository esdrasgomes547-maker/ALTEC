import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, User, Lock, Building, Truck, Globe, MapPin, CheckCircle2 } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    companyName: "Tecgas GLP Solutions",
    cnpj: "00.000.000/0001-00",
    email: "contato@tecgas.com.br",
    phone: "(11) 4002-8922",
    lowStockAlerts: true,
    shipmentUpdates: true,
    dailyEmail: false
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "default");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "settings/default");
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (section: string) => {
    try {
      await setDoc(doc(db, "settings", "default"), settings);
      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 2500);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "settings/default");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Gerencie as preferências da sua conta e configurações do sistema.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Building className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />
              Dados da Empresa
            </CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Informações globais da Tecgas e ALTEC.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                <input type="text" className="w-full h-10 px-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))]" value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CNPJ</label>
                <input type="text" className="w-full h-10 px-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))]" value={settings.cnpj} onChange={e => setSettings({...settings, cnpj: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email de Contato</label>
                <input type="email" className="w-full h-10 px-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))]" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone Principal</label>
                <input type="tel" className="w-full h-10 px-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))]" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
              </div>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Button onClick={() => handleSave('empresa')}>Salvar Informações</Button>
              {savedSection === 'empresa' && (
                <span className="flex items-center gap-1 text-sm text-emerald-600 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4" /> Salvo!
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />
              Preferências de Interface
            </CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Personalize a aparência do sistema para você.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Tema da Aplicação</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 ${theme === 'light' ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5' : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]'} transition-all`}
                >
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                       <div className="w-5 h-5 rounded-full bg-yellow-400"></div>
                    </div>
                    <span className="text-sm font-medium">Claro</span>
                  </div>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 ${theme === 'dark' ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5' : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]'} transition-all`}
                >
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 shadow-sm flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-blue-300 shadow-[0_0_10px_rgba(147,197,253,0.5)]"></div>
                    </div>
                    <span className="text-sm font-medium">Escuro</span>
                  </div>
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 ${theme === 'system' ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5' : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]'} transition-all`}
                >
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-slate-900 border border-gray-300 shadow-sm flex items-center justify-center">
                       <Globe className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium">Sistema</span>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bell className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />
              Notificações e Alertas
            </CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Configure como e quando você deseja ser notificado.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Alertas de Estoque Baixo</h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Receba notificações quando um produto atingir a quantidade mínima (CRÍTICO/WARNING).</p>
                </div>
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]" checked={settings.lowStockAlerts} onChange={e => setSettings({...settings, lowStockAlerts: e.target.checked})} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Atualizações de Expedição</h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Notificações sobre envios, alterações de status e entregas.</p>
                </div>
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]" checked={settings.shipmentUpdates} onChange={e => setSettings({...settings, shipmentUpdates: e.target.checked})} />
              </div>
              <div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-4">
                <div>
                  <h4 className="text-sm font-medium">Email Diário</h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Resumo diário do status do estoque e movimentos do dia.</p>
                </div>
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]" checked={settings.dailyEmail} onChange={e => setSettings({...settings, dailyEmail: e.target.checked})} />
              </div>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Button onClick={() => handleSave('notificacoes')}>Atualizar Preferências</Button>
              {savedSection === 'notificacoes' && (
                <span className="flex items-center gap-1 text-sm text-emerald-600 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4" /> Salvo!
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
