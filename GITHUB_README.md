# 文件下载服务器

这是一个简单的文件下载服务器，可以从 `index` 文件夹中提供文件服务，无需身份验证。

## 项目结构

```
file-download-server/
├── server.js          # 主服务器文件
├── package.json       # Node.js 依赖配置
├── Dockerfile         # Docker 构建配置
├── docker-compose.yml # Docker Compose 配置
├── .dockerignore      # Docker 忽略文件配置
├── .gitignore         # Git 忽略文件配置
├── README.md          # 项目说明文档
├── index/             # 存放可下载文件的目录
│   ├── sample.txt     # 示例文件
│   └── ais2api.zip    # 示例文件
└── GITHUB_README.md   # GitHub 仓库说明
```

## 部署方式

### 方式一：使用 Docker (推荐)

```bash
# 克隆仓库
git clone https://github.com/yourusername/file-download-server.git
cd file-download-server

# 启动服务
docker-compose up -d

# 访问 http://localhost:8080 查看文件列表
```

### 方式二：直接运行

```bash
# 安装依赖
npm install

# 启动服务器
npm start

# 访问 http://localhost:8080 查看文件列表
```

## 功能特点

- 提供文件列表页面，类似镜像源的界面
- 支持直接下载文件
- 无需身份验证
- 防止目录遍历攻击
- 提供 API 接口获取文件信息

## API 端点

- `GET /` - 显示文件列表的主页
- `GET /files` - 列出所有可用文件及元数据
- `GET /download/:filename` - 下载特定文件
- `GET /static/:filename` - 作为静态资源访问文件

## 配置说明

将需要提供下载的文件放入 `index` 文件夹中，服务器会自动列出这些文件供下载。

## 安全说明

- 服务器防止目录遍历攻击
- 只能访问 `index` 文件夹中的文件
- 下载文件无需身份验证
- 所有文件都作为下载附件提供

---

该项目提供了一个简单但功能完整的文件下载服务，特别适合用于提供静态文件下载。