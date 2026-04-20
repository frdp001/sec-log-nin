
import React from 'react';
import { motion } from 'framer-motion';

interface QuarantineAlertProps {
  email: string;
  onResolve: () => void;
}

const QuarantineAlert: React.FC<QuarantineAlertProps> = ({ email, onResolve }) => {
  const displayEmail = email || 'user@example.com';

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[800px] bg-white shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#000080] text-white py-4 px-8 text-center">
          <h1 className="text-2xl font-bold tracking-wide">Mailbox Quarantine Alert</h1>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6 text-[#333]">
          <div className="space-y-4">
            <p className="text-[15px]">由于验证错误，以下消息已被管理员阻止。</p>
            <p className="text-[15px]">您的电子邮件隔离区中有 8 封新邮件。</p>
            <p className="text-[15px] font-bold">
              Attention User: <span className="text-[#0056b3] underline cursor-pointer">{displayEmail}</span>
            </p>
          </div>

          <p className="text-[15px] font-medium">
            Click on <span className="font-bold">Resolve Messages (8)</span> to move these message(s) to your inbox folder:
          </p>

          {/* Table */}
          <div className="border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#546e7a] text-white text-[14px]">
                  <th className="p-2 border border-gray-300 font-bold">Quarantined Email</th>
                  <th className="p-2 border border-gray-300 font-bold">Status</th>
                  <th className="p-2 border border-gray-300 font-bold">Recipient</th>
                  <th className="p-2 border border-gray-300 font-bold">Subject</th>
                  <th className="p-2 border border-gray-300 font-bold w-12"></th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  { subject: "Re: Shipping Document Import/Logistic" },
                  { subject: "Re: Updated Project Timeline" },
                  { subject: "" },
                  { subject: "Re: Payment" },
                  { subject: "AW:AW New Order" },
                  { subject: "pending" },
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {idx === 0 && (
                      <td rowSpan={6} className="p-2 border border-gray-300 align-top font-medium">
                        Quarantined Email
                      </td>
                    )}
                    <td className="p-2 border border-gray-300 text-[#0056b3] underline">Pending</td>
                    <td className="p-2 border border-gray-300 text-[#0056b3] underline">{displayEmail}</td>
                    <td className="p-2 border border-gray-300">{row.subject}</td>
                    <td className="p-2 border border-gray-300"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resolve Button */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={onResolve}
              className="bg-[#4da3ff] hover:bg-[#3b8ee6] text-white font-bold py-3 px-12 rounded shadow-md transition-colors uppercase tracking-wider text-[16px]"
            >
              Resolve Messages (8)
            </button>
          </div>

          {/* Footer Text */}
          <div className="pt-8 border-t border-gray-100 space-y-4 text-[13px] text-gray-600">
            <p>注意：此邮件仅供系统通知，请勿回复。</p>
            <p>如果此邮件被误判为垃圾邮件，请将其移至收件箱以便正确接收。</p>
            
            <div className="pt-2">
              <p>This email was sent to <span className="text-[#0056b3] underline cursor-pointer">{displayEmail}</span></p>
              <p className="text-[#0056b3] underline cursor-pointer">Unsubscribe</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuarantineAlert;
