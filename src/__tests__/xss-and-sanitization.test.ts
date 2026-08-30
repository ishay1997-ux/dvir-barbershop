import { describe, it, expect } from 'vitest';
import { sanitizeInputText } from '@/lib/utils';

describe('XSS & Input Sanitization Invariants Tests', () => {
  it('should strip script tags and their inner payload completely', () => {
    const malicious = 'שלום <script>alert("XSS Attack!");</script>תודה';
    expect(sanitizeInputText(malicious)).toBe('שלום תודה');
  });

  it('should strip iframe and embedded frame tags', () => {
    const malicious = 'הערה ללקוח <iframe src="https://evil.com"></iframe> נא להגיע בזמן';
    expect(sanitizeInputText(malicious)).toBe('הערה ללקוח  נא להגיע בזמן');
  });

  it('should strip inline HTML event handlers (onerror, onload, onclick)', () => {
    const malicious = '<img src="invalid-image" onerror="alert(1)" />הודעת באנר';
    expect(sanitizeInputText(malicious)).toBe('הודעת באנר');
  });

  it('should strip javascript: pseudo-protocol URIs', () => {
    const malicious = 'javascript:alert(document.cookie)';
    expect(sanitizeInputText(malicious)).toBe('alert(document.cookie)');
  });

  it('should preserve safe Hebrew, English, numbers, and standard punctuation', () => {
    const safeInput = 'תספורת פרימיום לגברים! מומלץ להגיע 5 דקות לפני הזמן (סניף אריאל).';
    expect(sanitizeInputText(safeInput)).toBe(safeInput);
  });

  it('should handle empty, null, or undefined strings without throwing', () => {
    expect(sanitizeInputText('')).toBe('');
    expect(sanitizeInputText(null as any)).toBe('');
    expect(sanitizeInputText(undefined as any)).toBe('');
  });
});
