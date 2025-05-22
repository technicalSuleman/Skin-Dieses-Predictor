import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { motion } from 'framer-motion';
import LogoutIcon from '@mui/icons-material/Logout';
import Loader from '../loader/Loader';
import './UserInput.css';

const UserInput = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
 const [userName, setUserName] = useState('User');
const [userEmail, setUserEmail] = useState('');


 useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(JSON.parse(localStorage.getItem('user')));
  if (user) {
    if (user.username) setUserName(user.username);
    if (user.email) setUserEmail(user.email);
  }
}, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDetectDisease = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);
    const user = JSON.parse(localStorage.getItem('user'));
    formData.append('userEmail', user.email);

    try {
      const res = await fetch('http://localhost:5000/api/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      navigate('/result', { state: { prediction: data.prediction, confidence: data.confidence } });

    } catch (error) {
      console.error(error);
      setLoading(false);
      alert('Failed to detect disease');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold">Welcome, {userName}</span>
          <div className="d-flex align-items-center gap-2">
            <button onClick={() => navigate('/history')} className="btn btn-light fw-semibold">
              History
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-outline-light d-flex align-items-center"
              title="Logout"
            >
              <LogoutIcon fontSize="small" />
            </button>
          </div>
        </div>
      </nav>

      {loading && (
        <div className="fullscreen-loader">
          <Loader />
        </div>
      )}

      <div className={`container d-flex justify-content-center align-items-center vh-100 bg-light ${loading ? 'blurred' : ''}`}>
        <motion.div className="card p-4 shadow" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ maxWidth: '500px', width: '100%' }}>
          <h4 className="text-center mb-4">Upload Image for Disease Detection</h4>
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">Select Image</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <UploadFileIcon color="primary" />
              </span>
              <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
            </div>
          </div>

          {imagePreview && (
            <div className="text-center mb-3">
              <img src={imagePreview} alt="Preview" className="img-fluid rounded border" style={{ maxHeight: '250px', objectFit: 'cover' }} />
            </div>
          )}

          <motion.button whileTap={{ scale: 0.95 }} className="btn btn-success w-100 fw-bold" onClick={handleDetectDisease} disabled={!image || loading}>
            Detect Disease
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default UserInput;
