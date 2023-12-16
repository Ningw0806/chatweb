export function fetchSession() {
  return fetch("/api/session", {
    method: "GET",
  })
    .then(handleResponse)
    .catch(handleError);
}

export function fetchLogin(username) {
  return fetch("/api/session", {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({ username }),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function fetchLogout() {
  return fetch("/api/session", {
    method: "DELETE",
  })
    .then(handleResponse)
    .catch(handleError);
}

export function fetchMessages() {
  return fetch("/api/messages").then(handleResponse).catch(handleError);
}

export function sendMessage(username, text) {
  return fetch("/api/messages", {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({ username, text }),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function fetchUsers() {
  return fetch("/api/users").then(handleResponse).catch(handleError);
}

function handleResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    if (response.ok) {
      return response.json().then((data) => {
        return data;
      });
    } else {
      return response.json().then((err) => Promise.reject(err));
    }
  } else {
    return response;
  }
}

function handleError(error) {
  return Promise.reject(JSON.stringify({ error: error || "networkError" }));
}
