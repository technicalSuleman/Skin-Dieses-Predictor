import os
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename
from datetime import datetime
from bson import ObjectId
import base64
from io import BytesIO
from flask import current_app, jsonify, Blueprint, request  # added request

# Load the trained model once
model_path = os.path.join("ML_model", "mobilenet_skin_disease_model.h5")
model = load_model(model_path)

# Define your class labels
class_labels = ['Eczema', 'Melanoma', 'Psoriasis', 'Acne']

def preprocess_image(image_file):
    image = Image.open(image_file).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    return np.expand_dims(img_array, axis=0)

def detect_disease(request):
    image = request.files.get("image")
    user_email = request.form.get("userEmail")  # ✅ updated

    if not image or not user_email:
        return jsonify({"error": "Image and email are required"}), 400

    # Preprocess the image
    processed_image = preprocess_image(image)

    # Make prediction
    predictions = model.predict(processed_image)[0]
    confidence = float(np.max(predictions))
    predicted_label = class_labels[np.argmax(predictions)]

    # Convert image to base64 for storage
    img = Image.open(image).convert("RGB")
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()

    # Save result to MongoDB
    record = {
        "userEmail": user_email,  # ✅ store email
        "image": img_base64,
        "prediction": predicted_label,
        "confidence": confidence,
        "created_at": datetime.utcnow()
    }

    current_app.db.detections.insert_one(record)

    # Return prediction result
    return jsonify({
        "prediction": predicted_label,
        "confidence": confidence
    })
