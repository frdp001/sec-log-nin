
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-4 text-center bg-white border-t border-gray-50">
      <div className="max-w-[1000px] mx-auto space-y-6">
        <h3 className="text-[14px] font-bold text-gray-900 tracking-wider">About Us</h3>
        
        <div className="flex flex-wrap justify-center items-center text-[12px] text-gray-500 gap-x-6 gap-y-2 opacity-80">
          <a href="#" className="hover:text-[#f54c3e]">Alibaba Cloud</a>
          <a href="#" className="hover:text-[#f54c3e]">DingTalk</a>
          <a href="#" className="hover:text-[#f54c3e]">Wanwang</a>
          <a href="#" className="hover:text-[#f54c3e]">Alipay</a>
          <a href="#" className="hover:text-[#f54c3e]">Alibaba Group</a>
          <a href="#" className="hover:text-[#f54c3e]">Developer Community</a>
          <a href="#" className="hover:text-[#f54c3e]">Help Center</a>
          <a href="#" className="hover:text-[#f54c3e]">Alibaba Mail Personal Edition</a>
          <a href="#" className="hover:text-[#f54c3e]">Mail Push</a>
          <a href="#" className="hover:text-[#f54c3e]">DingStore</a>
        </div>

        <div className="text-[11px] text-gray-400 mt-4">
          2009-2026 Aliyun.com Copyright reserved ICP: 浙B2-20080101
        </div>
      </div>
    </footer>
  );
};

export default Footer;
