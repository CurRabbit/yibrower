#!/bin/bash
# Yi 易经浏览器每日凌晨构建脚本
# 由 cron: 0 2 * * * /root/yi-next/daily-build.sh >> /tmp/yi-daily-build.log 2>&1
#
# 架构：
#   - Next.js 前端  → 端口 3001
#   - yi-images-api → 端口 20224
set -e

WORKDIR="/root/yi-next"
API_DIR="/root/yi-images-api"
LOG="/tmp/yi-daily-build.log"
PID_FILE="/tmp/yi-next.pid"
API_PID_FILE="/tmp/yi-api.pid"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

log "=== 每日构建开始 ==="

# 1. 检查 swap
SWAP_TOTAL=$(free -m | awk '/Swap:/{print $2}')
DISK_AVAIL=$(df -h / | awk 'NR==2 {print $4}')
log "swap=${SWAP_TOTAL}MB, disk_free=${DISK_AVAIL}"
if [[ "$SWAP_TOTAL" == "0" ]]; then
  log "❌ swap 为 0，退出"
  exit 1
fi

# 2. 重启 yi-api
log "重启 yi-api..."
for pid in $(ss -tlnp 2>/dev/null | grep ':20224' | grep -oP 'pid=\K\d+' | sort -u); do
  kill -TERM "$pid" 2>/dev/null || true
done
sleep 2
for pid in $(ss -tlnp 2>/dev/null | grep ':20224' | grep -oP 'pid=\K\d+' | sort -u); do
  kill -9 "$pid" 2>/dev/null || true
done

cd "$API_DIR"
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 20224 >> "$LOG" 2>&1 &
echo $! > "$API_PID_FILE"

for i in $(seq 1 10); do
  sleep 1
  curl -sf http://localhost:20224/yi-api/health > /dev/null 2>&1 && log "✓ yi-api 就绪" && break
  log "  等待 yi-api... ($i/10)"
done

# 3. 停止旧 Next.js 进程
log "停止旧 Next.js..."
for pid in $(ss -tlnp 2>/dev/null | grep ':3001' | grep -oP 'pid=\K\d+' | sort -u); do
  log "  kill $pid"
  kill -TERM "$pid" 2>/dev/null || true
done
sleep 3
for pid in $(ss -tlnp 2>/dev/null | grep ':3001' | grep -oP 'pid=\K\d+' | sort -u); do
  kill -9 "$pid" 2>/dev/null || true
done

# 4. 构建
log "开始构建..."
cd "$WORKDIR"
NODE_OPTIONS='--max-old-space-size=768' npm run build >> "$LOG" 2>&1
BUILD_EXIT=$?
if [[ $BUILD_EXIT -ne 0 ]]; then
  log "❌ 构建失败 (exit $BUILD_EXIT)"
  exit 1
fi
log "✓ 构建成功"

# 5. 启动生产服务
log "启动 Next.js..."
cd "$WORKDIR"
nohup npm run start -- -p 3001 >> "$LOG" 2>&1 &
NEW_PID=$!
echo "$NEW_PID" > "$PID_FILE"
log "Next.js PID=$NEW_PID"

# 6. 等待验证
for i in $(seq 1 15); do
  sleep 2
  if curl -sI http://127.0.0.1:3001/yi/ | head -1 | grep -q "200"; then
    log "✓ 服务就绪"
    log "=== 每日构建完成 ==="
    exit 0
  fi
done

log "⚠️  服务启动超时"
exit 1
