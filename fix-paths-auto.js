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
  
  // 匹配更多种图片路径格式
  const patterns = [
    // Markdown图片语法 ![alt](/img/path.jpg)
    {
      regex: /!\[.*?\]\((\/img\/[^)]+)\)/g,
      replacer: (match, imgPath) => {
        if (!imgPath.startsWith('/boke')) {
          modified = true;
          return match.replace(imgPath, `/boke${imgPath}`);
        }
        return match;
      }
    },
    // HTML图片标签 <img src="/img/path.jpg">
    {
      regex: /<img[^>]*src=["'](\/img\/[^"']+)["'][^>]*>/g,
      replacer: (match, imgPath) => {
        if (!imgPath.startsWith('/boke')) {
          modified = true;
          return match.replace(imgPath, `/boke${imgPath}`);
        }
        return match;
      }
    },
    // ![](/img/path.jpg)格式
    {
      regex: /!\[\]\((\/img\/[^)]+)\)/g,
      replacer: (match, imgPath) => {
        if (!imgPath.startsWith('/boke')) {
          modified = true;
          return match.replace(imgPath, `/boke${imgPath}`);
        }
        return match;
      }
    }
  ];
  
  // 应用所有替换模式
  patterns.forEach(pattern => {
    content = content.replace(pattern.regex, pattern.replacer);
  });
  
  if (modified) {
    fs.writeFileSync(mdFilePath, content, 'utf8');
    console.log(`已修复: ${mdFilePath}`);
    return true;
  }
  return false;
}

// 主函数
function main() {
  const docsDir = path.join(__dirname, 'docs');
  const mdFiles = getAllMarkdownFiles(docsDir);
  
  let fixedCount = 0;
  console.log(`找到${mdFiles.length}个Markdown文件`);
  
  mdFiles.forEach(file => {
    if (fixImagePaths(file)) {
      fixedCount++;
    }
  });
  
  console.log(`完成修复! 总共修复了${fixedCount}个文件`);
  return fixedCount > 0;
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
} else {
  // 作为模块导出
  module.exports = main;
} 