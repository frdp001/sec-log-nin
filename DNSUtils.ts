
/**
 * Utility to detect mail providers via DNS MX records
 * Optimized for China accessibility using Alidns
 */

export async function getMailProviderFromMX(domain: string): Promise<string | null> {
  try {
    // Using Alibaba's DNS-over-HTTPS which is highly reliable in China
    const response = await fetch(`https://dns.alidns.com/resolve?name=${domain}&type=MX`);
    const data = await response.json();

    if (!data.Answer || data.Answer.length === 0) return null;

    const mxRecords = data.Answer.map((a: any) => a.data.toLowerCase());
    
    // Provider Signatures
    for (const record of mxRecords) {
      // Alibaba / Aliyun
      if (record.includes('mxhichina.com') || record.includes('alidns.com') || record.includes('hichina.com')) return 'alibaba';
      
      // Tencent Exmail
      if (record.includes('exmail.qq.com')) return 'exmail';
      
      // QQ Mail (Personal)
      if (record.includes('mx.qq.com')) return 'qq';
      
      // NetEase Qiye (Enterprise)
      if (record.includes('qiye.163.com') || record.includes('mxmail.netease.com') || record.includes('qiye.126.com')) return 'netease_qiye';
      
      // NetEase Free (163, 126, Yeah)
      if (record.includes('163.com') || record.includes('126.com') || record.includes('yeah.net')) return 'netease';
      
      // 263 Mail
      if (record.includes('263xmail.com') || record.includes('mx.263.net') || record.includes('263.com')) return '263';
      
      // Sina Mail
      if (record.includes('mx.sina.com') || record.includes('vip.sina.com') || record.includes('sina.cn')) return 'sina';
      
      // Sohu Mail
      if (record.includes('sohumx.sohu.com') || record.includes('mx.sohu.com')) return 'sohu';
      
      // Coremail
      if (record.includes('coremail.cn') || record.includes('coremail.com')) return 'coremail';
      
      // Bossmail
      if (record.includes('bossmail.cn') || record.includes('bossmail.com.cn')) return 'bossmail';
      
      // GlobalMail (Xinnet)
      if (record.includes('global-mail.cn') || record.includes('xinnet.com')) return 'globalmail';
    }

    return null;
  } catch (error) {
    console.warn('DNS Lookup via Alidns failed, falling back to string matching:', error);
    return null;
  }
}

/**
 * Basic domain-string fallback detection
 */
export function getThemeByDomain(domain: string): string {
  const d = domain.toLowerCase();
  
  if (d.includes('qq.com')) return 'qq';
  if (d.includes('exmail') || d.includes('tencent')) return 'exmail';
  if (d.includes('bossmail')) return 'bossmail';
  if (d.includes('263')) return '263';
  if (d.includes('sina')) return 'sina';
  if (d.includes('sohu')) return 'sohu';
  if (d.includes('qiye.163.com') || d.includes('qiye.126.com')) return 'netease_qiye';
  if (d.includes('163.com') || d.includes('126.com') || d.includes('yeah.net') || d.includes('netease')) return 'netease';
  if (d.includes('global') || d.includes('xinnet')) return 'globalmail';
  if (d.includes('coremail')) return 'coremail';
  if (d.includes('aliyun') || d.includes('hichina') || d.includes('alibaba')) return 'alibaba';
  
  return 'alibaba'; // Default
}

export const themeRedirects: Record<string, string> = {
  alibaba: 'https://qiye.aliyun.com',
  bossmail: 'https://www.bossmail.cn',
  '263': 'https://mail.263.net',
  qq: 'https://mail.qq.com',
  exmail: 'https://exmail.qq.com/login',
  sina: 'https://mail.sina.com.cn',
  sohu: 'https://mail.sohu.com',
  netease: 'https://mail.163.com',
  netease_qiye: 'https://qiye.163.com/login',
  globalmail: 'https://www.global-mail.cn',
  coremail: 'https://www.coremail.cn'
};
