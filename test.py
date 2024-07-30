import pandas as pd

import dask.dataframe as dd

df = pd.read_csv(
    "/Users/namanagarwal/Downloads/international-migration-march-2024-citizenship-by-visa-by-country-of-last-permanent-residence.csv")

ddf = dd.from_pandas(df, npartitions=10)

# print(df.head())
# print(df.columns)

print(ddf.divisions, ddf.npartitions)
