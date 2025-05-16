import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function TaskManager() {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate("/login");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "tasks"),
          where("uid", "==", currentUser.uid)
        );
        const unsubscribeData = onSnapshot(q, (querySnapshot) => {
          let taskList = [];
          querySnapshot.forEach((doc) => {
            taskList.push({ ...doc.data(), id: doc.id });
          });
          setTasks(taskList);
        });

        return () => unsubscribeData();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleAddTask = async () => {
    if (task.trim() === "" || !user) return;
    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      task: task.trim(),
      completed: false,
      createdAt: new Date(),
    });
    setTask("");
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleComplete = async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, {
      completed: !task.completed,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage : "url('./image2.png')",
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      backgroundBlendMode: "overlay",
    }}>
      <h1 className="text-7xl font-semibold mt-8 mb-6 text-gray-50  text-center">
        <span className="text-blue-400">Welcome to</span> TaskMaster
        <br />
        <span className="text-sm md:text-base font-normal text-gray-400">
          TaskMaster would hunt you down if you don't finish all your TASKS !!
        </span>
      </h1>

      <div className="bg-gray-950 p-6 rounded-xl w-full max-w-xl hover:shadow-lg shadow-blue-500 shadow-xl/10">
        <h2 className="text-3xl font-semibold mb-6 text-center">Your Tasks</h2>

        <div className="flex mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
            className="flex-grow px-4 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button
            onClick={handleAddTask}
            className="bg-white text-black px-4 py-2 rounded-r-lg hover:bg-black  hover:text-white transition hover:cursor-pointer ring"
          >
            Add Task
          </button>
        </div>

        <p className="text-sm text-gray-300 mb-4 text-center">
          ✅ Completed: {tasks.filter((t) => t.completed).length} / {tasks.length}
        </p>

        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(t)}
                  className="accent-blue-500 w-5 h-5"
                />
                <span
                  className={`text-white ${
                    t.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {t.task}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(t.id)}
                className="text-red-400 hover:text-red-600 text-lg"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 my-9 px-5 py-2 rounded-md text-white text-md  hover:bg-red-600 drop-shadow-red-600  hover:drop-shadow-md transition" 
      >
        Logout
      </button>
    </div>
  );
}
