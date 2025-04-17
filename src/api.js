const API_BASE = "http://localhost:3000/api/users"; // Replace with your deployed URL if needed

export const loginUser = async (username) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const updateProgress = async (roundNumber, status) => {
  const username = localStorage.getItem("username");
  if (!username) throw new Error("Username not found in localStorage");

  const res = await fetch(`${API_BASE}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, roundNumber, status }),
  });

  if (!res.ok) throw new Error("Progress update failed");
  return res.json();
};
