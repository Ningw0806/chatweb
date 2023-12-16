import { useState, useEffect } from "react";
import "./App.css";
import { LOGIN_STATUS, SERVER } from "./constants";
import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchMessages,
  sendMessage,
  fetchUsers,
} from "./services";

import LoginForm from "./LoginForm";
import Loading from "./Loading";
import Status from "./Status";
import Chat from "./Chat";

function App() {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [loginStatus, setLoginStatus] = useState(LOGIN_STATUS.NOT_LOGGED_IN);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  function onLogin(username) {
    fetchLogin(username)
      .then(() => {
        setUsername(username);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        loadMessages();
      })
      .catch((err) => {
        const serverError = JSON.parse(err);

        if (serverError?.error?.error === SERVER.AUTH_INSUFFICIENT) {
          setError(serverError?.error?.error);
        } else {
          setError(err?.error || "ERROR");
        }
      });
  }

  function onLogout() {
    fetchLogout()
      .then(() => {
        setUsername("");
        setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        setMessages([]);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
      });
  }

  function loadMessages() {
    fetchMessages()
      .then((fetchedMessages) => {
        setMessages(fetchedMessages);
        setError("");
      })
      .catch(() => {
        setError("Error loading messages");
      });
  }

  function onSendMessage(text) {
    sendMessage(username, text)
      .then(() => {
        loadMessages();
      })
      .catch(() => {
        setError("Error sending message");
      });
  }

  useEffect(() => {
    if (loginStatus !== LOGIN_STATUS.IS_LOGGED_IN) {
      return;
    }
    const intervalId = setInterval(() => {
      loadMessages();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loginStatus]);

  function checkForSession() {
    fetchSession()
      .then((session) => {
        if (session) {
          setUsername(session.username);
          setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
          loadMessages();
        } else {
          setLoginStatus(LOGIN_STATUS.PENDING);
        }
      })
      .catch((err) => {
        const serverError = JSON.parse(err);

        if (serverError?.error?.error === SERVER.AUTH_MISSING) {
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        } else if (serverError?.error?.error === SERVER.AUTH_INSUFFICIENT) {
          setLoginStatus(LOGIN_STATUS.PENDING);
          setError(serverError?.error?.error);
        } else {
          setError(err?.error || "ERROR");
        }
      });
  }

  function getOnlineUsers() {
    fetchUsers()
      .then((fetchedUsers) => {
        // filter current user
        const usersArray = Object.values(fetchedUsers);

        const onlineUsers = usersArray.filter(
          (user) => user.username !== username,
        );
        setOnlineUsers(onlineUsers);
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
      });
  }

  useEffect(() => {
    checkForSession();
  }, [loginStatus]);

  useEffect(() => {
    if (loginStatus !== LOGIN_STATUS.IS_LOGGED_IN) {
      return;
    }

    const intervalId = setInterval(() => {
      getOnlineUsers();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loginStatus]);

  return (
    <div className="app">
      <main>
        {error && <Status error={error} />}
        {loginStatus === LOGIN_STATUS.PENDING && (
          <Loading>Loading user...</Loading>
        )}
        {loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && (
          <LoginForm onLogin={onLogin} />
        )}
        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
          <div className="content">
            <Chat
              messages={messages}
              onSendMessage={onSendMessage}
              username={username}
              onLogout={onLogout}
              onlineUsers={onlineUsers}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
