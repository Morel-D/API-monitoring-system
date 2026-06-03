import { AuthShell } from "../features/auth/Components/AuthShared";
import { RegisterForm } from "../features/auth/Components/RegisterForm";


export function RegisterPage() {
  return (
    <AuthShell title="Create account" subtitle="Start monitoring your APIs">
      <RegisterForm />
    </AuthShell>
  );
}