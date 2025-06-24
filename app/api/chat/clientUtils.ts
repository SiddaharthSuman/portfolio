// app/api/chat/clientUtils.ts
import { NextRequest } from 'next/server';

export function getClientIP(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    if (isDevelopment) {
      return ips[0] || 'localhost';
    } else {
      const validIP = ips.find(
        (ip) =>
          ip &&
          !ip.startsWith('127.') &&
          !ip.startsWith('::1') &&
          !ip.startsWith('10.') &&
          !ip.startsWith('192.168.') &&
          !ip.startsWith('172.16.')
      );
      if (validIP) return validIP;
    }
  }

  if (xRealIP && (isDevelopment || (!xRealIP.startsWith('127.') && !xRealIP.startsWith('::1')))) {
    return xRealIP;
  }

  if (cfConnectingIP) return cfConnectingIP;

  return isDevelopment ? 'localhost' : 'anonymous';
}
