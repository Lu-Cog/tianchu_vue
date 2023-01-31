<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>考勤记录</h4>
      <download-excel
            class = "export-excel-wrapper"
            :data = "tableData2"
            :fields = "json_data"
            name = "考勤记录.xls">
            <el-button type="success" icon="el-icon-upload2">导出数据</el-button>
      </download-excel>
    </el-row>
    <div class="fromList">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead">
        <el-col :span='16' class="titleCol">
          <div class="name">
            <span>姓名</span>
            <el-input v-model="inputName" placeholder="请输入内容"></el-input>
          </div>
          <div class="name">
            <span>打卡名称</span>
            <el-input v-model="inputTitle" placeholder="请输入内容"></el-input>
          </div>
          <div class="name">
            <span>选择时间</span>
            <date-range-picker v-model="value1" style="width: 230px;" />
          </div>
          <div class="ssjg">
            <span>状态</span>
            <el-select v-model="status" placeholder="请选择">
              <el-option v-for="item in dict.daka_status" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='3'>
          <div class="btnflex">
            <el-button type="primary" @click="search()">查询</el-button>
            <el-button type="primary" plain @click="clear()">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row class="rowtable">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#FAFAFA'}" v-loading='loading'>
          <el-table-column type="index" label="#" align='center'>
          </el-table-column>
          <el-table-column prop="nickName" label="姓名" align='center'>
          </el-table-column>
          <el-table-column align='center' prop="username" label="登录账号ID">
          </el-table-column>
          <el-table-column align='center' prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="area" label="责任区" align='center'>
            <template v-slot="scope">
              <spen v-for="item in zrq" :key="item.areaId" v-if="item.areaId == scope.row.areaId">{{item.title}}</spen>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="日期" align='center'>
            <template v-slot="scope">
              <span>{{scope.row.createTime.split(' ')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="打卡名称" align='center'>
          </el-table-column>
          <el-table-column prop="stime" label="规定打卡时间" align='center'>
          </el-table-column>
          <el-table-column prop="createTime" label="打卡时间" align='center'>
            <template v-slot="scope">
              <span>{{scope.row.createTime.split(' ')[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="180" align='center'>
            <template slot-scope="scope">
              <span v-for="item in dict.daka_status" :style="{color:cColor['dkzt'+scope.row.status]}" v-if="scope.row.status==item.value">{{item.label}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pageClass">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]" :page-size="tableFrom.limit" :current-page="tableFrom.page"
            layout="total, sizes, prev, pager, next, jumper" :total="totalElements">
          </el-pagination>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  import cColor from '@/assets/styles/commonColor.scss'
  import {
    initData
  } from '@/api/data'
  import DateRangePicker from '@/components/DateRangePicker'
  export default {
    computed: {
      cColor() {
        return cColor
      }
    },
    components: {
      DateRangePicker
    },
    name: 'renyuan',
    dicts: ['daka_status'],
    data() {
      return {
        loading: false,
        inputName: '',
        inputTitle:'',
        value1: '',
        status: '',
        tableFrom: {
          page: 1,
          limit: 10
        },
        tableData: [],
		tableData2: [],
        json_data:{
          "姓名":"nickName",
          "登录账号":"username",
          "手机号":"phone",
          "责任区":"areaId",
          "日期":"createTime",
          "打卡名称":"title",
          "规定打卡时间":"stime",
          "打卡时间":"createTime",
          "状态":"status",
        },
        totalElements: 1,
        zrq: [],
      }
    },
    mounted() {
      this.initData()
	  this.initData2()
      initData('api/area',{size:1000}).then(res => {
        this.zrq = res.content
      })
    },
    methods: {
      clear() {
        this.inputName = ''
        this.inputTitle = ''
        this.value1 = ''
        this.status = ''
        this.initData()
		this.initData2()
      },
      search() {
        this.initData()
		this.initData2()
      },
      initData() {
        this.loading = true
        initData('api/appDaka', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          blurry: this.inputName,
          title: this.inputTitle,
          status: this.status,
          createTime: this.value1,
        }).then(res => {
          console.log(res);
          this.loading = false
          this.tableData = res.content
          this.totalElements = res.totalElements
        })
      },
		initData2() {
		  initData('api/appDaka', {
			page: 0,
			size: 1000000,
			blurry: this.inputName,
			title: this.inputTitle,
			status: this.status,
			createTime: this.value1,
		  }).then(res => {
			this.tableData2 = res.content
		  })
		},
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.tableFrom.limit = val
        this.initData()
      },
      handleCurrentChange(val) {
        this.tableFrom.page = val
        this.initData()
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fromList {
    background-color: #fff;
    border-radius: 10px;

    .fromHead {
      padding: 18px;
    }

    .rowtable {
      padding-bottom: 20px;

      .pageClass {
        display: flex;
        justify-content: flex-end;
        margin: 20px;
      }
    }
  }

  .page {
    padding: 20px;

    .title {
      background-color: #fff;
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 20px;

      h4 {
        margin: 0;
      }
    }
  }

  .titleCol {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ssjg,
    .name {
      span {
        min-width: 100px;
        text-align: center;
      }

      display: flex;
      align-items: center;
    }

  }

  .btnflex {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
