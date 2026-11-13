const { startMemoryDb, stopMemoryDb, clearCollections } = require('./helpers');

beforeAll(async () => {
  await startMemoryDb();
});

afterEach(async () => {
  await clearCollections();
});

afterAll(async () => {
  await stopMemoryDb();
});