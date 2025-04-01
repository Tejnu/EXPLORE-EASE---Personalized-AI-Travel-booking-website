from flask import Flask, render_template, request
import pandas as pd

app = Flask(__name__)

# Load train schedule data
schedules = pd.read_csv("D:/aaaah/projects/DTI/DATASETS/schedules.csv")
train_schedule = pd.read_csv("D:/aaaah/projects/DTI/DATASETS/train_schedule.csv")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search_trains():
    source = request.form['source'].upper()
    destination = request.form['destination'].upper()
    date = request.form['date']  # Placeholder for date-based filtering
    
    # Filter trains based on source and destination
    available_trains = schedules[(schedules['stationFrom'] == source) & (schedules['stationTo'] == destination)]
    
    return render_template('results.html', trains=available_trains.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
