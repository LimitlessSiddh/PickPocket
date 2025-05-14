from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_squared_error, mean_absolute_error
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor, XGBClassifier
import pandas as pd
import numpy as np
from fetch_data import FetchData, csv_dict
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_KEY")
client = OpenAI(api_key=OPENAI_KEY)

INSTRUCTIONS = {
    "nba": f"{os.getenv("NBA_INSTRUCTIONS")}",
    "nfl": f"{os.getenv("NFL_INSTRUCTIONS")}",
    "ufc": f"{os.getenv("UFC_INSTRUCTIONS")}",
    "mlb": f"{os.getenv("MLB_INSTRUCTIONS")}",
    "nhl": f"{os.getenv("NHL_INSTRUCTIONS")}"
}


class AIModel():
    """
    data: the historical data to train the model on
    sport: the sport to use for the model
    """
    def __init__(self, data: pd.DataFrame, prediction_data:pd.DataFrame = None, sport: str = None):
        self.data = data
        self.sport = sport
    def train_model(self):
        x_train, x_test, y_train, y_test = train_test_split(self.data, self.prediction_data, test_size=0.2, random_state=42)
        model = XGBRegressor()
    
    def predict(self, home: str, away: str):
        prompt = self.generate_prompt(home, away)
        openai_response = self.use_openai(prompt, INSTRUCTIONS[self.sport])
        new_prediction_data = pd.concat([self.prediction_data, pd.DataFrame(openai_response)], axis=1)
        prediction = self.model_type.predict(new_prediction_data)
        return prediction
    
    def evaluate_model(self):
        pass        

    def fine_tune_model(self):
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
        
NBA_AIModel = AIModel(FetchData("nba.csv", "nba").df, "nba")
NFL_AIModel = AIModel(FetchData("nfl.csv", "nfl").df, "nfl")
MLB_AIModel = AIModel(FetchData("mlb.csv", "mlb").df, "mlb")
NHL_AIModel = AIModel(FetchData("nhl.csv", "nhl").df, "nhl")

class UFC_AIModel(AIModel):
    """
    Since this is not a sport with a set score, we will use a different model.
    """
    def __init__(self, model_type: str, data: pd.DataFrame):
        super().__init__(model_type, data)

    def train_model(self):
        pass
    
    def predict(self):
        pass
    
    def evaluate(self):
        pass

