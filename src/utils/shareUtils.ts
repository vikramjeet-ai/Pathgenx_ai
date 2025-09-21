import pako from 'pako';
import type { CareerAnalysis } from '../types';

// Converts a Uint8Array to a URL-safe Base64 string
const uint8ArrayToBase64Url = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Converts a URL-safe Base64 string back to a Uint8Array
const base64UrlToUint8Array = (base64Url: string): Uint8Array => {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

/**
 * Encodes a CareerAnalysis object into a compressed, URL-safe string.
 * @param analysis The career analysis object.
 * @returns A URL-safe string token.
 */
export const encodeAnalysis = (analysis: CareerAnalysis, initialQuery: string): string => {
  try {
    const dataToEncode = { analysis, initialQuery };
    const jsonString = JSON.stringify(dataToEncode);
    const compressed = pako.deflate(jsonString);
    return uint8ArrayToBase64Url(compressed);
  } catch (error) {
    console.error('Failed to encode analysis:', error);
    return '';
  }
};

/**
 * Decodes a compressed, URL-safe string back into a CareerAnalysis object.
 * @param token The URL-safe string token.
 * @returns The decoded career analysis object, or null if decoding fails.
 */
export const decodeAnalysis = (token: string): { analysis: CareerAnalysis, initialQuery: string } | null => {
  try {
    const compressed = base64UrlToUint8Array(token);
    const jsonString = pako.inflate(compressed, { to: 'string' });
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decode analysis:', error);
    return null;
  }
};
