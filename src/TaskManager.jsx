import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { updateDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function TaskManager() {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

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
      createdAt: new Date()
    });
    setTask("");
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleComplete = async (task) => {
  const taskRef = doc(db, "tasks", task.id);
  await updateDoc(taskRef, {
    completed: !task.completed
  });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Tasks</h2>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={handleAddTask}>Add Task</button>
      <p>
  ✅ Completed: {tasks.filter((t) => t.completed).length} / {tasks.length}
</p>
      <ul>
        {tasks.map((t) => (
           <li key={t.id}>
    <input
      type="checkbox"
      checked={t.completed}
      onChange={() => toggleComplete(t)}
    />
    <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
      {t.task}
    </span>
    <button onClick={() => handleDeleteTask(t.id)}>❌</button>
  </li>
        ))}
      </ul>
    </div>
  );
}
