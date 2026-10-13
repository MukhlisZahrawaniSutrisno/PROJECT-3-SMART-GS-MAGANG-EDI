import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PublicMonitoring from './components/PublicMonitoring';
import AdminMonitoring from './components/AdminMonitoring';
import RequestLetterModal from './components/RequestLetterModal';
import AdminApprovalModal from './components/AdminApprovalModal';
import AdminLoginModal from './components/AdminLoginModal';
import UserLoginScreen from './components/UserLoginScreen';
import ToastNotification from './components/ToastNotification';

import { MOCK_LETTTERS } from './data/mockData';
import { NATIONAL_HOLIDAYS, canUserEditLetter } from './utils/letterHelper';
import { 
  fetchLettersFromSheets, 
  saveLetterToSheets, 
  deleteLetterFromSheets 
} from './services/googleSheetsService';
import {
  fetchLettersFromSupabase,
  insertLetterToSupabase,
  updateLetterInSupabase,
  deleteLetterFromSupabase,
  subscribeToLetters,
  checkSupabaseStatus
} from './lib/supabase';

import ExportExcelModal from './components/ExportExcelModal';

const STORAGE_KEY_LETTERS = 'digiletter_letters';

export default function App({ onBackHome }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('digiletter_theme') || 'light');
  
  // Persist status User & Admin di sessionStorage
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    return sessionStorage.getItem('digiletter_user_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return sessionStorage.getItem('digiletter_current_user') || 'user';
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('digiletter_is_admin') === 'true';
  });

  const [letters, setLetters] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LETTERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState(null);
  
  const [selectedLetterForApproval, setSelectedLetterForApproval] = useState(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const showToast = (title, message, type = 'success') => {
    setToast({ isOpen: true, title, message, type });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  const isModalOpen = isRequestModalOpen || Boolean(selectedLetterForApproval) || isAdminLoginOpen || isExportModalOpen;
  const isModalOpenRef = React.useRef(isModalOpen);

  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  // Muat data langsung dari Google Sheets Database secara otomatis & real-time
  useEffect(() => {
    let lettersChannel = null;

    async function loadData(isBackground = false) {
      if (isBackground && isModalOpenRef.current) return;

      // 1. Ambil data aktual dari Google Sheets
      const sheetsData = await fetchLettersFromSheets();
      if (sheetsData !== null && Array.isArray(sheetsData)) {
        setLetters(sheetsData);
        localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(sheetsData));
        return;
      }

      // 2. Fallback ke Supabase jika Google Sheets belum merespon
      if (checkSupabaseStatus()) {
        const supabaseData = await fetchLettersFromSupabase();
        if (supabaseData !== null && Array.isArray(supabaseData)) {
          setLetters(supabaseData);
          localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(supabaseData));
        }
      }
    }

    loadData(false);

    if (checkSupabaseStatus()) {
      lettersChannel = subscribeToLetters(() => {
        loadData(true);
      });
    }

    // Auto-polling setiap 4 detik agar perubahan / penghapusan di spreadsheet langsung terupdate di web
    const intervalId = setInterval(() => {
      loadData(true);
    }, 4000);

    return () => {
      clearInterval(intervalId);
      if (lettersChannel && typeof lettersChannel.unsubscribe === 'function') {
        lettersChannel.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('digiletter_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleUserLoginSuccess = (username) => {
    setIsUserLoggedIn(true);
    setCurrentUser(username);
    sessionStorage.setItem('digiletter_user_logged_in', 'true');
    sessionStorage.setItem('digiletter_current_user', username);
    showToast('Login Berhasil', `Selamat datang di DigiLetter Reg 3, ${username}!`, 'success');
  };

  const handleUserLogout = () => {
    setIsUserLoggedIn(false);
    setCurrentUser('');
    sessionStorage.removeItem('digiletter_user_logged_in');
    sessionStorage.removeItem('digiletter_current_user');
    showToast('Logout User', 'Anda telah keluar dari aplikasi.', 'success');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem('digiletter_is_admin', 'true');
    setIsAdminLoginOpen(false);
    showToast('Login Admin Berhasil', 'Selamat datang di Mode Sekretariat Divisi Telkom Reg 3.', 'success');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setIsExportModalOpen(false);
    setSelectedLetterForApproval(null);
    setIsRequestModalOpen(false);
    setEditingLetter(null);
    sessionStorage.removeItem('digiletter_is_admin');
    showToast('Logout Admin', 'Anda telah keluar dari Mode Admin.', 'success');
  };

  const handleEditRequest = (letter) => {
    if (!isAdmin && !canUserEditLetter(letter)) return;
    setEditingLetter(letter);
    setIsRequestModalOpen(true);
  };

  // Submit Pengajuan Baru / Edit Publik
  const handleSubmitRequest = async (requestData) => {
    let updatedItem;
    let updatedLetters;
    if (editingLetter) {
      const currentLetter = letters.find(item => item.id === editingLetter.id);
      if (!currentLetter || (!isAdmin && !canUserEditLetter(currentLetter))) {
        showToast('Pengajuan Terkunci', 'Pengajuan ini sudah tidak dapat diedit.', 'error');
        return;
      }
      // Update data pengajuan lama
      updatedItem = { ...currentLetter, ...requestData };
      updatedLetters = letters.map(item => item.id === requestData.id ? updatedItem : item);
      setLetters(updatedLetters);
      localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(updatedLetters));
      showToast('Pengajuan Diperbarui', `Detail pengajuan perihal "${requestData.perihal}" telah diperbarui.`, 'success');
      
      // Sync update ke Supabase & Google Sheets
      await updateLetterInSupabase(updatedItem.id, updatedItem);
    } else {
      // Tambah pengajuan baru
      updatedItem = {
        ...requestData,
        nomor_surat: '-',
        no_agenda: null,
        takah: '-',
        status: 'Menunggu Persetujuan'
      };
      updatedLetters = [updatedItem, ...letters];
      setLetters(updatedLetters);
      localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(updatedLetters));
      showToast('Pengajuan Terkirim', `Pengajuan nomor surat perihal "${requestData.perihal}" berhasil terkirim.`, 'success');
      
      // Sync insert ke Supabase
      await insertLetterToSupabase(updatedItem);
    }
    setEditingLetter(null);

    // Sync item ke Google Sheets jika URL terkonfigurasi
    saveLetterToSheets(updatedItem);
  };

  // Membatalkan / Menghapus Pengajuan Surat
  const handleDeleteRequest = async (letterItem) => {
    const currentLetter = letters.find(item => item.id === letterItem.id);
    if (!currentLetter || (!isAdmin && !canUserEditLetter(currentLetter))) {
      showToast('Pengajuan Terkunci', 'Pengajuan ini sudah tidak dapat dihapus.', 'error');
      return false;
    }
    const isApproved = currentLetter.status === 'Disetujui' || (currentLetter.nomor_surat && currentLetter.nomor_surat !== '-');
    const confirmMessage = isApproved
      ? `Apakah Anda yakin ingin menghapus surat yang sudah terbit "${currentLetter.perihal}" (Nomor: ${currentLetter.nomor_surat || '-'})? Tindakan ini akan menghapusnya dari database.`
      : `Apakah Anda yakin ingin menghapus pengajuan surat perihal "${currentLetter.perihal}" oleh ${currentLetter.pic}?`;

    if (!window.confirm(confirmMessage)) return false;

    const updatedLetters = letters.filter(item => item.id !== letterItem.id);
    setLetters(updatedLetters);
    localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(updatedLetters));
    showToast('Surat Berhasil Dihapus', `Data surat "${currentLetter.perihal}" telah dihapus dari database.`, 'success');

    // Sync delete ke Supabase & Google Sheets
    await deleteLetterFromSupabase(letterItem.id);
    deleteLetterFromSheets(letterItem.id);
    return true;
  };

  // Hitung No. Agenda berdasarkan Tanggal TTD (EVP) dengan Penanganan Sisipan (105.1, 105.2, dst.)
  const getNextAgendaNo = (targetDateStr) => {
    if (!targetDateStr) {
      const existingAgendas = letters
        .map(l => l.no_agenda)
        .filter(n => Boolean(n) && n !== '-');
      return existingAgendas.length === 0 ? '58' : `${parseInt(existingAgendas[0]) + 1}`;
    }

    const d = new Date(targetDateStr);
    const targetYear = d.getFullYear();

    let workdayCount = 0;
    const targetDateObj = new Date(targetDateStr + 'T00:00:00');
    const startOfYearObj = new Date(targetYear, 0, 1);

    let curr = new Date(startOfYearObj);

    while (curr <= targetDateObj) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, '0');
      const day = String(curr.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayOfWeek = curr.getDay(); // 0 = Sun, 6 = Sat

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        if (!NATIONAL_HOLIDAYS.includes(dateStr)) {
          workdayCount++;
        }
      }
      curr.setDate(curr.getDate() + 1);
    }

    const baseSlotEnd = Math.max(5, workdayCount * 5); // Contoh: Tanggal 15 -> slot 101 sampai 105
    const slotStart = baseSlotEnd - 4;

    const usedAgendas = new Set(letters.map(l => String(l.no_agenda)).filter(Boolean));

    // Cari slot reguler yang masih kosong antara (baseSlotEnd - 4) sampai baseSlotEnd
    let slot = slotStart;
    while (usedAgendas.has(String(slot)) && slot <= baseSlotEnd) {
      slot++;
    }

    // Jika 5 slot reguler pada tanggal TTD tersebut SUDAH PENUH:
    if (slot > baseSlotEnd) {
      const baseMaxAgenda = String(baseSlotEnd); // misal "105"
      // Cari berapa banyak sisipan .1, .2 yang sudah ada untuk 105
      let subIndex = 1;
      while (usedAgendas.has(`${baseMaxAgenda}.${subIndex}`)) {
        subIndex++;
      }
      return `${baseMaxAgenda}.${subIndex}`; // Mengembalikan 105.1, 105.2, dst.
    }

    return String(slot);
  };

  // Verifikasi / Approve oleh Admin Sekdiv
  const handleConfirmApprove = async (updatedLetter) => {
    if (!isAdmin) return;
    const updated = letters.map(item => item.id === updatedLetter.id ? updatedLetter : item);
    setLetters(updated);
    localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(updated));

    const approved = updatedLetter.status === 'Disetujui';
    showToast(
      approved ? 'Nomor Surat Diterbitkan' : 'Status Pengajuan Diperbarui',
      approved
        ? `Pengajuan perihal "${updatedLetter.perihal}" telah disetujui dengan Nomor: ${updatedLetter.nomor_surat}`
        : `Pengajuan perihal "${updatedLetter.perihal}" berstatus ${updatedLetter.status}.`,
      'success'
    );

    // Sync ke Supabase & Google Sheets
    await updateLetterInSupabase(updatedLetter.id, updatedLetter);
    saveLetterToSheets(updatedLetter);
  };

  return (
    <div className="app-container" data-theme={theme}>
      <ToastNotification toast={toast} onClose={closeToast} />

      <Navbar
        isAdmin={isAdmin}
        isUserLoggedIn={isUserLoggedIn}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        onUserLogout={handleUserLogout}
        onOpenRequestModal={() => { setEditingLetter(null); setIsRequestModalOpen(true); }}
        onBackHome={onBackHome}
      />

      <main className="main-content">
        {isAdmin ? (
          <AdminMonitoring
            letters={letters}
            onOpenApprovalModal={setSelectedLetterForApproval}
            onEditRequest={handleEditRequest}
            onOpenRequestModal={() => { setEditingLetter(null); setIsRequestModalOpen(true); }}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        ) : (
          <PublicMonitoring
            letters={letters}
            onEditRequest={handleEditRequest}
            onDeleteRequest={handleDeleteRequest}
            onOpenRequestModal={() => { setEditingLetter(null); setIsRequestModalOpen(true); }}
          />
        )}
      </main>

      <RequestLetterModal
        isOpen={isRequestModalOpen}
        onClose={() => { setIsRequestModalOpen(false); setEditingLetter(null); }}
        onSubmitRequest={handleSubmitRequest}
        editData={editingLetter}
        onDeleteRequest={isAdmin ? handleDeleteRequest : undefined}
      />

      <AdminApprovalModal
        isOpen={Boolean(selectedLetterForApproval)}
        onClose={() => setSelectedLetterForApproval(null)}
        letter={selectedLetterForApproval}
        nextAgendaNo={selectedLetterForApproval ? getNextAgendaNo(selectedLetterForApproval.tanggal_ttd) : 1}
        onConfirmApprove={handleConfirmApprove}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      <ExportExcelModal
        isOpen={isAdmin && isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        letters={letters}
      />
    </div>
  );
}
