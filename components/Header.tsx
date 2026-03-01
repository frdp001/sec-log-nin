
import React from 'react';
import { useTranslation } from './LanguageProvider';

const Header: React.FC = () => {
  const { lang, setLang } = useTranslation();

  return (
    <header className="w-full px-6 py-4 flex flex-col md:flex-row items-center justify-between max-w-[1200px] mx-auto bg-white">
      {/* Logo Section */}
      <div className="flex items-center mb-4 md:mb-0">
        <img 
          src="https://qiye.aliyun.com/static/0.2.9/images/forNetCN/logo.png" 
          alt="Aliyun Mail Logo" 
          className="h-10 object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Top Nav Links */}
      <nav className="flex flex-wrap justify-center items-center text-[12px] text-gray-500 space-x-6">
        <a href="#" className="hover:text-[#f54c3e] transition-colors font-medium">DingTalk</a>
        <a href="#" className="hover:text-[#f54c3e] transition-colors font-medium">Alibaba Mail</a>
        <a href="#" className="hover:text-[#f54c3e] transition-colors font-medium">Aliyun Mail Login</a>
        <a href="#" className="hover:text-[#f54c3e] transition-colors font-medium">Client Apps</a>
        <a href="#" className="hover:text-[#f54c3e] transition-colors font-medium">Help</a>
        
        <select 
          value={lang === 'zh' ? '简体中文' : 'English'}
          onChange={(e) => setLang(e.target.value === '简体中文' ? 'zh' : 'en')}
          className="ml-2 border border-gray-200 rounded px-1 py-0.5 bg-transparent text-gray-500 focus:outline-none cursor-pointer"
        >
          <option>English</option>
          <option>简体中文</option>
        </select>
      </nav>
    </header>
  );
};

export default Header;
