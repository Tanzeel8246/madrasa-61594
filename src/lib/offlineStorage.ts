import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDB extends DBSchema {
  students: {
    key: string;
    value: any;
  };
  teachers: {
    key: string;
    value: any;
  };
  classes: {
    key: string;
    value: any;
  };
  attendance: {
    key: string;
    value: any;
  };
  courses: {
    key: string;
    value: any;
  };
  fees: {
    key: string;
    value: any;
  };
  education_reports: {
    key: string;
    value: any;
  };
  sync_queue: {
    key: number;
    value: {
      id: number;
      table: string;
      operation: 'insert' | 'update' | 'delete';
      data: any;
      timestamp: number;
    };
    autoIncrement: true;
  };
}

let dbInstance: IDBPDatabase<OfflineDB> | null = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<OfflineDB>('madrasa-offline-db', 1, {
    upgrade(db) {
      // Create object stores for each table
      if (!db.objectStoreNames.contains('students')) {
        db.createObjectStore('students');
      }
      if (!db.objectStoreNames.contains('teachers')) {
        db.createObjectStore('teachers');
      }
      if (!db.objectStoreNames.contains('classes')) {
        db.createObjectStore('classes');
      }
      if (!db.objectStoreNames.contains('attendance')) {
        db.createObjectStore('attendance');
      }
      if (!db.objectStoreNames.contains('courses')) {
        db.createObjectStore('courses');
      }
      if (!db.objectStoreNames.contains('fees')) {
        db.createObjectStore('fees');
      }
      if (!db.objectStoreNames.contains('education_reports')) {
        db.createObjectStore('education_reports');
      }
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
      }
    },
  });

  return dbInstance;
}

export async function saveToOfflineStorage(table: string, key: string, data: any) {
  const db = await getDB();
  await db.put(table as any, data, key);
}

export async function getFromOfflineStorage(table: string, key: string) {
  const db = await getDB();
  return await db.get(table as any, key);
}

export async function getAllFromOfflineStorage(table: string) {
  const db = await getDB();
  return await db.getAll(table as any);
}

export async function deleteFromOfflineStorage(table: string, key: string) {
  const db = await getDB();
  await db.delete(table as any, key);
}

export async function clearOfflineStorage(table: string) {
  const db = await getDB();
  await db.clear(table as any);
}

export async function addToSyncQueue(
  table: string,
  operation: 'insert' | 'update' | 'delete',
  data: any
) {
  const db = await getDB();
  await db.add('sync_queue', {
    id: Date.now(),
    table,
    operation,
    data,
    timestamp: Date.now(),
  });
}

export async function getSyncQueue() {
  const db = await getDB();
  return await db.getAll('sync_queue');
}

export async function clearSyncQueue() {
  const db = await getDB();
  await db.clear('sync_queue');
}

export async function removeFromSyncQueue(id: number) {
  const db = await getDB();
  await db.delete('sync_queue', id);
}
