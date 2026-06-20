import { useState } from 'react';
import './Auth.css';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !password) {
      setError('Please fill in all military credentials.');
      return;
    }

    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/signup';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed. Try again.');
      }

      if (!isLogin) {
        // Enlistment success: do not log in automatically. Force manual login.
        setIsLogin(true);
        setPassword(''); // Clear password so they must enter it
        setError('Enlistment successful! Now enter your pass code to complete login.');
      } else {
        // Login success: pass user data back to parent app
        localStorage.setItem('scoutUser', JSON.stringify(data.user));
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-ambient-dust" />
      <div className="auth-panel animate-fade-in">
        <div className="auth-logo-wings">⸸</div>
        <h2 className="auth-title">WALL DEFENSE INTERCEPT</h2>
        <p className="auth-subtitle">IDENTIFY YOUR SCOUT REGIMENT STATUS</p>

        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab ${isLogin ? 'auth-tab--active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            LOGIN
          </button>
          <button 
            type="button" 
            className={`auth-tab ${!isLogin ? 'auth-tab--active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            ENLIST
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">SCOUT CODENAME</label>
            <input 
              type="text" 
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Eren Yeager"
              maxLength={24}
              required
              disabled={loading}
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">MILITARY PASSCODE</label>
            <input 
              type="password" 
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="auth-error animate-shake">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="auth-loading-spinner" />
            ) : (
              isLogin ? 'REQUEST RE-ENTRY' : 'OFFER YOUR HEART'
            )}
          </button>
        </form>

        <p className="auth-footer-notice">
          MILITARY POLICE SECURITY ENFORCEMENT &middot; YEAR 845
        </p>
      </div>
    </div>
  );
}
