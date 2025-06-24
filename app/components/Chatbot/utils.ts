// components/ChatBot/utils.ts
import { Message } from './types';

export const scrollToBottom = (containerRef: React.RefObject<HTMLDivElement | null>): void => {
  if (containerRef.current) {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }
};

export const focusInput = (inputRef: React.RefObject<HTMLInputElement | null>): void => {
  // Focus the input after a short delay to ensure DOM updates are complete
  setTimeout(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, 100);
};

export const animateTyping = async (
  text: string,
  updateMessage: (content: string) => void
): Promise<void> => {
  const words = text.split(' ');
  let currentContent = '';

  for (let i = 0; i < words.length; i++) {
    currentContent += (i > 0 ? ' ' : '') + words[i];
    updateMessage(currentContent);

    // Natural typing speed with variable delays
    const word = words[i];
    let delay = 80; // Base delay

    // Adjust delay based on word characteristics
    if (word.length > 8) delay += 40;
    if (word.includes(',') || word.includes('.')) delay += 120;
    if (word.includes('!') || word.includes('?')) delay += 150;
    if (i === 0) delay += 100; // Initial pause

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

export const removeTypingIndicator = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): void => {
  setMessages((prev) =>
    prev.map((msg, index) => (index === prev.length - 1 ? { ...msg, isTyping: false } : msg))
  );
};

export const removeSuggestions = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): void => {
  setMessages((prev) => prev.filter((msg) => msg.type !== 'suggestions'));
};
