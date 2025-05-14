from fastapi import FastAPI
from pydantic import BaseModel
from ai_model.model import NBA_AIModel, NFL_AIModel, UFC_AIModel, MLB_AIModel, NHL_AIModel


app = FastAPI()
# use the /docs# route to get a gui for testing api

class MatchResult(BaseModel):
    """
    This represents the predicted result of a match.
    This comes in the point of a spread normalized between -5 and 5
    This allows to make a rating system for each match, whether to bet on home
    or away
    """
    result: int

class FightResult(BaseModel):
    """
    This represents the predicted result of a fight.
    Fighter1 or Fighter2
    """
    result: str = "Tied"



@app.get("/get_nba_bet_data/{home}/{away}", response_model=MatchResult)
async def get_nba_bet_data(home: str, away: str) -> MatchResult:
    result = NBA_AIModel.predict(home, away)
    return {"result": result}

@app.get("/get_nfl_bet_data/{home}/{away}", response_model=MatchResult)
async def get_nfl_bet_data(home: str, away: str) -> MatchResult:
    result = NFL_AIModel.predict(home, away)
    return {"result": result}

@app.get("/get_ufc_bet_data/{fighter1}/{fighter2}", response_model=FightResult)
async def get_ufc_bet_data(fighter1: str, fighter2: str) -> FightResult:
    result = UFC_AIModel.predict(fighter1, fighter2)
    return {"result": result}

@app.get("/get_mlb_bet_data/{home}/{away}", response_model=MatchResult)
async def get_mlb_bet_data(home: str, away: str) -> MatchResult:
    result = MLB_AIModel.predict(home, away)
    return {"result": result}

@app.get("/get_nhl_bet_data/{home}/{away}", response_model=MatchResult)
async def get_nhl_bet_data(home: str, away: str) -> MatchResult:
    result = NHL_AIModel.predict(home, away)
    return {"result": result}