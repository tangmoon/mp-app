<template>
    <u-search placeholder="搜索" v-model="keyword" @search="searchHistory"></u-search>
   </template>
   <script>
   export default {
    data() {
      return {
        keyword: '', // 用户输入的关键字
        aList: [], // 展示的数据
        bList: [] // 所有的数据
      };
    },
    methods: {
      searchHistory(value) {
        if (value == '') {
          // 如果输入为空，则加载所有列表
          this.getList();
        } else {
          // 清空展示的数据
          this.aList = [];
          // 遍历所有数据，搜索关键字
          for (var i = 0; i < this.bList.length; i++) {
            if (this.bList[i].pullTime.indexOf(value) >= 0) {
              this.aList.push(this.bList[i]);
            }
          }
        }
      },
      getList() {
        // 向后台发送请求，获取所有数据后赋值给aList和bList
      }
    }
   }
   </script>