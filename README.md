# 文件下载服务器

这是一个简单的文件下载服务器，可以从 `index` 文件夹中提供文件服务，无需身份验证。

## 快速开始

### 使用 Docker (推荐)

1. 确保已安装 Docker 和 docker-compose
2. 将需要提供下载的文件放到 `index` 文件夹中
3. 在项目根目录运行以下命令：

```bash
# 构建并启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 停止服务
docker-compose down
```

服务器将在 `http://localhost:8080` 上运行。

### 传统方式

1. 将要提供下载的文件放在 `index` 文件夹中
2. 运行 `npm install` 安装依赖
3. 使用 `npm start` 启动服务器
4. 通过 API 端点访问文件

## API 端点

- `GET /` - 显示文件列表的主页
- `GET /files` - 列出所有可用文件及元数据
- `GET /download/:filename` - 下载特定文件
- `GET /static/:filename` - 作为静态资源访问文件

## 使用示例

1. 查看可用文件:
   ```
   curl http://localhost:8080/files
   ```

2. 下载文件:
   ```
   curl -O http://localhost:8080/download/myfile.txt
   ```

3. 在浏览器中访问文件:
   ```
   http://localhost:8080/download/myfile.pdf
   ```

## 安全说明

- 服务器防止目录遍历攻击
- 只能访问 `index` 文件夹中的文件
- 下载文件无需身份验证
- 所有文件都作为下载附件提供

## Docker 部署

### 构建镜像

```bash
# 构建镜像
docker build -t file-download-server .

# 或者使用 docker-compose 构建
docker-compose build
```

### 推送到镜像仓库

```bash
# 标记镜像
docker tag file-download-server your-registry/file-download-server:latest

# 推送镜像
docker push your-registry/file-download-server:latest
```

### 运行容器

```bash
# 直接运行
docker run -d -p 8080:8080 -v $(pwd)/index:/usr/src/app/index file-download-server

# 或使用 docker-compose
docker-compose up -d
```

## 运行服务器

```bash
# 启动服务器
npm start

# 或使用开发模式自动重启
npm run dev
```

服务器默认运行在 `http://localhost:8080` 上。