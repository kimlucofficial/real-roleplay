import mysql from 'mysql2/promise';

let pool;

export function getDb() {
  if (!pool) {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new Error("DATABASE_URL is not set");
    }

    pool = mysql.createPool(url);
  }

  return pool;
}