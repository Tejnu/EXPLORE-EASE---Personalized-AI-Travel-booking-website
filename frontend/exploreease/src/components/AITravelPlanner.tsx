// src/components/AITravelPlanner.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface AITravelPlannerProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TravelPlanFormData {
  destination: string;
  days: number;
  interests: string[];
  budget: number;
}

const INTERESTS_OPTIONS = [
  'History', 'Culture', 'Food', 'Adventure', 'Nature',
  'Shopping', 'Nightlife', 'Beaches', 'Museums', 'Architecture',
  'Wildlife', 'Photography', 'Relaxation', 'Local Experience'
];

const BUDGET_OPTIONS = [
  { value: 5000, label: '₹5,000' },
  { value: 10000, label: '₹10,000' },
  { value: 25000, label: '₹25,000' },
  { value: 50000, label: '₹50,000' },
  { value: 75000, label: '₹75,000' },
  { value: 100000, label: '₹100,000' },
  { value: 150000, label: '₹150,000' },
  { value: 200000, label: '₹200,000' },
];

const AITravelPlanner: React.FC<AITravelPlannerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI Travel Assistant. How can I help you plan your perfect trip today? You can ask me about destinations, create an itinerary, or get travel recommendations based on your interests.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Travel plan form state
  const [planForm, setPlanForm] = useState<TravelPlanFormData>({
    destination: '',
    days: 3,
    interests: [],
    budget: 50000
  });
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Get conversation history (last 10 messages for context)
      const chatContext = messages.slice(-10).concat(userMessage);

      const response = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputValue,
          conversation: chatContext
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add assistant response
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        
        // Update plan form if the message contains destination info
        const lowerInput = inputValue.toLowerCase();
        const lowerResponse = data.response.toLowerCase();
        
        // Extract potential destination from user message
        if (lowerInput.includes('trip to') || lowerInput.includes('visit') || lowerInput.includes('travel to')) {
          const potentialDestinations = ['goa', 'delhi', 'mumbai', 'jaipur', 'agra', 'chennai', 'kolkata', 'bangalore'];
          for (const dest of potentialDestinations) {
            if (lowerInput.includes(dest)) {
              setPlanForm(prev => ({ ...prev, destination: dest.charAt(0).toUpperCase() + dest.slice(1) }));
              break;
            }
          }
        }
        
        // Extract potential interests from user message
        const potentialInterests = INTERESTS_OPTIONS.map(i => i.toLowerCase());
        const mentionedInterests: string[] = [];
        
        for (const interest of potentialInterests) {
          if (lowerInput.includes(interest.toLowerCase())) {
            const originalInterest = INTERESTS_OPTIONS.find(i => i.toLowerCase() === interest)!;
            mentionedInterests.push(originalInterest);
          }
        }
        
        if (mentionedInterests.length > 0) {
          setPlanForm(prev => ({ ...prev, interests: [...new Set([...prev.interests, ...mentionedInterests])] }));
        }
        
        // Extract potential days from user message
        const daysMatch = inputValue.match(/(\d+)\s*(day|days)/i);
        if (daysMatch && daysMatch[1]) {
          const days = parseInt(daysMatch[1]);
          if (days > 0 && days <= 14) {
            setPlanForm(prev => ({ ...prev, days }));
          }
        }
        
        // If this is a fairly detailed query, suggest using the Plan Generator
        if (mentionedInterests.length > 0 && planForm.destination && !lowerResponse.includes('plan generator')) {
          setTimeout(() => {
            setMessages(prev => [
              ...prev, 
              { 
                role: 'assistant', 
                content: `I notice you're interested in ${planForm.destination} and activities like ${mentionedInterests.join(', ')}. Would you like me to create a detailed itinerary? Click on the "Plan Generator" tab and I can make a complete travel plan for you.` 
              }
            ]);
          }, 2000);
        }
      } else {
        // Add error message
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setPlanForm(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleGeneratePlan = async () => {
    if (!planForm.destination) {
      alert('Please enter a destination');
      return;
    }

    if (planForm.interests.length === 0) {
      alert('Please select at least one interest');
      return;
    }

    setLoading(true);
    setActiveTab('chat'); // Switch to chat tab to show results

    try {
      const response = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: planForm.destination,
          days: planForm.days,
          interests: planForm.interests,
          budget: planForm.budget
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add a context message for the itinerary
        const planIntroMessage = `Here's your personalized ${planForm.days}-day itinerary for ${planForm.destination} with a budget of ₹${planForm.budget.toLocaleString()}, focused on ${planForm.interests.join(', ')}:`;
        
        // Add the plan to chat but preserve conversation
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: planIntroMessage },
          { role: 'assistant', content: data.itinerary }
        ]);
        
        // Add a follow-up question after the plan
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { 
              role: 'assistant', 
              content: "What do you think of this itinerary? I can make adjustments if you'd like to change anything specific." 
            }
          ]);
        }, 2000);
      } else {
        // Add error message
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error generating your travel plan. Please try again.' }]);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error generating your travel plan. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle user clicking on a suggested interest
  const handleSuggestedInterest = (interest: string) => {
    const newInterests = [...planForm.interests];
    if (!newInterests.includes(interest)) {
      newInterests.push(interest);
      setPlanForm({ ...planForm, interests: newInterests });
      
      setMessages(prev => [
        ...prev,
        { role: 'user', content: `I'm interested in ${interest}` },
        { role: 'assistant', content: `Great! I've added ${interest} to your interests. Is there anything else you'd like to include?` }
      ]);
    }
  };

  // Render the chat interface
  const renderChat = () => (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-md p-4 space-y-4"
        style={{
          minHeight: 0, // ensures flexbox and overflow are honored
          maxHeight: '60vh', // limits container's height to 60% of viewport
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-[#ffa726] text-white ml-auto max-w-[80%]'
                : 'bg-gray-100 max-w-[90%]'
            }`}
          >
            <div className="whitespace-pre-line">{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestion buttons */}
      {!loading && (
        <div className="flex flex-wrap gap-2 my-3">
          {planForm.destination === '' && (
            <>
              <button 
                onClick={() => setInputValue("I want to visit Goa for a beach vacation")}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
              >
                Beach vacation in Goa
              </button>
              <button 
                onClick={() => setInputValue("Planning a trip to Delhi for 3 days")}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
              >
                3 days in Delhi
              </button>
              <button 
                onClick={() => setInputValue("What are good places to visit in India on a budget?")}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
              >
                Budget travel in India
              </button>
            </>
          )}
          
          {planForm.destination !== '' && planForm.interests.length === 0 && (
            <>
              {['Nature', 'History', 'Food', 'Shopping', 'Beaches'].map(interest => (
                <button 
                  key={interest}
                  onClick={() => handleSuggestedInterest(interest)}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
                >
                  {interest}
                </button>
              ))}
            </>
          )}
          
          {planForm.destination !== '' && planForm.interests.length > 0 && (
            <button 
              onClick={() => {
                setActiveTab('planner');
                setTimeout(() => {
                  setMessages(prev => [
                    ...prev,
                    { role: 'assistant', content: `I've pre-filled the Plan Generator with your preferences for ${planForm.destination}. You can customize and generate a detailed itinerary there.` }
                  ]);
                }, 500);
              }}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
            >
              Create detailed itinerary for {planForm.destination}
            </button>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 mt-auto"
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me about your travel plans..."
          disabled={loading}
          className="flex-1"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="bg-[#ffa726] hover:bg-[#ff9800] px-4 py-2 rounded-md text-white"
        >
          {loading ? (
            <span className="material-icons animate-spin">refresh</span>
          ) : (
            <span className="material-icons">send</span>
          )}
        </button>
      </form>
    </div>
  );

  // Render the plan generator interface
  const renderPlanner = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-6">
        <div>
          <label htmlFor="destination" className="block text-base font-medium mb-1">Where do you want to go?</label>
          <Input
            id="destination"
            placeholder="Enter city or country"
            value={planForm.destination}
            onChange={(e) => setPlanForm({...planForm, destination: e.target.value})}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="days" className="block text-base font-medium mb-1">How many days?</label>
          <div className="flex items-center space-x-4">
            <Input
              id="days"
              type="number"
              min={1}
              max={14}
              value={planForm.days}
              onChange={(e) => setPlanForm({...planForm, days: parseInt(e.target.value) || 3})}
              className="w-20"
            />
            <span className="text-gray-500">days</span>
          </div>
        </div>

        <div>
          <label className="block text-base font-medium mb-2">What are your interests?</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS_OPTIONS.map(interest => (
              <button
                key={interest}
                type="button"
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  planForm.interests.includes(interest)
                    ? 'bg-[#ffa726] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleInterestToggle(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="budget" className="block text-base font-medium mb-2">Budget (₹)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BUDGET_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                className={`py-2 px-3 rounded-md text-sm transition-colors ${
                  planForm.budget === option.value
                    ? 'bg-[#ffa726] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
                onClick={() => setPlanForm({...planForm, budget: option.value})}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={loading || !planForm.destination || planForm.interests.length === 0}
          className="w-full bg-[#ffa726] hover:bg-[#ff9800] text-white py-2 rounded-md font-medium"
        >
          {loading ? 'Generating Plan...' : 'Generate Travel Plan'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[85vh] max-h-[700px] flex flex-col">
        {/* Header */}
        <div className="bg-[#232e3d] text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <span className="material-icons mr-2">smart_toy</span>
            <h2 className="text-xl font-semibold">AI Travel Planner</h2>
          </div>
          <button onClick={onClose} className="text-white">
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Custom Tabs Implementation */}
        <div className="px-4 pt-2 border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-4 ${activeTab === 'chat' 
                ? 'border-b-2 border-[#ffa726] text-[#ffa726] font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Chat with AI
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`py-2 px-4 ${activeTab === 'planner' 
                ? 'border-b-2 border-[#ffa726] text-[#ffa726] font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Plan Generator
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' ? renderChat() : renderPlanner()}
        </div>
      </div>
    </div>
  );
};

export default AITravelPlanner;
