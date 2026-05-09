from pydantic import BaseModel
from typing import Optional

class GuaBase(BaseModel):
    gua_num: int
    gua_name: str
    gua_pinyin: str
    wuxing: Optional[int] = None
    binary: Optional[str] = None
    guaci: Optional[str] = None
    yaoci: Optional[list[str]] = None
    xiangci: Optional[str] = None
    tuanc: Optional[str] = None

class GuaResponse(GuaBase):
    pass

class ThemeBase(BaseModel):
    name: str
    prompt: str
    enabled: int = 1

class ThemeResponse(ThemeBase):
    id: int
    created_at: str
    updated_at: str

class ImageRecordBase(BaseModel):
    filename: str
    gua_num: int
    theme_name: str
    storage_backend: str = "local"
    storage_path: str
    storage_url: Optional[str] = None
    size_bytes: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    theme_prompt: Optional[str] = None
    generated_by: str = "manual"

class ImageRecordCreate(ImageRecordBase):
    pass

class ImageRecordResponse(ImageRecordBase):
    id: int
    api_key_masked: Optional[str] = None
    created_at: str
    mtime: Optional[int] = None
    status: int
