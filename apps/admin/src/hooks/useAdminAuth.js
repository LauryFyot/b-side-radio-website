// Authentication state manager for the admin app.
// Restores Supabase sessions and exposes login/logout actions.
// Centralizes loading and login error handling for UI components.
import { useEffect, useState } from 'react';
import { hasSupabaseConfig } from '../lib/supabaseClient';
import { getCurrentUser, signInWithEmail, signOutUser } from '../lib/adminRepository';
function useAdminAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    let mounted = true;

    // On first render, verify env config and restore an existing Supabase session.
    async function init() {
      try {
        if (!hasSupabaseConfig) {
          throw new Error('Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in apps/admin/.env');
        }

        const user = await getCurrentUser();
        if (mounted) {
          setAdminUser(user);
        }
      } catch (error) {
        if (mounted) {
          setLoginError(error.message || 'Unable to initialize admin app.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(event) {
    // Login form submit -> authenticate against Supabase Auth.
    event.preventDefault();
    setLoginError('');

    try {
      setIsLoading(true);
      const user = await signInWithEmail(loginForm.email, loginForm.password);
      setAdminUser(user);
    } catch (error) {
      setLoginError(error.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    // Logout clears the remote session and local user state.
    await signOutUser();
    setAdminUser(null);
  }

  function updateLoginField(field, value) {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  }

  return {
    isLoading,
    adminUser,
    loginForm,
    loginError,
    login,
    logout,
    updateLoginField
  };
}

export default useAdminAuth;
