// 改为只在打包前使用独立脚本，不在VuePress插件中使用fs和path
module.exports = (options = {}) => ({
  name: 'vuepress-plugin-fix-image-paths',
  
  // VuePress插件钩子
  async ready() {
    console.log('图片路径修复插件已加载。路径修复工作已在构建前通过独立脚本完成。');
  },

  // 提供在Vue组件中使用的方法
  extendPageData($page) {
    // 这里不使用fs和path，只修改页面数据
    // 前面的独立脚本已经修复了文件
  }
}); 