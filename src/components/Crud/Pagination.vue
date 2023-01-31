<!--分页-->
<template>
  <div class="fy">
    <el-pagination background :page-size.sync="page.size" :total="page.total" :current-page.sync="page.page"
      style="margin-top: 8px;" layout="total, sizes, prev, pager, next, jumper"
      @size-change="crud.sizeChangeHandler($event)" @current-change="crud.pageChangeHandler" />
  </div>
</template>
<script>
  import {
    pagination
  } from '@crud/crud'
  export default {
    mixins: [pagination()]
  }
</script>
<style>
  .fy {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
