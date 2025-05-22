from flask import Blueprint, request, jsonify, current_app
# from controllers.predict_controller import predict_and_store

predict_bp = Blueprint('predict', __name__)

@predict_bp.route("/predict", methods=["POST"])
def predict():
    db = current_app.config["DB"]
    
    # Get file and user_id from request
    file = request.files.get("file")
    user_id = request.form.get("user_id")
    
    if not file or not user_id:
        return jsonify({"error": "file and user_id are required"}), 400

    try:
        result = predict_and_store(file, db, user_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
