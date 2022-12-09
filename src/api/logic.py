import pandas as pd
import pickle

from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder 

labelEncoder = LabelEncoder()
ohe = OneHotEncoder(sparse=True)
def getSuggestionsByPrefference ( smoker,  drink_level,  dress_preference,  ambience,  transport,  marital_status,  age,  interest,  personality,  activity,  budget ) :
  restaurants_df=pd.read_csv("D:/SNU/CSD/CSD 493 - Project-1/software/Restaurant-Recommendation-System/src/csvFiles/unique_restaurant_details_flawless.csv")
  dataset=pd.read_csv("D:/SNU/CSD/CSD 493 - Project-1/software/Restaurant-Recommendation-System/src/csvFiles/dataset_flawless.csv")

  for index, row in restaurants_df.iterrows():
    alcohol = row['alcohol']
    smoking_area = row['smoking_area']
    price = row['price']
    Rambience = row['Rambience']

    # parse arguments
    data_dict = {'smoker':smoker, 'drink_level':drink_level, 'dress_preference':dress_preference, 'ambience':ambience, 'transport':transport,
          'marital_status':marital_status, 'age':age, 'interest':interest, 'personality':personality, 'activity':activity,
          'budget':budget, 'alcohol':alcohol, 'smoking_area':smoking_area, 'price':price, 'Rambience':Rambience}

    # add arguments to dataset
    dataset = dataset.append(data_dict,ignore_index=True)

  #one hot encoding
  for col_name in ['smoker', 'drink_level', 'dress_preference', 'ambience', 'transport',
        'marital_status', 'interest', 'personality', 'activity',
        'budget', 'alcohol', 'smoking_area', 'price', 'Rambience']:
        
        dataset[col_name] = labelEncoder.fit_transform(dataset[col_name])
    
  X = dataset.iloc[:1042,1:]

  X_to_be_predicted = dataset.iloc[1042:,1:]
  X = X.drop(['area', 'dress_code', 'hijos', 'religion', 'accessibility', 'other_services'], axis=1)
  X_to_be_predicted = X_to_be_predicted.drop(['Rating_sum','area', 'dress_code', 'hijos', 'religion', 'accessibility', 'other_services'], axis=1)

  loaded_model = pickle.load(open('D:/SNU/CSD/CSD 493 - Project-1/software/Restaurant-Recommendation-System/src/model/modelMatrixFactorization', 'rb'))
  y_pred = loaded_model.predict(X_to_be_predicted)

  # FIND PREDICTED RANKINGS OF RESTAURANTS
  rank = []
  for i in range(6,-1,-1):
    for j in range(len(y_pred)):
      if y_pred[j] == i:
        rank.append(j)

  # GET TOP 20 RANKINGS OF RESTAURANTS
  top20Restuarants = rank[:20]

  suggestions=[]
  counter=0
  for index in top20Restuarants:
    index = counter
    counter += 1
    name = restaurants_df.iloc[index]['name']
    city = restaurants_df.iloc[index]['city']
    longitude = restaurants_df.iloc[index]['longitude']
    latitude = restaurants_df.iloc[index]['latitude']
    # suggestions.append([counter,name,city, longitude, latitude])
    suggestion_dict = dict(zip(
        ['name', 'city', 'coords'], 
        [name, city, [latitude, longitude]]))
    suggestions.append(suggestion_dict)

  return suggestions
