# Chrome 代理配置指南 - SSH 隧道方案

**状态**: SSH 隧道已启动 ✅  
**本地代理**: 127.0.0.1:1080 (SOCKS5)  
**服务器**: fixr2026.com (法兰克福)

---

##  重要提示

### 关键：Chrome 对 SOCKS5 有限制！

根据 DeepSeek 的建议，Chrome 原生对 SOCKS5 代理有兼容性问题。

**解决方案（2选1）**：

---

## 方案 A: 使用 SOCKS4 协议（推荐）⭐

### 步骤 1: 安装 SwitchyOmega（如果还没有）

Chrome 网上应用店搜索 "SwitchyOmega" 或访问：
```
https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif
```

### 步骤 2: 配置 SOCKS4 代理

1. **点击 SwitchyOmega 图标** → 选项

2. **新建情景模式**:
   - 名称: `Frankfurt SSH`
   - 类型: **代理服务器**
   - 点击"创建"

3. **配置代理**:
   - 代理协议: **SOCKS4**（重要！不是 SOCKS5）
   - 代理服务器: `127.0.0.1`
   - 端口: `1080`
   - 点击"应用选项"

4. **切换到这个情景模式**:
   - 点击 SwitchyOmega 图标
   - 选择 `Frankfurt SSH`

### 步骤 3: 测试访问

打开**普通 Chrome 窗口**（不是无痕模式），访问：
```
https://chat.fixturerb2b.top/
```

---

## 方案 B: 使用 Firefox 浏览器（备选）

Firefox 对 SOCKS5 支持更好。

### 步骤 1: 安装 Firefox（如果还没有）

```bash
sudo apt install firefox
```

### 步骤 2: 配置代理

1. 打开 Firefox
2. 点击右上角菜单 → 设置
3. 滚动到"网络设置" → 点击"设置..."
4. 选择"手动代理配置"
5. 填写：
   - SOCKS 主机: `127.0.0.1`
   - 端口: `1080`
   - 勾选"使用 SOCKS v5 时代理 DNS 查询"
6. 点击"确定"

### 步骤 3: 测试访问

访问：
```
https://chat.fixturerb2b.top/
```

---

##  验证代理是否生效

### 方法 1: 检查 IP 地址

访问以下任一网站：
```
https://ipinfo.io
https://www.ip.cn
https://ifconfig.me
```

应该显示：
```
IP: 167.99.134.217
城市: Frankfurt am Main
国家: Germany (DE)
```

### 方法 2: curl 测试

在终端运行：
```bash
curl -x socks5h://127.0.0.1:1080 https://chat.fixturerb2b.top/ -o /dev/null -s -w "%{http_code}\n"
```

应该返回：`200`

### 方法 3: Chrome 开发者工具

1. 访问 `https://chat.fixturerb2b.top/`
2. 按 F12 打开开发者工具
3. Network 标签
4. 查看请求状态，应该全部是 200 OK

---

##  无痕模式注意事项

### 问题：SwitchyOmega 在无痕模式下可能不生效

**解决方案**：

1. **启用扩展在无痕模式**：
   - 打开 `chrome://extensions/`
   - 找到 SwitchyOmega
   - 点击"详细信息"
   - 勾选"在无痕模式下启用"

2. **或者使用普通窗口**：
   - 暂时不使用无痕模式
   - 直接在普通 Chrome 窗口测试

3. **或者使用 Firefox**：
   - Firefox 没有这个问题

---

##  故障排除

### 问题 1: 仍然报 ERR_SOCKS_CONNECTION_FAILED

**解决**：
1. 确认 SSH 隧道正在运行
2. 检查 SwitchyOmega 是否选择正确的情景模式
3. 确认使用的是 **SOCKS4**（不是 SOCKS5）
4. 完全关闭 Chrome，重新打开

### 问题 2: 页面加载很慢

**可能原因**：
- SSH 隧道断开
- 网络延迟
- 服务器负载高

**解决**：
```bash
# 检查 SSH 隧道
ps aux | grep "ssh -D 1080"

# 重新建立隧道
ssh -D 1080 -C -N root@fixr2026.com
```

### 问题 3: 无法连接到 127.0.0.1:1080

**检查端口是否监听**：
```bash
netstat -tuln | grep 1080
```

如果没有输出，说明 SSH 隧道未建立。

**解决**：
```bash
# 重新运行启动脚本
bash start-ssh-proxy.sh
```

---

##  管理 SSH 隧道

### 查看隧道状态

```bash
ps aux | grep "ssh -D 1080"
```

### 停止隧道

在运行 `start-ssh-proxy.sh` 的终端按 `Ctrl+C`

或者：
```bash
pkill -f "ssh -D 1080"
```

### 重新启动隧道

```bash
bash start-ssh-proxy.sh
```

---

##  测试清单

配置完成后，逐项测试：

- [ ] SSH 隧道正在运行（终端显示连接成功）
- [ ] SwitchyOmega 配置为 SOCKS4: 127.0.0.1:1080
- [ ] 切换到 Frankfurt SSH 情景模式
- [ ] 访问 https://ipinfo.io 显示法兰克福 IP
- [ ] 访问 https://fixr2026.com 正常打开
- [ ] 点击"Chat System"按钮能跳转
- [ ] https://chat.fixturerb2b.top/ 正常打开
- [ ] 聊天功能正常（能发送消息）
- [ ] 没有 ERR_SOCKS_CONNECTION_FAILED 错误

---

##  快捷命令

```bash
# 启动 SSH 隧道
bash start-ssh-proxy.sh

# 测试代理连通性
curl -x socks5h://127.0.0.1:1080 https://chat.fixturerb2b.top/ -o /dev/null -s -w "%{http_code}\n"

# 检查隧道状态
ps aux | grep "ssh -D 1080"

# 查看网络监听
netstat -tuln | grep 1080
```

---

## 📞 需要帮助？

如果配置后仍有问题，请提供：

1. **SSH 隧道状态**：
   ```bash
   ps aux | grep "ssh -D 1080"
   ```

2. **端口监听状态**：
   ```bash
   netstat -tuln | grep 1080
   ```

3. **代理测试结果**：
   ```bash
   curl -x socks5h://127.0.0.1:1080 https://chat.fixturerb2b.top/ -v
   ```

4. **Chrome 版本和 SwitchyOmega 版本**

---

**配置完成后，您应该能正常访问聊天系统了！** 🚀
