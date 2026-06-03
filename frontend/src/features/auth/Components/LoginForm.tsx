import { useLogin } from '../hooks/useLogin';
import { AuthField, AuthInput, AuthError, AuthSubmitButton, AuthLink } from './AuthShared';

export function LoginForm() {
  const { values, errors, serverError, loading, set, submit } = useLogin();

  return (
    <form onSubmit={submit} noValidate className="space-y-4">

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
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => set('password', e.target.value)}
          hasError={!!errors.password}
        />
      </AuthField>

      {serverError && <AuthError message={serverError} />}

      <AuthSubmitButton
        loading={loading}
        label="Sign in"
        loadingLabel="Signing in…"
      />

      <AuthLink text="Don't have an account?" linkText="Create one" to="/register" />

    </form>
  );
}