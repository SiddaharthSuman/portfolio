// components/ChatBot.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

import styles from './Chatbot.module.scss';

interface Message {
  content: string;
  isError?: boolean;
  isTyping?: boolean;
  source?: 'pattern' | 'ai';
  timestamp: Date;
  type: 'user' | 'bot';
}

interface ChatResponse {
  remaining: number;
  resetTime: number;
  response: string;
  shouldAnimate?: boolean;
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
        "Hi there! I'm Siddaharth Suman, and thanks for visiting my portfolio! I'm currently finishing my Master's at Northeastern here in Boston. Feel free to ask me about my experience, skills, education, or anything else you'd like to know!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [remainingQuestions, setRemainingQuestions] = useState<number>(10);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
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
      // Always try streaming first for better UX
      const streamResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/stream', // Request streaming
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (
        streamResponse.ok &&
        streamResponse.headers.get('content-type')?.includes('text/event-stream')
      ) {
        // Handle streaming response
        const reader = streamResponse.body?.getReader();
        const decoder = new TextDecoder();

        // Create initial empty message for streaming
        const streamingMessage: Message = {
          type: 'bot',
          content: '',
          timestamp: new Date(),
          source: 'ai',
          isTyping: true,
        };

        setMessages((prev) => [...prev, streamingMessage]);

        if (reader) {
          let fullContent = '';
          let isFirstChunk = true;

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    // Streaming complete
                    setMessages((prev) =>
                      prev.map((msg, index) =>
                        index === prev.length - 1 ? { ...msg, isTyping: false } : msg
                      )
                    );
                    setIsLoading(false);
                    return; // Exit the function
                  }

                  try {
                    const parsed = JSON.parse(data);

                    // Handle error in stream
                    if (parsed.error) {
                      setMessages((prev) =>
                        prev.map((msg, index) =>
                          index === prev.length - 1
                            ? {
                                ...msg,
                                content: parsed.error,
                                isError: true,
                                isTyping: false,
                              }
                            : msg
                        )
                      );
                      setIsLoading(false);
                      return;
                    }

                    if (parsed.text) {
                      fullContent += parsed.text;

                      // Update the streaming message with accumulated content
                      setMessages((prev) =>
                        prev.map((msg, index) =>
                          index === prev.length - 1
                            ? {
                                ...msg,
                                content: fullContent,
                                source: parsed.source || 'ai',
                              }
                            : msg
                        )
                      );

                      // Update remaining questions on first chunk
                      if (isFirstChunk && parsed.remaining !== undefined) {
                        setRemainingQuestions(parsed.remaining);
                        isFirstChunk = false;
                      }
                    }
                  } catch (parseError) {
                    console.error('Error parsing streaming data:', parseError);
                  }
                }
              }
            }
          } catch (streamError) {
            console.error('Streaming error:', streamError);
            // Update the message to show error
            setMessages((prev) =>
              prev.map((msg, index) =>
                index === prev.length - 1
                  ? {
                      ...msg,
                      content:
                        'Sorry, I encountered an issue. Try asking about my experience or skills!',
                      isError: true,
                      isTyping: false,
                    }
                  : msg
              )
            );
            setIsLoading(false);
          }
        }
      } else {
        // Fallback to regular response if streaming fails
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

        // Create message with typing animation for non-streaming responses
        if (data.shouldAnimate && data.response.length > 20) {
          const botMessage: Message = {
            type: 'bot',
            content: '',
            timestamp: new Date(),
            source: data.source,
            isTyping: true,
          };

          setMessages((prev) => [...prev, botMessage]);
          setRemainingQuestions(data.remaining);

          // Animate typing effect
          await animateTyping(data.response);
          setIsLoading(false);
        } else {
          // Show response immediately for very short responses
          const botMessage: Message = {
            type: 'bot',
            content: data.response,
            timestamp: new Date(),
            source: data.source,
          };

          setMessages((prev) => [...prev, botMessage]);
          setRemainingQuestions(data.remaining);
          setIsLoading(false);
        }
      }
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
      setIsLoading(false);
    }
  };

  // Improved typing animation for non-streaming responses
  const animateTyping = async (text: string): Promise<void> => {
    const words = text.split(' ');
    let currentContent = '';

    for (let i = 0; i < words.length; i++) {
      currentContent += (i > 0 ? ' ' : '') + words[i];

      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, content: currentContent } : msg
        )
      );

      // Natural typing speed with variable delays
      const word = words[i];
      let delay = 80; // Base delay increased for more natural feel

      // Adjust delay based on word characteristics
      if (word.length > 8) delay += 40;
      if (word.includes(',') || word.includes('.')) delay += 120;
      if (word.includes('!') || word.includes('?')) delay += 150;
      if (i === 0) delay += 100; // Initial pause

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Mark typing as complete
    setMessages((prev) =>
      prev.map((msg, index) => (index === prev.length - 1 ? { ...msg, isTyping: false } : msg))
    );
  };

  const suggestedQuestions: string[] = [
    'Tell me about your experience',
    'What are your technical skills?',
    'Where did you study?',
    'What leadership experience do you have?',
    'How can I contact you?',
    'What projects have you worked on?',
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
                <div
                  className={`${styles.messageContent} ${message.isError ? styles.error : ''} ${message.isTyping ? styles.typing : ''}`}
                >
                  {message.content}
                  {message.source === 'ai' && !message.isTyping && !message.isError && (
                    <span className={styles.aiIndicator}>✨ AI</span>
                  )}
                  {message.source === 'pattern' && !message.isTyping && !message.isError && (
                    <span className={styles.aiIndicator}>⚡ Quick</span>
                  )}
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
