import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email;

    if (!email) {
      alert("User not logged in!");
      return navigate('/');
    }

    fetch(`http://localhost:5000/api/history/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHistoryItems(data);
        else console.error("Unexpected response:", data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [navigate]);

  useEffect(() => {
    const modalEl = document.getElementById('previewModal');
    if (modalEl) {
      window.bootstrapModal = new window.bootstrap.Modal(modalEl);
    }
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    window.bootstrapModal.show();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Detection History</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div className="row">
        {historyItems.map((item) => (
          <div
            key={item._id}
            className="col-md-4 mb-4"
            onClick={() => handleItemClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card h-100 shadow-sm">
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                className="card-img-top"
                alt={item.prediction}
              />
              <div className="card-body">
                <h5 className="card-title">{item.prediction}</h5>
                <p className="card-text text-muted">
                  Confidence: {(item.confidence * 100).toFixed(2)}%
                </p>
                <p className="card-text text-muted">
                  Date: {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div
          className="modal fade"
          id="previewModal"
          tabIndex="-1"
          aria-labelledby="previewModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="previewModalLabel">{selectedItem.prediction}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body text-center">
                <img
                  src={`data:image/jpeg;base64,${selectedItem.image}`}
                  alt="Selected"
                  className="img-fluid rounded"
                />
                <p className="mt-3 text-muted">
                  Confidence: {(selectedItem.confidence * 100).toFixed(2)}%
                </p>
                <p className="text-muted">
                  Date: {new Date(selectedItem.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
