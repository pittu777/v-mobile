const request = require('supertest');
const app = require('../app');
const Todo = require('../models/todoModel');

/**
 * Regression tests for the two todo bugs, plus the REST path change.
 *
 * Bug 1: PUT /todos/:id with only `{ completed }` used to send
 *        `title: undefined` and fail validation. Toggling a checkbox in the app
 *        hit exactly this path.
 * Bug 2: creation moved from POST /create to POST /todos.
 */
describe('todos', () => {
  const createTodo = async (title) => {
    const res = await request(app).post('/api/todos').send({ title });
    expect(res.status).toBe(201);
    return res.body.data;
  };

  it('creates a todo through POST /api/todos', async () => {
    const todo = await createTodo('Buy milk');

    expect(todo).toMatchObject({ title: 'Buy milk', completed: false });
    expect(todo._id).toEqual(expect.any(String));

    const stored = await Todo.findById(todo._id);
    expect(stored).not.toBeNull();
  });

  it('rejects a blank title', async () => {
    const res = await request(app).post('/api/todos').send({ title: '   ' });
    expect(res.status).toBe(400);
  });

  it('toggles completion when only `completed` is sent (the original bug)', async () => {
    const todo = await createTodo('Water the plants');

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(true);
    expect(res.body.data.title).toBe('Water the plants');

    const stored = await Todo.findById(todo._id);
    expect(stored.title).toBe('Water the plants');
    expect(stored.completed).toBe(true);
  });

  it('accepts PATCH as a synonym for PUT', async () => {
    const todo = await createTodo('Stretch');

    const res = await request(app)
      .patch(`/api/todos/${todo._id}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  it('updates a title without clearing `completed`', async () => {
    const todo = await createTodo('Read a book');
    await request(app).put(`/api/todos/${todo._id}`).send({ completed: true });

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ title: 'Read two books' });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      title: 'Read two books',
      completed: true,
    });
  });

  it('rejects an update with no recognised fields', async () => {
    const todo = await createTodo('Nothing to change');
    const res = await request(app).put(`/api/todos/${todo._id}`).send({});

    expect(res.status).toBe(400);
  });

  it('rejects a non-boolean `completed`', async () => {
    const todo = await createTodo('Strict typing');
    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ completed: 'yes' });

    expect(res.status).toBe(400);
  });

  it('returns 404 for an unknown id and for a malformed id', async () => {
    const missing = await request(app)
      .put('/api/todos/64b7f0f0f0f0f0f0f0f0f0f0')
      .send({ completed: true });
    expect(missing.status).toBe(404);

    const malformed = await request(app)
      .put('/api/todos/not-an-object-id')
      .send({ completed: true });
    expect(malformed.status).toBe(404);
  });

  it('lists todos newest first', async () => {
    const first = await createTodo('First');
    const second = await createTodo('Second');

    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);

    const ids = res.body.data.map((todo) => todo._id);
    expect(ids[0]).toBe(second._id);
    expect(ids).toContain(first._id);
  });

  it('filters by completed state', async () => {
    const open = await createTodo('Still open');
    const done = await createTodo('Already done');
    await request(app).put(`/api/todos/${done._id}`).send({ completed: true });

    const onlyOpen = await request(app).get('/api/todos?completed=false');
    expect(onlyOpen.body.data.map((t) => t._id)).toEqual([open._id]);

    const onlyDone = await request(app).get('/api/todos?completed=true');
    expect(onlyDone.body.data.map((t) => t._id)).toEqual([done._id]);
  });

  it('deletes a todo and 404s on a second delete', async () => {
    const todo = await createTodo('Delete me');

    const first = await request(app).delete(`/api/todos/${todo._id}`);
    expect(first.status).toBe(200);
    expect(first.body.success).toBe(true);

    const second = await request(app).delete(`/api/todos/${todo._id}`);
    expect(second.status).toBe(404);

    expect(await Todo.findById(todo._id)).toBeNull();
  });

  it('no longer serves the old POST /api/create path', async () => {
    const res = await request(app).post('/api/create').send({ title: 'Legacy' });
    expect(res.status).toBe(404);
  });
});