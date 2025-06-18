const fs = require('fs');
const path = require('path');

// 递归获取所有Markdown文件
function getAllMarkdownFiles(dir, fileList = []) {
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
}

// 修复Markdown文件中的图片路径
function fixImagePaths(mdFilePath) {
  let content = fs.readFileSync(mdFilePath, 'utf8');
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
    fs.writeFileSync(mdFilePath, content, 'utf8');
    console.log(`已修复: ${mdFilePath}`);
  }
}

// 主函数
function main() {
  const docsDir = path.join(__dirname, 'docs');
  const mdFiles = getAllMarkdownFiles(docsDir);
  
  console.log(`找到${mdFiles.length}个Markdown文件`);
  mdFiles.forEach(fixImagePaths);
  console.log('完成修复!');
}

main();