// components/ChatBot/constants.ts
import { Message } from './types';

export const INITIAL_MESSAGES: Message[] = [
  {
    content:
      "Hi! I'm Siddaharth Suman, a Senior Software Engineer with 8+ years of experience actively seeking new opportunities. I've led frontend teams, built scalable applications, and delivered measurable business impact. I'm authorized to work in the US and ready to contribute immediately. What would you like to know about my background?",
    timestamp: new Date(),
    type: 'bot',
  },
  {
    content: '',
    suggestions: [
      'Tell me about your technical leadership experience',
      'What measurable impact have you delivered?',
      'What are your core technical strengths?',
      'When are you available to start?',
      'How can I contact you about opportunities?',
      'What type of role are you seeking?',
    ],
    timestamp: new Date(),
    type: 'suggestions',
  },
];

export const CHAT_CONFIG = {
  INITIAL_QUESTIONS_REMAINING: 10,
  MAX_MESSAGE_LENGTH: 500,
  MIN_MESSAGE_LENGTH: 2,
} as const;
