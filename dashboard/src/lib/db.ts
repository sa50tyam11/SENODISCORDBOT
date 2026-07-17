import Database from 'better-sqlite3';
import path from 'path';

// The database file is located two directories up, in the root of the SENOBOT folder
const dbPath = path.join(process.cwd(), '..', 'database.sqlite');
const db = new Database(dbPath, { readonly: true });

export default db;
