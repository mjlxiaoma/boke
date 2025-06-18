// import vue from 'vue/dist/vue.esm.browser'
export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  // window.Vue = vue // 使页面中可以使用Vue构造函数 （使页面中的vue demo生效）
  
  // 修复图片路径
  router.beforeEach((to, from, next) => {
    // 设置正确的加载方式
    next();
  });
  
  // 添加全局图片前缀方法
  Vue.mixin({
    methods: {
      // 增强版$withBase方法，专门处理图片路径
      $withBaseImg(path) {
        // 确保图片路径以/boke开头
        if (!path) return '';
        
        if (path.startsWith('/img/')) {
          return `/boke${path}`;
        } else if (path.startsWith('/')) {
          return path; // 已经是绝对路径，保持不变
        } else if (!path.startsWith('/boke/')) {
          // 非绝对路径的图片，添加/boke/img/前缀
          return `/boke/img/${path}`;
        }
        return path;
      }
    },
    computed: {
      // 添加计算属性，用于组件中引用图片
      $imageBaseUrl() {
        return '/boke';
      }
    }
  });
}
