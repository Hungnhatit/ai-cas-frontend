'use client'
import { useState } from "react";

const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState("");

  const alert = (message: string) => {
    setAlertMessage(message);
    // In a real app, you'd update the live region's textContent
    console.log(`[SR Announcement]: ${message}`);
    // Clear message after a bit so it can be re-announced
    setTimeout(() => setAlertMessage(""), 1000);
  };

  return { alert };
};

export default useAlert;