// Endpoint: /api/security-monitor
// Health check, security scanner probe detection, and manual alert test

import { inspectRequest, sendSecurityAlert } from './security-shield.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { isMalicious, threatType, payload, clientIp } = inspectRequest(req);

  // If attack pattern detected -> Block and Alert
  if (isMalicious) {
    await sendSecurityAlert({
      threatType,
      clientIp,
      endpoint: '/api/security-monitor',
      payload,
      userAgent: req.headers['user-agent']
    });

    return res.status(403).json({
      error: 'Yêu cầu bị từ chối bởi EduHub Security Shield do vi phạm quy tắc an toàn.',
      threat: threatType,
      ip: clientIp,
      timestamp: new Date().toISOString()
    });
  }

  // Handle explicit test alert trigger: GET /api/security-monitor?test_alert=1
  if (req.query.test_alert === '1') {
    await sendSecurityAlert({
      threatType: 'TEST_ALERT_TRIGGERED_BY_ADMIN',
      clientIp,
      endpoint: '/api/security-monitor?test_alert=1',
      payload: 'Kiểm tra hoạt động gửi email cảnh báo an ninh định kỳ',
      userAgent: req.headers['user-agent']
    });

    return res.status(200).json({
      status: 'success',
      message: 'Đã kích hoạt gửi email cảnh báo thử nghiệm tới lekimnam2809@gmail.com!',
      clientIp,
      timestamp: new Date().toISOString()
    });
  }

  // Regular Health Check Response
  return res.status(200).json({
    status: 'healthy',
    system: 'EduHub Web Core',
    securityShield: 'active',
    protected: true,
    clientIp,
    timestamp: new Date().toISOString()
  });
}
