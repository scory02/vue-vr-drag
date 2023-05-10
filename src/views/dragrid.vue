<template>
  <grid-layout :layout.sync="layout" :col-num="12" :row-height="30" :is-draggable="draggable" :is-resizable="resizable"
    :vertical-compact="true" :use-css-transforms="true">
    <grid-item v-for="(item, index) in layout" :key="index" :static="item.static" :x="item.x" :y="item.y" :w="item.w"
      :h="item.h" :i="item.i">
      <!-- <span class="text">{{ itemTitle(item) }}</span> -->
      <e-chart :options="chartOptions" />
    </grid-item>
  </grid-layout>
</template>

<script>
import { GridLayout, GridItem } from "vue-grid-layout"
import EChart from './FCharts.vue';

export default {
  name: 'dragridS',
  components: {
    GridLayout,
    GridItem,
        EChart
  },
  data() {
    return {
            chartOptions: {
                title: {
                    text: '折线图'
                },
                tooltip: {},
                xAxis: {
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'line',
                    data: [5, 20, 36, 10, 10, 20, 8]
                }]
            },
      layout: [
        { "x": 0, "y": 0, "w": 2, "h": 2, "i": "0", static: false },
      ],
      draggable: true,
      resizable: true,
      index: 0
    }
  },
  methods: {
    itemTitle(item) {
      let result = item.i;
      if (item.static) {
        result += " - Static";
      }
      return result;
    }
  }
}
</script>

<style scoped>
.vue-grid-layout {
  background: #eee;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}

.vue-grid-item .resizing {
  opacity: 0.9;
}

.vue-grid-item .static {
  background: #cce;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
</style>