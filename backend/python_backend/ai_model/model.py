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
client = OpenAI(api_key=OPENAI_KEY)

INSTRUCTIONS = {
    "nba": f"",
    "nfl": f"",
    "ufc": f"",
    "mlb": f"",
    "nhl": f""
}


class AIModel():
    """
    model_type: the type of AI model to use
    """
    def __init__(self, model_type: object, data: pd.DataFrame, prediction_data:pd.DataFrame = None, sport: str = None):
        self.model_type = model_type
        self.data = data
        self.prediction_data = prediction_data
        self.sport = sport
    def train_model(self):
        pass
    
    def predict(self, home: str, away: str):
        prompt = self.generate_prompt(home, away)
        openai_response = self.use_openai(prompt, INSTRUCTIONS[self.sport])
        new_prediction_data = pd.concat([self.prediction_data, pd.DataFrame(openai_response)], axis=1)
        self.model_type.predict(new_prediction_data)


    def generate_prompt(self, home: str, away: str):
        pass

    
    def evaluate(self):
        pass        

    def use_openai(self, prompt: str, instructions: str) -> dict:
        response = client.responses.create(
            model="o4-mini",
            instructions = instructions,
            input=prompt,
            tools=[{"type": "web_search_preview"}]
        )
        openai_reponse = response.output_text[0].content.text
        return {"LLM_prediction": openai_reponse}
        


class NBA_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)

class NFL_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)

class MLB_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)


class NHL_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)


class UFC_AIModel(AIModel):
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)

    def train_model(self):
        pass
    
    def predict(self):
        pass
    
    def evaluate(self):
        pass

