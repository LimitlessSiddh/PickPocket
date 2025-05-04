import pandas as pd
import numpy as np


class FetchData:
    def __init__(self, csv, sport):
        self.csv = csv
        self.sport = sport
    def get_historical_data(self):
        self.df = pd.read_csv(self.csv)

    def clean_data(self):
        pass

    

if __name__ == "__main__":
    print("fetching/cleaning data")