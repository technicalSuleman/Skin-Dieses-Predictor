import React, { useState } from "react";
import { motion } from "framer-motion";
import Google_image from "../../assets/google.png";
import Facebook from "../../assets/facebook.png";
import main_image from "../../assets/main_image.jpg";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    let tempErrors = { email: "", password: "" };

    if (!formData.email) {
      tempErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email format is invalid";
      valid = false;
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(data.user)); // Assuming data.user contains the user info
          console.log("User data received:", data.user);
          navigate("/user-input");
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        alert("Error connecting to server");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

      <div className="login-container container-fluid d-flex flex-column flex-md-row p-0">
        <motion.div
          className="login-left col-md-6 d-flex flex-column justify-content-center align-items-center p-4"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-100 px-4">
            <h2 className="fw-bold mb-3">Welcome to SKIN DISEASE PREDICTOR!</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
            </form>

            <div className="separator">or</div>

            <div className="d-flex gap-3 justify-content-center my-3 flex-column flex-sm-row">
              <button className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 w-100">
                <img src={Google_image} alt="Google" width="20" /> Login with Google
              </button>
              <button className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 w-100">
                <img src={Facebook} alt="Facebook" width="20" /> Login with Facebook
              </button>
            </div>

            <p className="mt-3 text-muted text-center">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-primary"
                style={{ cursor: "pointer" }}
              >
                Sign up
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="login-right col-md-6"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={main_image}
            alt="Leafy Background"
            className="img-fluid h-100 w-100 object-fit-cover"
          />
        </motion.div>
      </div>
    </>
  );
};

export default Login;
