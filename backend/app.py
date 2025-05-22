from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS (Allow frontend at localhost:5173)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# MongoDB connection
mongo_uri = os.getenv("MONGO_URI")  # Example: mongodb://localhost:27017/skin_disease_predictor
if not mongo_uri:
    raise ValueError("MONGO_URI not found in environment variables")

client = MongoClient(mongo_uri)
db = client["skin_disease_predictor"]
app.db = db  # Attach DB to app so it can be accessed globally

# Register blueprints (routes)
from routes.auth_routes import auth_bp
from routes.detection_routes import detection_bp
from routes.history import history_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(detection_bp, url_prefix="/api")
app.register_blueprint(history_bp)


# Run the server
if __name__ == "__main__":
    app.run(debug=True, port=5000)