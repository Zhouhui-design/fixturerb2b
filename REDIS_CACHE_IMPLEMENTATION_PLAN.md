# Redis 缓存集成实施方案

## 📅 创建时间
2026-05-02

## 🎯 目标
通过 Redis 缓存提升聊天系统性能，减少数据库查询压力。

---

## 📊 当前性能瓶颈分析

### 需要优化的场景

1. **统计数据查询**
   - 每次刷新管理后台都查询数据库
   - 包含：总用户数、活跃用户、消息统计等
   - 频率：高（管理员频繁查看）

2. **在线用户列表**
   - Socket.IO 连接状态查询
   - 频率：非常高（实时更新）

3. **消息历史分页**
   - 每次滚动加载都查询数据库
   - 频率：高（用户浏览聊天记录）

4. **用户信息缓存**
   - 频繁查询用户资料
   - 频率：中等

---

## 🏗️ 技术方案

### 架构设计

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│  Node.js    │◄────►│   Redis      │
│  Server     │      │   Cache      │
└──────┬──────┘      └──────────────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │
│  Database   │
└─────────────┘
```

### 缓存策略

| 数据类型 | TTL | 更新策略 | 预期命中率 |
|---------|-----|---------|-----------|
| 统计数据 | 5分钟 | 定时刷新 + 事件触发 | 90%+ |
| 在线用户 | 1分钟 | WebSocket 事件实时更新 | 95%+ |
| 消息历史 | 10分钟 | LRU 淘汰 | 70%+ |
| 用户信息 | 30分钟 | 用户更新时失效 | 85%+ |

---

## 🔧 实施步骤

### 步骤 1: 安装 Redis 服务器

```bash
# SSH 登录服务器
ssh root@139.59.108.156

# 安装 Redis
sudo apt-get update
sudo apt-get install redis-server

# 启动 Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 验证安装
redis-cli ping
# 应返回: PONG
```

### 步骤 2: 配置 Redis（可选优化）

```bash
# 编辑配置文件
sudo nano /etc/redis/redis.conf

# 推荐配置
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000

# 重启 Redis
sudo systemctl restart redis-server
```

### 步骤 3: 安装 Node.js 依赖

```bash
cd /var/www/chat-system/server
npm install redis ioredis
```

### 步骤 4: 创建 Redis 服务模块

文件位置：`server/services/cacheService.js`

```javascript
const Redis = require('ioredis');

class CacheService {
    constructor() {
        this.redis = null;
        this.init();
    }

    init() {
        try {
            this.redis = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                password: process.env.REDIS_PASSWORD || null,
                db: 0,
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    if (times > 10) return null; // 停止重试
                    return Math.min(times * 100, 3000);
                }
            });

            this.redis.on('connect', () => {
                console.log('✅ Redis connected');
            });

            this.redis.on('error', (err) => {
                console.error('❌ Redis error:', err.message);
            });
        } catch (error) {
            console.error('❌ Redis initialization failed:', error.message);
        }
    }

    /**
     * 获取缓存
     */
    async get(key) {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Cache GET error for key ${key}:`, error.message);
            return null;
        }
    }

    /**
     * 设置缓存
     */
    async set(key, value, ttl = 300) {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Cache SET error for key ${key}:`, error.message);
            return false;
        }
    }

    /**
     * 删除缓存
     */
    async del(key) {
        try {
            await this.redis.del(key);
            return true;
        } catch (error) {
            console.error(`Cache DEL error for key ${key}:`, error.message);
            return false;
        }
    }

    /**
     * 清除模式匹配的缓存
     */
    async clearPattern(pattern) {
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
            return keys.length;
        } catch (error) {
            console.error(`Cache CLEAR pattern ${pattern} error:`, error.message);
            return 0;
        }
    }

    /**
     * 获取或设置缓存（带回调）
     */
    async getOrSet(key, callback, ttl = 300) {
        const cached = await this.get(key);
        if (cached) {
            return { data: cached, fromCache: true };
        }

        const data = await callback();
        await this.set(key, data, ttl);
        return { data, fromCache: false };
    }
}

module.exports = new CacheService();
```

### 步骤 5: 集成到现有代码

#### 5.1 缓存统计数据

修改 `server/routes/stats.js`：

```javascript
const cacheService = require('../services/cacheService');

router.get('/dashboard', async (req, res) => {
    try {
        const { tenantId } = req.query;
        const cacheKey = `stats:${tenantId}`;

        // 尝试从缓存获取
        const cached = await cacheService.get(cacheKey);
        if (cached) {
            return res.json({ ...cached, fromCache: true });
        }

        // 查询数据库
        const stats = await calculateStats(tenantId);

        // 存入缓存（5分钟）
        await cacheService.set(cacheKey, stats, 300);

        res.json({ ...stats, fromCache: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

#### 5.2 缓存在线用户

在 `server/server.js` 中：

```javascript
const cacheService = require('./services/cacheService');

// 用户连接时更新缓存
socket.on('user_connected', async (data) => {
    // ... 现有逻辑
    
    // 更新在线用户缓存
    const onlineKey = `online_users:${data.tenantId}`;
    await cacheService.del(onlineKey); // 清除旧缓存
});

// 提供在线用户 API
router.get('/online-users', async (req, res) => {
    const { tenantId } = req.query;
    const cacheKey = `online_users:${tenantId}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.json(cached);
    }

    // 从 Socket.IO 获取实时数据
    const onlineUsers = getOnlineUsers(tenantId);
    await cacheService.set(cacheKey, onlineUsers, 60); // 1分钟 TTL

    res.json(onlineUsers);
});
```

#### 5.3 缓存消息历史

```javascript
router.get('/messages', async (req, res) => {
    const { chatId, page = 1, limit = 50 } = req.query;
    const cacheKey = `messages:${chatId}:${page}:${limit}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.json(cached);
    }

    const messages = await Message.find({ chatId })
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    await cacheService.set(cacheKey, messages, 600); // 10分钟 TTL

    res.json(messages);
});
```

### 步骤 6: 环境变量配置

在 `.env` 文件中添加：

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # 如果设置了密码
```

### 步骤 7: 监控和维护

创建监控脚本 `scripts/monitor_redis.js`：

```javascript
const cacheService = require('../services/cacheService');

async function monitorRedis() {
    const info = await cacheService.redis.info();
    console.log('Redis Info:', info);

    const keys = await cacheService.redis.dbsize();
    console.log('Total keys:', keys);

    const memory = await cacheService.redis.info('memory');
    console.log('Memory usage:', memory.used_memory_human);
}

monitorRedis();
```

---

## 📈 性能提升预期

### 基准测试（预估）

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 统计数据响应时间 | 200-500ms | 5-20ms | **90%+** |
| 在线用户查询 | 100-300ms | 2-10ms | **95%+** |
| 消息历史加载 | 300-800ms | 50-150ms | **70%+** |
| 数据库查询次数 | 高 | 降低 80% | **显著** |
| 服务器 CPU 使用率 | 较高 | 降低 40% | **明显** |

---

## ⚠️ 注意事项

### 1. 缓存一致性

- **问题**：缓存数据可能与数据库不一致
- **解决方案**：
  - 设置合理的 TTL
  - 数据更新时主动清除相关缓存
  - 使用版本号机制

### 2. 内存管理

- Redis 默认使用内存存储
- 建议设置 `maxmemory` 限制
- 使用 LRU 淘汰策略

### 3. 持久化

- Redis 支持 RDB 和 AOF 两种持久化方式
- 对于聊天系统，可以接受部分数据丢失
- 建议使用 RDB 快照即可

### 4. 故障恢复

- Redis 宕机不应影响核心功能
- 所有缓存操作应有 fallback 到数据库的逻辑
- 添加重试机制

---

## 🧪 测试方案

### 单元测试

```javascript
describe('CacheService', () => {
    it('should set and get cache', async () => {
        await cacheService.set('test_key', { value: 123 }, 60);
        const result = await cacheService.get('test_key');
        expect(result.value).toBe(123);
    });

    it('should handle cache miss', async () => {
        const result = await cacheService.get('nonexistent_key');
        expect(result).toBeNull();
    });

    it('should respect TTL', async () => {
        await cacheService.set('temp_key', 'value', 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const result = await cacheService.get('temp_key');
        expect(result).toBeNull();
    });
});
```

### 性能测试

```bash
# 使用 Apache Bench 测试
ab -n 1000 -c 10 http://localhost:3000/api/stats/dashboard?tenantId=fixturerb2b

# 对比有缓存和无缓存的响应时间
```

---

## 🚀 部署检查清单

- [ ] Redis 服务器已安装并运行
- [ ] Node.js 依赖已安装（redis, ioredis）
- [ ] 环境变量已配置
- [ ] 缓存服务模块已创建
- [ ] 统计数据接口已集成缓存
- [ ] 在线用户查询已集成缓存
- [ ] 消息历史已集成缓存
- [ ] 缓存清除逻辑已实现
- [ ] 错误处理和 fallback 已添加
- [ ] 性能测试已通过
- [ ] 监控脚本已部署

---

## 📊 资源需求评估

### 服务器资源

| 资源 | 需求 | 说明 |
|------|------|------|
| 内存 | +256MB | Redis 缓存占用 |
| CPU | +5% | 缓存序列化/反序列化 |
| 磁盘 | +50MB | Redis 持久化文件 |
| 网络 | 无额外需求 | 本地通信 |

### 当前服务器配置

```bash
# 检查当前资源
ssh root@139.59.108.156
free -h          # 内存使用情况
df -h            # 磁盘使用情况
top              # CPU 使用情况
```

**建议**：如果服务器内存 < 1GB，暂缓实施此优化。

---

## 📝 总结

### 优势
- ✅ 显著提升响应速度
- ✅ 降低数据库负载
- ✅ 改善用户体验
- ✅ 支持更高并发

### 劣势
- ❌ 增加系统复杂度
- ❌ 需要额外内存资源
- ❌ 缓存一致性问题
- ❌ 维护成本增加

### 推荐实施时机
- 当日均活跃用户 > 100 人
- 当数据库查询成为瓶颈
- 当服务器内存充足（> 2GB）
- 当需要支持更高并发

---

**创建时间**: 2026-05-02  
**状态**: 📋 待实施（等待资源评估）  
**优先级**: 中（性能优化）
