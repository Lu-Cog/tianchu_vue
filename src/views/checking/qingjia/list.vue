<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>历史记录</h4>
      <div style="display: flex;">
        <download-excel
              class = "export-excel-wrapper"
              :data = "tableData2"
              :fields = "json_data"
              name = "请假历史记录.xls">
              <el-button type="success" icon="el-icon-upload2">导出数据</el-button>
        </download-excel>
        <el-button style="margin-left: 10px;" type="primary" @click="$router.go(-1);">返回</el-button>
      </div>
    </el-row>
    <div class="fromList">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead">
        <el-col :span='10' class="titleCol">
          <div class="name">
            <span>姓名</span>
            <el-input v-model="inputName" placeholder="请输入内容"></el-input>
          </div>
          <!-- <div class="name">
            <span>标题</span>
            <el-input v-model="inputName" placeholder="请输入内容"></el-input>
          </div> -->
          <div class="name">
            <span>选择时间</span>
            <date-range-picker v-model="value1" style="width: 230px;" />
          </div>
         <!-- <div class="ssjg">
            <span>状态</span>
            <el-select v-model="holiday_status" placeholder="请选择">
              <el-option v-for="item in dict.holiday_status" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->
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
          <el-table-column align='center' prop="workNo" label="工号">
          </el-table-column>
          <el-table-column align='center' prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="cate" label="类型" align='center'>
            <template slot-scope="scope">
              <el-tag effect="dark" :color="cColor['qjlx'+scope.row.cate]" v-for="item in dict.qjlx" v-if="scope.row.cate==item.value">
               {{item.label}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" align='center'>
            <template v-slot="scope">
              <span>{{scope.row.createTime.split(' ')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="请假时间" align='center' width="200px">
            <template v-slot="scope">
              <span>{{scope.row.startTime.split(' ')[0]}} - {{scope.row.endTime.split(' ')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="days" label="天数" align='center'>
          </el-table-column>
          <el-table-column prop="content" width='260' label="请假事由" align='center'>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="180" align='center'>
            <template slot-scope="scope">
              <span v-for="item in dict.holiday_status" :style="{color:cColor['qjzt'+scope.row.status]}" v-if="scope.row.status==item.value">{{item.label}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align='center'>
            <template v-slot="scope">
              <div style="font-size: 20px;">
                <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);margin: 0 20px;"
                  @click="openShow(scope.row)"></i>
                  <i @click='toDelete(scope.row)' class="el-icon-delete" style="color: rgba(220, 23, 27, 1);"></i>

              </div>
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
    <el-dialog title="详情" :visible.sync="showMask" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="姓名">
          {{form.nickName}}
        </el-form-item>
        <el-form-item label="工号">
          {{form.workNo}}
        </el-form-item>
        <el-form-item label="手机号">
          {{form.phone}}
        </el-form-item>
        <el-form-item label="类型">
          <span v-for="item in dict.qjlx" v-if="form.cate==item.value">{{item.label}}</span>
        </el-form-item>
        <el-form-item label="申请时间">
          {{form.createTime}}
        </el-form-item>
        <el-form-item label="请假时间">
          {{form.startTime}} - {{form.endTime}}
        </el-form-item>
        <el-form-item label="天数">
          {{form.days}}
        </el-form-item>
        <el-form-item label="请假事由">
          {{form.content}}
        </el-form-item>
		<el-form-item label="审批意见">
		  {{form.reply}}
		</el-form-item>
		<el-form-item label="审批时间">
		  {{form.replyTime}}
		</el-form-item>
        <el-form-item label="状态">
          <span v-for="item in dict.holiday_status" v-if="form.status==item.value">{{item.label}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showMask = false">取 消</el-button>
        <el-button type="primary" @click="showMask = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import cColor from '@/assets/styles/commonColor.scss'
  import {
    initData
  } from '@/api/data'
  import DateRangePicker from '@/components/DateRangePicker'
  import qingjia from '@/api/checking/qingjia'
  export default {
    components: {
      DateRangePicker
    },
    computed: {
      cColor() {
        return cColor
      }
    },
    name: 'renyuan',
    dicts: ['qjlx', 'holiday_status'],
    data() {
      return {
        holiday_status: '',
        loading: false,
        value1: '',
        inputName: '',
        tableFrom: {
          page: 1,
          limit: 10
        },
        json_data:{
          "姓名":"nickName",
          "工号":"workNo",
          "手机号":"phone",
          "类型":"cate",
          "申请时间":"createTime",
          "请假时间":"startTime",
          "天数":"days",
          "请假事由":"content",
          "状态":"status",
        },
        form: {},
        tableData: [],
		tableData2: [],
        totalElements: 1,
        showMask: false
      }
    },
    mounted() {
      this.initData()
	  this.initData2()
    },
    methods: {
      clear() {
        this.inputName = ''
        this.holiday_status = ''
        this.value1 = ''
        this.initData()
		this.initData2()
      },
      search() {
        this.initData()
		this.initData2()
      },
      openShow(row) {
        row.createTime = row.createTime.split(' ')[0]
        row.startTime = row.startTime.split(' ')[0]
        row.endTime = row.endTime.split(' ')[0]
        this.form = {
          ...row
        }
        this.showMask = true
      },
      toDelete(row) {
        this.$confirm('确定删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          qingjia.del([row.holId]).then(res => {
            this.initData()
			this.initData2()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })

      },
      initData() {
        this.loading = true
        initData('api/appHoliday', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          blurry: this.inputName,
          createTime: this.value1,
          type:3,
          status: this.holiday_status
        }).then(res => {
          this.loading = false
          this.tableData = res.content
          this.totalElements = res.totalElements
        })
      },
			initData2() {
			  initData('api/appHoliday', {
			    page: 0,
			    size: 100000,
			    blurry: this.inputName,
			    createTime: this.value1,
			    type:3,
			    status: this.holiday_status
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
