from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import pyodbc
import os
from dotenv import load_dotenv

# Load Environment
dotenv_path = '.env'
load_dotenv(dotenv_path)

def execute_sql(sql):
    # Extract connection information
    server = os.getenv("DB_SERVER")
    database = os.getenv("DB_NAME")
    username = os.getenv('DB_USER')
    password = os.getenv('DB_PASSWORD')
    sql_server = '{ODBC Driver 13 for SQL Server}'
    try:    
        # pyodbc settings
        conn = pyodbc.connect('DRIVER={sql_server};SERVER={server};PORT=1433;DATABASE={database};UID={username};PWD={password};'.format(sql_server=sql_server, server=server, database=database, username=username, password=password))
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        result = [list(row) for row in rows]
        cursor.close()
        conn.close()
        return result
    except:
        return False

def login(staffno, staffpassword):
    # STAFFテーブルから入力されたログイン情報をもとに検索するクエリ
    sql = f"SELECT BaseNo, StaffNo, StaffPassword FROM STAFF WHERE StaffNo='{staffno}' AND StaffPassword='{staffpassword}'"
    
    result = execute_sql(sql)
    # print(result)
    if isinstance(result, list) and len(result) > 0:
        result = result[0]
    
    if result:
        # ログイン情報が正しい場合
        return {"result": "OK", "message": "Login successful", "user_role": "staff", "staffno": {staffno}}
    else:
        # ログイン情報が正しくない場合
        return {"result": "NG", "message": "Login faild"}