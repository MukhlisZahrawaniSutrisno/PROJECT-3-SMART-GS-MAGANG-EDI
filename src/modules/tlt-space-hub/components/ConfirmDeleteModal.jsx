import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container glass-card" style={{ maxWidth: '440px', textAlign: 'center', padding: '1.75rem 1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          background: 'var(--input-bg)',
          border: '1px solid var(--card-border)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 1.25rem auto',
          color: 'var(--primary-red)'
        }}>
          <AlertTriangle size={28} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.5rem' }}>
          {title || 'Konfirmasi Penghapusan Data'}
        </h3>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '0.5rem' }}>
          {message || 'Apakah Anda yakin ingin menghapus data ini?'}
        </p>

        <p style={{ fontSize: '0.75rem', color: 'var(--primary-red)', fontWeight: 600, marginBottom: '1.5rem' }}>
          ⚠️ Perhatian: Data yang telah dihapus tidak dapat dikembalikan.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-secondary"
            style={{ minWidth: '110px' }}
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="btn btn-primary"
            style={{ 
              minWidth: '130px', 
              background: 'var(--primary-red)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Trash2 size={16} /> Ya, Hapus
          </button>
        </div>

      </div>
    </div>
  );
}
