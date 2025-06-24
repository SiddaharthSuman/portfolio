// app/api/chat/validationService.ts
import { ErrorResponse } from './types';
import { VALIDATION_CONFIG } from './constants';

export function validateMessage(message: unknown): ErrorResponse | null {
  if (!message || typeof message !== 'string') {
    return {
      error: 'Message is required and must be a string',
      type: 'validation_error',
    };
  }

  if (message.length > VALIDATION_CONFIG.maxMessageLength) {
    return {
      error: `Message too long. Please keep it under ${VALIDATION_CONFIG.maxMessageLength} characters.`,
      type: 'validation_error',
    };
  }

  if (message.length < VALIDATION_CONFIG.minMessageLength) {
    return {
      error: 'Please ask a more specific question.',
      type: 'validation_error',
    };
  }

  return null; // Validation passed
}
