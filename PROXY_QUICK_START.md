# 法兰克福代理快速使用指南

## 🔍 当前问题

**错误**: `ERR_SOCKS_CONNECTION_FAILED`

**原因**: Dante 代理配置有问题，SOCKS5 连接失败

**解决方案**: 使用 SSH 动态端口转发（更简单、更可靠）

---

## ✅ 方案 A: SSH 动态转发（推荐，1分钟搞定）

### 步骤 1: 建立 SSH 隧道

在您的**本地终端**运行：

```bash
ssh -D 1080 -C -N root@fixr2026.com
```

**参数说明**:
- `-D 1080`: 在本地 127.0.0.1:1080 创建 SOCKS5 代理
- `-C`: 压缩数据（提升速度）
- `-N`: 不执行远程命令
- **保持这个终端窗口打开**，不要关闭

### 步骤 2: Chrome 配置

1. **安装 SwitchyOmega**（如果还没有）
   ```
   https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif
   ```

2. **新建情景模式**
   - 名称: `Frankfurt`
   - 代理协议: **SOCKS5**
   - 代理服务器: `127.0.0.1`
   - 端口: `1080`

3. **配置自动切换规则**
   - 模式: **Auto Switch**
   - 添加规则:
     ```
     条件类型: 域名通配符
     匹配模式: *.fixturerb2b.top
     目标情景: Frankfurt
     
     条件类型: 域名通配符
     匹配模式: *.fixr2026.com
     目标情景: Frankfurt
     
     条件类型: 域名通配符
     匹配模式: 167.99.134.217
     目标情景: Frankfurt
     
     默认情景: Direct Connection (直接连接)
     ```

4. **启用自动切换模式**

### 步骤 3: 测试访问

打开无痕窗口，访问：
```
https://chat.fixturerb2b.top/
```

应该立即打开，延迟 < 50ms

---

## 🔧 方案 B: 修复 Dante 代理（长期方案）

Dante 代理已在服务器上安装，但配置有问题。

### 修复步骤

1. **SSH 到服务器**
   ```bash
   ssh root@fixr2026.com
   ```

2. **停止当前 Dante**
   ```bash
   systemctl stop danted
   ```

3. **编辑配置**
   ```bash
   nano /etc/danted.conf
   ```

4. **使用以下配置**
   ```
   logoutput: /var/log/danted.log
   user.privileged: root
   user.unprivileged: nobody
   
   internal: 0.0.0.0 port = 1080
   external: eth0
   
   clientmethod: none
   socksmethod: none
   
   client pass {
       from: 0.0.0.0/0 to: 0.0.0.0/0
       log: error connect disconnect
   }
   
   socks pass {
       from: 0.0.0.0/0 to: 0.0.0.0/0
       command: connect bind udpassociate
       log: error connect disconnect
   }
   ```

5. **启动 Dante**
   ```bash
   systemctl start danted
   systemctl enable danted
   ```

6. **测试代理**
   ```bash
   curl -x socks5h://127.0.0.1:1080 https://fixr2026.com/ -o /dev/null -s -w "%{http_code}\n"
   ```

   应该返回 `200`

### Chrome 配置（使用 Dante）

代理服务器: `167.99.134.217`
端口: `1080`
协议: `SOCKS5`

---

## 📊 方案对比

| 特性 | SSH 动态转发 | Dante 代理 |
|------|-------------|-----------|
| 配置难度 | ⭐ 简单 | ⭐ 中等 |
| 稳定性 | ⭐⭐ 高 | ⭐⭐ 中 |
| 性能 | ⭐⭐ 中 | ⭐⭐⭐ 高 |
| 需要保持终端 | ✅ 是 |  否 |
| 适合场景 | 临时测试 | 长期使用 |

---

## 🎯 推荐方案

**立即使用**: 方案 A（SSH 动态转发）
- 1分钟搞定
- 100%可靠
- 完美模拟法兰克福用户

**长期优化**: 方案 B（Dante 代理）
- 无需保持终端
- 性能更好
- 支持多设备

---

## 🔍 验证代理是否工作

### 方法 1: curl 测试

```bash
# 测试主站
curl -x socks5h://127.0.0.1:1080 https://fixr2026.com/ -o /dev/null -s -w "%{http_code}\n"

# 测试聊天系统
curl -x socks5h://127.0.0.1:1080 https://chat.fixturerb2b.top/ -o /dev/null -s -w "%{http_code}\n"
```

都应该返回 `200`

### 方法 2: Chrome 开发者工具

1. 打开 `https://chat.fixturerb2b.top/`
2. F12 打开开发者工具
3. Network 标签
4. 查看请求状态，应该全部是 200 OK

### 方法 3: 检查 IP 位置

访问：https://ipinfo.io

应该显示：
```
City: Frankfurt am Main
Region: Hesse
Country: DE (Germany)
```

---

## ⚠️ 常见问题

### Q1: SSH 隧道断开怎么办？

重新运行：
```bash
ssh -D 1080 -C -N root@fixr2026.com
```

### Q2: Chrome 仍然报错？

1. 完全关闭 Chrome（所有窗口）
2. 重新打开
3. 检查 SwitchyOmega 是否正确启用

### Q3: 如何临时关闭代理？

在 SwitchyOmega 中选择 `Direct Connection`（直接连接）

### Q4: Dante 代理启动失败？

查看日志：
```bash
journalctl -u danted -n 50
```

---

## 📝 快速命令参考

```bash
# 启动 SSH 代理
ssh -D 1080 -C -N root@fixr2026.com

# 测试代理
curl -x socks5h://127.0.0.1:1080 https://fixr2026.com/

# 检查 Dante 状态
ssh root@fixr2026.com "systemctl status danted"

# 重启 Dante
ssh root@fixr2026.com "systemctl restart danted"

# 查看 Dante 日志
ssh root@fixr2026.com "tail -f /var/log/danted.log"
```

---

**现在立即执行方案 A，1分钟后就能正常访问了！** 🚀
