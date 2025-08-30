process.env.SQLITE_DB = ':memory:';

const request = require('supertest');
const { app, init } = require('../server');
const { db } = require('../db');

beforeAll(async () => {
  await init();
});

beforeEach((done) => {
  db.run('DELETE FROM todos', (err) => done(err));
});

afterAll((done) => {
  db.close(() => done());
});

describe('Todo API', () => {
  test('POST /api/todos creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Test Todo', description: 'desc' })
      .expect(201);

    expect(res.body.id).toBeGreaterThan(0);
    expect(res.body.title).toBe('Test Todo');
    expect(res.body.description).toBe('desc');
    expect(res.body.completed).toBe(false);
    expect(res.body.created_at).toBeTruthy();
    expect(res.body.updated_at).toBeTruthy();
  });

  test('GET /api/todos returns list', async () => {
    await request(app).post('/api/todos').send({ title: 'A' }).expect(201);
    await request(app).post('/api/todos').send({ title: 'B' }).expect(201);

    const res = await request(app).get('/api/todos').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('PUT /api/todos/:id updates fields and toggle completed', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'To Update' }).expect(201);
    const id = created.body.id;

    const upd = await request(app).put(`/api/todos/${id}`).send({ completed: true, description: 'updated' }).expect(200);
    expect(upd.body.completed).toBe(true);
    expect(upd.body.description).toBe('updated');

    const upd2 = await request(app).put(`/api/todos/${id}`).send({ title: 'New Title' }).expect(200);
    expect(upd2.body.title).toBe('New Title');
  });

  test('Filtering works', async () => {
    const a = await request(app).post('/api/todos').send({ title: 'X' }).expect(201);
    const b = await request(app).post('/api/todos').send({ title: 'Y' }).expect(201);
    await request(app).put(`/api/todos/${b.body.id}`).send({ completed: true }).expect(200);

    const all = await request(app).get('/api/todos?filter=all').expect(200);
    const active = await request(app).get('/api/todos?filter=active').expect(200);
    const completed = await request(app).get('/api/todos?filter=completed').expect(200);

    expect(all.body.length).toBe(2);
    expect(active.body.length).toBe(1);
    expect(completed.body.length).toBe(1);
    expect(completed.body[0].completed).toBe(true);
  });

  test('DELETE /api/todos/:id deletes and returns 204', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'To Delete' }).expect(201);
    const id = created.body.id;
    await request(app).delete(`/api/todos/${id}`).expect(204);
    await request(app).get(`/api/todos/${id}`).expect(404);
  });

  test('Validation errors for missing/invalid fields', async () => {
    await request(app).post('/api/todos').send({}).expect(400);
    await request(app).post('/api/todos').send({ title: '' }).expect(400);
    const created = await request(app).post('/api/todos').send({ title: 'Ok' }).expect(201);
    await request(app).put(`/api/todos/${created.body.id}`).send({ title: '' }).expect(400);
    await request(app).put(`/api/todos/${created.body.id}`).send({ completed: 'yes' }).expect(400);
  });
});
