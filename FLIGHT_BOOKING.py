import pandas as pd
from datetime import datetime

def load_data(file_path):
    """Load and clean flight data from CSV."""
    try:
        df = pd.read_csv(file_path)
        print("Columns in CSV:", df.columns.tolist())
        
        # Convert 'flight date' to datetime (from format DD-MM-YYYY), drop invalid dates
        df['flight date'] = pd.to_datetime(df['flight date'], format="%d-%m-%Y", errors="coerce")
        df = df.dropna(subset=['flight date'])
        df['flight date'] = df['flight date'].dt.strftime("%Y-%m-%d")
        
        # Remove commas from 'price' and convert to float
        df['price'] = df['price'].astype(str).str.replace(",", "").astype(float)
        
        return df
    except Exception as e:
        print("Error loading dataset:", e)
        return None

def apply_market_pricing(price, dep_time_str):
    """
    Adjust the flight's price using a scaling factor.
    This scaling factor reduces the high base price to a realistic market rate.
    For example, using a factor of 0.1 means a base price of ₹50,000 becomes ₹5,000.
    """
    scaling_factor = 0.1  # Adjust this factor as needed
    return round(price * scaling_factor, 2)

def calculate_taxes(price):
    """Calculate a 10% tax on the price."""
    tax_rate = 0.10
    return round(price * tax_rate, 2)

def search_flights(df, travel_date, departure, arrival):
    """
    Search flights matching the given travel date, departure and arrival.
    Assumes departure is in column 'from' and arrival in column 'to'.
    """
    filtered = df[
        (df["flight date"] == travel_date) &
        (df["from"].str.lower() == departure.lower()) &
        (df["to"].str.lower() == arrival.lower())
    ]
    return filtered

def main():
    file_path = "D:/aaaah/projects/DTI/DATASETS/goibibo_flights_data.csv"  # Update this if needed
    df = load_data(file_path)
    
    if df is None or df.empty:
        print("Dataset not loaded or is empty.")
        return
    
    # User input for flight search
    travel_date = input("Enter travel date (YYYY-MM-DD): ").strip()
    departure = input("Enter departure city/airport: ").strip()
    arrival = input("Enter arrival city/airport: ").strip()
    
    # Search for flights
    flights_found = search_flights(df, travel_date, departure, arrival)
    
    if flights_found.empty:
        print("No flights available for the selected date and route.")
        return
    
    # Display flights with adjusted pricing details
    print("\nAvailable flights:")
    flights_found = flights_found.reset_index(drop=True)
    for idx, row in flights_found.iterrows():
        base_price = row['price']
        # Adjust price using the scaling factor
        adjusted_price = apply_market_pricing(base_price, row['dep_time'])
        tax = calculate_taxes(adjusted_price)
        final_price = round(adjusted_price + tax, 2)
        
        print(f"Flight {idx}:")
        print(f"  Airline: {row['airline']}")
        print(f"  Flight Number: {row['flight_num']}")
        print(f"  Date: {row['flight date']}")
        print(f"  Departure: {row['from']} at {row['dep_time']}")
        print(f"  Arrival: {row['to']} at {row['arr_time']}")
        print(f"  Duration: {row['duration']}")
        print(f"  Base Price: ₹{base_price}")
        print(f"  Adjusted Price: ₹{adjusted_price}")
        print(f"  Tax (10%): ₹{tax}")
        print(f"  Final Price: ₹{final_price}\n")
        
        # Save the final price into the DataFrame for booking purposes
        flights_found.at[idx, 'final_price'] = final_price
    
    # Let the user select a flight for booking
    selected_index = input("Enter the flight number (index) you want to book: ").strip()
    try:
        selected_index = int(selected_index)
        selected_flight = flights_found.iloc[selected_index]
    except Exception as e:
        print("Invalid selection.", e)
        return
    
    # Simulate booking process
    user_name = input("Enter your name: ").strip()
    user_email = input("Enter your email: ").strip()
    booking_id = f"BOOK{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    print("\nBooking Confirmed!")
    print(f"Booking ID: {booking_id}")
    print(f"Name: {user_name}")
    print(f"Email: {user_email}")
    print(f"Flight: {selected_flight['airline']} {selected_flight['flight_num']}")
    print(f"Final Price: ₹{selected_flight['final_price']}")
    
if __name__ == "__main__":
    main()
