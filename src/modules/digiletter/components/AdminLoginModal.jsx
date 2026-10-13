import React, { useState } from 'react';
import { X, Lock, User, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Otentikasi Username & Password Admin Sekdiv Telkom Regional 3
    if (username.trim() === 'admin' && password === 'sekdivReg3') {
      setError('');
      setUsername('');
      setPassword('');
      onLoginSuccess();
    } else {
      setError('Username atau Password Admin salah. Silakan periksa kembali.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container glass-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--input-bg)', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                Login Admin Sekdiv
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Akses internal Sekretariat Telkom Reg 3
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Field Username */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Username Admin</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Masukkan Username Admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                autoFocus
              />
            </div>
          </div>

          {/* Field Password */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Password Admin</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan Password Admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
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
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary-red)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 1 }}
            >
              Masuk Admin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
