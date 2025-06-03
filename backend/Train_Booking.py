from flask import Flask, render_template, request
import pandas as pd
from datetime import datetime, timedelta

app = Flask(__name__)

# Load train schedules
dataset_path = "D:/Projects/DTI Project/ExploreEase/datasets"
schedules = pd.read_csv(dataset_path + "schedules.csv").apply(lambda x: x.str.strip() if x.dtype == "object" else x)
trains_cleartrip = pd.read_csv(dataset_path + "trains_cleartrip.csv").apply(lambda x: x.str.strip() if x.dtype == "object" else x)
train_schedule = pd.read_csv(dataset_path + "train_schedule.csv").apply(lambda x: x.str.strip() if x.dtype == "object" else x)

# Standardize column names for merging
schedules.rename(columns={'stationFrom': 'source', 'stationTo': 'destination'}, inplace=True)
trains_cleartrip.rename(columns={'Source': 'source', 'Destination': 'destination'}, inplace=True)

# Merge schedules
df_schedules = pd.concat([schedules, trains_cleartrip], ignore_index=True)

day_mapping = {'Mon': 'trainRunsOnMon', 'Tue': 'trainRunsOnTue', 'Wed': 'trainRunsOnWed',
               'Thu': 'trainRunsOnThu', 'Fri': 'trainRunsOnFri', 'Sat': 'trainRunsOnSat', 'Sun': 'trainRunsOnSun'}

def compute_travel_time(dep, arr):
    try:
        dep_time = datetime.strptime(dep, "%H:%M")
        arr_time = datetime.strptime(arr, "%H:%M")
        if arr_time < dep_time:
            arr_time += timedelta(days=1)
        delta = arr_time - dep_time
        return f"{delta.seconds // 3600}:{(delta.seconds % 3600) // 60}"
    except:
        return "N/A"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search_trains():
    source = request.form['source'].strip().upper()
    destination = request.form['destination'].strip().upper()
    date_input = request.form['date'].strip()
    
    date_obj = datetime.strptime(date_input, "%Y-%m-%d")
    weekday = date_obj.strftime("%a")
    day_col = day_mapping.get(weekday, 'trainRunsOnMon')
    
    filtered = df_schedules[(df_schedules['source'] == source) &
                            (df_schedules['destination'] == destination) &
                            (df_schedules[day_col] == 'Y')]
    
    intermediate_trains = df_schedules[(df_schedules['source'] != source) &
                                       (df_schedules['destination'] == destination) &
                                       (df_schedules[day_col] == 'Y')]
    
    all_trains = pd.concat([filtered, intermediate_trains]).drop_duplicates()
    
    all_trains['trainNumber'] = all_trains['trainNumber'].astype(str).str.strip()
    train_schedule['Train_No'] = train_schedule['Train_No'].astype(str).str.strip()
    
    result = pd.merge(all_trains, train_schedule, left_on='trainNumber', right_on='Train_No', how='left')
    
    result.drop_duplicates(subset=['trainNumber'], inplace=True)
    
    result['travelTime'] = result.apply(lambda row: compute_travel_time(row.get('Departure_Time', 'N/A'),
                                                                       row.get('Arrival_time', 'N/A')), axis=1)
    
    trains = result.to_dict(orient='records')
    return render_template('results.html', trains=trains, message="" if trains else f"No trains found from {source} to {destination} on {date_input}")

if __name__ == '__main__':
    app.run(debug=True)
