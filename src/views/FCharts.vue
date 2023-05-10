<template>
      <ECharts :type="'pie'" :data="chartData" :options="chartOptions" :containerStyle="chartStyle" @chart-click="handleChartClick" />
  </template>
  
  <script>
  import ECharts from '../components/Chart.vue';
  
  export default {
    name:"ssSa",
    components: { ECharts },
    data() {
      return {
        chartData: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' },
        ],
        chartOptions: {
          title: {
            text: '访问来源',
            subtext: '纯属虚构',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
          },
          legend: {
            orient: 'vertical',
            left: 10,
            top: 40,
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
          },
        },
        chartStyle: {
          width: '100%',
          height: '400px',
        },
      };
    },
    methods: {
      handleChartClick(dataIndex) {
        console.log('点击了第' + (dataIndex + 1) + '个扇形');
      },
    },
  };
  </script>
  