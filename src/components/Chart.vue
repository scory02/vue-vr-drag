<template>
    <div class="chart-container" ref="container"></div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    name: 'ECharts',
    props: {
      // 图表类型
      type: {
        type: String,
        required: true,
      },
      // 图表数据
      data: {
        type: Array,
        required: true,
      },
      // 图表配置项
      options: {
        type: Object,
        default: () => ({}),
      },
      // 图表容器样式
      containerStyle: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        chartInstance: null, // echarts实例
        resizeObserver: null, // ResizeObserver实例
      };
    },
    mounted() {
      this.initChart();
      this.initResizeObserver();
      this.renderChart();
    },
    beforeDestroy() {
      this.destroyChart();
      this.destroyResizeObserver();
    },
    methods: {
      initChart() {
        this.chartInstance = echarts.init(this.$refs.container);
        this.chartInstance.on('click', ({ dataIndex }) => {
          // 当图表被点击时，触发回调函数
          this.$emit('chart-click', dataIndex);
        });
      },
      destroyChart() {
        this.chartInstance.dispose();
        this.chartInstance = null;
      },
      renderChart() {
        const option = {
          ...this.options, // 合并传入的配置项
          series: [
            {
              ...this.options.series, // 合并传入的系列配置项
              type: this.type,
              data: this.data,
            },
          ],
        };
  
        this.chartInstance.setOption(option);
      },
      initResizeObserver() {
        this.resizeObserver = new ResizeObserver(() => {
          const el = this.$refs.container;
          const { width, height } = el.getBoundingClientRect();
          this.chartInstance.resize({ width, height });
        });
  
        this.resizeObserver.observe(this.$refs.container.parentNode);
      },
      destroyResizeObserver() {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      },
    },
  };
  </script>
  
  <style>
  .chart-container {
    width: 100%;
    height: 100%;
  }
  </style>
  