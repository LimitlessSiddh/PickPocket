from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor, XGBClassifier
import pandas as pd
import numpy as np
from fetch_data import get_historical_data
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_KEY")

class AIModel():
    def __init__(self, model_type: str, data: pd.DataFrame):
        self.model_type = model_type
        self.data = data

    def train_model(self):
        pass
    
    def predict(home: str, away: str):
        pass
    
    def evaluate(self):
        pass


class NBA_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)

    def train_model(self):
        pass
    
    def predict(self):
        pass
    
    def evaluate(self):
        pass

class NFL_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)

    def train_model(self):
        pass
    
    def predict(self):
        pass
    
    def evaluate(self):
        pass

class UFC_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)

    def train_model(self):
        pass
    
    def predict(self):
        pass
    
    def evaluate(self):
        pass


class MLB_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)

    def train_model(self):
        pass
    
    def predict(self):
        pass
    
    def evaluate(self):
        pass


class NHL_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)

    def train_model(self):
        pass
    
    def predict(self):
        pass
    
    def evaluate(self):
        pass