import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, User, HardHat, FileText, Wrench, X, History, UserCheck, ShieldAlert, Trash2, Edit2 } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, onSnapshot, query, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

// Mock Data
const initialEmployees: any[] = [];

export function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEmpForm, setNewEmpForm] = useState({ name: "", role: "", age: 30 });

  useEffect(() => {
    const q = query(collection(db, "employees"));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEmployees(items);
      if(selectedEmployee) {
        const updated = items.find(i => i.id === selectedEmployee?.id);
        if(updated) setSelectedEmployee(updated);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "employees");
    });
    return () => unsub();
  }, [selectedEmployee?.id]); // Only depend on the ID to avoid infinite loops

  const handleEdit = (emp: any, e: any) => {
    e.stopPropagation();
    setEditingId(emp.id);
    setNewEmpForm({
      name: emp.name,
      role: emp.role || "",
      age: emp.age || 30
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEmployee = async () => {
    try {
      if (editingId) {
        // preserve the old status, equipment, requests
        await updateDoc(doc(db, "employees", editingId), newEmpForm);
      } else {
        const newId = `FUNC-${String(Math.floor(Math.random() * 1000) + 100).padStart(3, '0')}`;
        const newEmployee = {
          ...newEmpForm,
          status: "ACTIVE",
          equipment: [],
          requests: []
        };
        await setDoc(doc(db, "employees", newId), newEmployee);
      }
      setIsAddModalOpen(false);
      setEditingId(null);
      setNewEmpForm({ name: "", role: "", age: 30 });
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, `employees/${editingId || 'new'}`);
    }
  };

  const handleDelete = async (id: string, e: any) => {
    e.stopPropagation();
    if(confirm("Deseja apagar este funcionário?")) {
      try {
        await deleteDoc(doc(db, "employees", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `employees/${id}`);
      }
    }
  };

  const filteredData = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE': return <Badge variant="success">Ativo</Badge>;
      case 'INACTIVE': return <Badge variant="secondary">Inativo</Badge>;
      case 'ON_LEAVE': return <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/10">Afastado/Férias</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReqStatusBadge = (status: string) => {
    switch(status) {
      case 'APPROVED': return <Badge variant="success" className="text-[10px] px-1.5 py-0">Aprovado</Badge>;
      case 'PENDING': return <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-600 border-amber-500/30">Pendente</Badge>;
      case 'DELIVERED': return <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-blue-500">Entregue</Badge>;
      case 'REJECTED': return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Rejeitado</Badge>;
      default: return <Badge variant="outline" className="text-[10px] px-1.5 py-0">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Gerencie a equipe, distribuição de ferramentas, EPIs e requisições.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center space-x-2 w-full max-w-md relative">
            <Search className="h-4 w-4 absolute left-3 text-[hsl(var(--muted-foreground))]" />
            <input 
              type="text" 
              placeholder="Buscar por nome, função ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 focus:border-[hsl(var(--primary))]"
            />
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map(emp => (
              <Card key={emp.id} className="cursor-pointer hover:border-[hsl(var(--primary))]/50 transition-colors shadow-sm" onClick={() => setSelectedEmployee(emp)}>
                <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] flex items-center justify-center text-xl font-bold border border-[hsl(var(--primary))]/20">
                    {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{emp.name}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{emp.role}</p>
                    <div className="mt-1 flex items-center justify-center space-x-2">
                       <span className="text-xs font-mono bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded text-[hsl(var(--muted-foreground))]">{emp.id}</span>
                       {getStatusBadge(emp.status)}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]" onClick={(e) => handleEdit(emp, e)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={(e) => handleDelete(emp.id, e)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredData.length === 0 && (
              <div className="col-span-full py-12 text-center text-[hsl(var(--muted-foreground))]">
                Nenhum funcionário encontrado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-4xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row flex-wrap sm:flex-nowrap items-start sm:items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4 bg-[hsl(var(--muted))]/30 shrink-0 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center text-xl font-bold shadow-md">
                  {selectedEmployee.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">{selectedEmployee.name}</CardTitle>
                    {getStatusBadge(selectedEmployee.status)}
                  </div>
                  <p className="text-base flex items-center gap-2 mt-1 text-[hsl(var(--muted-foreground))]">
                    <UserCheck className="h-4 w-4" /> {selectedEmployee.role}
                    <span className="text-[hsl(var(--muted-foreground))]/50">•</span>
                    <span>{selectedEmployee.age} anos</span>
                    <span className="text-[hsl(var(--muted-foreground))]/50">•</span>
                    <span className="font-mono text-xs bg-[hsl(var(--background))] px-1.5 py-0.5 rounded border border-[hsl(var(--border))] text-[hsl(var(--foreground))]">{selectedEmployee.id}</span>
                  </p>
                </div>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-[hsl(var(--accent))] transition-colors absolute top-4 right-4 sm:relative sm:top-0 sm:right-0"
                onClick={() => setSelectedEmployee(null)}
              >
                <X className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
              </button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Equipment Section */}
                <div className="p-6 border-b md:border-b-0 md:border-r border-[hsl(var(--border))]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <HardHat className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />
                      Ferramentas & EPIs
                    </h3>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Atribuir
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedEmployee.equipment.map((eq: any) => (
                      <div key={eq.id} className="flex items-start p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[hsl(var(--primary))]/30 transition-colors">
                        <div className="mt-0.5 mr-3">
                          {eq.type === 'EPI' ? <ShieldAlert className="h-4 w-4 text-emerald-500" /> : 
                           eq.type === 'TOOL' ? <Wrench className="h-4 w-4 text-amber-500" /> : 
                           <FileText className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none mb-1">{eq.name}</p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">Código: {eq.id}</p>
                        </div>
                      </div>
                    ))}
                    {selectedEmployee.equipment.length === 0 && (
                      <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4 border border-dashed rounded-lg">
                        Nenhum equipamento atribuído.
                      </p>
                    )}
                  </div>
                </div>

                {/* Requests Section */}
                <div className="p-6 bg-[hsl(var(--muted))]/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />
                      Requisições
                    </h3>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Nova Requisição
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedEmployee.requests.map((req: any) => (
                      <div key={req.id} className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[hsl(var(--primary))]/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-semibold text-[hsl(var(--muted-foreground))]">{req.id}</span>
                          {getReqStatusBadge(req.status)}
                        </div>
                        <p className="text-sm font-medium">{req.item}</p>
                        <div className="mt-2 flex items-center text-xs text-[hsl(var(--muted-foreground))]">
                          <History className="h-3 w-3 mr-1" /> 
                          {new Date(req.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    ))}
                    {selectedEmployee.requests.length === 0 && (
                      <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4 border border-dashed rounded-lg">
                        Nenhuma requisição recente.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
              <CardTitle className="text-xl">{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</CardTitle>
              <button className="p-2 rounded-full hover:bg-[hsl(var(--accent))] transition-colors" onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
              </button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <input 
                  type="text" 
                  className="w-full h-10 px-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] focus:ring-2 focus:ring-[hsl(var(--primary))]/20 focus:border-[hsl(var(--primary))] outline-none transition-all"
                  placeholder="Ex: Carlos Silva"
                  value={newEmpForm.name}
                  onChange={(e) => setNewEmpForm({...newEmpForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cargo / Função</label>
                <input 
                  type="text" 
                  className="w-full h-10 px-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] focus:ring-2 focus:ring-[hsl(var(--primary))]/20 focus:border-[hsl(var(--primary))] outline-none transition-all"
                  placeholder="Ex: Técnico em GLP"
                  value={newEmpForm.role}
                  onChange={(e) => setNewEmpForm({...newEmpForm, role: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Idade</label>
                <input 
                  type="number" 
                  className="w-full h-10 px-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] focus:ring-2 focus:ring-[hsl(var(--primary))]/20 focus:border-[hsl(var(--primary))] outline-none transition-all"
                  value={newEmpForm.age}
                  onChange={(e) => setNewEmpForm({...newEmpForm, age: Number(e.target.value)})}
                />
              </div>
              <div className="pt-4 flex items-center justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveEmployee} disabled={!newEmpForm.name || !newEmpForm.role}>Salvar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
