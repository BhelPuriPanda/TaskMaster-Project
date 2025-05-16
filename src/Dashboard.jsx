import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import TaskManager from "./TaskManager";


export default function Dashboard() {

    const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // or "/"
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  return (
     <>
      <TaskManager/>
    </>
  );
}
