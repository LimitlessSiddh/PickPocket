from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor, XGBClassifier
import pandas as pd
import numpy as np
from fetch_data import get_historical_data