import pyodbc
import os
from dotenv import load_dotenv

# Load Environment
dotenv_path = '.env'
load_dotenv(dotenv_path)

def execute_sql(sql):
    # Extract connection information
    server     = os.getenv("DB_SERVER")
    database   = os.getenv("DB_NAME")
    username   = os.getenv('DB_USER')
    password   = os.getenv('DB_PASSWORD')
    sql_server = '{ODBC Driver 17 for SQL Server}'
    print(f"login.py: {server}, {database}, {username}, {password}")

    # pyodbc settings
    conn = pyodbc.connect('DRIVER={sql_server};SERVER={server};PORT=1433;DATABASE={database};UID={username};PWD={password};Encrypt=yes;TrustServerCertificate=yes;SSLProtocol=TLSv1'.format(sql_server=sql_server, server=server, database=database, username=username, password=password))
    cursor = conn.cursor()
    cursor.execute(sql)
    rows = cursor.fetchall()
    result = [list(row) for row in rows]
    print("result: ", len(result))
    cursor.close()
    conn.close()
    return result

sql = "SELECT count(*) FROM STAFF"
execute_sql(sql)
