import { AuthShell } from "../features/auth/Components/AuthShared";
import { LoginForm } from "../features/auth/Components/LoginForm";


export function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your account">
      <LoginForm />
    </AuthShell>
  );
}