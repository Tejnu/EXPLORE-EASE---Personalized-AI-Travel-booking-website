import pandas as pd
import numpy as np
import re
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from tabulate import tabulate
import random

# --------------------------------------------------
# 1. Display Welcome Message
# --------------------------------------------------
print("**************************************************")
print("           Welcome to the Enhanced AI Travel Planner")
print("   Discover your ideal travel destinations using advanced machine learning!")
print("**************************************************\n")

# --------------------------------------------------
# 2. Load the Datasets
# --------------------------------------------------
try:
    places_df = pd.read_csv(r"C:\Users\bhanu\OneDrive\Documents\Places.csv")
    print("Places Dataset Loaded. Shape:", places_df.shape)
except FileNotFoundError:
    print("Error: Places file not found. Please check the file path.")
    exit()
except Exception as e:
    print(f"An error occurred while loading the Places dataset: {str(e)}")
    exit()

try:
    city_df = pd.read_csv(r"C:\Users\bhanu\OneDrive\Documents\City.csv")
    print("\nCity Dataset Loaded. Shape:", city_df.shape)
    print(city_df.head())
except Exception as e:
    print("Error loading the City dataset:", e)
    exit()

# --------------------------------------------------
# 3. Data Preprocessing for Places Dataset
# --------------------------------------------------
def extract_distance(value):
    """Safely extract numeric distance from a given value."""
    if pd.isna(value):
        return np.nan
    value = str(value)
    match = re.search(r'\d+', value)
    return int(match.group()) if match else np.nan

# Clean the Places data
places_df['Distance_km'] = places_df['Distance'].apply(extract_distance)
places_df['Ratings'] = places_df['Ratings'].astype(float)
places_df['Clean_Place'] = places_df['Place'].str.replace(r'^\d+\.\s*', '', regex=True)
places_df['City'] = places_df['City'].str.strip()

print("\nMissing Values in Places Dataset (Before Handling):")
print(places_df.isnull().sum())
places_df['Distance_km'] = places_df['Distance_km'].fillna(places_df['Distance_km'].median())
places_df['Ratings'] = places_df['Ratings'].fillna(places_df['Ratings'].median())

# Create a synthetic target variable (User_Satisfaction)
np.random.seed(42)
places_df['User_Satisfaction'] = (places_df['Ratings'] * 0.7 +
                                  (1 - places_df['Distance_km'] / places_df['Distance_km'].max()) * 0.3 * 5)
places_df['User_Satisfaction'] += np.random.normal(0, 0.3, len(places_df))
places_df['User_Satisfaction'] = places_df['User_Satisfaction'].clip(0, 5)

# --------------------------------------------------
# 4. Merge the City Dataset with Places Dataset
# --------------------------------------------------
df = pd.merge(places_df, city_df, on='City', how='left', suffixes=('', '_city'))
print("\nAfter merging, combined dataset shape:", df.shape)

# --------------------------------------------------
# 5. (Optional) Exploratory Data Analysis
# --------------------------------------------------
try:
    sns.set(style="whitegrid")
    print("\nSummary Statistics for Ratings and Distance:")
    print(df[['Ratings', 'Distance_km']].describe())

    plt.figure(figsize=(8, 4))
    sns.histplot(df['Ratings'], bins=10, kde=True, color='skyblue')
    plt.title('Distribution of Ratings')
    plt.xlabel('Ratings')
    plt.ylabel('Frequency')
    plt.tight_layout()
    plt.show()

    plt.figure(figsize=(8, 4))
    sns.histplot(df['Distance_km'], bins=10, kde=True, color='salmon')
    plt.title('Distribution of Distance (km)')
    plt.xlabel('Distance (km)')
    plt.ylabel('Frequency')
    plt.tight_layout()
    plt.show()

    plt.figure(figsize=(8, 4))
    sns.countplot(x='City', data=df, palette='viridis')
    plt.title('Count of Places per City')
    plt.xlabel('City')
    plt.ylabel('Number of Places')
    plt.tight_layout()
    plt.show()

except Exception as e:
    print("Error during EDA visualization:", e)

# --------------------------------------------------
# 6. Feature Engineering & Preprocessing Pipeline
# --------------------------------------------------
numeric_features = ['Ratings', 'Distance_km']
categorical_features = ['City']
if 'Population' in df.columns:
    numeric_features.append('Population')
if 'Region' in df.columns:
    categorical_features.append('Region')

print("\nNumeric Features:", numeric_features)
print("Categorical Features:", categorical_features)

preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# --------------------------------------------------
# 7. Model Development with XGBoost and Hyperparameter Tuning
# --------------------------------------------------
X = df[numeric_features + categorical_features]
y = df['User_Satisfaction']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', XGBRegressor(random_state=42))
])

param_grid = {
    'regressor__n_estimators': [100, 200, 300],
    'regressor__max_depth': [3, 5, 7],
    'regressor__learning_rate': [0.01, 0.1, 0.2],
    'regressor__subsample': [0.8, 0.9, 1.0],
    'regressor__colsample_bytree': [0.8, 0.9, 1.0]
}

search = RandomizedSearchCV(pipeline, param_grid, n_iter=50, scoring='neg_mean_squared_error',
                            cv=3, random_state=42, n_jobs=-1)
search.fit(X_train, y_train)
best_model = search.best_estimator_
print(f"\nBest Parameters: {search.best_params_}")

# --------------------------------------------------
# 8. Model Evaluation
# --------------------------------------------------
y_pred = best_model.predict(X_test)
rmse = mean_squared_error(y_test, y_pred, squared=False)
r2 = r2_score(y_test, y_pred)
print("\nEnhanced Model Evaluation:")
print(f"RMSE: {rmse:.3f}")
print(f"R² Score: {r2:.3f}")

# --------------------------------------------------
# 9. Recommendation System: Filtering Recommended Spots
# --------------------------------------------------
def enhanced_recommendations(city, min_rating=3.5, max_distance=50):
    """
    Filter recommended spots based on:
      - City (case insensitive)
      - Minimum rating threshold
      - Maximum distance threshold
    Compute predicted satisfaction and recommendation score.
    Returns matching spots sorted by score.
    """
    filtered = df[(df['City'].str.lower() == city.lower()) &
                  (df['Ratings'] >= min_rating) &
                  (df['Distance_km'] <= max_distance)]
    
    if filtered.empty:
        return pd.DataFrame()
    
    filtered = filtered.copy()
    filtered['Predicted_Satisfaction'] = best_model.predict(filtered[numeric_features + categorical_features])
    filtered['Recommendation_Score'] = (
        filtered['Predicted_Satisfaction'] * 0.6 +
        filtered['Ratings'] * 0.3 +
        (1 - filtered['Distance_km'] / max_distance) * 0.1
    )
    return filtered.sort_values('Recommendation_Score', ascending=False)

# --------------------------------------------------
# 10. Interactive Interface & Professional Itinerary Planning
# --------------------------------------------------
print("\n" + "="*50)
user_city = input("Enter your destination city: ").strip()
min_rating_input = input("Enter minimum rating (0-5, default 3.5): ")
max_distance_input = input("Enter maximum distance from city center (km, default 50): ")
trip_days_input = input("Enter number of travel days (e.g., 5): ")
num_nights_input = input("Enter number of nights (e.g., 3): ")

min_rating_val = float(min_rating_input) if min_rating_input.strip() else 3.5
max_distance_val = float(max_distance_input) if max_distance_input.strip() else 50
trip_days = int(trip_days_input) if trip_days_input.strip() else 1
num_nights = num_nights_input.strip() if num_nights_input.strip() else "N/A"

# Get the recommended spots based on user criteria
rec_df = enhanced_recommendations(user_city, min_rating_val, max_distance_val)

if not rec_df.empty:
    # Rename column for clarity and sort by predicted satisfaction
    display_df = rec_df[['Clean_Place', 'Ratings', 'Distance_km', 'Predicted_Satisfaction']].copy()
    display_df.rename(columns={'Clean_Place': 'Recommended Spots'}, inplace=True)
    display_df = display_df.sort_values('Predicted_Satisfaction', ascending=False).reset_index(drop=True)
    
    # For itinerary planning, use only the recommended spots
    recommended_spots = list(display_df['Recommended Spots'])
    
    # Partition the recommended spots evenly across the number of travel days
    itinerary_groups = np.array_split(recommended_spots, trip_days)
    
    # --------------------------------------------------
    # Print Professional Itinerary Summary
    # --------------------------------------------------
    print("\n**************************************************")
    print("               ITINERARY SUMMARY & STAY DETAILS")
    print("**************************************************\n")
    for day, spots in enumerate(itinerary_groups, start=1):
        print(f"Day {day}:")
        if len(spots) > 0:
            for spot in spots:
                print(f"  • {spot}")
        else:
            print("  No spots available")
        print()  # Blank line for spacing
    
    print(f"NO. OF NIGHTS: {num_nights}\n")
else:
    print("\nNo recommended spots found matching your criteria. Please try adjusting the filters.")
