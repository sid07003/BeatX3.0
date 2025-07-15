import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/SignUp.scss';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isNotification, setIsNotification] = useState(false);
  const [notification, setNotification] = useState('');
  const [isError, setIsError] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const showMessage = (msg, isError) => {
    setNotification(msg);
    setIsError(isError);
    setIsNotification(true);
    setTimeout(() => setIsNotification(false), 2000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showMessage("Passwords do not match", true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }) // No need to send confirmPassword
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      showMessage("Account created successfully", false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Signup error:", error);
      showMessage(error.message, true);
    }
  };

  return (
    <div className="container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type={showPassword1 ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`fa-regular ${showPassword1 ? "fa-eye" : "fa-eye-slash"}`}
              onClick={() => setShowPassword1(!showPassword1)}
              aria-label="Toggle password visibility"
              role="button"
            ></i>
          </div>
          <div className="form-group" style={{ position: "relative" }}>
            <input
              type={showPassword2 ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <i
              className={`fa-regular ${showPassword2 ? "fa-eye" : "fa-eye-slash"}`}
              onClick={() => setShowPassword2(!showPassword2)}
              aria-label="Toggle confirm password visibility"
              role="button"
            ></i>
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div
        id="notification"
        className={
          isNotification
            ? isError
              ? "error"
              : "success"
            : "noError"
        }
      >
        {notification}
      </div>
    </div>
  );
}
