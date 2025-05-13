from fastapi import FastAPI
from pydantic import BaseModel
from ai_model.model import NBA_AIModel, NFL_AIModel, UFC_AIModel, MLB_AIModel, NHL_AIModel

app = FastAPI()
# use the /docs# route to get a gui for testing api

class MatchResult(BaseModel):
    """
    This represents the predicted result of a match.
    Home or Away
    """
    result: str

class FightResult(BaseModel):
    """
    This represents the predicted result of a fight.
    Fighter1 or Fighter2
    """
    result: str = "Tied"



@app.get("/get_nba_bet_data/{home}/{away}", response_model=MatchResult)
async def get_nba_bet_data(home: str, away: str) -> MatchResult:
    nba_model = NBA_AIModel()
    result = nba_model.predict(home, away)
    return {"result": result}

@app.get("/get_nfl_bet_data/{home}/{away}", response_model=MatchResult)
async def get_nfl_bet_data(home: str, away: str) -> MatchResult:
    nfl_model = NFL_AIModel()
    result = nfl_model.predict(home, away)
    return {"result": result}

@app.get("/get_ufc_bet_data/{fighter1}/{fighter2}", response_model=FightResult)
async def get_ufc_bet_data(fighter1: str, fighter2: str) -> FightResult:
    ufc_model = UFC_AIModel()
    result = ufc_model.predict(fighter1, fighter2)
    return {"result": result}

@app.get("/get_mlb_bet_data/{home}/{away}", response_model=MatchResult)
async def get_mlb_bet_data(home: str, away: str) -> MatchResult:
    mlb_model = MLB_AIModel()
    result = mlb_model.predict(home, away)
    return {"result": result}

@app.get("/get_nhl_bet_data/{home}/{away}", response_model=MatchResult)
async def get_nhl_bet_data(home: str, away: str) -> MatchResult:
    nhl_model = NHL_AIModel()
    result = nhl_model.predict(home, away)
    return {"result": result}