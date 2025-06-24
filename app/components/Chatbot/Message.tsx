// components/ChatBot/Message.tsx
import React from 'react';

import { Message as MessageType } from './types';
import styles from './Chatbot.module.scss';

interface MessageProps {
  message: MessageType;
  onSuggestionClick: (suggestion: string) => void;
}

export const Message: React.FC<MessageProps> = ({ message, onSuggestionClick }) => {
  if (message.type === 'suggestions') {
    return (
      <div className={`${styles.message} ${styles.suggestions}`}>
        <div className={styles.suggestedQuestions}>
          <p>Try asking:</p>
          {message.suggestions?.map((question, qIndex) => (
            <button
              key={qIndex}
              className={styles.suggestionButton}
              type="button"
              onClick={() => onSuggestionClick(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.message} ${styles[message.type]} ${message.isError ? styles.error : ''}`}
    >
      <div
        className={`${styles.messageContent} ${message.isError ? styles.error : ''} ${message.isTyping ? styles.typing : ''}`}
      >
        {message.content}
        {message.source === 'ai' && !message.isTyping && !message.isError && (
          <span className={styles.aiIndicator}>✨ AI</span>
        )}
      </div>
      <div className={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
};
