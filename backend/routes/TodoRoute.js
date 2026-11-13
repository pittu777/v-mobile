const express = require('express');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

const router = express.Router();

// RESTful CRUD. Creation moved from the old `POST /create` to `POST /todos`
// so every todo operation is a resource path; `POST /create` was the one
// inconsistency in the API surface. `PATCH` is accepted as a synonym for PUT.
router.get('/todos', getTodos);
router.post('/todos', createTodo);
router.put('/todos/:id', updateTodo);
router.patch('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

module.exports = router;