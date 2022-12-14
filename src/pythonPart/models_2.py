# # -*- coding: utf-8 -*-
# """Models-2.ipynb

# Automatically generated by Colaboratory.

# Original file is located at
#     https://colab.research.google.com/drive/1JM9HsaxKmk8Gh3TI7tMsh06yTZsPITBZ
# """

import pandas as pd
import numpy as np
# import matplotlib.pyplot as plt
# import seaborn as sns
# import scipy as stats

# from google.colab import drive
# drive.mount('/content/drive')

# df=pd.read_csv('/content/drive/MyDrive/Python/dataset.csv')

# df.head()

# df.shape

# import copy
# df2 = copy.deepcopy(df)

# df2['res_latitude'].isna().sum()

# df2 = df2.dropna().reset_index()

# df2['res_latitude'].isna().sum()

# df2.shape

# #Taking some important features from userprofile_df and print their value counts
# features_user = df2
# #Getting all information about features users
# for col in features_user.columns.values:
#         print(features_user[col].value_counts() , "\n--------------------------------------\n")

# """Dropping unnecessary details from the dataset:

# """

# df2 = df2.drop(['food_rating', 'service_rating', 'latitude', 'longitude', 'birth_year', 'color', 'weight',
#           'height', 'res_latitude', 'res_longitude', 'the_geom_meter', 'name', 'address', 'city', 'state', 'country', 'fax', 'zip', 'url', 
#           'franchise'], axis = 1)

# """Replacing ? and combining classes"""

# df2['smoker'].value_counts()

# df2['smoker'].replace(['?'],
#                         ['FALSE'], inplace=True)

# df2.head()

# df2['smoker'].value_counts()

# df2['drink_level'].value_counts()

# df2['dress_preference'].value_counts()

# df2['dress_preference'].replace(['?', 'elegant'],
#                         ['no preference', 'formal'], inplace=True)

# df2['dress_preference'].value_counts()

# df2['ambience'].value_counts()

# df2['ambience'].replace(['?'],
#                         ['family'], inplace=True)

# df2['ambience'].value_counts()

# df2['transport'].value_counts()

# df2['transport'].replace(['?', 'on foot'],
#                         ['public', 'public'], inplace=True)

# df2['transport'].value_counts()

# df2['marital_status'].value_counts()

# df2['marital_status'].replace(['?', 'widow'],
#                         ['single', 'single'], inplace=True)
# df2['marital_status'].value_counts()

# df2['hijos'].value_counts()

# df2['hijos'].replace(['kids', '?'],
#                         ['dependent', 'independent'], inplace=True)
# df2['hijos'].value_counts()

# df2['interest'].value_counts()

# df2['personality'].value_counts()

# df2['religion'].value_counts()

# df2['religion'].replace(['Christian', 'Mormon', 'Jewish'],
#                         ['Catholic', 'Catholic', 'Catholic'], inplace=True)
# df2['religion'].value_counts()

# df2['activity'].value_counts()

# df2['activity'].replace(['working-class', 'unemployed', '?'],
#                         ['professional', 'student', 'student'], inplace=True)
# df2['activity'].value_counts()

# df2['budget'].value_counts()

# df2['budget'].replace(['?'],
#                         ['medium'], inplace=True)
# df2['budget'].value_counts()

# df2['alcohol'].value_counts()

# df2['smoking_area'].value_counts()

# df2['smoking_area'].replace(['section'],
#                         ['permitted'], inplace=True)
# df2['smoking_area'].value_counts()

# df2['dress_code'].value_counts()                                              #can be removed

# df2.columns

# df2['accessibility'].value_counts()

# df2['price'].value_counts()

# df2['Rambience'].value_counts()

# df2['area'].value_counts()                                                   # can be removed

# df2['other_services'].value_counts()

# df2['other_services'].replace(['Internet'],
#                         ['variety'], inplace=True)
# df2['other_services'].value_counts()

# df2.head()

# df2.to_csv('/content/drive/MyDrive/Colab Notebooks/FDS data/project/auto_generated.csv')

# !pip install matrix_factorization

# from matrix_factorization import BaselineModel, KernelMF, train_update_test_split

# import pandas as pd
# from sklearn.metrics import mean_squared_error

# dfmf = copy.deepcopy(df2)

# dfmf.rename(columns = {'userID':'user_id'}, inplace = True)
# dfmf['user_id'] = dfmf['user_id'].str[1:]
# dfmf['user_id'] = dfmf['user_id'].astype('int')

# all_models_accuracies = {}

# """### Matrix Factorisation-"""

# dfmf.rename(columns = {'placeID':'item_id'}, inplace = True)

# dfmf.head()

# X = dfmf[["user_id", "item_id"]]
# y = dfmf["rating"].to_numpy()

# print(X.dtypes)

# print(y)

# class matrix_factorization():
#   def __init__(self, data, features):
#     import numpy as np
#     self.data = data
#     self.features = features
#     self.user_count = data.shape [0]
#     self.item_count = data.shape[1]
#     self.user_features = np.random.uniform(low=0.1, high=0.9, size= (self.user_count, self.features))
#     self.item_features = np.random.uniform(low=0.1, high=0.9, size= (self.features, self.item_count))

#   def MSE(self):
#     matrix_product = np.matmul (self.user_features, self.item_features)
#     return np.sum((self.data-matrix_product)**2)

#   def single_gradient(self,user_row,item_col,wrt_user_idx=None,wrt_item_idx=None):
#     if wrt_user_idx != None and wrt_item_idx != None:
#       return "Too many elements"
#     elif wrt_user_idx == None and wrt_item_idx == None:
#       return "insufficient elements"
#     else:
#       u_row = self.user_features[user_row,:]
#       i_col = self.item_features[:,item_col]
#       ui_rating = float(self.data[user_row,item_col])
#       prediction = float(np.dot(u_row,i_col))
      
#       if wrt_user_idx != None:
#         row_elem = float(i_col[wrt_user_idx])
#         gradient = 2* (ui_rating - prediction)*row_elem
#       else:
#         col_elem = float(u_row[wrt_item_idx])
#         gradient = 2* (ui_rating - prediction)*col_elem
#       return gradient

#   def user_feature_gradient(self,user_row,wrt_user_idx):
#     summation = 0
#     for col in range (0,self.item_count):
#       summation += self.single_gradient (user_row=user_row, item_col=col,wrt_user_idx=wrt_user_idx)
#     return summation/self.item_count

#   def item_feature_gradient(self,item_col,wrt_item_idx):
#     summation = 0
#     for row in range (0,self.user_count):
#       summation += self.single_gradient(user_row = row, item_col = item_col, wrt_item_idx = wrt_item_idx)
#     return summation/self.user_count

#   def update_user_features (self,learning_rate):
#     for i in range (0, self.user_count):
#       for j in range(0,self.features) :
#         self.user_features[i,j] += learning_rate*self.user_feature_gradient (user_row=i,wrt_user_idx=j)

#   def update_item_features (self, learning_rate):
#     for i in range (0, self.features):
#       for j in range(0,self.item_count):
#         self.item_features[i,j] += learning_rate*self.item_feature_gradient (item_col=j,wrt_item_idx=i)

#   def train_model(self,learning_rate=0.1,iterations=1000):
#     for i in range (iterations):
#       self.update_user_features(learning_rate=learning_rate)
#       self.update_item_features(learning_rate=learning_rate)
#       if i % 50 == 0:
#         print(self.MSE())

# import numpy as np
# d = np.array([[5,3,1], [1,3,5], [3,5,1]])
# d2 = matrix_factorization(d,2)
# d2.train_model(learning_rate = .1)

# from matrix_factorization import BaselineModel, KernelMF, train_update_test_split
# from sklearn.metrics import mean_squared_error

# X = dfmf[["user_id", "item_id"]]
# y = dfmf["Rating_sum"]

# # Prepare data for online learning
# (
#     X_train_initial,
#     y_train_initial,
#     X_train_update,
#     y_train_update,
#     X_test_update,
#     y_test_update,
# ) = train_update_test_split(dfmf, frac_new_users=0.1)

# # Initial training
# matrix_fact = KernelMF(n_epochs=20, n_factors=100, verbose=1, lr=0.002, reg=0.005)
# matrix_fact.fit(X_train_initial, y_train_initial)

# # Update model with new users
# matrix_fact.update_users(
#     X_train_update, y_train_update, lr=0.002, n_epochs=20, verbose=1
# )
# pred = matrix_fact.predict(X_test_update)
# rmse = mean_squared_error(y_test_update, pred, squared=False)
# #print(f"\nTest RMSE: {rmse:.4f}")

# # Get recommendations
# user = 1077
# items_known = X_train_initial.query("user_id == @user")["item_id"]
# matrix_fact.recommend(user=user, items_known=items_known)

# print("\n\nFinal Accuracy: %.2f%%" % (rmse * 100.0))
# all_models_accuracies['Matrix Factorisation'] = (rmse * 100.0)

# df2 = df2.drop(['index', 'userID', 'placeID'], axis = 1)

# """### apply XGBoost from https://machinelearningmastery.com/develop-first-xgboost-model-python-scikit-learn/"""

# # First XGBoost model for Pima Indians dataset
# from numpy import loadtxt
# from xgboost import XGBClassifier
# from xgboost import XGBRegressor
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import accuracy_score
# from sklearn.preprocessing import LabelEncoder
# le = LabelEncoder()

# # load data

# import copy 
# dataset = copy.deepcopy(df2)
# dataset = dataset.drop(['Rating_sum'], axis = 1)

# # split data into X and y
# X = dataset.iloc[:,1:22]
# Y = dataset.iloc[:,0]

# # X = X.drop(['dress_code', 'hijos', 'religion'], axis=1)
# X = X.drop(['area','other_services'], axis=1)
# X = X.drop(['dress_code', 'hijos', 'religion', 'accessibility'], axis=1)

# dataset.columns

# X.columns

# """### Data transformation from categorical to numerical, bool, float

# """

# from sklearn.preprocessing import OneHotEncoder

# ohe = OneHotEncoder(sparse=True)

# # X['dress_preference'].value_counts()

# for col_name in ['smoker', 'drink_level', 'dress_preference', 'ambience', 'transport',
#        'marital_status', 'interest', 'personality', 'activity',
#        'budget', 'alcohol', 'smoking_area', 'price', 'Rambience']:
#        X[col_name] = le.fit_transform(X[col_name])

# # X = ohe.fit_transform(X).toarray()

# X

# """20 mean accuracy
# All models from https://analyticsindiamag.com/7-types-classification-algorithms/

# """

# # split data into train and test sets
# total = 0
# for seed in range(0,10):
#   test_size = 0.20
#   X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, random_state=seed)
#   # fit model no training data
#   model = XGBRegressor( eta =0.1 , eval_metric = 'rmse', 
#                   n_estimators = 400 , seed = 123)
#   model.fit(X_train, y_train)
#   # make predictions for test data
#   y_pred = model.predict(X_test)
#   predictions = [round(value) for value in y_pred]
#   y_test = y_test.tolist()
#   for i in range(len(predictions)):
#     if predictions[i] == 0 or predictions[i] == 1:
#       predictions[i]=0
#     if predictions[i] == 2 or predictions[i] == 3:
#       predictions[i]=1
#     if predictions[i] == 4 or predictions[i] == 5 or predictions[i] == 6:
#       predictions[i]=2
#   for i in range(len(y_test)):
#     if y_test[i] == 0 or y_test[i] == 1:
#       y_test[i]=0
#     if y_test[i] == 2 or y_test[i] == 3:
#       y_test[i]=1
#     if y_test[i] == 4 or y_test[i] == 5 or y_test[i] == 6:
#       y_test[i]=2
#   # evaluate predictions
#   accuracy = accuracy_score(y_test, predictions)
#   print("Accuracy: %.2f%%" % (accuracy * 100.0))
#   total = total + accuracy
# print("Final Accuracy: %.2f%%" % (total * 100.0/10))
# all_models_accuracies['XGBoostClassifier'] = (total * 100.0/10)

# XGBoost_accuracies = {}
# for n_estimator in range(1,500,5):
#   total = 0
#   for seed in range(0,10):
#     test_size = 0.20
#     X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, random_state=seed)
#     # fit model no training data
#     model = XGBRegressor( eta =0.1 , eval_metric = 'rmse', 
#                     n_estimators = n_estimator , seed = 123)
#     model.fit(X_train, y_train)
#     # make predictions for test data
#     y_pred = model.predict(X_test)
#     predictions = [round(value) for value in y_pred]
#     y_test = y_test.tolist()
#     for i in range(len(predictions)):
#       if predictions[i] == 0 or predictions[i] == 1:
#         predictions[i]=0
#       if predictions[i] == 2 or predictions[i] == 3:
#         predictions[i]=1
#       if predictions[i] == 4 or predictions[i] == 5 or predictions[i] == 6:
#         predictions[i]=2
#     for i in range(len(y_test)):
#       if y_test[i] == 0 or y_test[i] == 1:
#         y_test[i]=0
#       if y_test[i] == 2 or y_test[i] == 3:
#         y_test[i]=1
#       if y_test[i] == 4 or y_test[i] == 5 or y_test[i] == 6:
#         y_test[i]=2
#     # evaluate predictions
#     accuracy = accuracy_score(y_test, predictions)
#     print("Accuracy: %.2f%%" % (accuracy * 100.0))
#     total = total + accuracy
#   print("Final Accuracy: %.2f%%" % (total * 100.0/10))
#   XGBoost_accuracies[n_estimator] = (total * 100.0/10)

# import plotly.graph_objects as go
# # create trace1
# trace1 = go.Bar(
#                 x = list(XGBoost_accuracies.keys()),
#                 y = list(XGBoost_accuracies.values()),
#                 marker = dict(color = 'rgb(0, 128, 128)',
#                               line=dict(color='rgb(0,0,0)',width=1)))
# layout = go.Layout(title = 'Accuracy of different n_estimators in XGBoost Classifier' , xaxis = dict(title = 'Different XGBoost n_estimators'), yaxis = dict(title = '% of Accuracy'))
# fig = go.Figure(data = [trace1], layout = layout)
# fig.show()

# """ROC_AUC score of XGBoost algorithm"""

# # from sklearn.metrics import confusion_matrix
# # from sklearn.metrics import classification_report

# # cm = confusion_matrix(y_test, predictions)
# # # Creating a dataframe for a array-formatted Confusion matrix,so it will be easy for plotting.
# # cm_df = pd.DataFrame(cm,
# #                      index = ['0','1','2','3','4'], 
# #                      columns = ['0','1','2','3','4'])
# # plt.figure(figsize=(5,4))
# # sns.heatmap(cm_df, annot=True)
# # plt.title('Confusion Matrix')
# # plt.ylabel('Actal Values')
# # plt.xlabel('Predicted Values')
# # plt.show()

# """.Let us calculate the TP, TN, FP, FN values for the class Setosa using the Above tricks:

# TP: The actual value and predicted value should be the same. So concerning Setosa class, the value of cell 1 is the TP value.

# FN: The sum of values of corresponding rows except the TP value

# FN = (cell 2 + cell3)

# = (0 + 0)

# = 0

# FP : The sum of values of corresponding column except the TP value.

# FP = (cell 4 + cell 7)

# = (0 + 0)

# = 0

# TN: The sum of values of all columns and row except the values of that class that we are calculating the values for.

# TN = (cell 5 + cell 6 + cell 8 + cell 9)

# = 17 + 1 +0 + 11

# = 29

# """

# tp=27
# fn=39
# fp=12
# tn=140+33+62

# precision = tp/(tp+fp)
# print(precision)

# recall = tp/(tp+fn)
# print(recall)

# f1_score = 2*(precision*recall)/(precision+recall)
# print(f1_score)

# # RANDOM FOREST
# from sklearn.ensemble import RandomForestClassifier
# total = 0
# for seed in range(0,10):
#   test_size = 0.20
#   X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, random_state=seed)
#   # fit model no training data
#   clf=RandomForestClassifier(n_estimators=10)

#   #Train the model using the training sets y_pred=clf.predict(X_test)
#   clf.fit(X_train,y_train)

#   y_pred=clf.predict(X_test)
#   predictions = [round(value) for value in y_pred]
#   # evaluate predictions
#   accuracy = accuracy_score(y_test, predictions)
#   print("Accuracy: %.2f%%" % (accuracy * 100.0))
#   total = total + accuracy
# print("Final Accuracy: %.2f%%" % (total * 100.0/10))
# all_models_accuracies['RandomForestClassifier'] = (total * 100.0/10)

# """## Hyperparameter tuning of KNN"""

# from sklearn.neighbors import KNeighborsClassifier
# from sklearn.model_selection import GridSearchCV
# #List Hyperparameters that we want to tune.
# leaf_size = list(range(1,50))
# n_neighbors = list(range(1,30))
# p=[1,2]
# #Convert to dictionary
# hyperparameters = dict(leaf_size=leaf_size, n_neighbors=n_neighbors, p=p)
# #Create new KNN object
# knn_2 = KNeighborsClassifier()
# #Use GridSearch
# clf = GridSearchCV(knn_2, hyperparameters, cv=10)
# #Fit the model
# best_model = clf.fit(X,Y)
# #Print The value of best Hyperparameters
# print('Best p:', best_model.best_estimator_.get_params()['p'])

# """P=1 means manhattan distance(l1)

# P=2 means Eucledian Distance(l2)
# """

# from sklearn.neighbors import KNeighborsClassifier
# total = 0
# for seed in range(0,10):
#   test_size = 0.30
#   X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, random_state=seed)
#   # fit model no training data
#   accuracy_list = []
#   y_test=y_test.tolist()
#   for i in range(len(y_test)):
#     if y_test[i] == 0 or y_test[i] == 1:
#       y_test[i]=0
#     if y_test[i] == 2 or y_test[i] == 3:
#       y_test[i]=1
#     if y_test[i] == 4 or y_test[i] == 5 or y_test[i] == 6:
#       y_test[i]=2

#   for K in range(2,30):
#     clf=KNeighborsClassifier(n_neighbors=K, p=2)

#     #Train the model using the training sets y_pred=clf.predict(X_test)
#     clf.fit(X_train,y_train)

#     y_pred=clf.predict(X_test)
#     predictions = [round(value) for value in y_pred]
#     for i in range(len(predictions)):
#       if predictions[i] == 0 or predictions[i] == 1:
#         predictions[i]=0
#       if predictions[i] == 2 or predictions[i] == 3:
#         predictions[i]=1
#       if predictions[i] == 4 or predictions[i] == 5 or predictions[i] == 6:
#         predictions[i]=2
    
#     # evaluate predictions
#     accuracy = accuracy_score(y_test, predictions)
#     print("Accuracy: %.2f%%" % (accuracy * 100.0))
#     total = total + accuracy
#     accuracy_list.append(accuracy*100)
# print(accuracy_list)
# all_models_accuracies['KNN, K=5'] = max(accuracy_list)

# import matplotlib.pyplot as plt
# xs = [x+2 for x in range(len(accuracy_list))]
# plt.plot(xs, accuracy_list)
# plt.show()
# # Make sure to close the plt object once done
# plt.close()

# import plotly.graph_objects as go
# # create trace1
# trace1 = go.Bar(
#                 x = list(all_models_accuracies.keys()),
#                 y = list(all_models_accuracies.values()),
#                 marker = dict(color = 'rgb(0, 128, 128)',
#                               line=dict(color='rgb(0,0,0)',width=1.5)))
# layout = go.Layout(title = 'Accuracy of different Classifier Models' , xaxis = dict(title = 'Classifier Models'), yaxis = dict(title = '% of Accuracy'))
# fig = go.Figure(data = [trace1], layout = layout)
# fig.show()

# """## Fetching top 20 restaurants using User Profile:

# """

# import copy
# dataset = copy.deepcopy(df2)

# dataset.columns

# dataset = dataset.drop(['rating'], axis = 1)

restaurants_df=pd.read_csv("/content/drive/MyDrive/Python/unique_restaurant_details_flawless.csv")

#@title GET USER DETAILS


smoker = 'FALSE'

drink_level = 'social drinker'

dress_preference = 'formal'

ambience = 'friends'

transport = 'car owner'

marital_status = 'single'

age = 21

interest = 'technology'

personality = 'hunter-ostentatious'

activity = 'student'

budget = 'low'

user_latitude = 23.335448

user_longitude = -101.05468

for index, row in restaurants_df.iterrows():
  alcohol = row['alcohol']
  smoking_area = row['smoking_area']
  price = row['price']
  Rambience = row['Rambience']
  data_dict = {'smoker':smoker, 'drink_level':drink_level, 'dress_preference':dress_preference, 'ambience':ambience, 'transport':transport,
        'marital_status':marital_status, 'age':age, 'interest':interest, 'personality':personality, 'activity':activity,
        'budget':budget, 'alcohol':alcohol, 'smoking_area':smoking_area, 'price':price, 'Rambience':Rambience}

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
X_to_be_predicted = X_to_be_predicted.drop(['area', 'dress_code', 'hijos', 'religion', 'accessibility', 'other_services'], axis=1)

Y.isna().sum()

clf=KNeighborsClassifier(n_neighbors=5, p=2)
clf.fit(X,Y)

y_pred=clf.predict(X_to_be_predicted)

# print(y_pred)

# FIND PREDICTED RANKINGS OF RESTAURANTS
rank = []
for i in range(6,-1,-1):
  for j in range(len(y_pred)):
    if y_pred[j] == i:
      rank.append(j)

# print(rank)

# GET TOP 20 RANKINGS OF RESTAURANTS
top_20=rank[:20]
# print(top_20)

# !pip install texttable

# restaurants=[]
# restaurants.append(['Rank','Name', 'City'])
# counter=0
# for index in top_20:
#   index = counter
#   counter += 1
#   name = restaurants_df.iloc[index]['name']
#   city = restaurants_df.iloc[index]['city']
#   restaurants.append([counter,name,city])


# from texttable import Texttable
# t = Texttable()
# t.add_rows(restaurants)
# print(t.draw())

# # from tabulate import tabulate
# # tabulate(restaurants, headers=['Name', 'City'],tablefmt='orgtbl')

# """## Sort by distance from user"""

# X_test.columns

# from math import radians, cos, sin, asin, sqrt
# def distance(lat1, lat2, lon1, lon2):
     
#     # The math module contains a function named
#     # radians which converts from degrees to radians.
#     lon1 = radians(lon1)
#     lon2 = radians(lon2)
#     lat1 = radians(lat1)
#     lat2 = radians(lat2)
      
#     # Haversine formula
#     dlon = lon2 - lon1
#     dlat = lat2 - lat1
#     a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
 
#     c = 2 * asin(sqrt(a))
    
#     # Radius of earth in kilometers. Use 3956 for miles
#     r = 6371
      
#     # calculate the result
#     return(c * r)

# restaurant_distance_dict = {}
# counter=0
# for index in top_20:
#   index = counter
#   counter += 1
#   res_latitude = restaurants_df.iloc[index]['latitude']
#   res_longitude = restaurants_df.iloc[index]['longitude']
#   index = index
#   restaurant_distance_dict[index] = distance(user_latitude,res_latitude,user_longitude,res_longitude)
# sorted_rest_distance_dict = dict(sorted(restaurant_distance_dict.items(), key=lambda x: x[1]))

# counter=0
# distance_rest_list=[]
# distance_rest_list.append(['Rank','Name', 'City','Distance'])
# for index in sorted_rest_distance_dict.keys():
#   counter += 1
#   name = restaurants_df.loc[index]['name']
#   city = restaurants_df.loc[index]['city']
#   distance = sorted_rest_distance_dict[index]
#   distance_rest_list.append([counter,name,city,str(distance/10)[:5]+" KM"])

# t = Texttable()
# t.add_rows(distance_rest_list)
# print(t.draw())

# """todo optional:
# - more evaluation metrics add
# """