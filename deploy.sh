#!/bin/bash
# 停止旧进程（只杀 node，不要杀 Hermes 自己）
pkill -9 -f "node.*yi-next" 2>/dev/null
pkill -9 -f "next.*3001" 2>/dev/null
sleep 2

# 构建
cd /root/yi-next
npm run build

# 启动新服务
npm run start -- -p 3001 &
