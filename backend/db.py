#!/usr/bin/env python3
import sqlite3
from pathlib import Path
from contextlib import contextmanager

DB_PATH = Path("/root/daily/yi-images/yi-images.db")

@contextmanager
def get_conn():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
