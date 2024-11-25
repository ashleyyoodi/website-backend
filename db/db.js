import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.HOST,
    port: 5432,
    database: process.env.DATABASE,
    ssl: true
});

export const query = (text, params, callback) => {
    return pool.query(text, params, callback)
}