// src/routes/index.js
const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const path = require("path");
const router = express.Router();
const app = express();
const admin = require("../firebase");
const db = admin.database();

// Function to fetch user data by UID
async function fetchUserData(uid) {
  return db
    .ref(`users/${uid}`)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        throw new Error("User data not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      throw error;
    });
}

router.delete("/deleteTodo/:id", async (req, res) => {
  const todoId = req.params.id;
  const userId = req.cookies.uid;
  try {
    await db.ref(`users/${userId}/todos/${todoId}`).remove();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send("Error deleting todo");
  }
});
router.put("/updateTodo/:id", async (req, res) => {
  const todoId = req.params.id;
  const userId = req.cookies.uid;
  const { todo } = req.body;

  try {
    await db.ref(`users/${userId}/todos/${todoId}/task/todo`).set(todo);
    res.sendStatus(200); 
  } catch (error) {
    res.status(500).send("Error updating todo");
  }
});

router.post("/add-todo", async (req, res) => {
  const { todo, time, date } = req.body;
  const todoData = {
    todo: todo,
    time: time,
    date: date,
  };
  try {
    const userId = req.cookies.uid;
    const newTaskRef = db.ref(`users/${userId}/todos`).push();
    const todoId = newTaskRef.key;
    newTaskRef
      .set({
        id: todoId,
        task: todoData,
        completed: false,
      })
      .then(() => {
        res.status(200).send({ message: "Task added successfully" });
      })
      .catch((error) => {
        res.status(500).json({ error: "Error adding task" });
      });
  } catch (error) {
    res.status(500).json({ error: "Error adding task" });
  }
});
router.get("/", verifyToken, async (req, res) => {
  const uid = req.cookies.uid;
  let userData = await fetchUserData(uid);
  let username = userData.username;
  db.ref(`users/${uid}/todos`)
    .once("value")
    .then((snapshot) => {
      const todos = snapshot.val();
      const escapedData = JSON.stringify(todos);
      res.render("index", { USERNAME: username, TODOS: escapedData });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error fetching tasks" });
    });
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/html/signup.html"));
});

module.exports = router;
