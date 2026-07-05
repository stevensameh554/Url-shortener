import { useState } from "react";
import { registerAccount } from "../features/auth/authApi";
import { useAuth } from "../features/auth/AuthProvider";

export function RegisterPage({ onAuthenticated, onLogin }: { onAuthenticated?: () => void; onLogin?: () => void }) {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await registerAccount(form);
      setUser(response.user);
      setMessage("Account created.");
      onAuthenticated?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed");
    }
  }
  return <form className="panel auth-form" onSubmit={submit}><p className="eyebrow">LinkPulse</p><h2>Sign up</h2><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" /><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" /><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" /><button>Create account</button><button className="secondary-button" type="button" onClick={onLogin}>I already have an account</button><p>{message}</p></form>;
}
