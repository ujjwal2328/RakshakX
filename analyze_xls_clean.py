import pandas as pd
import glob
import os

path = r'f:\RakshakX\Master Plan KORBA CF\Master Plan KORBA CF\**\*.xls'
for f in glob.glob(path, recursive=True):
    print("---------------------------------")
    print(f"File: {os.path.basename(f)}")
    try:
        xls = pd.ExcelFile(f)
        print("Sheets:", xls.sheet_names)
        for sheet in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet, nrows=5)
            print(f"  Sheet '{sheet}' Columns:", list(df.columns))
    except Exception as e:
        print("Error reading:", str(e))
