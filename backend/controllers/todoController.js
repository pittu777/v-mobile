const Todo = require('../models/todoModel');
const asyncHandler = require('../utils/asyncHandler');
const { parseObjectId } = require('../utils/parseObjectId');
const HttpError = require('../utils/HttpError');
const { sendData, sendCreated, sendMessage } = require('../utils/respond');

/**
 * Todos CRUD.
 *
 * Two bugs from the previous version are fixed here:
 *  1. `updateTodo` used to write `title: undefined` when the client sent only
 *     `{ completed }` — which is exactly what the app does when toggling a
 *     checkbox — so the save failed validation. The update body is now built
 *     only from the keys the client actually provided.
 *  2. Reads went through a bare `find()` and failed with a raw 500 carrying
 *     the Mongo error message; errors now flow through the shared handler.
 */
const getTodos = asyncHandler(async (req, res) => {
  const filter = {};

  // `?completed=true|false` lets the app fetch only open (or only done) items.
  if (typeof req.query.completed === 'string') {
    if (req.query.completed !== 'true' && req.query.completed !== 'false') {
      throw HttpError.badRequest('`completed` must be "true" or "false".');
    }
    filter.completed = req.query.completed === 'true';
  }

  const todos = await Todo.find(filter).sort({ createdAt: -1 });
  return sendData(res, todos);
});

const createTodo = asyncHandler(async (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';

  if (!title) throw HttpError.badRequest('A title is required.');
  if (title.length > 200) {
    throw HttpError.badRequest('A title must be at most 200 characters.');
  }

  const todo = await Todo.create({ title });
  return sendCreated(res, todo, 'Todo created.');
});

const updateTodo = asyncHandler(async (req, res) => {
  const id = parseObjectId(req.params.id, 'Todo');

  // Only apply the fields the client actually sent.
  const updates = {};
  if (req.body?.title !== undefined) {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) throw HttpError.badRequest('A title cannot be empty.');
    if (title.length > 200) {
      throw HttpError.badRequest('A title must be at most 200 characters.');
    }
    updates.title = title;
  }
  if (req.body?.completed !== undefined) {
    if (typeof req.body.completed !== 'boolean') {
      throw HttpError.badRequest('`completed` must be true or false.');
    }
    updates.completed = req.body.completed;
  }

  if (Object.keys(updates).length === 0) {
    throw HttpError.badRequest('Provide a `title` or `completed` value to update.');
  }

  const todo = await Todo.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!todo) throw HttpError.notFound('Todo not found.');
  return sendData(res, todo, 'Todo updated.');
});

const deleteTodo = asyncHandler(async (req, res) => {
  const id = parseObjectId(req.params.id, 'Todo');
  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) throw HttpError.notFound('Todo not found.');
  return sendMessage(res, 'Todo deleted.');
});

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };