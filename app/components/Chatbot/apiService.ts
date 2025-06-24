// components/ChatBot/apiService.ts
import { ChatResponse, ErrorResponse, Message } from './types';
import { focusInput, animateTyping, removeTypingIndicator } from './utils';

interface StreamingCallbacks {
  onChunkReceived: (fullContent: string, source: string) => void;
  onError: (error: string) => void;
  onRemainingQuestionsUpdate: (remaining: number) => void;
  onStreamComplete: () => void;
}

export const sendMessageToAPI = async (
  message: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRemainingQuestions: React.Dispatch<React.SetStateAction<number>>,
  inputRef: React.RefObject<HTMLInputElement | null>
): Promise<void> => {
  try {
    // Try streaming first
    const streamResponse = await fetch('/api/chat', {
      body: JSON.stringify({ message }),
      headers: {
        Accept: 'text/stream',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (
      streamResponse.ok &&
      streamResponse.headers.get('content-type')?.includes('text/event-stream')
    ) {
      await handleStreamingResponse(streamResponse, {
        onChunkReceived: (fullContent, source) => {
          setMessages((prev) =>
            prev.map((msg, index) =>
              index === prev.length - 1
                ? { ...msg, content: fullContent, source: source as 'ai' }
                : msg
            )
          );
        },
        onError: (error) => {
          setMessages((prev) =>
            prev.map((msg, index) =>
              index === prev.length - 1
                ? { ...msg, content: error, isError: true, isTyping: false }
                : msg
            )
          );
          setIsLoading(false);
          focusInput(inputRef);
        },
        onRemainingQuestionsUpdate: (remaining) => {
          setRemainingQuestions(remaining);
        },
        onStreamComplete: () => {
          removeTypingIndicator(setMessages);
          setIsLoading(false);
          focusInput(inputRef);
        },
      });
    } else {
      // Fallback to regular response
      await handleRegularResponse(
        message,
        setMessages,
        setIsLoading,
        setRemainingQuestions,
        inputRef
      );
    }
  } catch (error) {
    handleAPIError(error, setMessages, setIsLoading, inputRef);
  }
};

const handleStreamingResponse = async (
  response: Response,
  callbacks: StreamingCallbacks
): Promise<void> => {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    callbacks.onError('Failed to establish streaming connection');
    return;
  }

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
            callbacks.onStreamComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              callbacks.onError(parsed.error);
              return;
            }

            if (parsed.text) {
              fullContent += parsed.text;
              callbacks.onChunkReceived(fullContent, parsed.source || 'ai');

              // Update remaining questions on first chunk
              if (isFirstChunk && parsed.remaining !== undefined) {
                callbacks.onRemainingQuestionsUpdate(parsed.remaining);
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
    callbacks.onError('Connection error. Please try again!');
  }
};

const handleRegularResponse = async (
  message: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setRemainingQuestions: React.Dispatch<React.SetStateAction<number>>,
  inputRef: React.RefObject<HTMLInputElement | null>
): Promise<void> => {
  const response = await fetch('/api/chat', {
    body: JSON.stringify({ message }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }

  const data: ChatResponse = await response.json();

  if (data.shouldAnimate && data.response.length > 20) {
    // Create typing message
    const botMessage: Message = {
      content: '',
      isTyping: true,
      source: data.source,
      timestamp: new Date(),
      type: 'bot',
    };

    setMessages((prev) => [...prev, botMessage]);
    setRemainingQuestions(data.remaining);

    // Animate typing
    await animateTyping(data.response, (content) => {
      setMessages((prev) =>
        prev.map((msg, index) => (index === prev.length - 1 ? { ...msg, content } : msg))
      );
    });

    removeTypingIndicator(setMessages);
    setIsLoading(false);
    focusInput(inputRef);
  } else {
    // Show response immediately
    const botMessage: Message = {
      content: data.response,
      source: data.source,
      timestamp: new Date(),
      type: 'bot',
    };

    setMessages((prev) => [...prev, botMessage]);
    setRemainingQuestions(data.remaining);
    setIsLoading(false);
    focusInput(inputRef);
  }
};

const handleAPIError = (
  error: unknown,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  inputRef: React.RefObject<HTMLInputElement | null>
): void => {
  let errorContent = "I'm having some technical difficulties right now. Please try asking again!";

  if (error instanceof Error) {
    errorContent = error.message;
  }

  const errorMessage: Message = {
    content: errorContent,
    isError: true,
    timestamp: new Date(),
    type: 'bot',
  };

  setMessages((prev) => [...prev, errorMessage]);
  setIsLoading(false);
  focusInput(inputRef);
};
