from flask import Blueprint, current_app
from controllers.auth_controller import signup_controller, login_controller

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    return signup_controller(current_app.db)  # <== fixed

@auth_bp.route('/login', methods=['POST'])
def login():
    return login_controller(current_app.db)  # <== fixed
