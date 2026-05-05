# 完整重新部署指南 - 手动执行

**创建时间**: 2026-05-05  
**状态**: SSH 连接不稳定，建议手动执行

---

##  问题分析

根据您当前的情况：

### ✅ 确认的事实

1. **服务器直连正常**
   ```
   主站: HTTP 200, 0.86s ✅
   聊天系统: HTTP 200, 1.03s ✅
   ```

2. **本地代码完整**
   - dist/ 目录有所有构建文件
   - index.html, chat.html 都存在
   - assets/ 目录完整

3. **网络可以访问外网**
   - Google.com 可访问
   - Gmail.com 可访问

### ❌ 当前问题

1. **SSH 连接不稳定**
   - 自动部署脚本无法执行
   - 可能是网络波动或服务器负载高

2. **聊天系统可能文件不完整**
   - 之前的部署可能有遗漏
   - 需要重新上传所有文件

---

##  解决方案（手动执行）

### 方案 A: 使用 rsync 重新部署（推荐）

#### 步骤 1: 等待网络稳定

先测试 SSH 连接：
```bash
ssh root@fixr2026.com "echo '连接成功'"
```

如果能连接，继续下一步。

#### 步骤 2: 清理服务器旧文件

```bash
ssh root@fixr2026.com
rm -rf /var/www/fixr2026.com/*
rm -rf /var/www/chat-system/client/*
exit
```

#### 步骤 3: 上传主站文件

```bash
rsync -avz --delete dist/ root@fixr2026.com:/var/www/fixr2026.com/
```

#### 步骤 4: 部署聊天系统

```bash
ssh root@fixr2026.com
# 复制主站文件到聊天系统目录
cp -r /var/www/fixr2026.com/* /var/www/chat-system/client/

# 确保 index.html 存在
cp /var/www/chat-system/client/chat.html /var/www/chat-system/client/index.html

# 设置权限
chown -R www-data:www-data /var/www/chat-system/client/
chmod -R 755 /var/www/chat-system/client/

exit
```

#### 步骤 5: 重启 Nginx

```bash
ssh root@fixr2026.com "systemctl restart nginx"
```

#### 步骤 6: 测试

```bash
curl -skL https://fixr2026.com/ -o /dev/null -w "主站: HTTP %{http_code}\n"
curl -skL https://chat.fixturerb2b.top/ -o /dev/null -w "聊天系统: HTTP %{http_code}\n"
```

---

### 方案 B: 使用 scp 逐文件上传（备选）

如果 rsync 不行，使用 scp：

```bash
# 上传主站
scp dist/index.html root@fixr2026.com:/var/www/fixr2026.com/
scp dist/chat.html root@fixr2026.com:/var/www/fixr2026.com/
scp -r dist/assets root@fixr2026.com:/var/www/fixr2026.com/
scp -r dist/images root@fixr2026.com:/var/www/fixr2026.com/

# 复制主站文件到聊天系统
ssh root@fixr2026.com "cp -r /var/www/fixr2026.com/* /var/www/chat-system/client/ && cp /var/www/chat-system/client/chat.html /var/www/chat-system/client/index.html && chown -R www-data:www-data /var/www/chat-system/client/"

# 重启 Nginx
ssh root@fixr2026.com "systemctl restart nginx"
```

---

### 方案 C: 检查 DNS 问题

如果部署后仍然无法访问，检查 DNS：

```bash
# 检查 DNS 解析
nslookup fixr2026.com
nslookup chat.fixturerb2b.top

# 应该都返回: 167.99.134.217
```

如果 DNS 不对，需要到您的域名注册商处更新 A 记录。

---

##  诊断命令

### 检查服务器状态

```bash
# SSH 连接
ssh root@fixr2026.com

# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看 Nginx 状态
systemctl status nginx

# 查看 Nginx 错误日志
tail -50 /var/log/nginx/error.log

# 查看文件权限
ls -la /var/www/fixr2026.com/
ls -la /var/www/chat-system/client/
```

### 检查网络连接

```bash
# ping 服务器
ping -c 5 167.99.134.217

# traceroute
traceroute 167.99.134.217

# 测试端口
telnet 167.99.134.217 443
```

---

##  常见问题排查

### 问题 1: SSH 连接超时

**原因**: 网络波动、防火墙、服务器负载高

**解决**:
```bash
# 增加超时时间
ssh -o ConnectTimeout=30 root@fixr2026.com

# 检查本地网络
ping 8.8.8.8

# 尝试多次连接
for i in {1..5}; do
    ssh root@fixr2026.com "echo 'Attempt $i'" && break
    sleep 2
done
```

### 问题 2: 文件上传失败

**原因**: 磁盘空间不足、权限问题

**解决**:
```bash
# 检查磁盘空间
ssh root@fixr2026.com "df -h"

# 检查权限
ssh root@fixr2026.com "ls -la /var/www/"

# 修复权限
ssh root@fixr2026.com "chown -R root:root /var/www/"
```

### 问题 3: 部署后仍然 404

**原因**: Nginx 配置错误、文件路径不对

**解决**:
```bash
# 检查 Nginx 配置
ssh root@fixr2026.com "nginx -t"

# 查看 Nginx 配置
ssh root@fixr2026.com "cat /etc/nginx/sites-available/fixr2026.com"

# 检查文件是否存在
ssh root@fixr2026.com "ls -la /var/www/fixr2026.com/index.html"
ssh root@fixr2026.com "ls -la /var/www/chat-system/client/index.html"

# 查看 Nginx 错误日志
ssh root@fixr2026.com "tail -100 /var/log/nginx/error.log"
```

---

##  验证清单

部署完成后，逐项验证：

- [ ] SSH 连接稳定
- [ ] 主站文件完整上传
- [ ] 聊天系统文件完整上传
- [ ] index.html 存在（两个目录）
- [ ] 文件权限正确（www-data）
- [ ] Nginx 配置正确
- [ ] Nginx 重启成功
- [ ] 主站 HTTP 200
- [ ] 聊天系统 HTTP 200
- [ ] DNS 解析正确（167.99.134.217）

---

##  需要帮助？

如果手动执行后仍有问题，请提供：

1. **SSH 连接测试结果**:
   ```bash
   ssh root@fixr2026.com "echo 'test'"
   ```

2. **文件列表**:
   ```bash
   ssh root@fixr2026.com "ls -lh /var/www/fixr2026.com/ && ls -lh /var/www/chat-system/client/"
   ```

3. **Nginx 状态**:
   ```bash
   ssh root@fixr2026.com "systemctl status nginx && nginx -t"
   ```

4. **错误日志**:
   ```bash
   ssh root@fixr2026.com "tail -50 /var/log/nginx/error.log"
   ```

---

##  总结

### 核心问题
- SSH 连接不稳定导致自动部署失败
- 需要手动执行重新部署

### 解决方案
1. 等待网络稳定
2. 使用 rsync 或 scp 上传文件
3. 重启 Nginx
4. 验证访问

### 预期结果
- 主站和聊天系统都能 HTTP 200
- 访问速度正常（< 1s）
- 没有 404 错误

---

**建议：等待 5-10 分钟后重试 SSH 连接，然后手动执行上述步骤。**
