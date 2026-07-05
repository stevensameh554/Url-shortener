import { LogOut } from "lucide-react";
import { logoutAccount } from "../features/auth/authApi";
import { useAuth } from "../features/auth/AuthProvider";

export function AccountSettingsPage({ onLoggedOut }: { onLoggedOut?: () => void }) {
  const { user, setUser } = useAuth();
  async function logout() {
    await logoutAccount();
    setUser(null);
    onLoggedOut?.();
  }
  return <section className="panel"><h2>Account</h2><p>{user?.email ?? "Not signed in"}</p><button onClick={logout}><LogOut size={16} /> Logout</button></section>;
}
