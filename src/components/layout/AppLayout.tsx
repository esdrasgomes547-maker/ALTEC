import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Truck, Users, Settings, Bell, Search, Menu, ChevronLeft, ChevronRight, Moon, Sun, HardHat } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { TecgasLogo } from "../TecgasLogo";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Estoque", path: "/inventory", icon: Package },
    { name: "Expedição", path: "/shipments", icon: Truck },
    { name: "Fornecedores", path: "/suppliers", icon: Users },
    { name: "Funcionários", path: "/employees", icon: HardHat },
    { name: "Configurações", path: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] transition-all duration-300 ease-in-out md:static",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
          isCollapsed && !isMobileOpen ? "md:w-20" : "md:w-64"
        )}
      >
        <div className={cn("h-16 flex items-center px-4 border-b border-[hsl(var(--border))]", isCollapsed && !isMobileOpen ? "justify-center" : "space-x-3")}>
          <div className="w-8 h-8 flex-shrink-0">
            <TecgasLogo />
          </div>
          {(!isCollapsed || isMobileOpen) && <span className="font-bold text-lg tracking-tight shrink-0">TECGAS</span>}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed && !isMobileOpen ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-colors",
                  isCollapsed && !isMobileOpen ? "justify-center p-3" : "px-3 py-2.5 space-x-3",
                  isActive 
                    ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]" 
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span className="truncate">{item.name}</span>}
              </Link>
            )
          })}
        </div>
        
        <div className={cn("p-4 border-t border-[hsl(var(--border))] flex items-center", isCollapsed && !isMobileOpen ? "justify-center px-2 flex-col space-y-4" : "justify-between")}>
          <div className={cn("flex items-center", isCollapsed && !isMobileOpen ? "" : "space-x-3")}>
            <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
              AD
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium leading-none truncate">Admin</span>
                <span className="text-xs text-[hsl(var(--muted-foreground))] mt-1 truncate">admin@tecgas.com.br</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-20 h-6 w-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-full items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-16 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden mr-4 p-2 -ml-2 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="hidden sm:flex items-center w-64 md:w-96 relative">
              <Search className="h-4 w-4 absolute left-3 text-[hsl(var(--muted-foreground))]" />
              <input 
                type="text" 
                placeholder="Buscar ordens, SKUs ou clientes..." 
                className="w-full h-9 pl-9 pr-4 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20 focus:border-[hsl(var(--primary))]"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              className="relative p-2 rounded-full hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Alternar Tema"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="sm:hidden relative p-2 rounded-full hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]">
              <Search className="h-5 w-5" />
            </button>
            <button className="relative p-2 rounded-full hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-[hsl(var(--destructive))] border-2 border-[hsl(var(--card))]"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(var(--card))] border-t border-[hsl(var(--border))] z-40 px-2 pb-safe">
          <div className="flex items-center justify-between h-16">
            {[
              { name: "Dashboard", path: "/", icon: LayoutDashboard },
              { name: "Estoque", path: "/inventory", icon: Package },
              { name: "Expedição", path: "/shipments", icon: Truck },
              { name: "Equipe", path: "/employees", icon: HardHat },
            ].map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full space-y-1 text-xs font-medium transition-colors",
                    isActive 
                      ? "text-[hsl(var(--primary))]" 
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "stroke-2" : "stroke-[1.5]")} />
                  <span className="truncate w-full text-center px-1">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
