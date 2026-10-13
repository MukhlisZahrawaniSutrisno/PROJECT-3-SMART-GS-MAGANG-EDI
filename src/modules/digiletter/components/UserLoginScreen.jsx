import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, ShieldCheck, ArrowRight, Sparkles, Sun, Moon, Eye, EyeOff } from 'lucide-react';


export default function UserLoginScreen({ onUserLoginSuccess, onOpenAdminLogin, theme, onToggleTheme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'admin'
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === 'user' && password === '123') {
      setError('');
      onUserLoginSuccess(username.trim());
    } else {
      setError('Username atau Password salah. Silakan periksa kembali.');
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminUsername.trim() === 'admin' && adminPassword === 'sekdivReg3') {
      setError('');
      onOpenAdminLogin(true); // Directly login as admin
    } else {
      setError('Username atau Password Admin Sekdiv salah. Silakan periksa kembali.');
    }
  };

  return (
    <div className="corporate-login-screen" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Top Header Floating Bar */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <button
          onClick={onToggleTheme}
          className="btn btn-secondary"
          title={theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}
        >
          {theme === 'light' ? (
            <Moon size={18} style={{ color: 'var(--text-main)' }} />
          ) : (
            <Sun size={18} style={{ color: 'var(--text-main)' }} />
          )}
        </button>
      </div>

      {/* Main Login Card */}
      <div 
        className="glass-card corporate-login-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--card-border)',
          background: 'var(--card-bg)',
          backdropFilter: 'none'
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.25rem',
            borderRadius: '8px',
            background: 'var(--card-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid var(--card-border)',
            padding: '8px'
          }}>
            <img 
              src="/telkom-icon.png" 
              alt="Telkom Indonesia" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span style="color:#e00000;font-weight:900;font-size:1.8rem;">T</span>';
              }}
            />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--primary-red)', border: '1px solid var(--card-border)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Sparkles size={13} /> TELKOM REGIONAL 3
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em', margin: '0.25rem 0' }}>
            DigiLetter Reg 3
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Portal Pengajuan & Monitoring Nomor Surat Sekretariat Divisi
          </p>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          background: 'var(--input-bg)',
          padding: '4px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid var(--card-border)'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('user'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.65rem 0',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              background: activeTab === 'user' ? 'var(--card-bg)' : 'transparent',
              color: activeTab === 'user' ? 'var(--primary-red)' : 'var(--text-muted)',
              boxShadow: activeTab === 'user' ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none'
            }}
          >
            <User size={16} />
            Login User
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.65rem 0',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              background: activeTab === 'admin' ? 'var(--card-bg)' : 'transparent',
              color: activeTab === 'admin' ? 'var(--primary-red)' : 'var(--text-muted)',
              boxShadow: activeTab === 'admin' ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none'
            }}
          >
            <ShieldCheck size={16} />
            Admin Sekdiv
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'var(--input-bg)',
            color: 'var(--text-muted)',
            border: '1px solid var(--card-border)',
            fontSize: '0.8125rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Login User */}
        {activeTab === 'user' ? (
          <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.8125rem', fontWeight: 600 }}>
                Username / NIK
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan Username / NIK"
                  className="form-input"
                  style={{ paddingLeft: '2.6rem' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.8125rem', fontWeight: 600 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  className="form-input"
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  aria-pressed={showPassword}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.9375rem',
                fontWeight: 700,
                borderRadius: '8px',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Masuk Dashboard
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          /* Form Login Admin Sekdiv */
          <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.8125rem', fontWeight: 600 }}>
                Username Admin
              </label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-red)' }} />
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Masukkan Username Admin"
                  className="form-input"
                  style={{ paddingLeft: '2.6rem' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.8125rem', fontWeight: 600 }}>
                Password Admin
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-red)' }} />
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Masukkan Password Admin"
                  className="form-input"
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword((visible) => !visible)}
                  aria-label={showAdminPassword ? 'Sembunyikan password admin' : 'Tampilkan password admin'}
                  aria-pressed={showAdminPassword}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}
                >
                  {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.9375rem',
                fontWeight: 700,
                borderRadius: '8px',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'var(--primary-red)',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer'
              }}
            >
              Masuk Mode Admin
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Footer info inside card */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Telkom Indonesia Regional 3 • Sekretariat Divisi
        </div>

      </div>
    </div>
  );
}
