#!/bin/bash
# 启动 yi-images FastAPI 服务
# 端口: 20224
# 挂载路径: /yi-api/ (nginx 反向代理)

cd /root/yi-images-api
source ~/.venv/yi-images-api/bin/activate 2>/dev/null || true

exec python3 -m uvicorn main:app --host 0.0.0.0 --port 20224 --reload false
