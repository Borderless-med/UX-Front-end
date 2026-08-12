// src/utils/turnstileVerification.ts
// Utility for verifying Cloudflare Turnstile tokens on the client side
// Calls Vercel API route which performs server-side verification

/**
 * Verify a Cloudflare Turnstile token
 * @param token - The Turnstile token from the widget
 * @returns Promise<boolean> - true if valid, false otherwise
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!token) {
    console.warn('Turnstile token is empty');
    return false;
  }

  try {
    const response = await fetch('/api/verify-turnstile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.error('Turnstile verification failed:', response.statusText);
      return false;
    }

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}

/**
 * Check honeypot value (should be empty for real users)
 * @param value - The honeypot field value
 * @returns boolean - true if valid (empty), false if triggered
 */
export function checkHoneypot(value: string): boolean {
  return value === '';
}
