<template>
    <el-row class="screen">
        <el-col :span="20" class="relative">
            <vr />
            <draggable id="draggable_left" class="left" :list="leftComList" :group="'people'" animation="300" @add="onAdd">
                <template v-for="({ name, id }, index) in leftComList">
                    <VueDragResize ref="VueDragResize" :parentLimitation="true" :snapToGrid="true" :key="index"
                        :w="position[id].width" :h="position[id].height" :x="position[id].left" :y="position[id].top"
                        @resizestop="(e) => resize(e, id)" @dragstop="(e) => resize(e, id)">
                        {{
                            handleAddCom({
                                props: { comItem: { name, id }, queryObj },
                                index,
                                on: {
                                    contextmenu: (e) => showMenu(e, id)
                                }
                            })
                        }}
                    </VueDragResize>
                </template>
                <!-- <div ref="comBody" v-for="({ name, id }, index) in leftComList" :key="id" class="comBody"
                    @contextmenu.prevent.stop="(e) => showMenu(e, id)">
                    <VueDragResize ref="VueDragResize" :parentLimitation="true" :snapToGrid="true"
                        :w="position[id].width" :h="position[id].height" :x="position[id].left" :y="position[id].top"
                        axis='both' @activated="onActivated(id)" @deactivated="onDeactivated(id)"
                        @resizing="(e) => resize(e, id)" @dragging="(e) => resize(e, id)">
                        {{
                                handleAddCom({
                                    props: { comItem: { name, id }, queryObj },
                                    index,
                                })
                        }}
                    </VueDragResize>
                </div> -->
            </draggable>
            <rightMenu v-if="isShowMenu" :conversation="conversation" @hiddenMenu="hiddenMenu"
                @handleDeleteCom="handleDeleteCom" />
        </el-col>
        <el-col :span="4">
            <draggable class="right" drag-class="dragClass" ghost-class="ghostClass" chosen-class="chosenClass"
                :list="rightComList" animation="300" :group="{ name: 'people', pull: 'clone', put: false }"
                :clone="() => { }">
                <div class="card" v-for="element in rightComList" :key="element.id">
                    {{ element.name }}
                </div>
            </draggable>
        </el-col>
    </el-row>
</template>
  
<script>
import draggable from "vuedraggable";
import CreateCom from "../utils/ReturnNewCom";
import rightMenu from './rightMenu'
import VueDragResize from 'vue-drag-resize';
import vr from "./vr.vue";
let id = null
export default {
  name: 'sCreen',
    components: {
        draggable, vr, VueDragResize, rightMenu
    },
    data() {
        return {
            add: true,
            position: {},
            isActive: {},
            isShowMenu: false,
            menuTop: 0,
            menuLeft: 0,
            conversation: {},
            rightComList: [
                {
                    id: Math.random(),
                    name: "dragrid",
                },
                {
                    id: Math.random(),
                    name: "FCharts",
                },
            ],
            leftComList: [], // 存储驱动动态生成组件的数据。
            comMap: new Map(), // 主要的作用就是用来记录 组件有没有渲染到 class="comCard" 这个DOM中,
            // 如果渲染了就不能再往进添加子元素了。
            queryObj: {
                // 主要的作用就是向子组件传递查询条件
                num: 0,
            },
        };
    },
    created() {
        document.addEventListener('click', () => {
            this.isShowMenu = false
        })
        document.addEventListener('mousedown', (e) => {
            const { button } = e
            if (button === 2) {
                this.isShowMenu = false
            }
        })
    },
    mounted() {
        var zoom = 1
        function resize() {
            zoom = window.innerWidth / window.screen.availWidth;
            document.body.style.zoom = zoom;
            let dom = document.getElementsByClassName('list-group')
            if (dom) {
                for (let i = 0; i < dom.length; i++) {
                    const item = dom[i];
                    item.style.zoom = zoom;
                }
            }
        }
        window.onresize = function () {
            resize();
        }
        resize();
    },
    methods: {
        resize(newRect, id) {
            this.position[id] = newRect
        },
        showMenu(e, id) {
            e.preventDefault()
            this.conversation = {
                x: e.pageX,
                y: e.pageY,
                id
            }
            this.isShowMenu = true
        },
        hiddenMenu() {
            this.isShowMenu = false
        },
        handleAddCom({ index, on = {}, props = { comItem: { name: "", id: 0 } } }) {
            const {
                comItem: { id, name },
            } = props;
            this.$nextTick(() => {
                // 获取该节点的子节点的长度
                const childNodesLength = this.$refs.VueDragResize[index].$children.length;
                // 获取comBody 这个DOM 数组的长度
                const comLine = this.$refs.VueDragResize.length;
                if (!this.comMap.get(id)) {
                    // 如果没有渲染过组件
                    // 1. 调用 CreateCom 方法 创建组件。 并传递 props 和 事件
                    const com = CreateCom({
                        name,
                        props,
                        on: {
                            handleDelete: this.handleDeleteCom,
                            ...on,
                        },
                    });
                    // 2. 生成组件
                    com.$mount();
                    if (childNodesLength === 2) {
                        // 如果要添加到两个组件中间。那么就将新生成的组件DOM位置进行修改放到中间。
                        // 将最后的组件DOM添加到正确的位置
                        this.$refs.VueDragResize.splice(
                            index,
                            0,
                            this.$refs.VueDragResize[comLine - 1]
                        );
                    }
                    // 3. 将生成的组件添加到改DOM中。
                    this.$refs.VueDragResize[index].$refs.container.appendChild(com.$el);
                    // 4. 记录该组件实现了渲染。
                    this.comMap.set(id, true);
                } else {
                    // 该位置的组件已经渲染，不需要再次渲染直接返回
                    return;
                }
            });
        },
        handleDeleteCom(values) {
            let id = values ? values.id : this.conversation.id
            this.hiddenMenu()
            // 传递给子组件删除的方法，根据组件的id来删除数据
            const index = this.leftComList.findIndex((item) => item.id === id);
            if (~index) {
                // 如果存在这个id的组件，就删除
                this.leftComList.splice(index, 1);
            }
        },
        onAdd(e) {
            const draggable_left = document.getElementById('draggable_left')
            if (draggable_left) {
                const { item, originalEvent } = e
                const { layerX, layerY } = originalEvent
                const { scrollWidth, scrollHeight } = draggable_left
                if (layerX <= scrollWidth && layerY <= scrollHeight) {
                    id = Math.random()
                    this.position[id] = {}
                    this.position[id]['top'] = layerY
                    this.position[id]['left'] = layerX
                    this.position[id]['width'] = 200
                    this.position[id]['height'] = 200
                    // 给 leftComList 数组添加数据
                    this.leftComList.push({
                        id, name: item.innerText
                    })
                }
            }
        },
        onActivated(id) {
            console.log(id);
            /* Object.keys(this.isActive).map((item, index) => {
                if (item != id && this.isActive[item] == true) {
                    this.isActive[item] = false
                }
            })
            this.isActive[id] = true
            return true */
        },
        onDeactivated() {
            Object.keys(this.isActive).map((item, ) => {
                if (this.isActive[item] == true) {
                    this.isActive[item] = false
                }
            })
            return false
        },
    },
    beforeDestroy() {
        // 清除 记录 的数据
        this.comMap.clear();
    },
};
</script>

<style  >
.screen {
    width: 100%;
    height: 100%;
    display: flex;
}

.screen .comBody {
    width: 100%;
    height: 100%;
    position: absolute;
}

.screen .chosen {
    background-color: #000 !important;
    color: #fff;
}

.screen .relative {
    position: relative;
}

.screen .relative .left {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 21;
}

.screen .relative .left .chosenClass {
    display: none;
}

.screen .relative .left .vdr,
.screen .relative .left .vdr.active:before {
    position: absolute;
}

.screen .relative .left .content-container {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.screen .relative .left .content-container >:first-child {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.screen .relative .left .el-main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    overflow: hidden !important;
    width: 100%;
    padding: 10px !important;
}

.screen .card {
    height: 50px;
    background-color: #40cec7;
    margin: 12px 0;
    font-size: 12px;
    line-height: 50px;
    cursor: move;
}

</style>