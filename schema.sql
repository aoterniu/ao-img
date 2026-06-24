CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER DEFAULT 0,
  width INTEGER DEFAULT 0,
  height INTEGER DEFAULT 0,
  format TEXT DEFAULT 'unknown',
  mime_type TEXT DEFAULT 'image/png',
  protected INTEGER DEFAULT 0,
  password TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  deleted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_images_created ON images(created_at);
CREATE INDEX IF NOT EXISTS idx_images_deleted ON images(deleted_at);
