import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getBusinessConfigSync, mergeWithDefaults } from '@/lib/business-service';

describe('State Resilience & Corrupted Storage Recovery Tests', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
    };
  })();

  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  it('should fallback to default flagship config when localStorage is completely empty', () => {
    const config = getBusinessConfigSync('dvir');
    expect(config).toBeDefined();
    expect(config?.slug).toBe('dvir');
    expect(config?.services.length).toBeGreaterThan(0);
    expect(config?.themeColor).toBe('#C9A84C');
  });

  it('should not crash when resolving synchronous known presets', () => {
    const config = getBusinessConfigSync('beauty');
    expect(config).toBeDefined();
    expect(config?.slug).toBe('beauty');
    expect(config?.services.length).toBeGreaterThan(0);
  });

  it('should handle missing nested layout properties with safe fallbacks via mergeWithDefaults', () => {
    const incompleteBusiness = {
      id: 'test-incomplete',
      slug: 'test-incomplete',
      name: 'Incomplete Shop',
      themeColor: '#FF0000',
      // layout, branches, services are missing
    };

    const merged = mergeWithDefaults(incompleteBusiness);
    expect(merged).toBeDefined();
    expect(merged.slug).toBe('test-incomplete');
    expect(merged.name).toBe('Incomplete Shop');
    expect(merged.themeColor).toBe('#FF0000');
    expect(merged.layout).toBeDefined();
    expect(merged.layout?.bgTheme).toBe('dark-obsidian');
    expect(merged.services.length).toBeGreaterThan(0);
    expect(merged.branches.length).toBeGreaterThan(0);
  });
});
