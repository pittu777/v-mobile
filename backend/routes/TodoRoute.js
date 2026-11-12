const express = require("express");
const router = express.Router();
const {getTodos,createTodo, deleteTodo, updateTodo} = require("./../controllers/todoController");
// GET /todos - Fetch all todos
router.get("/todos", getTodos)
router.post("/create",createTodo)
router.delete("/todos/:id",deleteTodo)
router.put('/todos/:id', updateTodo);
module.exports = router;
