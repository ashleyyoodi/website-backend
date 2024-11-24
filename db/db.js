import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    user: 'websitedb_owner',
    password: '7hJ0socGeWVI',
    host: 'ep-round-river-a6u30irr.us-west-2.aws.neon.tech',
    port: 5432,
    database: 'websitedb',
    ssl: true
});

export const query = (text, params, callback) => {
    return pool.query(text, params, callback)
}