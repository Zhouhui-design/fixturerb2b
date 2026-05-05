#!/usr/bin/env node

/**
 * 图片批量压缩脚本
 * 功能:
 * - 将JPEG/PNG图片转换为WebP格式
 * - 保持高质量(80-85%)
 * - 自动调整过大图片的尺寸
 * - 保留原始文件作为备份
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  inputDir: path.join(__dirname, 'public', 'images'),
  outputDir: path.join(__dirname, 'public', 'images-webp'),
  quality: 82, // WebP质量 (0-100)
  maxWidth: 1920, // 最大宽度
  maxHeight: 1920, // 最大高度
  supportedFormats: ['jpg', 'jpeg', 'png'], // 需要转换的格式
};

// 统计信息
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0,
  originalSize: 0,
  compressedSize: 0,
};

/**
 * 格式化文件大小
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 计算压缩率
 */
function calculateCompressionRatio(original, compressed) {
  return ((1 - compressed / original) * 100).toFixed(1);
}

/**
 * 调整图片尺寸(如果需要)
 */
function getResizeOptions(metadata) {
  const { width, height } = metadata;
  
  if (width > CONFIG.maxWidth || height > CONFIG.maxHeight) {
    return {
      width: Math.min(width, CONFIG.maxWidth),
      height: Math.min(height, CONFIG.maxHeight),
      fit: 'inside',
      withoutEnlargement: true,
    };
  }
  
  return null;
}

/**
 * 处理单个图片文件
 */
async function processImage(filePath, relativePath) {
  const ext = path.extname(filePath).toLowerCase().substring(1);
  
  // 检查是否是支持的格式
  if (!CONFIG.supportedFormats.includes(ext)) {
    stats.skipped++;
    console.log(`⊘ 跳过 (不支持的格式): ${relativePath}`);
    return;
  }
  
  stats.total++;
  
  try {
    // 读取原始文件信息
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;
    stats.originalSize += originalSize;
    
    // 创建输出目录结构
    const outputPath = path.join(
      CONFIG.outputDir,
      relativePath.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    );
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 使用sharp处理图片
    let pipeline = sharp(filePath);
    
    // 获取元数据
    const metadata = await pipeline.metadata();
    
    // 如果需要,调整尺寸
    const resizeOptions = getResizeOptions(metadata);
    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
      console.log(`↔ 调整尺寸: ${relativePath} (${metadata.width}x${metadata.height})`);
    }
    
    // 转换为WebP并压缩
    await pipeline
      .webp({ 
        quality: CONFIG.quality,
        effort: 6, // 更高的effort = 更好的压缩 (0-6)
      })
      .toFile(outputPath);
    
    // 获取压缩后的文件大小
    const compressedStats = fs.statSync(outputPath);
    const compressedSize = compressedStats.size;
    stats.compressedSize += compressedSize;
    
    // 计算压缩率
    const ratio = calculateCompressionRatio(originalSize, compressedSize);
    const saved = originalSize - compressedSize;
    
    stats.success++;
    
    console.log(`✓ 成功: ${relativePath}`);
    console.log(`  原始: ${formatBytes(originalSize)} → 压缩: ${formatBytes(compressedSize)} (节省 ${ratio}%)`);
    
  } catch (error) {
    stats.failed++;
    console.error(`✗ 失败: ${relativePath}`);
    console.error(`  错误: ${error.message}`);
  }
}

/**
 * 递归处理目录中的所有图片
 */
async function processDirectory(dirPath, relativeBase = '') {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.join(relativeBase, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 递归处理子目录
      await processDirectory(fullPath, relativePath);
    } else if (stat.isFile()) {
      // 处理图片文件
      await processImage(fullPath, relativePath);
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始图片批量压缩...\n');
  console.log(`输入目录: ${CONFIG.inputDir}`);
  console.log(`输出目录: ${CONFIG.outputDir}`);
  console.log(`WebP质量: ${CONFIG.quality}%`);
  console.log(`最大尺寸: ${CONFIG.maxWidth}x${CONFIG.maxHeight}\n`);
  console.log('─'.repeat(80) + '\n');
  
  // 检查输入目录是否存在
  if (!fs.existsSync(CONFIG.inputDir)) {
    console.error(`❌ 错误: 输入目录不存在: ${CONFIG.inputDir}`);
    process.exit(1);
  }
  
  // 创建输出目录
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`✓ 创建输出目录: ${CONFIG.outputDir}\n`);
  }
  
  const startTime = Date.now();
  
  // 处理所有图片
  await processDirectory(CONFIG.inputDir);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // 打印统计信息
  console.log('\n' + '═'.repeat(80));
  console.log('📊 压缩统计报告');
  console.log('═'.repeat(80));
  console.log(`总文件数:     ${stats.total}`);
  console.log(`成功:         ${stats.success} ✓`);
  console.log(`失败:         ${stats.failed} ✗`);
  console.log(`跳过:         ${stats.skipped} ⊘`);
  console.log(`\n原始总大小:   ${formatBytes(stats.originalSize)}`);
  console.log(`压缩后大小:   ${formatBytes(stats.compressedSize)}`);
  console.log(`节省空间:     ${formatBytes(stats.originalSize - stats.compressedSize)}`);
  
  if (stats.originalSize > 0) {
    const overallRatio = calculateCompressionRatio(stats.originalSize, stats.compressedSize);
    console.log(`压缩率:       ${overallRatio}%`);
  }
  
  console.log(`\n耗时:         ${duration}秒`);
  console.log('═'.repeat(80));
  
  // 生成报告文件
  const reportPath = path.join(__dirname, 'IMAGE_COMPRESSION_REPORT.md');
  const report = `# 图片压缩报告

生成时间: ${new Date().toLocaleString('zh-CN')}

## 配置
- WebP质量: ${CONFIG.quality}%
- 最大尺寸: ${CONFIG.maxWidth}x${CONFIG.maxHeight}px
- 输入目录: \`${CONFIG.inputDir}\`
- 输出目录: \`${CONFIG.outputDir}\`

## 统计
- 总文件数: ${stats.total}
- 成功: ${stats.success}
- 失败: ${stats.failed}
- 跳过: ${stats.skipped}

## 文件大小
- 原始总大小: ${formatBytes(stats.originalSize)}
- 压缩后大小: ${formatBytes(stats.compressedSize)}
- 节省空间: ${formatBytes(stats.originalSize - stats.compressedSize)}
- 压缩率: ${stats.originalSize > 0 ? calculateCompressionRatio(stats.originalSize, stats.compressedSize) : 0}%

## 耗时
${duration}秒

## 下一步
1. 测试压缩后的图片显示效果
2. 更新代码中的图片路径引用
3. 部署到服务器
`;
  
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\n📝 报告已保存到: ${reportPath}`);
  
  // 退出码
  process.exit(stats.failed > 0 ? 1 : 0);
}

// 运行主函数
main().catch(error => {
  console.error('❌ 未处理的错误:', error);
  process.exit(1);
});
