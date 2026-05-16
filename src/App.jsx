import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, Check, RefreshCw, Trash2, Key, Clock, Search, ArrowRight, ShieldAlert } from 'lucide-react';
import { supabase } from './supabase';

// Secure Random Generator (CSPRNG)
const generateSecureString = (length) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnopqrstuvwxyz';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(array[i] % chars.length);
  }
  return result;
};

const generateSecureId = (length) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(array[i] % chars.length);
  }
  return result;
};

function App() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [viewNote, setViewNote] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [error, setError] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [isAccessing, setIsAccessing] = useState(false);

  // Check for note ID in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const encryptionKey = window.location.hash.substring(1);

    if (id && encryptionKey) {
      fetchNote(id, encryptionKey);
    }
  }, []);

  const fetchNote = async (id, encryptionKey) => {
    if (!supabase) {
      setError('Cấu hình Supabase bị thiếu. Vui lòng kiểm tra file .env');
      return;
    }
    
    // Validate ID format to prevent SQL injection or weird queries
    if (!/^[A-Z2-9]{6}$/.test(id)) {
      setError('Định dạng ID không hợp lệ.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('content, expires_at')
        .eq('short_id', id)
        .single();

      if (error) throw new Error('Mã không tồn tại hoặc ghi chú đã bị xóa.');
      
      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Ghi chú này đã hết hạn tự động.');
      }

      const bytes = CryptoJS.AES.decrypt(data.content, encryptionKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      if (!originalText) throw new Error('Khóa giải mã không chính xác.');

      setViewNote(originalText);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!content.trim()) return;
    
    // Security: Limit content length (max 100KB)
    if (content.length > 100000) {
      setError('Ghi chú quá dài (tối đa 100,000 ký tự).');
      return;
    }

    if (!supabase) {
      setError('Cấu hình Supabase bị thiếu. Vui lòng kiểm tra file .env');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const encryptionKey = generateSecureString(12);
      const shortId = generateSecureId(6);
      const ciphertext = CryptoJS.AES.encrypt(content, encryptionKey).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from('notes')
        .insert([{ 
          short_id: shortId, 
          content: ciphertext, 
          expires_at: expiresAt 
        }]);

      if (error) throw error;

      const combinedCode = `${shortId}-${encryptionKey}`;
      const shareUrl = `${window.location.origin}${window.location.pathname}?id=${shortId}#${encryptionKey}`;
      
      setResult({
        code: combinedCode,
        url: shareUrl
      });
      setContent('');
    } catch (err) {
      console.error(err);
      setError('Lỗi hệ thống khi lưu ghi chú. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessByCode = () => {
    const code = accessCode.trim();
    if (!code) return;
    
    const parts = code.split('-');
    if (parts.length !== 2 || parts[0].length !== 6) {
      setError('Định dạng mã không đúng (VD: A1B2C3-XXXX)');
      return;
    }
    
    fetchNote(parts[0], parts[1]);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  if (viewNote) {
    return (
      <div className="glass-card">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <ShieldAlert className="text-primary" /> Ghi chú an toàn
        </h1>
        <p className="subtitle">Nội dung đã được giải mã thành công.</p>
        
        <div style={{ position: 'relative' }}>
          <textarea readOnly value={viewNote} style={{ border: '1px solid var(--primary)' }} />
          <button 
            className="copy-btn" 
            style={{ position: 'absolute', top: '10px', right: '10px' }}
            onClick={() => copyToClipboard(viewNote, 'note')}
          >
            {copySuccess === 'note' ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <button className="btn btn-primary" onClick={() => window.location.href = window.location.origin + window.location.pathname}>
          <RefreshCw size={20} /> Tạo ghi chú mới
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h1>Fast Share Notes</h1>
      <p className="subtitle">Mã hóa AES-256, tự hủy sau 5 phút.</p>

      {!supabase && (
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', textAlign: 'left', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> Cấu hình chưa hoàn tất</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.8 }}>
            Bạn cần tạo file <strong>.env</strong> và điền thông tin Supabase để ứng dụng hoạt động.
          </p>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      {!result ? (
        <>
          <div className="tab-container" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            <button className="btn" style={{ background: isAccessing ? 'transparent' : 'rgba(16, 185, 129, 0.1)', flex: 1, color: isAccessing ? 'var(--text-secondary)' : 'var(--primary)' }} onClick={() => setIsAccessing(false)}>
              <Share2 size={18} /> Tạo Note
            </button>
            <button className="btn" style={{ background: !isAccessing ? 'transparent' : 'rgba(16, 185, 129, 0.1)', flex: 1, color: !isAccessing ? 'var(--text-secondary)' : 'var(--primary)' }} onClick={() => setIsAccessing(true)}>
              <Key size={18} /> Nhập Mã
            </button>
          </div>

          {!isAccessing ? (
            <>
              <textarea 
                placeholder="Nhập nội dung ghi chú tại đây..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Độ dài: {content.length} / 100,000</span>
                {content.length > 90000 && <span style={{ color: '#f87171' }}>Sắp đạt giới hạn!</span>}
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleShare}
                disabled={isLoading || !content.trim()}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <Share2 size={20} />}
                {isLoading ? 'Đang mã hóa...' : 'Chia sẻ an toàn'}
              </button>
            </>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Nhập mã (VD: A1B2C3-XXXX)" 
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '1.1rem',
                    outline: 'none',
                    marginBottom: '1.5rem'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAccessByCode()}
                />
                <Search style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', color: 'var(--text-secondary)' }} size={20} />
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleAccessByCode}
                disabled={isLoading || !accessCode.trim()}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                Giải mã ghi chú
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="results-area" style={{ paddingTop: '1rem' }}>
          <div className="badge" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={14} /> Tự hủy sau 5 phút
          </div>

          <div className="result-label">Mã truy cập an toàn</div>
          <div className="result-item">
            <span className="result-value" style={{ letterSpacing: '1px' }}>{result.code}</span>
            <button className="copy-btn" onClick={() => copyToClipboard(result.code, 'code')}>
              {copySuccess === 'code' ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <div className="result-label">Link giải mã tự động</div>
          <div className="result-item">
            <span className="result-value" style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
              {result.url}
            </span>
            <button className="copy-btn" onClick={() => copyToClipboard(result.url, 'url')}>
              {copySuccess === 'url' ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <div className="qr-container">
            <div className="qr-code">
              <QRCodeSVG value={result.url} size={150} />
            </div>
            <p className="result-label">Quét mã QR để xem nhanh</p>
          </div>

          <button 
            className="btn" 
            style={{ marginTop: '1rem', background: 'rgba(16, 185, 129, 0.05)', color: 'var(--text-secondary)' }}
            onClick={() => setResult(null)}
          >
            <RefreshCw size={20} /> Tạo ghi chú khác
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
