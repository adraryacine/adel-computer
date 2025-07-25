import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import '../../styles/admin.css'; // Corrected path to admin CSS

const emailValidationMessages = [
  {
    test: (email) => email.includes('@'),
    message: "L'email doit contenir le symbole @",
  },
  {
    test: (email) => email.split('@')[1]?.includes('.'),
    message: "Le domaine doit contenir un point (ex: .com, .fr)",
  },
  // Add more rules as needed
];

function validateEmail(email) {
  for (const rule of emailValidationMessages) {
    if (!rule.test(email)) {
      return rule.message;
    }
  }
  return '';
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function passwordStrengthLabel(score) {
  if (score <= 2) return 'Faible';
  if (score === 3 || score === 4) return 'Moyen';
  if (score === 5) return 'Fort';
  return '';
}

import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AccountCreation({ onAccountCreated }) {
  const [tab, setTab] = useState('create');
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginShowPassword, setLoginShowPassword] = useState(false);

  const handleLoginEmailChange = (e) => {
    setLoginEmail(e.target.value);
    setLoginEmailError(validateEmail(e.target.value));
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (loginEmailError) return;
    setLoginSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        setLoginError('Email ou mot de passe incorrect');
        setLoginSubmitting(false);
        return;
      }
      setLoginError('');
      setLoginSubmitting(false);
      if (onAccountCreated) onAccountCreated();
    } catch (err) {
      setLoginError('Erreur de connexion');
      setLoginSubmitting(false);
    }
  };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activationSent, setActivationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    const score = getPasswordStrength(pwd);
    setPasswordStrength(score);
    setPasswordError(score < 3 ? 'Mot de passe trop faible' : '');
  };

  const handlePassword2Change = (e) => {
    setPassword2(e.target.value);
    setPasswordMatchError(e.target.value !== password ? 'Les mots de passe ne correspondent pas' : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError || passwordMatchError) return;
    setSubmitting(true);
    console.log('[DEBUG] Attempting registration with:', { email, password, name });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin + '/admin',
        },
      });
      console.log('[DEBUG] Supabase signUp response:', { data, error });
      if (error) {
        setSubmitting(false);
        setSuccess(false);
        setActivationSent(false);
        setEmailError(error.message);
        console.error('[DEBUG] Registration error:', error);
        return;
      }
      setSuccess(true);
      setActivationSent(true);
      setSubmitting(false);
      if (onAccountCreated) onAccountCreated();
      console.log('[DEBUG] Registration successful. Data:', data);
    } catch (err) {
      setSubmitting(false);
      setSuccess(false);
      setActivationSent(false);
      setEmailError(err.message || 'Erreur lors de la création du compte');
      console.error('[DEBUG] Registration exception:', err);
    }
  };

  return (
    <div className="account-creation-bg">
      <div className="account-creation-card">
        <div className="account-creation-tabs">
          <button
            className={`account-creation-tab-btn${tab === 'create' ? ' active' : ''}`}
            onClick={() => setTab('create')}
            type="button"
          >
            Créer un compte
          </button>
          <button
            className={`account-creation-tab-btn${tab === 'login' ? ' active' : ''}`}
            onClick={() => setTab('login')}
            type="button"
          >
            Se connecter
          </button>
        </div>
        <div className="account-creation-header">
          <FaUser className="account-creation-avatar" />
          <h2>{tab === 'create' ? 'Créer un compte administrateur' : 'Connexion administrateur'}</h2>
        </div>
        {tab === 'create' ? (
          success ? (
            <div className="success-message cool-success">
              <FaCheckCircle className="success-icon" />
              Compte créé ! Un email d'activation a été envoyé.
            </div>
          ) : (
            <form className="account-creation-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="account-form-group">
              <label><FaUser /> Nom</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Votre nom" />
            </div>
            <div className="account-form-group">
              <label><FaEnvelope /> Email</label>
              <input type="email" value={email} onChange={handleEmailChange} required placeholder="exemple@email.com" />
              {emailError && <div className="error-message cool-error">{emailError}</div>}
            </div>
            <div className="account-form-group">
              <label><FaLock /> Mot de passe</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Créer un mot de passe fort"
                  className={passwordStrength < 3 ? 'weak-password' : passwordStrength === 5 ? 'strong-password' : ''}
                />
                <span className="toggle-password" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className={`password-strength cool-strength ${passwordStrength < 3 ? 'weak' : passwordStrength === 5 ? 'strong' : 'medium'}`}>
                Force: {passwordStrengthLabel(passwordStrength)}
              </div>
              {passwordError && <div className="error-message cool-error">{passwordError}</div>}
            </div>
            <div className="account-form-group">
              <label><FaLock /> Vérification du mot de passe</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  value={password2}
                  onChange={handlePassword2Change}
                  required
                  placeholder="Retapez le mot de passe"
                />
                <span className="toggle-password" onClick={() => setShowPassword2(v => !v)}>
                  {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordMatchError && <div className="error-message cool-error">{passwordMatchError}</div>}
            </div>
            <button type="submit" className="cool-btn" disabled={submitting || !!emailError || !!passwordError || !!passwordMatchError}>
              {submitting ? 'Création...' : 'Créer le compte'}
            </button>
          </form>
          )
        ) : null}
        {activationSent && (
          <div className="info-message cool-info">Vérifiez votre email pour activer le compte.</div>
        )}
        {tab === 'login' && (
          <form className="account-creation-form" onSubmit={handleLoginSubmit} autoComplete="off">
            <div className="account-form-group">
              <label><FaEnvelope /> Email</label>
              <input type="email" value={loginEmail} onChange={handleLoginEmailChange} required placeholder="exemple@email.com" />
              {loginEmailError && <div className="error-message cool-error">{loginEmailError}</div>}
            </div>
            <div className="account-form-group">
              <label><FaLock /> Mot de passe</label>
              <div className="password-input-wrapper">
                <input
                  type={loginShowPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={handleLoginPasswordChange}
                  required
                  placeholder="Votre mot de passe"
                />
                <span className="toggle-password" onClick={() => setLoginShowPassword(v => !v)}>
                  {loginShowPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {loginError && <div className="error-message cool-error">{loginError}</div>}
            </div>
            <button type="submit" className="cool-btn" disabled={loginSubmitting || !!loginEmailError}>
              {loginSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

