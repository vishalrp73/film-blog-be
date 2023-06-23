import { MongoClient } from 'mongodb';
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING ?? '';

const client = new MongoClient(CONNECTION_STRING);

const db = async () => {
  let conn;
  try {
    conn = await client.connect();
  } catch (err) {
    console.error('suka', err);
  }
  return conn?.db('films');
};

export default db;
