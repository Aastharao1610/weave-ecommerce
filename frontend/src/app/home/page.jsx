"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/health");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        const data = await response.json();
        setMessage(data.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to fetch data from the backend.");
    }
  }, []);

  return (
    <div>
      <h1>Welcome to Weave 🧵</h1>
      <p>{message}</p>
    </div>
  );
}
