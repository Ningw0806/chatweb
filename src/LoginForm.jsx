import { useState } from "react";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");

  function onChange(e) {
    setUsername(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (username) {
      onLogin(username);
    }
  }

  return (
    <div className="login">
      <h1 className="login__title">Chat Application login</h1>
      <form className="login__form" action="/login" onSubmit={onSubmit}>
        <label>
          <span>Username:</span>
          <input
            className="login__username"
            value={username}
            onChange={onChange}
          />
        </label>
        <button className="login__button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
