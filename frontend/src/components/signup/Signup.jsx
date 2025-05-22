import React, { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Google_image from "../../assets/google.png";
import Facebook from "../../assets/facebook.png";
import main_image from "../../assets/main_image.jpg";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import Loader from "../loader/Loader"; // Assuming you have a Loader component

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: "",
  });

  const [loading, setLoading] = useState(false); // For loading state

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    let tempErrors = { username: "", email: "", password: "", confirmPassword: "", agreed: "" };

    // Username validation
    if (!formData.username) {
      tempErrors.username = "Username is required";
      valid = false;
    }

    // Email validation
    if (!formData.email) {
      tempErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email format is invalid";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Confirm password is required";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    // Agreement validation
    if (!formData.agreed) {
      tempErrors.agreed = "You must agree to the terms and policy";
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
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username, // Include username in request body
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            agreed: formData.agreed,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setLoading(false);
        navigate("/"); // Go to login or homepage
      } catch (err) {
        Swal.fire({
  icon: "error",
  title: "Signup Failed",
  text: err.message,
});
        setLoading(false);
      }
    }
  };

  return (
    <div className="signup-container container-fluid d-flex flex-column flex-md-row p-0">
      {/* Left Form Section */}
      <motion.div
        className="signup-left col-md-6 d-flex flex-column justify-content-center align-items-center p-4"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-100 px-4">
          <h2 className="fw-bold mb-3">Welcome to SKIN DISEASE PREDICTOR!</h2>

          {loading ? (
            <div className="loader-overlay">
              <Loader />
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? "is-invalid" : ""}`}
                  placeholder="Enter your username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              {/* Email */}
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
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="mb-2">
                <label className="form-label d-flex justify-content-between">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div className="mb-2">
                <label className="form-label d-flex justify-content-between">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="Re-enter your password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>

              {/* Remember Me */}
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="remember">Remember for 30 days</label>
                {errors.agreed && <div className="invalid-feedback d-block">{errors.agreed}</div>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-success w-100 mb-3">
                Signup
              </button>
            </form>
          )}

          <div className="separator">or</div>

          <div className="d-flex gap-3 justify-content-center my-3 flex-column flex-sm-row">
            <button className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 w-100">
              <img src={Google_image} alt="Google" width="20" /> Sign up with Google
            </button>
            <button className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 w-100">
              <img src={Facebook} alt="Facebook" width="20" /> Sign up with Facebook
            </button>
          </div>

          <p className="mt-3 text-muted text-center">
            Have an account?{" "}
            <span onClick={() => navigate("/")} className="text-primary" style={{ cursor: "pointer" }}>
              Sign in
            </span>
          </p>
        </div>
      </motion.div>

      {/* Right Image Section */}
      <motion.div
        className="signup-right col-md-6"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img src={main_image} alt="Leafy Background" className="img-fluid h-100 w-100 object-fit-cover" />
      </motion.div>
    </div>
  );
};

export default Signup;
