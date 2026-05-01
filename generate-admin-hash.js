#!/usr/bin/env node

/**
 * 生成管理员密码的 SHA-256 哈希值
 * 使用方法：node generate-admin-hash.js <your-password>
 */

import crypto from 'crypto'

const password = process.argv[2]

if (!password) {
  console.log('使用方法: node generate-admin-hash.js <your-password>')
  console.log('示例: node generate-admin-hash.js MySecurePassword123')
  process.exit(1)
}

const hash = crypto.createHash('sha256').update(password).digest('hex')

console.log('\n═'.repeat(70))
console.log('  管理员密码哈希值生成成功！')
console.log('═'.repeat(70))
console.log('\n密码:', password)
console.log('SHA-256 哈希值:')
console.log(hash)
console.log('\n请将以下行添加到 .env 文件中:')
console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}`)
console.log('\n' + '═'.repeat(70))
console.log('\n 安全提示:')
console.log('  - 不要在代码中明文存储密码')
console.log('  - 使用强密码（至少 12 位，包含大小写字母、数字和符号）')
console.log('  - 将 .env 文件添加到 .gitignore（已添加）')
console.log('  - 定期更换密码\n')
