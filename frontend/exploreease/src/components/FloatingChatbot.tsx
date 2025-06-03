'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ChatbotModal from './ChatbotModal';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-ee-orange-500 hover:bg-ee-orange-600 text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg z-40"
        aria-label="Open AI assistant"
      >
        <span className="material-icons text-3xl">smart_toy</span>
      </Button>

      <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FloatingChatbot;
