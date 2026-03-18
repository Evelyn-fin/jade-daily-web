#!/bin/bash

# GitHub 仓库设置脚本

echo "========================================="
echo "📦 Jade's Daily Planner - GitHub 仓库设置"
echo "========================================="
echo ""

# 检查是否安装了 git
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装"
    echo "请先安装 Git: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git 已安装"
echo ""

# 进入项目目录
cd /workspace/projects

echo "📝 步骤1：初始化 Git 仓库..."
git init
git add -A
git commit -m "Initial commit: Jade's Daily Planner web build"
echo "✅ 本地仓库初始化完成"
echo ""

echo "📝 步骤2：请按照以下步骤创建GitHub仓库："
echo ""
echo "1. 打开浏览器，访问："
echo "   https://github.com/new"
echo ""
echo "2. 填写仓库信息："
echo "   - Repository name: jade-daily-web"
echo "   - 选择 Public（公开）"
echo "   - 不要勾选任何选项"
echo ""
echo "3. 点击 \"Create repository\""
echo ""
echo "4. 复制仓库地址，格式如下："
echo "   https://github.com/你的用户名/jade-daily-web.git"
echo ""
echo "========================================="

read -p "👉 请输入你的GitHub仓库地址（按回车继续）: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ 未输入仓库地址"
    echo "你可以手动执行以下命令："
    echo "git remote add origin https://github.com/你的用户名/jade-daily-web.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    exit 1
fi

echo "📝 步骤3：连接远程仓库..."
git remote add origin "$repo_url"
echo "✅ 远程仓库已连接"
echo ""

echo "📝 步骤4：推送到GitHub..."
echo "⚠️  如果是第一次推送，可能会让你输入GitHub用户名和密码（或Personal Access Token）"
echo ""
git branch -M main

# 尝试推送
if git push -u origin main; then
    echo ""
    echo "✅ 代码已成功推送到GitHub！"
    echo ""
    echo "========================================="
    echo "🎉 下一步：在Vercel导入这个仓库"
    echo "========================================="
    echo ""
    echo "1. 打开 Vercel: https://vercel.com/"
    echo "2. 登录你的账号"
    echo "3. 点击 \"Add New...\" → \"Project\""
    echo "4. 在 \"Import Git Repository\" 找到 jade-daily-web"
    echo "5. 点击 \"Import\""
    echo "6. 点击 \"Deploy\""
    echo ""
    echo "等待几分钟，你的APP就上线了！🚀"
    echo "========================================="
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. 仓库地址错误"
    echo "2. 没有正确的权限"
    echo "3. 需要使用 Personal Access Token（而不是密码）"
    echo ""
    echo "获取 Personal Access Token 的步骤："
    echo "1. 访问：https://github.com/settings/tokens"
    echo "2. 点击 \"Generate new token\" → \"Generate new token (classic)\""
    echo "3. 勾选 \"repo\" 权限"
    echo "4. 点击生成，复制token"
    echo "5. 再次推送时，用token代替密码"
    echo ""
    echo "重新推送命令："
    echo "git push -u origin main"
    echo ""
fi
