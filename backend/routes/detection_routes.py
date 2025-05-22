from flask import Blueprint, request, jsonify
from controllers.detection_controller import detect_disease

detection_bp = Blueprint('detection', __name__)

@detection_bp.route('/detect', methods=['POST'])
def detect():
    return detect_disease(request)
