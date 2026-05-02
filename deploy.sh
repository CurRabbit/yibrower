#!/bin/bash
# Yi 易经浏览器发布脚本
# 用法: ./deploy.sh [--rebuild]
#   无参数：只重启进程（轻量，适合 .tsx/.ts/.css 改动）
#   --rebuild：完整重建（只有改依赖/配置时才用）
#
# 架构说明（2026-05-02）：
#   - Next.js 前端  → 端口 3001，/yi/ 路径
#   - yi-images-api → 端口 20224，/yi-api/ 路径（nginx 反代）
#   两服务独立，deploy.sh 分别管理

set -e

WORKDIR="/root/yi-next"
API_DIR="/root/yi-images-api"
LOG="/tmp/yi-deploy.log"
PID_FILE="/tmp/yi-next.pid"
API_PID_FILE="/tmp/yi-api.pid"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG"; }

# ── 参数解析 ──
REBUILD=false
if [[ "$1" == "--rebuild" ]]; then
  REBUILD=true
  log "⚠️  完整重建模式"
fi

# ── 0. 前置安全检查 ──
log "=== 开始发布 (rebuild=$REBUILD) ==="

# 检查 swap（rebuild 必须）
if $REBUILD; then
  SWAP_TOTAL=$(free -m | awk '/Swap:/{print $2}')
  DISK_AVAIL=$(df -h / | awk 'NR==2 {print $4}')
  log "swap=${SWAP_TOTAL}MB, disk_free=${DISK_AVAIL}"
  if [[ "$SWAP_TOTAL" == "0" ]]; then
    log "❌ 错误：swap 为 0，build 会导致 OOM"
    exit 1
  fi
fi

# ── 1. 重启 yi-api 后端（始终执行） ──
log "=== yi-api 后端 ==="

# 杀掉旧 api 进程
if [[ -f "$API_PID_FILE" ]]; then
  OLD_API_PID=$(cat "$API_PID_FILE")
  if [[ -n "$OLD_API_PID" ]] && kill -0 "$OLD_API_PID" 2>/dev/null; then
    log "  kill yi-api PID=$OLD_API_PID"
    kill -TERM "$OLD_API_PID" 2>/dev/null || true
    sleep 2
    kill -0 "$OLD_API_PID" 2>/dev/null && kill -9 "$OLD_API_PID" 2>/dev/null || true
  fi
fi

# 端口占用的备用杀
for pid in $(ss -tlnp 2>/dev/null | grep ':20224' | grep -oP 'pid=\K\d+' | sort -u); do
  log "  kill port-20224 PID=$pid"
  kill -TERM "$pid" 2>/dev/null || true
done

sleep 1

# 启动新 api 服务（--rebuild 时重新安装依赖）
if $REBUILD; then
  log "  安装 yi-api 依赖..."
  pip install -q -r "$API_DIR/requirements.txt" 2>&1 | tail -2
fi

log "  启动 yi-api on :20224..."
cd "$API_DIR"
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 20224 > "$LOG" 2>&1 &
API_NEW_PID=$!
echo "$API_NEW_PID" > "$API_PID_FILE"
log "  yi-api PID=$API_NEW_PID"

# 等待 api 就绪
for i in $(seq 1 10); do
  sleep 1
  if curl -sf http://localhost:20224/yi-api/health > /dev/null 2>&1; then
    log "  ✓ yi-api 就绪"
    break
  fi
  log "  等待 yi-api... ($i/10)"
done

# ── 2. Next.js 前端发布 ──
log "=== Next.js 前端 ==="

# 停止旧进程
if [[ -f "$PID_FILE" ]]; then
  OLD_PID=$(cat "$PID_FILE")
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    log "  kill -TERM $OLD_PID"
    kill -TERM "$OLD_PID" 2>/dev/null || true
    sleep 3
    kill -0 "$OLD_PID" 2>/dev/null && kill -9 "$OLD_PID" 2>/dev/null || true
  fi
fi

for pid in $(ss -tlnp 2>/dev/null | grep ':3001' | grep -oP 'pid=\K\d+' | sort -u); do
  log "  kill port-3001 PID=$pid"
  kill -TERM "$pid" 2>/dev/null || true
done
sleep 2

# 构建（仅 --rebuild）
if $REBUILD; then
  log "开始构建..."
  cd "$WORKDIR"
  if [[ ! -f ".next/BUILD_ID" ]]; then
    log "⚠️  .next/BUILD_ID 不存在，强制 rebuild"
  fi
  NODE_OPTIONS='--max-old-space-size=768' /root/.local/bin/npm run build >> "$LOG" 2>&1
  BUILD_EXIT=$?
  if [[ $BUILD_EXIT -ne 0 ]]; then
    log "❌ 构建失败 (exit $BUILD_EXIT)"
    exit 1
  fi
  log "✓ 构建成功"
else
  log "(跳过 build)"
fi

# 启动
log "启动 Next.js on :3001..."
cd "$WORKDIR"
nohup /root/.local/bin/npm run start -- -p 3001 > "$LOG" 2>&1 &
NEW_PID=$!
echo "$NEW_PID" > "$PID_FILE"
log "Next.js PID=$NEW_PID"

# 等待就绪
for i in $(seq 1 15); do
  sleep 2
  if curl -sf http://127.0.0.1:3001/yi/ > /dev/null 2>&1; then
    log "✓ Next.js 就绪 (${i}×2s)"
    break
  fi
  log "  等待 Next.js... ($i/15)"
done

log "=== 发布完成 ==="
log "  前端: http://8.136.25.169/yi/"
log "  API:  http://8.136.25.169/yi-api/health"
