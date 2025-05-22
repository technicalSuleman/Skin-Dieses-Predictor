import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Result.css";

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { prediction, confidence } = location.state || {};

  return (
    <div className="result-container container-fluid d-flex flex-column justify-content-center align-items-center p-4">
      <div className="result-card">
        <h2 className="fw-bold mb-3">Prediction Result</h2>

        <div className="result-content">
          {prediction ? (
            <>
              <p>Your skin disease prediction is:</p>
              <h4 className="text-success">{prediction}</h4>
              <p className="text-muted">Confidence: {confidence}%</p>
            </>
          ) : (
            <h4 className="text-danger">No result available</h4>
          )}
        </div>

        <button className="btn btn-primary w-100 mt-3" onClick={() => navigate("/user-input")}>
          Go Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default Result;
