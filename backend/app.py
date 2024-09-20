from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user
from datetime import timedelta
import secrets

from login import login
from display import main

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

app.secret_key = secrets.token_hex(32)  # セッションの暗号化に必要なキーを設定
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'

# Flask-Loginのセットアップ
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login_route"

CORS(app, resources={r"/*": {"origins": ["http://localhost", "http://localhost:3000"]}}, supports_credentials=True)

# ユーザークラス
class User(UserMixin):
    def __init__(self, id):
        self.id = id

# ログインマネージャーによるユーザーのロード
@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

# login-display
@app.route('/api/login', methods=['POST'])
def login_route():
    print("----- login successful ------")
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    logger.debug(f"Input : {username}, {password}")
    # logger.debug(f"Output : {result}")


    if username == "1" and password == "1":
        user = User(id=username)
        login_user(user)
        session.permanent = True
        app.permanent_session_lifetime = timedelta(minutes=25) # 25分でセッションを切る
        session['user_id'] = user.id
        return jsonify({"message": "Login successful", "status": 200})
    else:
        print("username & passwrd: failed")
    # else:
    #     return jsonify({"message": "Invalid credentials"}), 401    
# home-display
@app.route('/api/')
@login_required  # ルートアクセス時に認証されていない場合はログインページにリダイレクト
def index():
    print("----- index -------")
    return jsonify({"message": "Welcome to the home page!", "user": current_user.id})

@app.route('/api/display_by_store', methods=['POST'])
# @login_required  # このエンドポイントはログインが必要
def display_by_store(): # 店舗別データ表示    
    print("----- displya_by_store ------")
    try:
        request_data = request.get_json()
        # response = "{'合計': {'base_name': '合計', 'base_no': '', 'sales_total1': '8,500,246', 'sales_total2': '', 'sales_total_diff': '', 'sales_total_ab_ratio': '', 'users1': '7,271', 'users2': '', 'users_total_diff': '', 'users_total_ab_ratio': '', 'average_spend1': '1,169.06', 'average_spend2': '', 'average_spend_total_diff': '', 'average_spend_total_ab_ratio': '', 'new_users1': '730', 'new_users2': '', 'new_users_total_diff': '', 'new_users_total_ab_ratio': '', 'new_rate1': '10.04%', 'new_rate2': '', 'other_sales_total1': '91,403', 'other_sales_total2': '', 'other_sales_total_diff': '', 'other_sales_total_ab_ratio': ''}, '店舗データ': [{'base_name': 'S雷門', 'base_no': '1357', 'sales_total1': '4,323,050', 'sales_total2': '', 'sales_total_diff': '', 'sales_total_ab_ratio': '', 'users1': '3,744', 'users2': '', 'users_total_diff': '', 'users_total_ab_ratio': '', 'average_spend1': '1,154.66', 'average_spend2': '', 'average_spend_total_diff': '', 'average_spend_total_ab_ratio': '', 'new_users1': '436', 'new_users2': '', 'new_users_total_diff': '', 'new_users_total_ab_ratio': '', 'new_rate1': '11.65%', 'new_rate2': '', 'other_sales_total1': '56,723', 'other_sales_total2': '', 'other_sales_total_diff': '', 'other_sales_total_ab_ratio': ''}, {'base_name': 'S荻窪', 'base_no': '1243', 'sales_total1': '4,177,196', 'sales_total2': '', 'sales_total_diff': '', 'sales_total_ab_ratio': '', 'users1': '3,527', 'users2': '', 'users_total_diff': '', 'users_total_ab_ratio': '', 'average_spend1': '1,184.35', 'average_spend2': '', 'average_spend_total_diff': '', 'average_spend_total_ab_ratio': '', 'new_users1': '294', 'new_users2': '', 'new_users_total_diff': '', 'new_users_total_ab_ratio': '', 'new_rate1': '8.34%', 'new_rate2': '', 'other_sales_total1': '34,680', 'other_sales_total2': '', 'other_sales_total_diff': '', 'other_sales_total_ab_ratio': ''}]}"
        response = main(request_data)
        return jsonify(response), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/display_by_date', methods=['POST'])
@login_required  # このエンドポイントはログインが必要
def display_by_date(): # 日別データ表示
    try:
        request_data = request.get_json()
        response = main(request_data)
        return jsonify(response), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
    
