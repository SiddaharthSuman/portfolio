// components/ChatBot/index.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

import { Message as MessageType } from './types';
import { Message } from './Message';
import { sendMessageToAPI } from './apiService';
import { scrollToBottom, focusInput, removeSuggestions } from './utils';
import { INITIAL_MESSAGES, CHAT_CONFIG } from './constants';
import styles from './Chatbot.module.scss';

export default function ChatBot() {
  const [messages, setMessages] = useState<MessageType[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [remainingQuestions, setRemainingQuestions] = useState<number>(
    CHAT_CONFIG.INITIAL_QUESTIONS_REMAINING
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom(messagesContainerRef);
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      focusInput(inputRef);
    }
  }, [isOpen]);

  const handleSuggestedQuestion = async (question: string): Promise<void> => {
    if (isLoading) return;

    // Remove suggestions and add user message
    removeSuggestions(setMessages);

    const userMessage: MessageType = {
      type: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create initial typing message
    const typingMessage: MessageType = {
      type: 'bot',
      content: '',
      timestamp: new Date(),
      source: 'ai',
      isTyping: true,
    };

    setMessages((prev) => [...prev, typingMessage]);

    // Send to API
    await sendMessageToAPI(question, setMessages, setIsLoading, setRemainingQuestions, inputRef);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    // Validate message length
    if (inputMessage.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
      // Show error message
      const errorMessage: MessageType = {
        type: 'bot',
        content: `Message too long. Please keep it under ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} characters.`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    if (inputMessage.length < CHAT_CONFIG.MIN_MESSAGE_LENGTH) {
      const errorMessage: MessageType = {
        type: 'bot',
        content: 'Please ask a more specific question.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // Remove suggestions if they exist and add user message
    removeSuggestions(setMessages);

    const userMessage: MessageType = {
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const messageToProcess = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Create initial typing message
    const typingMessage: MessageType = {
      type: 'bot',
      content: '',
      timestamp: new Date(),
      source: 'ai',
      isTyping: true,
    };

    setMessages((prev) => [...prev, typingMessage]);

    // Send to API
    await sendMessageToAPI(
      messageToProcess,
      setMessages,
      setIsLoading,
      setRemainingQuestions,
      inputRef
    );
  };

  return (
    <div data-lenis-prevent className={styles.chatContainer}>
      {/* Chat Toggle Button */}
      <button
        aria-label="Toggle chat"
        className={styles.chatToggle}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <h3>Chat with Siddaharth</h3>
            <div className={styles.remainingQuestions}>{remainingQuestions} questions left</div>
          </div>

          {/* Messages Container */}
          <div ref={messagesContainerRef} data-lenis-prevent className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <Message key={index} message={message} onSuggestionClick={handleSuggestedQuestion} />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className={`${styles.message} ${styles.bot}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typing}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className={styles.inputForm} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className={styles.messageInput}
              disabled={isLoading}
              maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
              type="text"
              value={inputMessage}
              placeholder={
                remainingQuestions > 0
                  ? 'Ask Siddaharth anything...'
                  : 'Rate limit reached. Try again later...'
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
            />
            <button
              className={styles.sendButton}
              disabled={isLoading || !inputMessage.trim() || remainingQuestions <= 0}
              type="submit"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
