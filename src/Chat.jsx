import React, { useState } from "react";

const Chat = ({ messages, onSendMessage, username, onLogout, onlineUsers }) => {
  const [messageText, setMessageText] = useState("");
  return (
    <div id="container">
      <aside>
        <ul>
          {onlineUsers.map((user) => (
            <li key={user.username}>
              <div>
                <h2>{user.username}</h2>
                <h3>
                  <span className="status green"></span>
                  online
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <main>
        <header>
          <div>
            <h2>Hello! {username}</h2>
          </div>
        </header>
        <ul id="chat">
          {messages.map((message, index) => (
            <div key={index}>
              {message.username === username ? (
                <li className="you" key={index}>
                  <div className="user">
                    <h2>{message.username}</h2>
                  </div>

                  <div className="message">
                    <p>{message.text}</p>
                  </div>
                </li>
              ) : (
                <li className="me" key={index}>
                  <div className="user">
                    <h2>{message.username}</h2>
                  </div>

                  <div className="message">
                    <p>{message.text}</p>
                  </div>
                </li>
              )}
            </div>
          ))}
        </ul>
        <footer>
          <textarea
            placeholder="Type your message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          ></textarea>

          <div className="buttons">
            <button
              onClick={() => {
                onSendMessage(messageText);
                setMessageText("");
              }}
              disabled={!messageText.trim()}
            >
              Send
            </button>
            <button
              onClick={() => {
                onLogout();
              }}
            >
              Logout
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Chat;
