from flask import Flask, render_template, request
import pandas as pd

app = Flask(__name__)

# Load the hotel dataset
file_path = "D:/aaaah/projects/DTI/DATASETS/google_hotel_data_clean_v2.csv"
df = pd.read_csv(file_path)

@app.route('/')
def home():
    return render_template('hotelindex.html')

@app.route('/search', methods=['POST'])
def search():
    city = request.form['city'].strip().lower()
    nights = int(request.form['nights'])

    hotels = df[df['City'].str.lower() == city]
    if hotels.empty:
        return render_template('hotelindex.html', message="No hotels found in this city.")

    hotels_list = hotels.to_dict(orient='records')
    for hotel in hotels_list:
        hotel['Total_Price'] = hotel['Hotel_Price'] * nights

    return render_template('hotelresults.html', hotels=hotels_list, nights=nights, city=city.capitalize())

if __name__ == '__main__':
    app.run(debug=True)
