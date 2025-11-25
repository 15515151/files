# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json (如果存在)
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 创建用于存放下载文件的目录
RUN mkdir -p ./index

# 暴露端口 (与 server.js 中的端口保持一致)
EXPOSE 8080

# 启动应用
CMD [ "node", "server.js" ]