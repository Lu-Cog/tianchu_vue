<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>巡护任务配置1</h4>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="dialogFormVisible=true">任务配置</el-button>
    </el-row>

    <div class="fromList">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead">
        <el-col :span='20' class="titleCol">
          <div class="ssjg">
            <span>任务类型</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="name">
            <span>任务名称</span>
            <el-input v-model="inputName" placeholder="请输入内容"></el-input>
          </div>
          <div class="name">
            <span>选择时间</span>
            <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="ssjg">
            <span>状态</span>
            <el-select v-model="value2" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='3'>
          <div class="btnflex">
            <el-button type="primary">查询</el-button>
            <el-button type="primary" plain>重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row class="rowtable">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#FAFAFA'}">
          <el-table-column type="index" label="#" align='center'>
          </el-table-column>
          <el-table-column prop="title" label="任务名称" align='center'>
          </el-table-column>
          <el-table-column align='center' prop="label" label="任务类型">
            <template slot-scope="scope">
              <span style="color: #409EFF">{{scope.row.label}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="jjcd" label="紧急程度" align='center'
            :filters="[{ text: '高', value: '1' }, { text: '中', value: '2' }, { text: '低', value: '3' }]"
            :filter-method="filterJjcd" filter-placement="bottom-end">
            <template slot-scope="scope">
              <span style="color: #F56C6C;" v-if="scope.row.jjcd==1">高</span>
              <span style="color: #E6A23C;" v-if="scope.row.jjcd==2">中</span>
              <span style="color: #409EFF;" v-if="scope.row.jjcd==3">底</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" width='250' align='center'>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align='center'>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" align='center'>
          </el-table-column>
          <el-table-column prop="endTime" label="截止时间" align='center'>
          </el-table-column>
          <el-table-column prop="note" label="任务内容" width='260' align='center'>
          </el-table-column>
          <el-table-column label="操作" align='center'>
            <div style="font-size: 20px;">
              <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);"></i>
              <i class="el-icon-edit" style="color: rgba(67, 207, 124, 1);margin: 0 20px;"></i>
              <i class="el-icon-delete" style="color: rgba(220, 23, 27, 1);"></i>
            </div>
          </el-table-column>
        </el-table>
        <div class="pageClass">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]" :page-size="tableFrom.limit" :current-page="tableFrom.page"
            layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
          </el-pagination>
        </div>
      </el-row>
    </div>
    <el-dialog title="巡护任务配置" width="70%" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="180px">
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="任务名称：">
              <el-input v-model="form.num1" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="任务类型：">
              <el-select v-model="rwlxVal" placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in rwlx" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='0'>
          <el-form-item label="任务内容：">
            <el-input type="textarea" :rows="5" style="width: 80%;" placeholder="请输入内容" v-model="textarea">
            </el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="任务地址：">
              <el-input v-model="form.address" placeholder="请输入或选择"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="具体坐标：">
              <el-input disabled v-model="latlng" style="width: 80%;" placeholder="请选择"></el-input>
              <el-button type="primary" @click="opanAddress">定位</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="开始时间：">
              <el-input type="date" v-model="form.num1" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="截止时间：">
              <el-input type="date" v-model="form.num2" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="巡护频次：">
              <el-input v-model="form.num1" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="紧急程度：">
              <el-select v-model="jjcdVal" placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in jjcd" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="责任区选择：">
              <el-input v-model="form.num1" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="定位" :visible.sync="dialogTableVisible" top="3vh">
      <iframe id="mapPage" width="100%" height="800px" frameborder="0"
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=7BZBZ-VZO6J-47OFE-FRXSX-BWLWJ-AXBRW&referer=myapp"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import {
    workConFig,
    workConFigSet
  } from '../../../api/system/appWork.js'
  import {
    rwLx,
    jjcd
  } from '../../../api/system/zd.js'
  import {
    initData
  } from '@/api/data'
  export default {
    name: 'renwu',
    data() {
      return {
        dialogFormVisible: false,
        dialogTableVisible: false,
        form: {
          num1: null,
          num2: null,
          address: null,
          lon: null,
          lat: null,
        },
        latlng: '',
        value1: '',
        value: '',
        value2: '',
        rwlxVal: '',
        jjcdVal: '',
        inputName: '',
        options: [],
        tableFrom: {
          page: 1,
          limit: 10
        },
        tableData: [],
        rwlx: [],
        jjcd: []
      }
    },
    mounted() {
      this.initData()
      this.workConFig()
      this.mapListener()
      this.rwLx()
      this.jjCd()
    },
    methods: {
      initData() {
        initData('/api/workConfig', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          blurry: this.inputName,
          dept : this.dept
        }).then(res => {
          console.log(res);
          this.tableData = res.content
        })
      },
      jjCd() {
        jjcd().then(res => {
          this.jjcd = res.content
        })
      },
      rwLx() {
        rwLx().then(res => {
          this.rwlx = res.content
        })
      },
      workConFig() {
        workConFig().then(res => {
          this.form = res
        })
      },
      onSubmit() {
        workConFigSet(this.form).then(res => {
          this.workConFig()
          this.$message.success('保存成功');
        })
      },
      opanAddress() {
        this.dialogTableVisible = true
      },
      filterJjcd(value, row) {
        return row.jjcd === Number(value);
      },
      filterStutas(value, row) {
        return row.stutas === Number(value);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.tableFrom.limit = val
      },
      handleCurrentChange(val) {
        this.tableFrom.page = val
        console.log(`当前页: ${val}`);
      },
      mapListener() {
        let that = this
        window.addEventListener('message', function(event) {
          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          let mapData = event.data;
          if (mapData && mapData.module == 'locationPicker') {
            that.form.address = mapData.poiname
            that.form.lon = mapData.latlng.lng
            that.form.lat = mapData.latlng.lat
            that.latlng = mapData.latlng.lng + '，' + mapData.latlng.lat
          }
          that.dialogTableVisible = false
        }, false);
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fromList {
    padding: 20px 0;
    background-color: #fff;
    border-radius: 10px;

    .tag {
      margin: 0 40px 20px;
    }

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
      height: 53px;
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
