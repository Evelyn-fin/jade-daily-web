#!/usr/bin/env node

/**
 * 构建Web版本用于部署
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建Web版本...');

try {
  // 创建构建目录
  const buildDir = path.join(process.cwd(), 'dist-web');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // 导出静态文件
  console.log('📦 正在导出静态文件...');
  execSync('npx expo export --platform web --output-dir dist-web', {
    stdio: 'inherit',
    cwd: path.join(process.cwd(), 'client')
  });

  console.log('✅ 构建完成！');
  console.log('📁 构建目录：', buildDir);
  console.log('\n下一步：将 dist-web 目录部署到云服务（Vercel/Netlify/腾讯云等）');

} catch (error) {
  console.error('❌ 构建失败：', error.message);
  process.exit(1);
}
