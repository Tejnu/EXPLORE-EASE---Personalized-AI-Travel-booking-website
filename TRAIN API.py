import requests
import json


def book_train(train_number, travel_date, source_station, destination_station, passengers, travel_class):
    """
    Books a train ticket using the IRCTC API on RapidAPI.

    Parameters:
      - train_number: (str) The train number (e.g., "12345").
      - travel_date: (str) Travel date in YYYY-MM-DD format.
      - source_station: (str) Source station code (e.g., "NDLS").
      - destination_station: (str) Destination station code (e.g., "BCT").
      - passengers: (list) A list of dictionaries, each containing passenger details.
      - travel_class: (str) Class of travel (e.g., "3A", "2A", "SL").

    Returns:
      - JSON response from the API.
    """

    url = "https://irctc1.p.rapidapi.com/api/v1/getFare"  # Example endpoint (verify in docs)

    payload = {
        "trainNumber": train_number,
        "travelDate": travel_date,
        "sourceStation": source_station,
        "destinationStation": destination_station,
        "passengers": passengers,
        "class": travel_class
    }

    headers = {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "82f94937a4msha3a5a70e90b739fp16a90fjsn002361d4b50f",  # Replace with your RapidAPI key
        "X-RapidAPI-Host": "irctc1.p.rapidapi.com"
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an error for bad HTTP status codes
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print("HTTP error response details:", response.text)
        return {"error": f"HTTP error occurred: {http_err}"}
    except Exception as e:
        return {"error": f"An error occurred: {e}"}

if __name__ == "__main__":
    print("=== Train Booking ===")
    train_number = input("Enter train number: ")
    travel_date = input("Enter travel date (YYYY-MM-DD): ")
    source_station = input("Enter source station code: ")
    destination_station = input("Enter destination station code: ")
    travel_class = input("Enter class (e.g., 3A, 2A, SL): ")

    # For simplicity, this example collects details for one passenger.
    print("\nEnter passenger details:")
    name = input("Name: ")
    age = int(input("Age: "))
    gender = input("Gender (male/female): ")
    berth_preference = input("Berth preference (e.g., LB, MB, UB, SL, GN): ")

    passengers = [
        {
            "name": name,
            "age": age,
            "gender": gender,
            "berthPreference": berth_preference
        }
    ]

    booking_response = book_train(train_number, travel_date, source_station, destination_station, passengers, travel_class)

    print("\nBooking Response:")
    print(json.dumps(booking_response, indent=4))
