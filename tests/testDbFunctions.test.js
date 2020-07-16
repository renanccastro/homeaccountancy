const { MongoClient } = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('Insert should insert', async () => {
    const categories = db.collection('categories');

    const mockCategorie = {
      name: 'Tostando 2.0',
      createdAt: new Date(),
    };

    await categories.insertOne(mockCategorie);

    const insertedCategorie = await categories.findOne({
      name: mockCategorie.name,
    });

    expect(mockCategorie).toEqual(insertedCategorie);
  });

  test('Delete should delete', async () => {
    const categories = db.collection('categories');

    const categorieNameToRemove = 'Tostando 2.0';

    await categories.remove({ name: categorieNameToRemove });

    const deletedCategorie = await categories.findOne({
      name: categorieNameToRemove,
    });

    expect(deletedCategorie).toBeNull();
  });
});
