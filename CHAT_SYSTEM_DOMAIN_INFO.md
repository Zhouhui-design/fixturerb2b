# 聊天系统域名说明

## 架构说明

本项目采用**双域名架构**：

### 1. 主站（独立电商站）
- **域名**: `https://fixr2026.com`
- **用途**: B2B  fixtures 产品展示和销售
- **技术栈**: React + Vite + TypeScript
- **部署**: Nginx + DigitalOcean

### 2. 聊天系统（独立SaaS服务）
- **域名**: `https://chat.fixturerb2b.top`
- **用途**: 多租户在线客服系统
- **特点**: 
  - ✅ 独立于主站的SaaS产品
  - ✅ 服务于多个独立站客户
  - ✅ 未来会推出独立客户端（Desktop/Mobile App）
  - ✅ 有自己的品牌和技术演进路线
- **技术栈**: 独立的技术实现
- **部署**: 独立服务器/云服务

## 为什么聊天系统保持使用 `.top` 域名？

1. **独立性**: 聊天系统是独立的SaaS产品，不属于主站的一部分
2. **多租户**: 其他独立站也在使用这个聊天系统，改域名会影响所有客户
3. **品牌策略**: 聊天系统有自己的品牌定位，`.top` 域名完全适用
4. **技术解耦**: 两个系统独立部署、独立升级、独立维护
5. **未来规划**: 计划发展为独立的聊天软件产品

## 代码中的配置

### 主站配置 (`src/config/site.ts`)
```typescript
export const siteConfig = {
  contact: {
    // ... 其他配置
    chatSystem: 'https://chat.fixturerb2b.top', // 独立SaaS服务
  }
}
```

### 管理员仪表板 (`src/pages/AdminDashboard.tsx`)
```typescript
// API调用
const response = await fetch('https://chat.fixturerb2b.top/api/stats', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})

// 管理后台链接
<a href="https://chat.fixturerb2b.top/admin.html">
  Open Chat Manager
</a>
```

## 集成方式

其他独立站集成聊天系统时，只需：

1. 在站点配置中添加聊天系统URL
2. 嵌入聊天Widget组件
3. 配置API密钥（如需要）

示例：
```typescript
// 其他独立站的配置
const chatConfig = {
  apiUrl: 'https://chat.fixturerb2b.top/api',
  widgetUrl: 'https://chat.fixturerb2b.top/widget.js',
  adminUrl: 'https://chat.fixturerb2b.top/admin.html'
}
```

## 域名迁移总结

| 系统 | 旧域名 | 新域名 | 状态 |
|------|--------|--------|------|
| 主站 | fixturerb2b.top | fixr2026.com | ✅ 已迁移 |
| 聊天系统 | chat.fixturerb2b.top | chat.fixturerb2b.top | ✅ 保持不变 |

## 注意事项

1. **不要修改聊天系统域名**: 除非聊天系统本身决定品牌升级
2. **跨域配置**: 确保聊天系统的CORS设置允许主站域名访问
3. **SSL证书**: 两个域名都需要有效的SSL证书
4. **DNS配置**: 两个域名可以指向不同的服务器

## 未来扩展

当聊天系统发展为独立产品时，可能考虑：
- 注册独立域名（如 `chatsaas.com` 或 `livechat.io`）
- 建立完整的品牌体系
- 提供SDK和API文档
- 支持更多集成场景

---

**最后更新**: 2026-05-04  
**维护者**: FixturerB2B Team
