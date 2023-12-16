import { MESSAGES } from "./constants";

function Status({ error }) {
  const message = MESSAGES[error] || MESSAGES.default;
  return <div className="error">{error && message}</div>;
}

export default Status;
