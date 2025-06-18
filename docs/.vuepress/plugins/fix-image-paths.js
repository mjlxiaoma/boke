const fs = require('fs');
const path = require('path');

// 修复Markdown文件中的图片路径
function fixImagePaths(mdFilePath) {
  let content;
  try {
    content = fs.readFileSync(mdFilePath, 'utf8');
  } catch (err) {
    console.error(`读取文件失败: ${mdFilePath}`, err);
    return false;
  }

  let modified = false;
  
  // 匹配Markdown图片语法 ![alt](/img/path.jpg) 
  // 或HTML图片标签 <img src="/img/path.jpg">
  const mdImageRegex = /!\[.*?\]\((\/img\/[^)]+)\)/g;
  const htmlImageRegex = /<img[^>]*src=["'](\/img\/[^"']+)["'][^>]*>/g;
  
  // 修复Markdown图片语法
  content = content.replace(mdImageRegex, (match, imgPath) => {
    if (!imgPath.startsWith('/boke')) {
      modified = true;
      return match.replace(imgPath, `/boke${imgPath}`);
    }
    return match;
  });
  
  // 修复HTML图片标签
  content = content.replace(htmlImageRegex, (match, imgPath) => {
    if (!imgPath.startsWith('/boke')) {
      modified = true;
      return match.replace(imgPath, `/boke${imgPath}`);
    }
    return match;
  });
  
  if (modified) {
    try {
      fs.writeFileSync(mdFilePath, content, 'utf8');
      console.log(`已修复图片路径: ${mdFilePath}`);
    } catch (err) {
      console.error(`写入文件失败: ${mdFilePath}`, err);
      return false;
    }
    return true;
  }
  return false;
}

// VuePress插件
module.exports = (options = {}) => ({
  name: 'vuepress-plugin-fix-image-paths',
  
  // 在准备阶段修复图片路径
  async ready() {
    const sourceDir = this.sourceDir;
    console.log('开始修复图片路径...');
    
    // 递归获取所有Markdown文件
    const getAllMarkdownFiles = (dir, fileList = []) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          getAllMarkdownFiles(filePath, fileList);
        } else if (file.endsWith('.md')) {
          fileList.push(filePath);
        }
      });
      
      return fileList;
    };

    try {
      const mdFiles = getAllMarkdownFiles(sourceDir);
      console.log(`找到${mdFiles.length}个Markdown文件`);
      
      let fixedCount = 0;
      mdFiles.forEach(file => {
        if (fixImagePaths(file)) {
          fixedCount++;
        }
      });
      
      console.log(`完成修复! 总共修复了${fixedCount}个文件`);
    } catch (err) {
      console.error('处理图片路径时出错:', err);
    }
  }
}); 