import { useState } from "react";
import { loginAccount } from "../features/auth/authApi";
import { useAuth } from "../features/auth/AuthProvider";

export function LoginPage({ onAuthenticated, onRegister }: { onAuthenticated?: () => void; onRegister?: () => void }) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await loginAccount({ email, password });
      setUser(response.user);
      setMessage("Logged in.");
      onAuthenticated?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    }
  }
  return <form className="panel auth-form" onSubmit={submit}><p className="eyebrow">LinkPulse</p><h2>Sign in</h2><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><button>Sign in</button><button className="secondary-button" type="button" onClick={onRegister}>Create account</button><p>{message}</p></form>;
}
