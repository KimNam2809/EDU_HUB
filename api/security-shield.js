// EduHub Security Shield & Attack Detection Engine
// Detects SQLi, XSS, Path Traversal, Bot Scans, and dispatches email alerts to lekimnam2809@gmail.com

const ADMIN_EMAIL = 'lekimnam2809@gmail.com';

// Regular expressions for detecting malicious payloads
const THREAT_PATTERNS = {
  SQL_INJECTION: /(union\s+select|insert\s+into|drop\s+table|delete\s+from|update\s+\w+\s+set|--|\bexec\b|\bxp_cmdshell\b|information_schema|1\s*=\s*1|or\s+true\b|select\s+.*\s+from)/i,
  XSS_PAYLOAD: /(<script|javascript:|onerror\s*=|onload\s*=|document\.cookie|<iframe|<img\s+src\s*=\s*['"]?javascript:)/i,
  PATH_TRAVERSAL: /(\.\.\/|\.\.\\|\/etc\/passwd|win\.ini|\.env|\.git\/config|wp-admin|wp-login|actuator\/|phpmyadmin|\.aws)/i,
  MALICIOUS_BOT: /(sqlmap|nikto|burp|nmap|dirbuster|acunetix|masscan|wpscan|gobuster)/i
};

// Simple in-memory rate limiter for serverless instance (IP -> timestamps[])
const ipRequestHistory = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // Max 60 req/min per IP

/**
 * Inspects request headers, query parameters, and body for attack signatures
 * Returns { isMalicious: boolean, threatType?: string, payload?: string }
 */
export function inspectRequest(req) {
  const userAgent = req.headers['user-agent'] || '';
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  // 1. Check User-Agent for known scanning tools
  if (THREAT_PATTERNS.MALICIOUS_BOT.test(userAgent)) {
    return {
      isMalicious: true,
      threatType: 'MALICIOUS_SCANNER_BOT',
      payload: userAgent,
      clientIp
    };
  }

  // 2. Rate Limiting Check
  const now = Date.now();
  const timestamps = ipRequestHistory.get(clientIp) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  validTimestamps.push(now);
  ipRequestHistory.set(clientIp, validTimestamps);

  if (validTimestamps.length > MAX_REQUESTS_PER_WINDOW) {
    return {
      isMalicious: true,
      threatType: 'RATE_LIMIT_DDoS_ABUSE',
      payload: `${validTimestamps.length} requests in 60s`,
      clientIp
    };
  }

  // 3. Inspect URL query string
  const rawUrl = req.url || '';
  for (const [threatName, regex] of Object.entries(THREAT_PATTERNS)) {
    if (threatName === 'MALICIOUS_BOT') continue;
    if (regex.test(rawUrl)) {
      return {
        isMalicious: true,
        threatType: threatName,
        payload: rawUrl,
        clientIp
      };
    }
  }

  // 4. Inspect Body if string or object
  if (req.body) {
    const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    for (const [threatName, regex] of Object.entries(THREAT_PATTERNS)) {
      if (threatName === 'MALICIOUS_BOT') continue;
      if (regex.test(bodyStr)) {
        return {
          isMalicious: true,
          threatType: threatName,
          payload: bodyStr.slice(0, 300),
          clientIp
        };
      }
    }
  }

  return { isMalicious: false, clientIp };
}

/**
 * Dispatches an automated incident notification email to admin (lekimnam2809@gmail.com)
 * and logs to Supabase if configured.
 */
export async function sendSecurityAlert({ threatType, clientIp, endpoint, payload, userAgent }) {
  const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  
  console.error(`[SECURITY ALERT] [${threatType}] IP: ${clientIp} | Endpoint: ${endpoint} | Payload: ${payload}`);

  // 1. Log to Supabase security_incident_logs table if configured
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/security_incident_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          ip_address: clientIp,
          threat_type: threatType,
          threat_level: threatType.includes('SQL') || threatType.includes('PATH') ? 'CRITICAL' : 'HIGH',
          endpoint: endpoint,
          payload: String(payload).slice(0, 500),
          user_agent: userAgent,
          action_taken: 'BLOCKED_403'
        })
      });
    } catch (e) {
      console.warn('Could not write incident to Supabase:', e.message);
    }
  }

  // 2. Dispatch Email via Resend API (if RESEND_API_KEY provided)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #ef4444; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">🛡️ CẢNH BÁO AN NINH EDUHUB</h1>
            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Phát hiện hành vi tấn công nghi vấn</p>
          </div>
          <div style="padding: 24px; color: #1e293b;">
            <p style="margin-top: 0; font-size: 15px; line-height: 1.6;">
              Hệ thống <strong>EduHub Security Shield</strong> vừa phát hiện và tự động <strong>chặn đứng (403 Forbidden)</strong> một yêu cầu đáng ngờ nhắm vào nền tảng.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b; width: 140px;">Loại hành vi:</td>
                <td style="padding: 10px 0; color: #dc2626; font-weight: bold;">${threatType}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Địa chỉ IP:</td>
                <td style="padding: 10px 0; font-family: monospace; font-size: 15px;">${clientIp}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Thời gian:</td>
                <td style="padding: 10px 0;">${timestamp}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Endpoint:</td>
                <td style="padding: 10px 0; font-family: monospace;">${endpoint}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">Nội dung Payload:</td>
                <td style="padding: 10px 0; font-family: monospace; background: #f8fafc; padding: 8px; border-radius: 6px; word-break: break-all;">${String(payload).slice(0, 300)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #64748b;">User-Agent:</td>
                <td style="padding: 10px 0; font-size: 12px; color: #475569; word-break: break-all;">${userAgent || 'Không xác định'}</td>
              </tr>
            </table>

            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 14px; border-radius: 8px; margin: 20px 0;">
              <strong style="color: #991b1b; display: block; margin-bottom: 6px;">⚡ Hướng xử lý đề xuất:</strong>
              <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 13.5px; line-height: 1.5;">
                <li>Kiểm tra Vercel Dashboard tab Logs để xem thêm chi tiết.</li>
                <li>Nếu nghi vấn tấn công phá hoại liên tục, truy cập GitHub Actions và chạy workflow <strong>"Emergency Lockdown Vercel"</strong> để tạm dừng tiếp nhận traffic.</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <a href="https://vercel.com/dashboard" style="background: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; display: inline-block;">Truy cập Vercel Logs</a>
            </div>
          </div>
          <div style="background: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #64748b;">
            EduHub Security Shield • Tự động gửi về ${ADMIN_EMAIL}
          </div>
        </div>
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'EduHub Security <onboarding@resend.dev>',
          to: [ADMIN_EMAIL],
          subject: `[CẢNH BÁO AN NINH EDUHUB] Phát hiện ${threatType} từ IP ${clientIp}`,
          html: emailHtml
        })
      });
      console.log(`[SECURITY] Alert email sent successfully to ${ADMIN_EMAIL}`);
    } catch (err) {
      console.error('[SECURITY] Error sending alert email via Resend:', err.message);
    }
  }
}
