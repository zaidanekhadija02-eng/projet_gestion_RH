 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/AuthService';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      console.log('User:', user);

      localStorage.setItem('user', JSON.stringify(user));

      // Redirection selon le rôle
      if(user.role === 'admin') navigate('/admin-dashboard');
      else if(user.role === 'employe') navigate('/employe-dashboard');
      else navigate('/candidat-dashboard');
    } catch(err) {
      console.error(err);
      alert("Email ou mot de passe incorrect !");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Bienvenue</h1>
        <p className="login-subtitle">Connectez-vous pour continuer</p>
        
        {/* ✅ FIX: Add autocomplete="off" to form */}
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          
          <div className="input-group">
            <input 
              type="email" 
              name="login_email"  /* ✅ FIX: Unique name */
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              autoComplete="username"  /* ✅ FIX: Proper autocomplete */
              required
            />
            <label>Email</label>
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              name="login_password"  /* ✅ FIX: Unique name */
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              autoComplete="current-password"  /* ✅ FIX: Proper autocomplete */
              required
            />
            <label>Mot de passe</label>
          </div>
          
          <div className="forgot-password">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>
          
          <button type="submit" className="ripple">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;