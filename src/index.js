import { initMixin } from './code/init';
import { lifecycleMixin } from './code/instance/lifecycle';
import { renderMixin } from './code/vdom';

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;

// npm 发包文档
// https://www.icode9.com/content-4-788551.html
// https://www.jianshu.com/p/2b857cbd1d4a
// https://blog.csdn.net/weixin_45047039/article/details/109890779
