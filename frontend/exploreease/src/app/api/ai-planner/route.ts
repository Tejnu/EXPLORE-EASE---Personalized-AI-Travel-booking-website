import { NextResponse } from 'next/server';

export interface TravelPlanRequest {
  destination: string;
  days: number;
  interests: string[];
  budget: number;
}

export interface ChatRequest {
  prompt: string;
  userId?: string;
  conversation?: { role: 'user' | 'assistant'; content: string }[];
}

// Handle both travel plan generation and chat messages
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Determine if this is a travel plan request or a chat message
    if (body.prompt) {
      return handleChatMessage(body as ChatRequest);
    } else if (body.destination) {
      return handleTravelPlan(body as TravelPlanRequest);
    } else {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in AI API:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

async function handleChatMessage(chatRequest: ChatRequest) {
  const { prompt, userId } = chatRequest;

  // Simulate API processing time
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Analyze the prompt to provide a context-aware response
  const lowerPrompt = prompt.toLowerCase();
  let response;

  // Travel planning requests
  if (
    lowerPrompt.includes('plan a trip') ||
    lowerPrompt.includes('travel itinerary') ||
    lowerPrompt.includes('vacation plan')
  ) {
    // Extract potential destination if mentioned
    let destination = '';
    const destinations = ['dubai', 'new york', 'paris', 'tokyo', 'london', 'bali', 'bangkok'];
    for (const place of destinations) {
      if (lowerPrompt.includes(place)) {
        destination = place.charAt(0).toUpperCase() + place.slice(1);
        break;
      }
    }

    if (destination) {
      response = `I'd be happy to help you plan a trip to ${destination}! Here's what I need to create a personalized itinerary:\n\n1. How many days would you like to stay in ${destination}?\n2. What are your main interests? (e.g., history, food, adventure, relaxation, shopping)\n3. What's your approximate budget for this trip?\n\nOnce you provide these details, I can create a day-by-day itinerary for you!`;
    } else {
      response = "I'd love to help you plan a trip! Where would you like to go? Once you tell me the destination, I'll ask about your travel dates, interests, and budget to create a personalized itinerary.";
    }
  }
  // Flight queries
  else if (lowerPrompt.includes('flight')) {
    if (lowerPrompt.includes('cheap') || lowerPrompt.includes('best deal') || lowerPrompt.includes('discount')) {
      response = "To find the best flight deals, I recommend checking our Flights page where you can compare prices across different airlines. The best deals are typically found when booking 1-3 months in advance and being flexible with your travel dates. Would you like me to help you search for flights now?";
    } else {
      response = "I can help you find and book flights. Could you please specify your departure city, destination, and travel dates? Our system will search across multiple airlines to find the best options for you.";
    }
  }
  // Hotel queries
  else if (lowerPrompt.includes('hotel') || lowerPrompt.includes('accommodation') || lowerPrompt.includes('place to stay')) {
    response = "ExploreEase offers a wide range of accommodation options from budget-friendly hostels to luxury hotels. Could you tell me your destination, check-in and check-out dates, and any specific requirements (like Wi-Fi, breakfast, pool, etc.)? I'll find the perfect place for your stay!";
  }
  // Train queries
  else if (lowerPrompt.includes('train')) {
    if (lowerPrompt.includes('pnr') || lowerPrompt.includes('status')) {
      response = "To check your train PNR status, please provide your 10-digit PNR number, and I'll fetch the latest information for you.";
    } else {
      response = "I can help you book train tickets and check availability. Please provide your source station, destination station, and travel date so I can find the best options for you.";
    }
  }
  // Bus queries
  else if (lowerPrompt.includes('bus')) {
    response = "ExploreEase has partnered with major bus operators across the country. To book bus tickets, please specify your departure city, destination, and travel date. I'll show you the available options with prices and amenities.";
  }
  // Help/general requests
  else if (lowerPrompt.includes('help') || lowerPrompt.includes('what can you do')) {
    response = "I'm your ExploreEase AI assistant! I can help you with:\n\n• Booking flights, trains, hotels, and bus tickets\n• Creating personalized travel itineraries\n• Providing information about destinations\n• Checking PNR status and flight information\n• Finding the best travel deals\n\nJust let me know what you need assistance with!";
  }
  // Greeting messages
  else if (lowerPrompt.includes('hi') || lowerPrompt.includes('hello') || lowerPrompt.includes('hey')) {
    response = `Hello${userId !== 'guest' ? ' there' : ''}! How can I assist with your travel plans today? I can help you book flights, trains, hotels, or create a personalized travel itinerary.`;
  }
  // Thank you messages
  else if (lowerPrompt.includes('thank')) {
    response = "You're welcome! I'm here to make your travel planning and booking experience as smooth as possible. Is there anything else I can help you with today?";
  }
  // Default response
  else {
    response = "I can help you with booking travel services and planning trips. Could you please provide more details about what you're looking for so I can assist you better?";
  }

  return NextResponse.json({ success: true, response });
}

async function handleTravelPlan(travelPlanRequest: TravelPlanRequest) {
  const { destination, days, interests, budget } = travelPlanRequest;

  // Validate inputs
  if (!destination || !days || !interests.length || !budget) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Simulate API processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const itinerary = generateTravelPlan(destination, days, interests, budget);
  return NextResponse.json({ success: true, itinerary });
}

// Generate a travel plan
function generateTravelPlan(
  destination: string,
  days: number,
  interests: string[],
  budget: number
): string {
  const formattedInterests = interests.join(', ');
  const dailyBudget = Math.round(budget / days);
  
  let itinerary = `
Hello, I am EXPLOAI, your AI Travel Assistant! 😊

Here's your ${days}-day travel itinerary for ${destination}. 🌍✈️

I've focused on your interests: ${formattedInterests} 🎯
Budget: ₹${budget.toLocaleString()} (about ₹${dailyBudget.toLocaleString()} per day) 💰

Your detailed itinerary:
`;

  // Generate day-by-day plan
  for (let day = 1; day <= Math.min(days, 7); day++) {
    const dayBudget = Math.round(budget * (0.2 + (Math.random() * 0.2)) / days);
    
    // Add different activities based on interests
    let morningActivity = "Visit local attractions";
    let afternoonActivity = "Explore the area";
    let eveningActivity = "Experience local cuisine";
    let nightActivity = "Relax at your accommodation";
    
    if (interests.includes('History') || interests.includes('Culture')) {
      morningActivity = `Visit ${destination}'s historical sites and monuments`;
    }
    
    if (interests.includes('Food')) {
      afternoonActivity = "Food tour of local delicacies and street food";
    }
    
    if (interests.includes('Shopping')) {
      eveningActivity = "Shopping at local markets and boutiques";
    }
    
    if (interests.includes('Nature') || interests.includes('Adventure')) {
      morningActivity = "Hiking or nature excursion in nearby natural areas";
    }
    
    if (interests.includes('Beaches') && day > 1) {
      afternoonActivity = "Relax at the beach with water activities";
    }
    
    if (interests.includes('Nightlife') && day > 1) {
      nightActivity = "Experience the local nightlife scene";
    }
    
    itinerary += `
Day ${day}:
- Morning: ${morningActivity}
- Afternoon: ${afternoonActivity}
- Evening: ${eveningActivity}
- Night: ${nightActivity}
- Food Recommendations: Regional specialties and popular dishes
- Estimated Cost: ₹${dayBudget.toLocaleString()}
`;
  }
  
  itinerary += `
Travel Tips:
- Best time to visit ${destination} is during the non-monsoon season
- Use local transportation for an authentic experience
- Try the local cuisine for a true cultural experience
- Book accommodations in advance, especially during peak season

Would you like more specific details about any part of this itinerary?
`;
  
  return itinerary;
}
