'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import AITravelPlanner from './AITravelPlanner';

interface FloatingMenuProps {
  onAIClick?: () => void;
  onHelpClick?: () => void;
  onLanguageClick?: () => void;
  onSettingsClick?: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  onAIClick,
  onHelpClick,
  onLanguageClick,
  onSettingsClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAIPlanner, setShowAIPlanner] = useState(false);
  const [menuTimeout, setMenuTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-hide the menu after 5 seconds of inactivity
    if (isExpanded) {
      if (menuTimeout) clearTimeout(menuTimeout);
      const timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      setMenuTimeout(timeout);
    }

    return () => {
      if (menuTimeout) clearTimeout(menuTimeout);
    };
  }, [isExpanded]);

  const handleMenuHover = () => {
    if (menuTimeout) clearTimeout(menuTimeout);
  };

  const handleMenuLeave = () => {
    if (!showAIPlanner) {
      const timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
      setMenuTimeout(timeout);
    }
  };

  const handleAIClick = () => {
    setShowAIPlanner(true);
    if (onAIClick) onAIClick();
  };

  return (
    <>
      <div
        className={`fixed bottom-6 right-6 flex flex-col-reverse items-end gap-3 z-40 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
        onMouseEnter={handleMenuHover}
        onMouseLeave={handleMenuLeave}
      >
        {isExpanded && (
          <>
            <Button
              onClick={handleAIClick}
              className="rounded-full p-3 bg-amber-500 hover:bg-amber-600 shadow-lg"
              title="AI Travel Planner"
              aria-label="AI Travel Planner"
            >
              <span className="material-icons">smart_toy</span>
            </Button>
            <Button
              onClick={onHelpClick}
              className="rounded-full p-3 bg-blue-500 hover:bg-blue-600 shadow-lg"
              title="Help"
              aria-label="Help"
            >
              <span className="material-icons">help_outline</span>
            </Button>
            <Button
              onClick={onLanguageClick}
              className="rounded-full p-3 bg-purple-500 hover:bg-purple-600 shadow-lg"
              title="Language"
              aria-label="Language"
            >
              <span className="material-icons">language</span>
            </Button>
            <Button
              onClick={onSettingsClick}
              className="rounded-full p-3 bg-gray-600 hover:bg-gray-700 shadow-lg"
              title="Settings"
              aria-label="Settings"
            >
              <span className="material-icons">settings</span>
            </Button>
          </>
        )}
      </div>

      {/* Main floating button */}
      <div
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={handleMenuLeave}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`rounded-full p-4 shadow-lg transition-all duration-300 ${isExpanded ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-teal-500 hover:bg-teal-600'}`}
          title={isExpanded ? "Close Menu" : "Open Menu"}
          aria-label={isExpanded ? "Close Menu" : "Open Menu"}
        >
          <span className="material-icons">{isExpanded ? 'close' : 'add'}</span>
        </Button>
      </div>

      {/* AI Travel Planner */}
      {showAIPlanner && <AITravelPlanner onClose={() => setShowAIPlanner(false)} />}
    </>
  );
};

export default FloatingMenu;
