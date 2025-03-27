from openai import OpenAI

# Initialize OpenAI client with OpenRouter API
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",  # Replace with your actual API key
)

def get_travel_plan(destination, days, interests, budget):
    """Generates a well-structured travel itinerary based on user preferences."""
    
    prompt = (f"Generate a detailed {days}-day travel itinerary for {destination}. "
              f"Focus on these interests: {', '.join(interests)}. "
              f"Budget: {budget} INR. "
              "Ensure each day's plan includes:\n"
              "- Morning, afternoon, evening, and night activities\n"
              "- Recommended local food options\n"
              "- Estimated costs for each activity\n"
              "- Travel tips and must-visit places and travel methods\n\n"
              "Output should be in english and Format the output clearly as follows:\n"
              "Day 1:\n- Morning: [Activity]\n- Afternoon: [Activity]\n- Evening: [Activity]\n- Night: [Activity]\n- Food Recommendations: [Food]\n- Estimated Cost: [Cost]\n\n"
              "Repeat this for all days.")

    try:
        response = client.chat.completions.create(
            model="cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
            messages=[{"role": "user", "content": prompt}],
        )

        itinerary = response.choices[0].message.content
        return itinerary

    except Exception as e:
        return f"Error: {e}"

# Example Usage
destination = input("Enter your destination: ")
days = int(input("Enter number of days: "))  # Ensuring input is an integer
interests = input("Enter your interests (comma-separated): ").split(',')
budget = int(input("Enter your budget (INR): "))  # Ensuring input is an integer

itinerary = get_travel_plan(destination, days, interests, budget)

# Print output with better formatting
print("\n" + "="*40)
print("           AI-Generated Travel Plan")
print("="*40 + "\n")
print(itinerary)
print("\n" + "="*40)
