# 图片优化 - 快速开始指南 🚀

## 一分钟速览

### ✅ 已完成
- ✓ 210张图片转换为WebP格式
- ✓ 压缩率67.6% (61.9MB → 20MB)
- ✓ 创建OptimizedImage懒加载组件
- ✓ 更新Nginx配置
- ✓ 生成完整文档

### 📁 重要文件位置

```
public/images-webp/          # WebP优化图片(210个)
src/components/ui/OptimizedImage.tsx  # 懒加载组件
compress-images.js           # 压缩脚本
deploy-images.sh            # 部署脚本
WEBP_IMAGE_OPTIMIZATION_GUIDE.md  # 详细指南
```

## 立即使用

### 1. 测试效果

在浏览器中打开:
```
http://localhost:8090/test-webp-images.html
```

### 2. 在代码中使用OptimizedImage

```tsx
// 导入组件
import OptimizedImage from '@/components/ui/OptimizedImage'

// 替换原有的img标签
// 之前: <img src="/images/photo.jpg" alt="..." />
// 现在:
<OptimizedImage 
  src="/images/photo.jpg" 
  alt="Description" 
/>
```

### 3. 添加新图片

```bash
# 1. 将图片放入 public/images/ 目录

# 2. 运行压缩
node compress-images.js

# 3. 在代码中使用
<OptimizedImage src="/images/new-image.jpg" alt="..." />
```

## 常用命令

```bash
# 压缩所有图片
node compress-images.js

# 查看压缩报告
cat IMAGE_COMPRESSION_REPORT.md

# 部署到服务器(需配置SSH)
./deploy-images.sh
```

## 组件示例

### 基本用法
```tsx
<OptimizedImage src="/images/product.jpg" alt="Product" />
```

### 首屏图片(优先加载)
```tsx
<OptimizedImage 
  src="/images/hero.jpg" 
  alt="Hero"
  priority={true} 
/>
```

### 固定宽高比
```tsx
<OptimizedImage 
  src="/images/case.jpg" 
  alt="Case"
  aspectRatio="16/9" 
/>
```

### 自定义尺寸
```tsx
<OptimizedImage 
  src="/images/thumb.jpg" 
  alt="Thumb"
  width={300}
  height={200}
/>
```

## 性能数据

| 指标 | 数值 |
|------|------|
| 压缩率 | 67.6% |
| 节省空间 | 41.87 MB |
| 处理图片 | 210张 |
| 成功率 | 100% |

## 需要帮助?

查看详细文档:
- [完整使用指南](./WEBP_IMAGE_OPTIMIZATION_GUIDE.md)
- [压缩报告](./IMAGE_COMPRESSION_REPORT.md)
- [完成报告](./IMAGE_OPTIMIZATION_COMPLETE.md)

---

**提示**: 建议从首页Hero区域开始,逐步替换所有页面的图片为OptimizedImage组件。
