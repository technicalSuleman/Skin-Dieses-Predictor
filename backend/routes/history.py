from flask import Blueprint, jsonify, current_app

history_bp = Blueprint('history', __name__)

@history_bp.route('/api/history/<email>', methods=['GET'])
def get_user_history(email):
    records = current_app.db.detections.find({"userEmail": email}).sort("created_at", -1)
    result = []
    for record in records:
        result.append({
            "_id": str(record["_id"]),
            "image": record["image"],
            "prediction": record["prediction"],
            "confidence": record["confidence"],
            "created_at": record["created_at"]
        })
    return jsonify(result)
