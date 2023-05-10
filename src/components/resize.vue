<template>
    <el-row class="screen">
        <el-col :span="20" class="relative">
            <vr />
            <el-row class="left">
                <el-col :span="8">
                    <h3>左边</h3>
                    <draggable class="list-group" :list="left.list" :clone="clone" :group="left.group"
                        @add="(e) => add(e, 'left')" @start="start" @remove="(e) => remove(e, 'left')" animation="300">
                        <div :class="['item', 'item-row' + item.row]" v-for="item in left.list" :key="item.id"
                            @contextmenu="(e) => showMenu(e, item, 'left')">
                            <el-skeleton :rows="groupRows[item.row - 1]" animated>
                                <template>{{ item.name }}</template>
                            </el-skeleton>
                        </div>
                    </draggable>
                </el-col>
                <el-col :span="8" style="float: right;">
                    <h3>右边</h3>
                    <draggable class="list-group" :list="right.list" :clone="clone" :group="right.group"
                        @add="(e) => add(e, 'right')" @start="start" @remove="(e) => remove(e, 'right')" animation="300">
                        <div :class="['item', 'item-row' + item.row]" v-for="item in right.list" :key="item.id"
                            @contextmenu="(e) => showMenu(e, item, 'right')">
                            <el-skeleton :rows="groupRows[item.row - 1]" animated>
                                <template>{{ item.name }}</template>
                            </el-skeleton>
                        </div>
                    </draggable>
                </el-col>
            </el-row>
            <rightMenu v-if="isShowMenu" :data="menuData" @hiddenMenu="hiddenMenu" @delCom="delCom" />
        </el-col>
        <el-col :span="4" class="relative">
            <h3>组件库</h3>
            <draggable class="dragArea list-group" :list="all.list" :group="all.group" :clone="clone" @start="start"
                animation="300">
                <el-badge :class="['item', 'item-row' + item.row]" type="primary" v-for="item in all.list" :key="item.id"
                    :value="item.row">
                    {{ item.name }}
                </el-badge>
            </draggable>
        </el-col>
    </el-row>
</template>
  
<script>
import draggable from "vuedraggable";
import rightMenu from './rightMenu'
import vr from "./vr.vue";
const groupName = "people"
const groupRows = [3, 6, 9]
const all = {
    list: [
        { name: "乡村概况", id: Math.random() + 1, row: 1 },
        { name: "产业兴旺", id: Math.random() + 2, row: 2 },
        { name: "乡村环境", id: Math.random() + 3, row: 3 },],//组件集
    group: {
        name: groupName, pull: 'clone', put: false
    },
}
let left = {
    list: [],//组件集
    group: {
        name: groupName,
        put: true,//(入)
        pull: true //(出)
    },
    total: 6,//可入组件数量
}
let right = {
    list: [],//组件集
    group: {
        name: groupName,
        put: true,//(入)
        pull: true //(出)
    },
    total: 6,//可入组件数量
}
export default {
    name: groupName,
    components: {
        draggable, vr, rightMenu
    },
    data() {
        return {
            left,
            right,
            all,
            groupRows,
            isShowMenu: false,
            menuData: {},
            controlOnStart: true
        };
    },
    methods: {
        clone(item) {
            if (item) {
                const { ...others } = item
                return { ...others, id: Math.random() };
            }
        },
        remove(e, type) {
            const { _underlying_vm_: { row } } = e.item
            if (this[type].total + row <= 6) {
                this[type].total += row
                if (!this[type].group.put) {
                    this[type].group.put = true
                }
            }
        },
        add(e, type) {
            const { _underlying_vm_: { row } } = e.item
            if (this[type].total - row >= 0) {
                this[type].total -= row
            }
        },
        start(e) {
            this.hiddenMenu()
            const { _underlying_vm_: { row } } = e.item
            if (left.total - row >= 0) {
                if (!this.left.group.put) {
                    this.left.group.put = true
                }
            } else if (this.left.group.put) {
                this.left.group.put = false
            }
            if (right.total - row >= 0) {
                if (!this.right.group.put) {
                    this.right.group.put = true
                }
            } else if (this.right.group.put) {
                this.right.group.put = false
            }
        },
        delCom(values) {
            this.hiddenMenu()
            if (values) {
                const { type, row } = values
                // 传递给子组件删除的方法，根据组件的id来删除数据
                const index = this[type].list.findIndex((item) => item.id === this.menuData.id);
                if (~index) {
                    // 如果存在这个id的组件，就删除
                    this[type].list.splice(index, 1);
                    if (this[type].total + row <= 6) {
                        this[type].total += row
                        if (!this[type].group.put) {
                            this[type].group.put = true
                        }
                    } else if (this[type].group.put) {
                        this[type].group.put = false
                    }
                }
            }
        },
        showMenu(e, values, type) {
            e.preventDefault()
            this.menuData = {
                x: e.pageX,
                y: e.pageY,
                id: values.id,
                row: values.row,
                type
            }
            if (!this.isShowMenu) {
                this.isShowMenu = true
            }
        },
        hiddenMenu() {
            if (this.isShowMenu) {
                this.isShowMenu = false
            }
        },
        /* pullFunction() {
            return this.controlOnStart ? "clone" : true;
        }, */
        /* start({ originalEvent }) {
            console.log(originalEvent);
            this.controlOnStart = originalEvent.ctrlKey;
        } */
    },
};
</script>

<style scoped >
.screen {
    width: 100%;
    height: 100%;
    display: flex;
    text-align: center;
    user-select: none;
}

.el-col {
    height: 100%;
    padding: 0;
    margin: 0;
}

.relative {
    position: relative;

}

.left {
    height: calc(100% - 90px);
    width: 100%;
    position: absolute;
    top: 90px;
    left: 0;
    z-index: 21;
}

h3 {
    margin: 0;
}

.list-group {
    height: calc(100% - 31px);
    overflow: hidden;
    margin: 0 10px;
    display: grid;
}

.item {
    background-repeat: no-repeat;
    background-size: contain;
    padding: 28px 20px;
}

item>div {
    margin-top: 5%;
}

.dragArea .item {
    margin: 10px;
}

.item-row1 {
    background-image: url(../assets/left_1.png);
}
.item-row2 {
    background-image: url(../assets/left_2.png);
}
.item-row3 {
    background-image: url(../assets/left_3.png);
}

.item:hover {
    cursor: move;
    opacity: 0.8;
}

.item+.item {
    border-top: none;
    margin-top: 6px;
}

/*定义要拖拽元素的样式*/
.ghostClass {
    background-color: blue !important;
}

.chosenClass {
    background-color: red !important;
    opacity: 1 !important;
}

.dragClass {
    background-color: blueviolet !important;
    opacity: 1 !important;
    box-shadow: none !important;
    outline: none !important;
    background-image: none !important;
}

.itxst {
    margin: 10px;
}

.title {
    padding: 6px 12px;
}

.col {
    width: 40%;
    flex: 1;
    padding: 10px;
    border: solid 1px #eee;
    border-radius: 5px;
    float: left;
}

.col+.col {
    margin-left: 10px;
}
</style>