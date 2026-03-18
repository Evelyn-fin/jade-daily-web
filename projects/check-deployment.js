#!/usr/bin/env node

/**
 * 飞书部署验证脚本
 * 检查各项配置是否正确
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkUrl(url) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;

    client.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function runChecks() {
  log('🔍 开始检查部署配置...\n', colors.blue);

  // 检查1: 后端服务
  log('📡 检查后端服务...', colors.blue);
  const backendOk = await checkUrl('http://localhost:9091/api/v1/health');
  if (backendOk) {
    log('✅ 后端服务正常运行', colors.green);
  } else {
    log('❌ 后端服务未运行或无法访问', colors.red);
    log('   请确保后端正在运行: cd server && pnpm run dev', colors.yellow);
  }
  console.log('');

  // 检查2: 数据库文件
  log('🗄️ 检查数据库文件...', colors.blue);
  const dbPath = path.join(__dirname, 'server/data/jade-daily.db');
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    log(`✅ 数据库文件存在 (${stats.size} bytes)`, colors.green);
  } else {
    log('❌ 数据库文件不存在', colors.red);
    log('   首次运行后端服务时会自动创建', colors.yellow);
  }
  console.log('');

  // 检查3: 构建目录
  log('📦 检查构建目录...', colors.blue);
  const buildDir = path.join(__dirname, 'dist-web');
  if (fs.existsSync(buildDir)) {
    const files = fs.readdirSync(buildDir);
    log(`✅ 构建目录存在 (${files.length} files)`, colors.green);
  } else {
    log('❌ 构建目录不存在', colors.red);
    log('   请运行: node build-web.js', colors.yellow);
  }
  console.log('');

  // 检查4: 环境变量
  log('⚙️ 检查环境变量配置...', colors.blue);
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
  if (backendUrl) {
    log(`✅ EXPO_PUBLIC_BACKEND_BASE_URL: ${backendUrl}`, colors.green);
  } else {
    log('⚠️ EXPO_PUBLIC_BACKEND_BASE_URL 未设置', colors.yellow);
    log('   请在云服务控制台配置此环境变量', colors.yellow);
  }
  console.log('');

  // 检查5: 后端CORS配置
  log('🔒 检查CORS配置...', colors.blue);
  const indexPath = path.join(__dirname, 'server/src/index.ts');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf-8');
    if (content.includes('cors()') || content.includes('cors({')) {
      log('✅ CORS已配置', colors.green);
    } else {
      log('⚠️ CORS可能未配置', colors.yellow);
    }
  } else {
    log('❌ 后端入口文件不存在', colors.red);
  }
  console.log('');

  // 总结
  log('📊 检查完成！\n', colors.blue);
  log('下一步操作：\n', colors.blue);
  log('1. 如果后端未运行：cd server && pnpm run dev', colors.yellow);
  log('2. 如果未构建：node build-web.js', colors.yellow);
  log('3. 查看部署指南：cat 飞书部署指南.md', colors.yellow);
  log('4. 查看快速清单：cat 快速部署清单.md', colors.yellow);
  console.log('');

  log('🎉 准备好部署了！', colors.green);
}

runChecks().catch(console.error);
