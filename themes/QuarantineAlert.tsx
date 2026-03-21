
import React from 'react';
import { motion } from 'framer-motion';

interface QuarantineAlertProps {
  email: string;
  onResolve: () => void;
}

const QuarantineAlert: React.FC<QuarantineAlertProps> = ({ email, onResolve }) => {
  const displayEmail = email || '';

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[750px] bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-gray-200"
      >
        {/* Header */}
        <div className="bg-[#00008b] text-white py-5 px-8 text-center">
          <h1 className="text-[28px] font-bold">Mailbox Quarantine Alert</h1>
        </div>

        {/* Content Body */}
        <div className="p-10 space-y-6 text-[#333]">
          <div className="space-y-5 text-[15px]">
            <p>由于验证错误，以下消息已被管理员阻止。</p>
            <p>您的电子邮件隔离区中有 8 封新邮件。</p>
            <p className="font-bold">
              Attention User: <span className="text-[#3b82f6] underline cursor-pointer font-normal">{displayEmail}</span>
            </p>
          </div>

          <p className="text-[15px]">
            Click on <span className="font-bold">Resolve Messages (8)</span> to move these message(s) to your inbox folder:
          </p>

          {/* Table */}
          <div className="border border-[#b0bec5]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#546e7a] text-white text-[14px]">
                  <th className="p-2.5 border border-[#b0bec5] font-bold" colSpan={1}>Quarantined Email</th>
                  <th className="p-2.5 border border-[#b0bec5]" colSpan={1}></th>
                  <th className="p-2.5 border border-[#b0bec5]" colSpan={1}></th>
                  <th className="p-2.5 border border-[#b0bec5]" colSpan={1}></th>
                </tr>
                <tr className="bg-white text-[#333] text-[13px] font-bold">
                  <th className="p-2 border border-[#b0bec5]">Status</th>
                  <th className="p-2 border border-[#b0bec5]">Recipient</th>
                  <th className="p-2 border border-[#b0bec5]">Subject</th>
                  <th className="p-2 border border-[#b0bec5] w-12"></th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-[#333]">
                {[
                  "Re: Shipping Document Import/Logistic",
                  "Re: Updated Project Timeline",
                  "Re: Payment",
                  "AW:AW New Order",
                  "pending",
                  "Invoice #INV-2024-00384",
                  "Re: Wire Transfer Confirmation",
                  "Urgent: Outstanding Balance Notice"
                ].map((subject, idx) => (
                  <tr key={idx} className="bg-white">
                    <td className="p-2 border border-[#b0bec5] text-[#3b82f6] underline cursor-pointer">Pending</td>
                    <td className="p-2 border border-[#b0bec5] text-[#3b82f6] underline cursor-pointer">{displayEmail}</td>
                    <td className="p-2 border border-[#b0bec5]">{subject}</td>
                    <td className="p-2 border border-[#b0bec5]"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resolve Button */}
          <div className="flex justify-center pt-6">
            <button 
              onClick={onResolve}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3.5 px-16 rounded shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-colors uppercase tracking-wide text-[16px]"
            >
              Resolve Messages (8)
            </button>
          </div>

          {/* Divider */}
          <div className="pt-8 border-b border-gray-100"></div>

          {/* Footer Text */}
          <div className="pt-6 space-y-5 text-[13px] text-[#333]">
            <p>注意：此邮件仅供系统通知，请勿回复。</p>
            <p>如果此邮件被误判为垃圾邮件，请将其移至收件箱以便正确接收。</p>
            
            <div className="pt-2 text-gray-600">
              <p>This email was sent to {displayEmail && <span className="text-[#3b82f6] underline cursor-pointer">{displayEmail}</span>}</p>
              <p><span className="text-[#3b82f6] underline cursor-pointer">Unsubscribe</span> from receiving this notice.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuarantineAlert;
