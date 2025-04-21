import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a user-specific database path
const DB_DIR = path.join(os.homedir(), '.xelt');
const DB_PATH = path.join(DB_DIR, 'xelt.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db = null;
let connectionPool = null;

export async function initialize() {
    if (db) return db;

    try {
        // Ensure db directory exists in user's home directory
        await fs.mkdir(DB_DIR, { recursive: true });

        // Read and execute schema
        const schema = await fs.readFile(SCHEMA_PATH, 'utf-8');
        
        db = await open({
            filename: DB_PATH,
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            verbose: false
        });

        // Enable WAL mode for better concurrency
        await db.exec('PRAGMA journal_mode = WAL;');
        await db.exec('PRAGMA synchronous = NORMAL;');
        await db.exec('PRAGMA cache_size = -2000;'); // Use 2MB of cache
        await db.exec('PRAGMA temp_store = MEMORY;');
        await db.exec('PRAGMA foreign_keys = ON;');
        
        // Execute schema
        await db.exec(schema);
        
        return db;
    } catch (error) {
        throw new Error(`Database initialization failed: ${error.message}`);
    }
}

export async function query(sql, params = []) {
    try {
        const database = await initialize();
        return await database.all(sql, params);
    } catch (error) {
        throw new Error(`Query failed: ${error.message}`);
    }
}

export async function execute(sql, params = []) {
    try {
        const database = await initialize();
        return await database.run(sql, params);
    } catch (error) {
        throw new Error(`Execute failed: ${error.message}`);
    }
}

// Project operations
export async function createProject(name, version, template) {
    try {
        const database = await initialize();
        const stmt = await database.prepare(
            'INSERT INTO projects (name, version, template, created_at) VALUES (?, ?, ?, datetime("now"))'
        );
        try {
            return await stmt.run(name, version, template);
        } finally {
            await stmt.finalize();
        }
    } catch (error) {
        throw new Error(`Failed to create project: ${error.message}`);
    }
}

export async function getProjectById(id) {
    try {
        const projects = await query('SELECT * FROM projects WHERE id = ?', [id]);
        return projects[0];
    } catch (error) {
        throw new Error(`Failed to get project: ${error.message}`);
    }
}

export async function deleteProject(id) {
    try {
        return await execute('DELETE FROM projects WHERE id = ?', [id]);
    } catch (error) {
        throw new Error(`Failed to delete project: ${error.message}`);
    }
}

export async function deleteAllProjects() {
    try {
        return await execute('DELETE FROM projects');
    } catch (error) {
        throw new Error(`Failed to delete all projects: ${error.message}`);
    }
}

export async function getAllProjects() {
    try {
        return await query('SELECT * FROM projects ORDER BY created_at DESC');
    } catch (error) {
        throw new Error(`Failed to get all projects: ${error.message}`);
    }
}
