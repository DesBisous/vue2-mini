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
