<template>
  <div id="app">
    <el-radio-group v-model="radio" @change="change" style="padding:10px;">
      <el-radio-button label="拖拽页面一"></el-radio-button>
      <el-radio-button label="拖拽页面二"></el-radio-button>
      <el-radio-button label="拖拽页面三"></el-radio-button>
      <el-radio-button label="VR页"></el-radio-button>
    </el-radio-group>
    <component :is="component" />
  </div>
</template>

<script>
import Resize from './components/resize.vue'
import screen from './components/screen.vue'
import dragrid from './views/dragrid.vue';
import vr from "./components/vr.vue";
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  }
}
export default {
  name: 'App',
  components: {
    Resize,
    screen,
    dragrid,
    vr,
  },
  data() {
    return {
      radio: "拖拽页面一",
      component: Resize
    }
  },
  methods: {
    change: debounce(function(val) {
      switch (val) {
        case '拖拽页面一':
          this.component = Resize
          break;
        case '拖拽页面二':
          this.component = screen
          break;
        case '拖拽页面三':
          this.component = dragrid
          break;
        case 'VR页':
          this.component = vr
          break;

        default:
          this.component = vr
          break;
      }
    }, 500),
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html,
body,
#app,
.el-tabs--border-card,
.el-tab-pane {
  width: 100%;
  height: 100%;
}

.el-tabs--border-card {
  border: none;
  box-shadow: none;
}

.el-tabs__content {
  height: calc(100% - 39px);
  padding: 0 !important;
}
</style>
