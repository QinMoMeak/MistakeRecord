# 学生错题总结与学习档案网站

一个适合部署到 GitHub Pages 的纯前端学生学习管理系统。核心围绕“学生档案”组织错题、每日作业、评测考试、举一反三练习，所有数据保存在浏览器本地 IndexedDB。

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router Hash Router
- Zustand
- Dexie / IndexedDB

## 当前 MVP 能力

- 学生档案 CRUD
- 错题与学生关联
- 学生详情分析
- 每日作业草稿生成
- 评测草稿生成
- 错题规则解析与举一反三
- 标签 / 知识点管理
- JSON 导入导出
- GitHub Pages 自动部署

## 页面

- `/` 首页总览
- `/students` 学生档案列表
- `/students/new` 新建学生
- `/students/:id` 学生详情
- `/students/:id/edit` 编辑学生
- `/mistakes` 错题本
- `/mistakes/new` 新建错题
- `/mistakes/:id` 错题详情
- `/mistakes/:id/edit` 编辑错题
- `/mistakes/:id/exercises` 举一反三
- `/assignments` 每日作业列表
- `/assignments/new` 生成作业
- `/assignments/:id` 作业详情 / 编辑
- `/assessments` 评测考试列表
- `/assessments/new` 生成评测
- `/assessments/:id` 评测详情 / 编辑
- `/taxonomy` 标签与知识点管理

## 本地启动

```bash
npm install
npm run dev
```

默认开发地址为 `http://localhost:5173`。

## 打包构建

```bash
npm run build
npm run preview
```

## GitHub Pages 部署

项目已包含工作流文件 [deploy.yml](E:\Android\Project_\MistakeRecord\.github\workflows\deploy.yml)。

### 1. 推送仓库

将当前项目推送到 GitHub 仓库默认分支 `main`。

### 2. 启用 Pages

在仓库 `Settings -> Pages` 中把部署源切换为 `GitHub Actions`。

### 3. base 路径

Vite 通过 `VITE_BASE_PATH` 控制构建资源路径：

- 仓库地址若为 `https://用户名.github.io/仓库名/`
- Actions 会自动设置 `VITE_BASE_PATH=/<仓库名>/`

路由使用 `HashRouter`，所以 GitHub Pages 刷新不会 404。

## 数据存储说明

- 学生、错题、作业、评测、标签、知识点、图片全部存 IndexedDB
- 不依赖后端
- 清理浏览器站点数据会清空本地记录

## 导出 / 导入

- 导出：导出完整学习档案 JSON，包含学生及关联数据
- 导入并合并：保留现有记录并追加导入内容
- 覆盖导入：先清空本地数据库再导入

导入导出会保留以下关联关系：

- 学生与错题
- 学生与作业
- 学生与评测
- 作业 / 评测与关联错题
- 图片与错题

## 学生分析逻辑

核心逻辑文件：

- [studentAnalysis.ts](E:\Android\Project_\MistakeRecord\src\utils\studentAnalysis.ts)
- [assignmentGenerator.ts](E:\Android\Project_\MistakeRecord\src\utils\assignmentGenerator.ts)
- [assessmentGenerator.ts](E:\Android\Project_\MistakeRecord\src\utils\assessmentGenerator.ts)

已实现的前端规则包括：

- 高频薄弱知识点排序
- 高频错误类型统计
- 最近趋势判断
- 推荐复习知识点
- 推荐练习难度
- 每日作业建议
- 评测建议
- 个性化备注

## 目录结构

```text
.
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
├─ src/
│  ├─ components/
│  ├─ data/
│  ├─ hooks/
│  ├─ layouts/
│  ├─ lib/
│  ├─ pages/
│  ├─ router/
│  ├─ store/
│  ├─ styles/
│  ├─ types/
│  ├─ utils/
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

## 示例数据

首次打开会自动写入两位示例学生、若干错题、作业、评测和图片数据。样例位于 [sampleData.ts](E:\Android\Project_\MistakeRecord\src\data\sampleData.ts)，可以直接替换或删除。
