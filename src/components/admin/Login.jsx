// ===============================
// ADMIN LOGIN - Page de connexion admin
// ===============================
import { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/admin.css';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple password check
    if (password === 'adel-mehh6') {
      // Store login state in localStorage
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      onLogin();
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Administration</h1>
          <p>Connexion requise</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-input-group">
            <label htmlFor="password">
              <FaLock />
              Mot de passe
            </label>
            <div className="admin-password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                required
                autoFocus
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-login-btn"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Accès réservé aux administrateurs</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 