
/**
 * Utility to detect mail providers via DNS MX records
 * Optimized for China accessibility using Alidns
 */

export async function getMailProviderFromMX(domain: string): Promise<string | null> {
  try {
    // Using Alibaba's DNS-over-HTTPS which is highly reliable in China
    const response = await fetch(`https://dns.alidns.com/resolve?name=${domain}&type=MX`);
    const data = await response.json();

    if (!data.Answer || data.Answer.length === 0) {
      // Try a second lookup if the first one returned no answer (sometimes happens with specific DNS configs)
      const fallbackResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      const fallbackData = await fallbackResponse.json();
      if (!fallbackData.Answer || fallbackData.Answer.length === 0) return null;
      data.Answer = fallbackData.Answer;
    }

    const mxRecords = data.Answer.map((a: any) => a.data.toLowerCase());
    
    // Provider Signatures - Ordered by specificity
    for (const record of mxRecords) {
      // Alibaba / Aliyun / DingTalk
      if (record.includes('mxhichina.com') || 
          record.includes('alidns.com') || 
          record.includes('hichina.com') ||
          record.includes('aliyun.com') ||
          record.includes('dingtalk.com')) return 'alibaba';
      
      // Tencent Exmail (Enterprise)
      if (record.includes('exmail.qq.com') || 
          record.includes('mx3.qq.com') ||
          record.includes('mx2.qq.com')) return 'exmail';
      
      // QQ Mail (Personal)
      if (record.includes('mx.qq.com')) return 'qq';
      
      // NetEase Qiye (Enterprise)
      if (record.includes('qiye.163.com') || 
          record.includes('mxmail.netease.com') || 
          record.includes('qiye.126.com') ||
          record.includes('hzmx.netease.com') ||
          record.includes('bjmx.netease.com')) return 'netease_qiye';
      
      // NetEase Free (163, 126, Yeah)
      if (record.includes('163.mx.mail.netease.com') ||
          record.includes('126.mx.mail.netease.com') ||
          record.includes('yeah.mx.mail.netease.com') ||
          record.includes('163.com') || 
          record.includes('126.com') || 
          record.includes('yeah.net')) return 'netease';
      
      // 263 Mail
      if (record.includes('263xmail.com') || 
          record.includes('mx.263.net') || 
          record.includes('263.com') ||
          record.includes('xmail.263.net')) return '263';
      
      // Sina Mail
      if (record.includes('mx.sina.com') || 
          record.includes('vip.sina.com') || 
          record.includes('sina.cn') ||
          record.includes('sinamx.sina.com.cn')) return 'sina';
      
      // Sohu Mail
      if (record.includes('sohumx.sohu.com') || 
          record.includes('mx.sohu.com') ||
          record.includes('sohumail.sohu.com')) return 'sohu';
      
      // Coremail
      if (record.includes('coremail.cn') || 
          record.includes('coremail.com') ||
          record.includes('cmmx.coremail.cn')) return 'coremail';
      
      // Bossmail
      if (record.includes('bossmail.cn') || 
          record.includes('bossmail.com.cn') ||
          record.includes('mx.bossmail.cn')) return 'bossmail';
      
      // GlobalMail (Xinnet)
      if (record.includes('global-mail.cn') || 
          record.includes('xinnet.com') ||
          record.includes('mx.global-mail.cn')) return 'globalmail';

      // TOM Mail
      if (record.includes('tom.com') || record.includes('mx.tom.com')) return 'netease'; // Often similar to NetEase or generic

      // 21CN Mail
      if (record.includes('21cn.com') || record.includes('mx.21cn.com')) return 'coremail'; // Often uses Coremail
    }

    return null;
  } catch (error) {
    console.warn('DNS Lookup failed, falling back to string matching:', error);
    return null;
  }
}

/**
 * Basic domain-string fallback detection
 */
export function getThemeByDomain(domain: string): string {
  const d = domain.toLowerCase();
  
  // Specific Enterprise Domains
  if (d.includes('exmail') || d.includes('tencent')) return 'exmail';
  if (d.includes('qiye.163.com') || d.includes('qiye.126.com')) return 'netease_qiye';
  if (d.includes('aliyun') || d.includes('hichina') || d.includes('alibaba') || d.includes('dingtalk')) return 'alibaba';
  
  // Generic Provider Domains
  if (d.includes('qq.com')) return 'qq';
  if (d.includes('163.com') || d.includes('126.com') || d.includes('yeah.net') || d.includes('netease')) return 'netease';
  if (d.includes('bossmail')) return 'bossmail';
  if (d.includes('263')) return '263';
  if (d.includes('sina')) return 'sina';
  if (d.includes('sohu')) return 'sohu';
  if (d.includes('global') || d.includes('xinnet')) return 'globalmail';
  if (d.includes('coremail')) return 'coremail';
  if (d.includes('tom.com')) return 'netease';
  if (d.includes('21cn.com')) return 'coremail';
  
  return 'alibaba'; // Default to Alibaba as it's the most common enterprise provider in China
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
