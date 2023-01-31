<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <el-col :span='11'>
        <div class="title_l">
          <h4 style="white-space: nowrap;">请假管理</h4>
          <label style="white-space: nowrap;" for="name">姓名</label>
          <el-input v-model="inputName" placeholder="请输入内容" id="name" style="width: 200px;margin-right: 30px;">
          </el-input>
          <label style="white-space: nowrap;" for="">选择时间</label>
          <date-range-picker v-model="value1" style="width: 230px;" />
          <!-- <label for="">状态</label>
          <el-select v-model="holiday_status" placeholder="请选择">
            <el-option v-for="item in dict.holiday_status" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
        </div>
      </el-col>
      <el-col :sm="10" :lg="6" :md="8" class="title_r">
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button type="primary" plain @click="clear()">重置</el-button>
        <router-link to="/qingjia/list" class="link">
          历史请假记录
        </router-link>
        <div class="listType">
          <svg-icon @click="changeType(1)" :icon-class="listType==1?'icon_kapian':'icon_kapianS'" />
          <svg-icon @click="changeType(2)" :icon-class="listType==2?'icon_listS':'icon_list'" />
        </div>
      </el-col>
    </el-row>
    <div class="list" v-loading='loading' v-if="listType==1">
      <nothing v-if="tableData.length<=0"></nothing>
      <el-card v-else style="width: 19%;margin: 0 16px 16px 0;" v-for="(item,index) in tableData" :key="item.id">
        <div class="box-card">
          <img style="width: 80px;height: 80px;border-radius: 50%;" :src="item.avatarPath" alt="">
          <h3>{{item.nickName}}</h3>
          <p>请假类型：
            <el-tag effect="dark" disable-transitions :color="cColor['qjlx'+item.cate]" v-for="items in dict.qjlx" :key="items.id" v-if="items.value==item.cate">
              {{items.label}}
            </el-tag>
          </p>
          <div class="date">
            <svg-icon icon-class="icon_date" />
            <span>{{item.startTime.split(' ')[0]}}</span><span
              class="stext">至</span><span>{{item.endTime.split(' ')[0]}}</span>
          </div>
          <el-button class="btnw" type="primary" @click="openDrawer(item)">详情</el-button>
        </div>
      </el-card>
      </el-col>
    </div>
    <el-table v-else :data="tableData" style="width: 100%" :header-cell-style="{background:'#FAFAFA'}" v-loading='loading'>
      <el-table-column type="index" label="#" align='center'>
      </el-table-column>
      <el-table-column prop="nickName" label="姓名" align='center'>
      </el-table-column>
      <el-table-column align='center' prop="workNo" label="工号">
      </el-table-column>
      <el-table-column align='center' prop="phone" label="手机号">
      </el-table-column>
      <el-table-column prop="cateId" label="类型" align='center'>
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
          <el-button type="primary" @click="openDrawer(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer title="请假申请" :visible.sync="drawer" size='20%' :with-header="false">
      <div class="qinjia">
        <div class="head"></div>
        <img class="headimg" :src="form.avatarPath" alt="">
        <h3>姓名：{{form.nickName}}</h3>
        <p>请假类型：
          <el-tag effect="dark" :color="cColor['qjlx'+form.cate]" v-for="items in dict.qjlx" :key="items.id" v-if="items.value==form.cate">
            {{items.label}}
          </el-tag>
        </p>
        <div class="content">{{form.content}}</div>
        <div class="qjFrom">
          <div class="qjItem">
            <span>申请时间</span>
            <span>{{form.createTime}}</span>
          </div>
          <div class="qjItem">
            <span>请假天数</span>
            <div class="date">
              <svg-icon icon-class="icon_date" />
              <span>{{form.startTime}}</span><span class="stext">至</span><span>{{form.endTime}}</span>
            </div>
            <span>共{{form.days}}天</span>
          </div>
          <div class="qjItem">
            <span>上传附件</span>
            <div class="imglist">
              <el-image style="width: 100px; height: 100px;margin: 4px;" v-for="img in form.imgs" :src="img"
                :preview-src-list="form.imgs">
              </el-image>
            </div>
          </div>
          <div class="qjItem">
            <span>审批意见</span>
            <el-input type="textarea" :rows="2" style="width: 100%;" placeholder="请输入内容" v-model="form.reply">
            </el-input>
          </div>
        </div>
        <div class="btns">
          <el-button class="agree" type="primary" icon="el-icon-success" @click="agree(1)">同意</el-button>
          <el-button class="agree" type="info" icon="el-icon-error" @click="agree(2)">不同意</el-button>
        </div>
      </div>
    </el-drawer>
    <div class="pageClass">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]" :page-size="tableFrom.limit" :current-page="tableFrom.page"
        layout="total, sizes, prev, pager, next, jumper" :total="totalElements">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import cColor from '@/assets/styles/commonColor.scss'
  import {
    initData
  } from '@/api/data'
  import qingjia from '@/api/checking/qingjia'
  import DateRangePicker from '@/components/DateRangePicker'
  import Nothing from '@/components/nothing'
  export default {
    name: 'qingjias',
    computed: {
      cColor() {
        return cColor
      }
    },
    components: {
      DateRangePicker,
      Nothing
    },
    data() {
      return {
        holiday_status:'',
        listType: 1,
        loading: false,
        inputName: '',
        value1: '',
        drawer: false,
        tableFrom: {
          page: 1,
          limit: 10
        },
        tableData: [],
        totalElements: 1,
        form: {}
      }
    },
    dicts: ['qjlx', 'holiday_status'],
    mounted() {
      this.initData()
    },
    methods: {
      changeType(type) {
        this.listType = type
      },
      clear() {
        this.inputName = ''
        this.holiday_status=''
        this.value1 = ''
        this.initData()
      },
      search() {
        this.initData()
      },
      initData() {
        this.loading = true
        initData('api/appHoliday', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          blurry: this.inputName,
          type:0,
          status: this.holiday_status,
          createTime: this.value1,
        }).then(res => {
          this.loading = false
          this.tableData = res.content
          this.totalElements = res.totalElements
        })
      },
      openDrawer(item) {
        item.startTime = item.startTime.split(' ')[0]
        item.endTime = item.endTime.split(' ')[0]
        if (!Array.isArray(item.imgs)) {
          item.imgs = JSON.parse(item.imgs)
        }
        this.form = {
          ...item
        }
        this.drawer = true
      },
      agree(type) {
        if (!this.form.reply) {
          return this.$message({
            message: '请填写审批意见'
          })
        }
        this.form.status = type
        qingjia.edit(this.form).then(res => {
          this.drawer = false
          this.initData()
          if (type == 1) {
            this.$message({
              message: '已同意',
              type: 'success'
            });
          } else {
            this.$message('已拒绝');
          }
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.tableFrom.limit = val
        this.initData()
      },
      handleCurrentChange(val) {
        this.tableFrom.page = val
        console.log(`当前页: ${val}`);
        this.initData()
      }
    }

  }
</script>

<style lang="scss" scoped>
  .pageClass {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }

  .list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

  }

  .page {
    padding: 20px;

    .title {
      background-color: #fff;
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 20px;

      h4 {
        margin: 0 40px 0 0;
      }

      .title_l {
        display: flex;
        align-items: center;
        justify-content: space-between;

        label {
          color: rgba(116, 129, 150, 1);
          font-size: 16px;
        }
      }

      .link {
        white-space: nowrap;
        margin-left: 20px;
        display: inline-block;
        text-align: center;
        line-height: 30px;
        width: 136px;
        height: 30px;
        background: rgba(35, 188, 202, 1);
        color: #fff;
        font-size: 16px;
        border-radius: 8px;
      }

      .title_r {
        display: flex;
        .listType {
          display: flex;
          font-size: 24px;
          margin-left: 40px;
        }
      }
    }
  }

  .box-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    p {
      margin: 0 0 10px;
    }

    .date {
      display: flex;
      align-items: center;
      margin: 0 0 10px;
      font-size: 20px;

      span {
        margin: 0 6px;
        color: rgba(148, 162, 179, 1);
        font-size: 12px;
      }

      .stext {
        font-size: 16px;
        color: #000;
      }

    }

    .btnw {
      width: 114px;
      border-radius: 20px;
    }
  }

  .qinjia {
    .head {
      width: 100%;
      height: 200px;
      background: rgba(42, 130, 228, 1);
    }

    .headimg {
      width: 125px;
      height: 125px;
      margin: -60px auto 0;
      display: flex;
      border: 6px solid #fff;
      border-radius: 12px;
    }

    h3,
    p {
      text-align: center;
    }

    .content {
      margin: 0 21px 25px;
    }

    .qjFrom {
      margin: 0 21px;

      .qjItem {
        display: flex;
        align-items: flex-start;
        margin-bottom: 24px;

        .imglist {
          display: flex;
          flex-wrap: wrap;
        }

        span {
          color: rgba(40, 88, 173, 1);

          &:first-child {
            white-space: nowrap;
            color: rgba(40, 88, 173, 1);
            font-size: 14px;
            margin-right: 16px;
          }
        }

        .date {
          display: flex;
          align-items: center;
          margin: 0 0 10px;
          font-size: 20px;

          span {
            margin: 0 6px;
            color: rgba(148, 162, 179, 1);
            font-size: 12px;
          }

          .stext {
            font-size: 16px;
            color: rgba(40, 88, 173, 1);
          }

        }

        input {
          padding: 10px;
          height: 120px;
          border: 2px solid rgba(40, 88, 173, 1);
          border-radius: 6px;
        }
      }
    }

    .btns {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 50px;

      .agree {
        width: 40%;
        height: 40px;
        font-size: 18px;
      }
    }
  }
</style>
