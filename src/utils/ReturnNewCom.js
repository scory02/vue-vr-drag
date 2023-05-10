import Vue from "vue";

// 想要动态生成的组件，先引入这个文件。
import dragrid from '../views/dragrid.vue';
import FCharts from '../views/FCharts.vue';

// 将组件的名称和组件做一个对应Map
const comMap = {
    dragrid,FCharts,
};

// 接收生成组件需要的组件名称，和想要传递给组件的
// props 和 on 事件
const ReturnNewCom = function ({ props, on }) {
    const {
        comItem: { name },
    } = props;
    const newComponent = Vue.extend({
        render(createElement) {
            // 使用传进来的组件name来决定渲染哪一个组件。
            return createElement('div', {
                props,
                on,
                style: {
                    width: '100%',
                    height: '100%'
                }
            },
            [
                createElement(comMap[name], {
                    props,
                    on,
                })
            ]);
        },
    });
    return new newComponent();
};

export default ReturnNewCom;