# GNOME Keyring 问题解决指南

## 已完成的操作

### 1. 安装的软件包
✅ gnome-keyring (46.1-2ubuntu0.2)
✅ gnome-keyring-pkcs11 (46.1-2ubuntu0.2)
✅ libpam-gnome-keyring (46.1-2ubuntu0.2)
✅ libsecret-1-0 (0.21.4-1build3)
✅ libsecret-tools (0.21.4-1build3)
✅ dbus-x11 (1.14.10-4ubuntu4.1)

### 2. 配置状态
✅ PAM 配置已正确设置 (/etc/pam.d/gdm-password)
   - auth optional pam_gnome_keyring.so
   - session optional pam_gnome_keyring.so auto_start

✅ 权限已设置
   - sudo setcap cap_ipc_lock=+ep $(which gnome-keyring-daemon)

### 3. 当前状态
gnome-keyring-daemon 进程正在运行，但由于当前会话在软件包安装之前就已经启动，
keyring 可能无法正常工作。

## 解决方案

### 方法 1：注销并重新登录（推荐）
这是最简单和最可靠的方法：
1. 保存所有工作
2. 注销当前用户会话
3. 重新登录

这样 gnome-keyring-daemon 会在登录时通过 PAM 自动正确启动。

### 方法 2：重启系统
如果注销不起作用，可以重启整个系统：
```bash
sudo reboot
```

### 方法 3：手动启动（临时方案）
如果你不能注销或重启，可以尝试手动启动脚本：
```bash
./start-keyring.sh
```

注意：这个方法可能不会完全正常工作，因为 GNOME 会话已经初始化完成。

## 验证安装

重新登录后，运行以下命令验证：

```bash
# 检查进程是否运行
ps aux | grep gnome-keyring-daemon

# 测试 secret-tool
secret-tool store --label="Test" test_service test_key
# 输入测试密码后，应该能成功存储

# 查看存储的密钥
secret-tool search service test_service
```

## 常见问题

### 问题：仍然显示 "OS keyring 不可用"
解决：确保你已经注销并重新登录，而不仅仅是重新启动终端。

### 问题：SSH 远程连接时使用
如果使用 SSH，需要启用 X11 转发：
```bash
ssh -X username@hostname
# 或
ssh -Y username@hostname
```

### 问题：在无桌面环境的服务器上使用
需要额外配置 D-Bus 会话：
```bash
export DBUS_SESSION_BUS_ADDRESS=$(dbus-daemon --session --fork --print-address)
gnome-keyring-daemon --start --components=secrets
```

## 应用程序配置

某些应用程序可能需要额外配置才能使用 keyring：

### Git
```bash
git config --global credential.helper libsecret
```

### VS Code
VS Code 通常会自动检测 keyring，但如果需要强制指定：
```bash
code --password-store="gnome"
```

## 文件说明

- `start-keyring.sh`: 手动启动 keyring 的脚本（仅供参考，推荐使用注销/重启方法）
