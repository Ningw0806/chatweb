const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const messages = require("./messages");
const sessions = require("./sessions");
const users = require("./users");

app.use(cookieParser());
app.use(express.static("./dist"));
app.use(express.json());

app.get("/api/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  res.json({ username });
});

app.post("/api/session", (req, res) => {
  const { username } = req.body;

  if (!users.isValid(username)) {
    res.status(400).json({ error: "required-username" });
    return;
  }

  if (username === "dog") {
    res.status(403).json({ error: "auth-insufficient" });
    return;
  }

  const sid = sessions.addSession(username);

  users.addUserData(username, {
    username,
  });

  res.cookie("sid", sid);
  res.json({ username });
});

app.delete("/api/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";

  if (sid) {
    res.clearCookie("sid");
  }

  if (username) {
    sessions.deleteSession(sid);
    users.removeUserData(username);
  }
  res.json({ username });
});

app.get("/api/messages", (req, res) => {
  res.json(messages.getAllMessages());
});

app.post("/api/messages", (req, res) => {
  const { username, text } = req.body;
  const id = messages.createMessage(username, text);
  res.status(201).json(messages.getMessage(id));
});

app.delete("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  messages.deleteMessage(id);
  res.status(204).end();
});

app.get("/api/users", (req, res) => {
  res.json(users.getAllUsers());
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
