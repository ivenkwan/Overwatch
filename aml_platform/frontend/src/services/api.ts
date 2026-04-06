const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export const api = {
  async fetchFeed() {
    const res = await fetch(`${API_BASE_URL}/alerts/feed`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Failed to fetch monitoring feed");
    return res.json();
  },

  async fetchGraphNetwork() {
    const res = await fetch(`${API_BASE_URL}/graph/network`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Failed to fetch graph network");
    return res.json();
  }
};
