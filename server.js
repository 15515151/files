const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Define the index folder path (relative to this server file)
const INDEX_FOLDER = path.join(__dirname, 'index');

// Ensure the index folder exists
if (!fs.existsSync(INDEX_FOLDER)) {
    fs.mkdirSync(INDEX_FOLDER, { recursive: true });
    console.log(`Created index folder at: ${INDEX_FOLDER}`);
}

// Route to list all downloadable files
app.get('/files', (req, res) => {
    fs.readdir(INDEX_FOLDER, (err, files) => {
        if (err) {
            console.error('Error reading index folder:', err);
            return res.status(500).json({ error: 'Unable to read file directory' });
        }

        // Filter out directories, only return files
        const fileStats = files.map(file => {
            const filePath = path.join(INDEX_FOLDER, file);
            const stat = fs.statSync(filePath);
            return {
                name: file,
                size: stat.size,
                modified: stat.mtime
            };
        }).filter(item => item); // Remove any undefined items

        res.json({ files: fileStats });
    });
});

// Route to download a specific file by name
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(INDEX_FOLDER, filename);

    // Security: Prevent directory traversal
    if (!filePath.startsWith(INDEX_FOLDER)) {
        return res.status(400).send('Invalid file path');
    }

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filePath}`);
            return res.status(404).send('File not found');
        }

        // Check if it's actually a file (not a directory)
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error('Error getting file stats:', err);
                return res.status(500).send('Internal server error');
            }

            if (!stats.isFile()) {
                return res.status(400).send('Requested path is not a file');
            }

            // Set headers for file download
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/octet-stream'); // Generic binary type
            res.setHeader('Content-Length', stats.size);

            // Create read stream and pipe to response
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        });
    });
});

// Alternative route to serve files directly as static resources
app.use('/static', express.static(INDEX_FOLDER));

// Home route with file listing
app.get('/', (req, res) => {
    fs.readdir(INDEX_FOLDER, (err, files) => {
        if (err) {
            console.error('读取index文件夹时出错:', err);
            return res.status(500).send('无法读取文件目录');
        }

        // 获取文件信息
        const fileData = files.map(file => {
            const filePath = path.join(INDEX_FOLDER, file);
            try {
                const stat = fs.statSync(filePath);
                return {
                    name: file,
                    size: stat.size,
                    modified: stat.mtime,
                    isDirectory: stat.isDirectory()
                };
            } catch (error) {
                console.error(`获取文件信息失败: ${filePath}`, error);
                return null;
            }
        }).filter(item => item); // 过滤掉无效项目

        // 生成HTML页面
        let fileListHTML = '<ul style="list-style-type: none; padding: 0;">';
        fileData.forEach(item => {
            const size = item.isDirectory ? '-' : `${(item.size / 1024).toFixed(2)} KB`;
            const modified = item.modified.toLocaleString();
            const icon = item.isDirectory ? '📁' : '📄';
            fileListHTML += `
                <li style="padding: 5px; border-bottom: 1px solid #eee;">
                    <span>${icon}</span>
                    <a href="/download/${encodeURIComponent(item.name)}" style="text-decoration: none; color: #3366cc;">
                        ${item.name}
                    </a>
                    <span style="float: right;">${size} | ${modified}</span>
                </li>
            `;
        });
        fileListHTML += '</ul>';

        res.send(`
            <html>
            <head>
                <title>文件服务器 - Index</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                    ul { margin: 0; padding: 0; }
                    li { padding: 8px; }
                    a:hover { text-decoration: underline; }
                    .info { color: #666; font-size: 0.9em; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1>📁 文件服务器</h1>
                <h2>index 目录文件列表</h2>
                ${fileListHTML}
                <div class="info">
                    <p>所有文件均可直接下载，无需身份验证</p>
                    <p>总文件数: ${fileData.length}</p>
                </div>
            </body>
            </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`File server running on http://localhost:${PORT}`);
    console.log(`Index folder location: ${INDEX_FOLDER}`);
    console.log('Available routes:');
    console.log('  GET /files - List all files');
    console.log('  GET /download/:filename - Download a specific file');
    console.log('  GET /static/:filename - Access file as static resource');
});