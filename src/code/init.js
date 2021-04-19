import { initState } from './instance/state';
import { compileToRenderFunction } from '../compiler';
import { mountComponent } from './instance/lifecycle';

function initMixin(Vue) {
    // 世界的开始
    Vue.prototype._init = function (options) {
        const vm = this;

        vm.$options = options;

        // 响应式劫持
        initState(vm);

        if (vm.$options.el) {
            // 挂载函数 Vue.prototype.$mount
            vm.$mount(vm.$options.el)
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this,
            options = vm.$options;

        el = document.querySelector(el);

        if (!options.render) {
            let template = options.template;

            if (!template) {
                template = el.outerHTML;
            }

            // 构建 AST -> Render
            const render = compileToRenderFunction(template);
            options.render = render;
        }
        // console.log(options.render);
        mountComponent(vm, el);
    }
}

export {
    initMixin
};