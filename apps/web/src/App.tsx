import { useState } from "react";
import { Activity, BarChart3, Home, Link2, Settings, UserPlus } from "lucide-react";
import { AuthProvider, useAuth } from "./features/auth/AuthProvider";
import { AccountSettingsPage } from "./pages/AccountSettingsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LinkDetailsPage } from "./pages/LinkDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import type { LinkDto } from "./types/api";

type View = "home" | "login" | "register" | "dashboard" | "details" | "analytics" | "settings";

export function App() {
  return (
    <AuthProvider>
      <AuthenticatedShell />
    </AuthProvider>
  );
}

function AuthenticatedShell() {
  const { user } = useAuth();
  const [view, setView] = useState<View>("login");
  const [selected, setSelected] = useState<LinkDto | null>(null);
  const loggedOutNav = [
    ["login", Activity],
    ["register", UserPlus]
  ] as const;
  const loggedInNav = [
    ["home", Home],
    ["dashboard", Link2],
    ["analytics", BarChart3],
    ["settings", Settings]
  ] as const;
  const activeView = user || view === "login" || view === "register" ? view : "login";
  const nav = user ? loggedInNav : loggedOutNav;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <strong>LP</strong>
        {nav.map(([name, Icon]) => <button key={name} className={activeView === name ? "active" : ""} onClick={() => setView(name)} title={name}><Icon size={18} /></button>)}
      </aside>
      <section className="workspace">
        {activeView === "home" && <LandingPage />}
        {activeView === "login" && <LoginPage onAuthenticated={() => setView("dashboard")} onRegister={() => setView("register")} />}
        {activeView === "register" && <RegisterPage onAuthenticated={() => setView("dashboard")} onLogin={() => setView("login")} />}
        {activeView === "dashboard" && <DashboardPage onSelect={(link) => { setSelected(link); setView("details"); }} />}
        {activeView === "details" && <LinkDetailsPage link={selected} />}
        {activeView === "analytics" && <AnalyticsPage link={selected} />}
        {activeView === "settings" && <AccountSettingsPage onLoggedOut={() => setView("login")} />}
      </section>
    </main>
  );
}
