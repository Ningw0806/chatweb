const uuid = require("uuid").v4;

let messages = {};

function createMessage(username, text) {
  const id = uuid();
  messages[id] = { id, username, text, timestamp: new Date() };
  return id;
}

function getAllMessages() {
  return Object.values(messages);
}

function getMessage(id) {
  return messages[id];
}

function deleteMessage(id) {
  delete messages[id];
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessage,
  deleteMessage,
};
