from flask import jsonify, request
from models.user_model import get_user_by_email, create_user
from werkzeug.security import generate_password_hash
from flask import request, jsonify
from models.user_model import get_user_by_email
from werkzeug.security import check_password_hash

def signup_controller(db):
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")
    agreed = data.get("agreed")

    # Basic validations
    if not all([username, email, password, confirm_password]):
        return jsonify({"message": "All fields are required."}), 400

    if password != confirm_password:
        return jsonify({"message": "Passwords do not match."}), 400

    if not agreed:
        return jsonify({"message": "You must agree to the terms and policy."}), 400

    # Email already exists?
    if get_user_by_email(db, email):
        return jsonify({"message": "Email already registered."}), 409

    # Hash and save
    hashed_password = generate_password_hash(password)
    user_data = {
        "username": username,
        "email": email,
        "password": hashed_password
    }

    create_user(db, user_data)
    return jsonify({"message": "Signup successful!"}), 201


def login_controller(db):
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = get_user_by_email(db, email)
    if not user:
        return jsonify({"message": "User not found"}), 404

    if not check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Convert ObjectId to string for JSON serialization
    user["_id"] = str(user["_id"])
    del user["password"]

    return jsonify({
        "message": "Login successful",
        "user": user
    }), 200