import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoginPrompt } from "../features/loginPrompt/loginPromptSlice";
import { Link } from "react-router-dom";
import "../CSS/LoginPrompt.scss"

export default function LoginPrompt() {
  const isVisible = useSelector((state) => state.loginPrompt.visible);
  const dispatch = useDispatch();

  return (
    <div id="not_logged_in" style={{ visibility: isVisible ? "visible" : "hidden" }}>
      <div id="not_logged_in_box" style={{ position: "relative" }}>
        <div id="close_button" onClick={() => dispatch(hideLoginPrompt())}>X</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Link to={"/login"} id="login_signup_btn">Login/Signup</Link>
        </div>
      </div>
    </div>
  );
}