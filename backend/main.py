#!/usr/bin/env python3
"""
Yi-Images FastAPI 服务
卦数据 + 主题配置 + 图片记录 CRUD
挂载路径: /yi-api/ → localhost:20224
"""
import json
import math
from pathlib import Path
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from db import get_conn, DB_PATH
from models import (
    GuaResponse, ThemeResponse, ThemeBase,
    ImageRecordCreate, ImageRecordResponse
)

# ── 挂载路径（nginx 反向代理用 /yi-api/）
PREFIX = "/yi-api"
app = FastAPI(title="Yi-Images API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════
# 卦数据
# ═══════════════════════════════════════════════════════

@app.get(f"{PREFIX}/gua", response_model=list[GuaResponse], tags=["卦数据"])
def list_gua():
    """列出全部 64 卦"""
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM gua_info ORDER BY gua_num").fetchall()
        result = []
        for r in rows:
            d = dict(r)
            if d.get("yaoci"):
                d["yaoci"] = json.loads(d["yaoci"])
            else:
                d["yaoci"] = []
            result.append(d)
        return result


@app.get(f"{PREFIX}/gua/{{gua_num}}", response_model=GuaResponse, tags=["卦数据"])
def get_gua(gua_num: int):
    """按卦序获取单卦"""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM gua_info WHERE gua_num = ?", (gua_num,)
        ).fetchone()
        if not row:
            raise HTTPException(404, f"卦序 {gua_num} 不存在")
        d = dict(row)
        d["yaoci"] = json.loads(d["yaoci"]) if d.get("yaoci") else []
        return d


# ═══════════════════════════════════════════════════════
# 主题配置
# ═══════════════════════════════════════════════════════

@app.get(f"{PREFIX}/themes", response_model=list[ThemeResponse], tags=["主题"])
def list_themes(enabled: Optional[bool] = None):
    """列出全部主题，可选只返回启用的"""
    with get_conn() as conn:
        if enabled is True:
            rows = conn.execute(
                "SELECT * FROM themes WHERE enabled = 1 ORDER BY id"
            ).fetchall()
        elif enabled is False:
            rows = conn.execute(
                "SELECT * FROM themes WHERE enabled = 0 ORDER BY id"
            ).fetchall()
        else:
            rows = conn.execute("SELECT * FROM themes ORDER BY id").fetchall()
        return [dict(r) for r in rows]


@app.post(f"{PREFIX}/themes", response_model=ThemeResponse, tags=["主题"])
def create_theme(theme: ThemeBase):
    """新建主题"""
    now = datetime.now().isoformat()
    with get_conn() as conn:
        try:
            cur = conn.execute(
                """INSERT INTO themes (name, prompt, enabled, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?)""",
                (theme.name, theme.prompt, theme.enabled, now, now)
            )
            conn.commit()
            row = conn.execute(
                "SELECT * FROM themes WHERE id = ?", (cur.lastrowid,)
            ).fetchone()
            return dict(row)
        except sqlite3.IntegrityError:
            raise HTTPException(409, f"主题名 '{theme.name}' 已存在")


@app.put(f"{PREFIX}/themes/{{theme_id}}", response_model=ThemeResponse, tags=["主题"])
def update_theme(theme_id: int, theme: ThemeBase):
    """更新主题"""
    now = datetime.now().isoformat()
    with get_conn() as conn:
        cur = conn.execute(
            """UPDATE themes SET name=?, prompt=?, enabled=?, updated_at=?
               WHERE id=?""",
            (theme.name, theme.prompt, theme.enabled, now, theme_id)
        )
        if cur.rowcount == 0:
            raise HTTPException(404, f"主题 {theme_id} 不存在")
        conn.commit()
        row = conn.execute("SELECT * FROM themes WHERE id=?", (theme_id,)).fetchone()
        return dict(row)


@app.delete(f"{PREFIX}/themes/{{theme_id}}", tags=["主题"])
def delete_theme(theme_id: int):
    """软删除主题（enabled=0）"""
    now = datetime.now().isoformat()
    with get_conn() as conn:
        cur = conn.execute(
            "UPDATE themes SET enabled=0, updated_at=? WHERE id=?",
            (now, theme_id)
        )
        if cur.rowcount == 0:
            raise HTTPException(404, f"主题 {theme_id} 不存在")
        conn.commit()
        return {"ok": True}


# ═══════════════════════════════════════════════════════
# 图片记录
# ═══════════════════════════════════════════════════════

def _row_to_image(r) -> dict:
    d = dict(r)
    # storage_url 为 null 时补上 local 路径规则
    if not d.get("storage_url"):
        d["storage_url"] = f"/yi/assets/{d['storage_path']}"
    return d


@app.get(f"{PREFIX}/images", response_model=list[ImageRecordResponse], tags=["图片"])
def list_images(
    gua_num: Optional[int] = None,
    theme_name: Optional[str] = None,
    status: Optional[int] = Query(default=0, ge=0, le=1),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    """查询图片记录"""
    sql = "SELECT * FROM image_records WHERE status = ?"
    params = [status]
    if gua_num is not None:
        sql += " AND gua_num = ?"
        params.append(gua_num)
    if theme_name:
        sql += " AND theme_name = ?"
        params.append(theme_name)
    sql += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    with get_conn() as conn:
        rows = conn.execute(sql, params).fetchall()
        return [_row_to_image(r) for r in rows]


@app.get(f"{PREFIX}/images/{{image_id}}", response_model=ImageRecordResponse, tags=["图片"])
def get_image(image_id: int):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM image_records WHERE id = ?", (image_id,)
        ).fetchone()
        if not row:
            raise HTTPException(404, f"图片 {image_id} 不存在")
        return _row_to_image(row)


@app.post(f"{PREFIX}/images", response_model=ImageRecordResponse, tags=["图片"])
def create_image(img: ImageRecordCreate):
    """新增图片记录"""
    now = datetime.now().isoformat()
    mtime = None
    # 尝试从文件系统获取 mtime
    fpath = Path(f"/root/web/yi/assets/{img.storage_path}")
    if fpath.exists():
        mtime = int(fpath.stat().st_mtime)
        if img.size_bytes is None:
            img.size_bytes = fpath.stat().st_size

    with get_conn() as conn:
        cur = conn.execute(
            """INSERT INTO image_records
               (filename, gua_num, theme_name, storage_backend, storage_path,
                storage_url, size_bytes, width, height, theme_prompt,
                generated_by, created_at, mtime, status)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,0)""",
            (
                img.filename, img.gua_num, img.theme_name,
                img.storage_backend, img.storage_path, img.storage_url,
                img.size_bytes, img.width, img.height, img.theme_prompt,
                img.generated_by, now, mtime
            )
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM image_records WHERE id = ?", (cur.lastrowid,)
        ).fetchone()
        return _row_to_image(row)


@app.delete(f"{PREFIX}/images/{{image_id}}", tags=["图片"])
def delete_image(image_id: int):
    """软删除图片"""
    with get_conn() as conn:
        cur = conn.execute(
            "UPDATE image_records SET status=1 WHERE id=? AND status=0",
            (image_id,)
        )
        if cur.rowcount == 0:
            raise HTTPException(404, f"图片 {image_id} 不存在或已删除")
        conn.commit()
        return {"ok": True}


# ═══════════════════════════════════════════════════════
# 健康检查
# ═══════════════════════════════════════════════════════

@app.get(f"{PREFIX}/health", tags=["系统"])
def health():
    db_exists = DB_PATH.exists()
    return {"status": "ok" if db_exists else "db_missing", "db": str(DB_PATH)}


if __name__ == "__main__":
    import sqlite3
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=20224, reload=False)
