<template>
    <div class="menu" :style="{ 'left': (data.x) - 150 + 'px', 'top': (data.y) - 100 + 'px' }">
        <div class="data-item-menu box-shadow1">
            <!-- <span class="menu-item operation-text" @click.stop="stick">置顶</span> -->
            <el-popover placement="top" width="160" v-model="showDelPop">
                <p>是否删除？</p>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="showDelPop = false">取消</el-button>
                    <el-button type="primary" size="mini" @click.stop="remove">确定</el-button>
                </div>
                <span slot="reference" class="menu-item operation-text">删除</span>
            </el-popover>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'rightMenu',
    props: ['data'],
    data() {
        return {
            showDelPop: false,
            friendInfo: {}
        }
    },
    methods: {
        remove() {
            this.$nextTick(() => {
                this.$emit('delCom', this.data)
            })
        },
        stick() {
            this.$emit('hiddenMenu')
        },
    },
}
</script>
  
<style>
.menu {
    position: absolute;
    padding: 5px;
    border-radius: 10px;
    z-index: 22;
    background-color: white;
}

.data-item-menu {
    padding: 5px;
}

.box-shadow1 {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.menu-item {
    display: block;
    margin-top: 5px;
}

.operation-text {
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 3px;
    color: #7e7e7e;
    transition: all .5s ease-in;
}

.operation-text:hover {
    background-color: #E9EAEC;
}
</style>
  
  