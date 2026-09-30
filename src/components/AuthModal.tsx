import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AuthUser } from '../types/travel';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const ACCOUNTS_STORAGE_KEY = 'world_explorer_auth_accounts_v1';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const accounts = getStoredAccounts();

    if (mode === 'signup') {
      const cleanName = name.trim();
      if (!cleanName) {
        setErrorMsg('Please enter your name to create an account.');
        return;
      }

      const existing = accounts.find((a) => a.email === cleanEmail);
      if (existing) {
        setErrorMsg('An account with this email already exists. Please log in.');
        return;
      }

      const newAcc: StoredAccount = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        passwordHash: btoa(password),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        ACCOUNTS_STORAGE_KEY,
        JSON.stringify([...accounts, newAcc])
      );

      onAuthenticated({
        id: newAcc.id,
        name: newAcc.name,
        email: newAcc.email,
        createdAt: newAcc.createdAt,
      });
      onClose();
    } else {
      const existing = accounts.find((a) => a.email === cleanEmail);
      if (!existing) {
        // Allow seamless sign-in or prompt if password doesn't match
        const inferredName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const autoAcc: StoredAccount = {
          id: `usr-${Date.now()}`,
          name:
            inferredName.charAt(0).toUpperCase() + inferredName.slice(1) ||
            'Explorer',
          email: cleanEmail,
          passwordHash: btoa(password),
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          ACCOUNTS_STORAGE_KEY,
          JSON.stringify([...accounts, autoAcc])
        );
        onAuthenticated({
          id: autoAcc.id,
          name: autoAcc.name,
          email: autoAcc.email,
          createdAt: autoAcc.createdAt,
        });
        onClose();
        return;
      }

      if (existing.passwordHash !== btoa(password)) {
        setErrorMsg('Incorrect password for this email account.');
        return;
      }

      onAuthenticated({
        id: existing.id,
        name: existing.name,
        email: existing.email,
        createdAt: existing.createdAt,
      });
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Sign In to World Explorer' : 'Sign Up for World Explorer'}
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-sky-700">
              World Explorer Account
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              {mode === 'login' ? 'Sign In with Email' : 'Create Traveler Account'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl my-4">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="auth-name-input"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="auth-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email-input"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="auth-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password-input"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              id="auth-password-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {mode === 'login' ? 'Sign In to World Explorer' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
