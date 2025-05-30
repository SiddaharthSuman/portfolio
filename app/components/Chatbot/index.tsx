// components/ChatBot.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

import styles from './Chatbot.module.scss';

interface Message {
  content: string;
  isError?: boolean;
  source?: 'pattern' | 'ai';
  timestamp: Date;
  type: 'user' | 'bot';
}

interface ChatResponse {
  remaining: number;
  resetTime: number;
  response: string;
  source: 'pattern' | 'ai';
}

interface ErrorResponse {
  error: string;
  resetTime?: number;
  type?: 'rate_limit' | 'service_error' | 'validation_error';
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content:
        "Hi there! I'm Siddaharth. Thanks for checking out my portfolio! Ask me about my experience, skills, education, or anything else you'd like to know about my background.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [remainingQuestions, setRemainingQuestions] = useState<number>(10); // Will be updated from backend
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    // Use direct scrolling instead of scrollIntoView to avoid Lenis interference
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data: ChatResponse = await response.json();

      const botMessage: Message = {
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        source: data.source,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Update remaining questions from backend
      if (data.remaining) setRemainingQuestions(data.remaining);
    } catch (error) {
      let errorContent =
        "Sorry, I'm having some technical difficulties right now. Try asking me about my experience, skills, or education!";

      if (error instanceof Error) {
        errorContent = error.message;
      }

      const errorMessage: Message = {
        type: 'bot',
        content: errorContent,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions: string[] = [
    'Tell me about your experience',
    'What are your technical skills?',
    'Where did you study?',
    'What leadership experience do you have?',
    'How can I contact you?',
  ];

  const handleSuggestedQuestion = (question: string): void => {
    setInputMessage(question);
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

          {/* Messages */}
          <div ref={messagesContainerRef} data-lenis-prevent className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${styles[message.type]} ${message.isError ? styles.error : ''}`}
              >
                <div className={`${styles.messageContent} ${message.isError ? styles.error : ''}`}>
                  {message.content}
                  {message.source === 'ai' && <span className={styles.aiIndicator}>✨ AI</span>}
                </div>
                <div className={styles.timestamp}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}

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

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className={styles.suggestedQuestions}>
              <p>Try asking:</p>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className={styles.suggestionButton}
                  type="button"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form className={styles.inputForm} onSubmit={sendMessage}>
            <input
              className={styles.messageInput}
              disabled={isLoading}
              maxLength={500}
              placeholder="Ask Siddaharth anything..."
              type="text"
              value={inputMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
            />
            <button
              className={styles.sendButton}
              disabled={isLoading || !inputMessage.trim()}
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
