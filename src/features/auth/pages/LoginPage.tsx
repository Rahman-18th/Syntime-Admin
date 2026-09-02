import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginAdmin } from '../api/auth.api';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAdmin({
        email,
        password,
      });

      const roles =
        result.data.user.roles ?? [];

      const allowed =
        roles.includes('admin') ||
        roles.includes('hr');

      if (!allowed) {
        setError(
          'This account does not have admin access.',
        );

        return;
      }

      localStorage.setItem(
        'syntime_admin_token',
        result.data.token,
      );

      localStorage.setItem(
        'syntime_admin_user',
        JSON.stringify(result.data.user),
      );

      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : 'Login failed. Please try again.';

      setError(
        errorMessage,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f5f7f6',
        padding: '24px',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '18px',
          padding: '32px',
          boxShadow:
            '0 18px 50px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            marginBottom: '28px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 800,
            }}
          >
            SynTime Admin
          </h1>

          <p
            style={{
              marginTop: '8px',
              color: '#6b7280',
            }}
          >
            Sign in to manage attendance
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '12px',
                borderRadius: '10px',
                border:
                  '1px solid #d1d5db',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div
            style={{
              marginBottom: '18px',
            }}
          >
            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '12px',
                borderRadius: '10px',
                border:
                  '1px solid #d1d5db',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: '16px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#b91c1c',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              border: 0,
              borderRadius: '10px',
              background: '#2f6f5e',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isLoading
              ? 'Signing in...'
              : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}