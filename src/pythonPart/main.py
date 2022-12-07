import pandas as pd
import pickle

from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder 

labelEncoder = LabelEncoder()
ohe = OneHotEncoder(sparse=True)
def getSuggestionsByPrefference ( smoker,  drink_level,  dress_preference,  ambience,  transport,  marital_status,  age,  interest,  personality,  activity,  budget ) :
  restaurants_df=pd.read_csv("/content/drive/MyDrive/Python/unique_restaurant_details_flawless.csv")
  dataset=pd.read_csv("/content/drive/MyDrive/Python/dataset_flawless.csv")

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
  Y = dataset.iloc[:1042,0]

  X_to_be_predicted = dataset.iloc[1042:,1:]
  X = X.drop(['area', 'dress_code', 'hijos', 'religion', 'accessibility', 'other_services'], axis=1)
  X_to_be_predicted = X_to_be_predicted.drop(['Rating_sum','area', 'dress_code', 'hijos', 'religion', 'accessibility', 'other_services'], axis=1)

  # dataset = dataset.drop(['Rating_sum','area', 'dress_code', 'hijos', 'religion', 'accessibility', 'other_services'], axis=1)
  # restaurants_df = restaurants_df.drop(['area', 'dress_code', 'accessibility', 'other_services'], axis=1)
  
  # dataset.to_csv("/content/drive/MyDrive/Python/dataset_flawless_cleaned.csv")
  # restaurants_df.to_csv("/content/drive/MyDrive/Python/unique_restaurant_details_flawless_cleaned.csv")


  loaded_model = pickle.load(open('/content/drive/MyDrive/Python/modelKNN', 'rb'))


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
        ['name', 'city', 'longitude', 'latitude'], 
        [name, city, longitude, latitude]))
    suggestions.append(suggestion_dict)

  return suggestions

# getSuggestionsByPrefference(
#   0,
#   'social drinker',
#   'formal',
#   'friends',
#   'car owner',
#   'single',
#   21,
#   'technology',
#   'hunter-ostentatious',
#   'student',
#   'low'
# )


# adding col name, smoker
# [False True]
# adding col name, drink_level
# ['social drinker' 'casual drinker' 'abstemious']
# adding col name, dress_preference
# ['formal' 'informal' 'no preference']
# adding col name, ambience
# ['family' 'friends' 'solitary']
# adding col name, transport
# ['public' 'car owner']
# adding col name, marital_status
# ['married' 'single']
# adding col name, interest
# ['technology' 'variety' 'none' 'eco-friendly' 'retro']
# adding col name, personality
# ['thrifty-protector' 'hard-worker' 'hunter-ostentatious' 'conformist']
# adding col name, activity
# ['student' 'professional']
# adding col name, budget
# ['medium' 'low' 'high']
# adding col name, alcohol
# ['No_Alcohol_Served' 'Wine-Beer' 'Full_Bar']
# adding col name, smoking_area
# ['not permitted' 'none' 'permitted' 'section' 'only at bar']
# adding col name, price
# ['medium' 'low' 'high']
# adding col name, Rambience
# ['familiar' 'quiet']