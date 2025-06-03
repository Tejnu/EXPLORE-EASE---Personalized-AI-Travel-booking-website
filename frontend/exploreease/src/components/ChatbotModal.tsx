'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCurrentUser } from '@/lib/auth';

interface Message {
  type: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = getCurrentUser();
  const [suggestions, setSuggestions] = useState<string[]>([
    'Help me plan a trip',
    'Book flight tickets',
    'Find hotels in Delhi',
    'Show train availability'
  ]);

  // Add initial greeting message when component mounts
  useEffect(() => {
    const initialMessage = {
      type: 'ai' as const,
      text: `Hello${user ? ` ${user.name}` : ''}! I'm your ExploreEase AI assistant. How can I help you today?`,
      timestamp: new Date()
    };

    const systemMessage = {
      type: 'system' as const,
      text: 'You can ask me about flights, trains, hotels, or use our AI travel planner to create a personalized itinerary.',
      timestamp: new Date()
    };

    setMessages([initialMessage, systemMessage]);
  }, [user]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    // Analyze user input to determine context-specific suggestions
    const lowerInput = input.toLowerCase();

    // Update suggestions based on user message
    if (lowerInput.includes('flight')) {
      setSuggestions([
        'Show flight prices',
        'Compare airlines',
        'Check baggage allowance',
        'Flight cancellation policy'
      ]);
    } else if (lowerInput.includes('hotel')) {
      setSuggestions([
        'Show hotels with pool',
        'Hotels near airport',
        'Luxury hotels',
        'Hotel booking process'
      ]);
    } else if (lowerInput.includes('train')) {
      setSuggestions([
        'Check PNR status',
        'Train running status',
        'Tatkal booking tips',
        'Train seat availability'
      ]);
    } else if (lowerInput.includes('trip') || lowerInput.includes('plan') || lowerInput.includes('itinerary')) {
      setSuggestions([
        'Create travel itinerary',
        'Budget travel tips',
        'Family vacation ideas',
        'Weekend getaways'
      ]);
    }

    try {
      // Make API call to the AI planner endpoint
      const response = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: input,
          userId: user?.id || 'guest'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        type: 'ai',
        text: data.response || generateFallbackResponse(input),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);

      // Fallback to client-side generation if the API fails
      const aiMessage: Message = {
        type: 'ai',
        text: generateFallbackResponse(input),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback response generator for when API calls fail
  const generateFallbackResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Travel planning responses
    if (lowerInput.includes('plan a trip') || lowerInput.includes('itinerary') || lowerInput.includes('travel plan')) {
      return "I'd be happy to help plan your trip! To create a personalized itinerary, I'll need a few details:\n\n1. Where would you like to go?\n2. How many days are you planning to travel?\n3. What are your interests? (e.g., nature, history, food, adventure)\n4. What's your approximate budget?\n\nYou can also click the 'Create travel itinerary' button below for a guided experience.";
    }

    // Flight-related responses
    if (lowerInput.includes('flight')) {
      if (lowerInput.includes('cheap') || lowerInput.includes('best') || lowerInput.includes('deal')) {
        return "To find the best flight deals, you need to be a bit flexible with your travel dates. ExploreEase can help you compare prices across different dates, airlines, and even nearby airports. Would you like me to search for flights? Please provide your departure city, destination, and preferred travel dates.";
      }
      return "I can help you search for flights, compare prices, and book tickets. Please provide your departure city, destination, and preferred travel dates to get started.";
    }

    // Hotel-related responses
    if (lowerInput.includes('hotel') || lowerInput.includes('stay') || lowerInput.includes('accommodation')) {
      return "ExploreEase partners with thousands of hotels worldwide. I can help you find accommodations that match your preferences and budget. Could you tell me which city you're planning to visit, your check-in and check-out dates, and any specific requirements (like Wi-Fi, breakfast, pool, etc.)?";
    }

    // Train-related responses
    if (lowerInput.includes('train') || lowerInput.includes('rail')) {
      if (lowerInput.includes('pnr') || lowerInput.includes('status')) {
        return "To check your PNR status, simply enter your 10-digit PNR number, and I'll fetch the latest information for you. Would you like to check a PNR status now?";
      }
      return "I can help you find and book train tickets, check PNR status, and get information about train schedules. What specific information are you looking for regarding train travel?";
    }

    // Help/general responses
    if (lowerInput.includes('help') || lowerInput.includes('how do you') || lowerInput.includes('what can you')) {
      return "I'm your ExploreEase AI assistant! I can help you with:\n\n• Booking flights, trains, hotels, and bus tickets\n• Creating personalized travel itineraries\n• Providing information about destinations\n• Checking PNR status and flight information\n• Finding the best travel deals\n\nJust let me know what you need assistance with!";
    }

    // Greeting responses
    if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
      return `Hello${user ? ` ${user.name}` : ''}! How can I assist with your travel plans today? I can help you book flights, trains, or hotels, or even create a personalized travel itinerary.`;
    }

    // Thank you responses
    if (lowerInput.includes('thank')) {
      return "You're welcome! I'm here to make your travel planning and booking experience as smooth as possible. Is there anything else I can help you with today?";
    }

    // Default response
    return "I can help you with booking flights, trains, hotels, and creating personalized travel plans. Could you please provide more details about what you're looking for so I can assist you better?";
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Don't send immediately to allow user to edit
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden max-h-[80vh] flex flex-col bg-white border-ee-ash-200">
        <DialogHeader className="bg-ee-ash-800 text-white p-4 flex flex-row justify-between items-center">
          <DialogTitle className="flex items-center">
            <span className="material-icons mr-2">smart_toy</span>
            <span>ExploreEase AI Assistant</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-4 bg-white max-h-[60vh]">
          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 ${
                message.type === 'user'
                  ? 'ml-auto max-w-[85%]'
                  : message.type === 'system'
                    ? 'mx-auto max-w-[90%] text-center'
                    : 'mr-auto max-w-[85%]'
              }`}
            >
              {message.type === 'system' ? (
                <div className="bg-ee-ash-100 text-ee-ash-600 p-2 rounded-md text-sm border border-ee-ash-200">
                  {message.text}
                </div>
              ) : (
                <>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-ee-orange-500 text-white'
                      : 'bg-ee-ash-100 text-ee-ash-800'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                  <div className={`text-xs mt-1 text-ee-ash-500 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="self-start mb-3 max-w-[85%]">
              <div className="bg-ee-ash-100 p-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-ee-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-ee-orange-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-2 h-2 bg-ee-orange-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Invisible div to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-2 bg-white flex flex-wrap gap-2 border-t border-ee-ash-200">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="bg-ee-ash-100 text-ee-orange-600 border border-ee-orange-300 hover:bg-ee-ash-200 text-xs px-3 py-1 rounded-full"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="p-3 bg-white border-t border-ee-ash-200">
          <div className="flex items-center bg-ee-ash-100 rounded-full p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message here..."
              className="flex-grow bg-transparent border-none focus:outline-none px-2 text-ee-ash-800"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-ee-orange-500 hover:bg-ee-orange-600 text-white rounded-full p-1 ml-2 h-8 w-8 flex items-center justify-center"
              disabled={!input.trim() || isLoading}
            >
              <span className="material-icons text-sm">send</span>
            </Button>
          </div>
          <p className="text-xs text-ee-ash-500 mt-2 text-center">Powered by ExploreEase AI to provide personalized travel assistance</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal;
