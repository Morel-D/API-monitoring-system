import { useRegister } from '../hooks/useRegister';
import { AuthField, AuthInput, AuthSubmitButton, AuthLink } from './AuthShared';

export function RegisterForm() {
  const { values, errors, loading, set, submit } = useRegister();

  return (
    <div className="space-y-4">

      <AuthField label="Name" error={errors.name}>
        <AuthInput
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          hasError={!!errors.name}
        />
      </AuthField>

      <AuthField label="Email" error={errors.email}>
        <AuthInput
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          hasError={!!errors.email}
        />
      </AuthField>

      <AuthField label="Password" error={errors.password}>
        <AuthInput
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => set('password', e.target.value)}
          hasError={!!errors.password}
        />
      </AuthField>

      <AuthSubmitButton
        loading={loading}
        onClick={submit}
        label="Create account"
        loadingLabel="Creating account…"
      />

      <AuthLink text="Already have an account?" linkText="Sign in" to="/login" />

    </div>
  );
}