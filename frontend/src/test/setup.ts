/// <reference types="vitest/globals" />

import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock environment variables for testing
vi.stubEnv("VITE_API_HOST_URL", "http://localhost:5209");

// Mock fetch globally
(globalThis as any).fetch = vi.fn();

// Mock console methods to reduce noise in tests
(globalThis as any).console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
