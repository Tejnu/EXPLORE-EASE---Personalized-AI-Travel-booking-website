import requests
import time
import razorpay

# -------------------------------
# Configuration - Replace with your actual keys
# -------------------------------
# Aviationstack API key and endpoint.
AVIATIONSTACK_ACCESS_KEY = "90032bc9dad6cb2927d1f7c6f6cb7196"
AVIATIONSTACK_URL = "http://api.aviationstack.com/v1/flights"

# Razorpay API credentials (sandbox/test keys)
RAZORPAY_KEY_ID = "rzp_test_TTSlEMIX7uzTBh"        # Get your test key from Razorpay Dashboard.
RAZORPAY_KEY_SECRET = "5Ag4vinxaW2dxnNonvJo2tpl"  # Get your test secret key.

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# -------------------------------
# Functions
# -------------------------------
def search_flights(departure_iata, arrival_iata, flight_date):
    """
    Search for flights using the Aviationstack API.
    
    Parameters:
      - departure_iata: Departure airport IATA code (e.g., "DEL").
      - arrival_iata: Arrival airport IATA code (e.g., "BOM").
      - flight_date: Flight date in YYYY-MM-DD format.
    
    Returns:
      - JSON data returned by the API.
    """
    params = {
        "access_key": AVIATIONSTACK_ACCESS_KEY,
        "dep_iata": departure_iata,
        "arr_iata": arrival_iata,
        "flight_date": flight_date
    }
    try:
        response = requests.get(AVIATIONSTACK_URL, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print("An error occurred during flight search:", e)
        return None

def process_flight_data(data):
    """
    Processes the JSON data returned from Aviationstack.
    Extracts flight number, departure and arrival times, and airline name.
    
    Returns:
      - A list of flight dictionaries.
    """
    flights = []
    if not data:
        return flights
    
    # Aviationstack returns data under the "data" key
    for flight in data.get("data", []):
        flight_info = flight.get("flight", {})
        departure_info = flight.get("departure", {})
        arrival_info = flight.get("arrival", {})
        airline_info = flight.get("airline", {})
        
        flights.append({
            "flight_number": flight_info.get("number", "N/A"),
            "departure_time": departure_info.get("scheduled", "N/A"),
            "arrival_time": arrival_info.get("scheduled", "N/A"),
            "airline": airline_info.get("name", "N/A")
        })
    return flights

def create_order(amount, currency, receipt):
    """
    Creates a payment order using Razorpay.
    
    Parameters:
      - amount: Amount in the smallest currency unit (e.g., paise for INR).
      - currency: Currency code (e.g., "INR").
      - receipt: A unique receipt identifier.
    
    Returns:
      - The order object returned by Razorpay.
    """
    order_data = {
        "amount": amount,
        "currency": currency,
        "receipt": receipt,
        "payment_capture": 1  # Auto-capture payments upon success.
    }
    try:
        order = razorpay_client.order.create(data=order_data)
        return order
    except Exception as e:
        print("Error creating Razorpay order:", e)
        return None

# -------------------------------
# Main Function
# -------------------------------
def main():
    print("Welcome to the Flight Booking System using Aviationstack & Razorpay!")
    departure = input("Enter departure airport IATA code (e.g., DEL): ").strip().upper()
    arrival = input("Enter arrival airport IATA code (e.g., BOM): ").strip().upper()
    flight_date = input("Enter flight date (YYYY-MM-DD): ").strip()
    
    # Search for flights.
    data = search_flights(departure, arrival, flight_date)
    flights = process_flight_data(data)
    if not flights:
        print("No flights found for the given criteria.")
        return
    
    # Display available flights.
    print("\nAvailable Flights:")
    for idx, flight in enumerate(flights, start=1):
        print(f"{idx}. Flight {flight['flight_number']} by {flight['airline']} | "
              f"Departs: {flight['departure_time']} | Arrives: {flight['arrival_time']}")
    
    try:
        choice = int(input("\nSelect a flight by entering its number: ")) - 1
    except ValueError:
        print("Invalid input. Exiting.")
        return
    
    if choice < 0 or choice >= len(flights):
        print("Invalid selection.")
        return
    
    selected_flight = flights[choice]
    print(f"\nYou selected Flight {selected_flight['flight_number']} by {selected_flight['airline']}.")
    
    # Simulate Payment Processing using Razorpay.
    print("\nProceeding to payment...")
    # For demonstration, assume a fixed price, e.g., INR 5000.
    price = 5000
    # Convert INR to paise (1 INR = 100 paise)
    amount = int(price * 100)
    currency = "INR"
    receipt = f"order_rcptid_{selected_flight['flight_number']}"
    
    print("Creating payment order...")
    order = create_order(amount, currency, receipt)
    if order:
        print("Order created successfully!")
        print("Order details:", order)
        # In a real integration, you would now send the order details to the frontend to open Razorpay Checkout.
        # Here we simulate a successful payment.
        print("Payment successful! Your flight booking is confirmed.")
    else:
        print("Payment failed. Please try again.")

if __name__ == "__main__":
    main()
