<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>消息管理</h4>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="openNew()">发送新消息</el-button>
    </el-row>
    <div class="fromList">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead">
        <el-col :span='12' class="titleCol">
          <div class="ssjg">
            <span>消息类型</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in dict.msg_type" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="name">
            <span>标题</span>
            <el-input v-model="inputName" placeholder="请输入内容"></el-input>
          </div>
          <div class="name">
            <span>时间</span>
            <date-range-picker v-model="value1" style="width: 230px;" />
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
          <el-table-column prop="type" label="消息类型" align='center'>
            <template slot-scope="scope">
              <span v-for="item in dict.msg_type" v-if="item.value==scope.row.type">{{item.label}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="title" label="标题">
          </el-table-column>
          <el-table-column prop="createTime" label="发送时间" align='center'>
          </el-table-column>
          <el-table-column prop="toType" label="发送范围" align='center'>
			<template v-slot="scope">
				<span v-if="scope.row.toType==1">全部</span>
				<span v-else-if="scope.row.toType==2">林长</span>
				<span v-else-if="scope.row.toType==3">护林员</span>
				<span v-else-if="scope.row.toType==4">个人</span>
			</template>
          </el-table-column>
          <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
              <div style="font-size: 20px;">
                <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);margin: 0 20px;"
                  @click="openInfo(scope.row)"></i>
                <i class="el-icon-delete" @click='toDelete(scope.row)' style="color: rgba(220, 23, 27, 1);"></i>
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
    <el-dialog title="发送消息" :visible.sync="newMask" width="30%" @close='clearDialog()'>
      <el-form :model="form" label-width="100px" :rules="rules" ref="myform">
        <el-form-item label="通知类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in dict.msg_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="form.title" autocomplete="off" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="通知内容" prop="content">
          <el-input v-model="form.content" :rows="5" type="textarea" autocomplete="off" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="责任区选择" prop="toAreaId">
          <el-select v-model="form.toAreaId" filterable placeholder="请选择责任区" style="width: 100%;">
            <el-option v-for="item in zrq" :key="item.areaId" :label="item.title" :value="item.areaId" />
          </el-select>
          <el-radio-group v-model="form.toType">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">林长</el-radio>
            <el-radio :label="3">护林员</el-radio>
            <el-radio :label="4">个人</el-radio>
          </el-radio-group>
          <div class="manList" v-if="form.toType==4">
            <div class="manItem" v-for="item in userlist">
              <img :src="item.img" alt="">
              <span>{{item.label}}</span>
            </div>
            <div class="manItem" @click="checkMan">
              <img style="cursor: pointer;" src="@/assets/images/fpry.png" alt="">
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newMask = false">取 消</el-button>
        <el-button type="primary" @click="sub">立即分配</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="form.title" :visible.sync="infoMask" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="通知类型">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%;" disabled>
            <el-option v-for="item in dict.msg_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知标题">
          <el-input v-model="form.title" autocomplete="off" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="通知时间">
          <el-input v-model="form.createTime" autocomplete="off" style="width: 100%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="通知内容">
          <el-input v-model="form.content" type="textarea" autocomplete="off" style="width: 100%;" disabled></el-input>
        </el-form-item>
		<el-form-item label="发送范围">
			<el-select v-model="form.toType" placeholder="请选择" style="width: 100%;" disabled>
			  <el-option label="全部" :value="1"></el-option>
			  <el-option label="林长" :value="2"></el-option>
			  <el-option label="护林员" :value="3"></el-option>
			  <el-option label="个人" :value="4"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="发送人员">
		  <el-input v-model="form.man" autocomplete="off" style="width: 100%;" disabled></el-input>
		</el-form-item>
        <el-form-item label="已读人员">
          <div class="ydList">
            <div class="ydItem" v-for="item in form.list">
              <span>{{item.nickName}}</span>
              <span>{{item.time}}</span>
            </div>
          </div>
          <el-pagination background layout="prev, pager, next" :total="10" @current-change="handleCurrentChange2">
          </el-pagination>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="infoMask = false">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配人员" :visible.sync="manMask" width="30%">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree class="filter-tree" :data="data" show-checkbox :filter-node-method="filterNode" ref="tree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="manMask = false">取 消</el-button>
        <el-button type="primary" @click="closeMan">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import xiaoxi from '@/api/message/xiaoxi'
  import {
    initData
  } from '@/api/data'
  import DateRangePicker from '@/components/DateRangePicker'
  export default {
    name: 'renyuan',
    components: {
      DateRangePicker
    },
    dicts: ['msg_type'],
	watch: {
	  filterText(val) {
		this.$refs.tree.filter(val);
	  }
	},
    data() {
      return {
        rules: {
          type: [{
            required: true,
            message: '请选择类别',
            trigger: 'change'
          }],
          content: [{
            required: true,
            message: '请填写内容',
            trigger: 'change'
          }],
          toAreaId: [{
            required: true,
            message: '请选择责任区',
            trigger: 'change'
          }],
          title: [{
            required: true,
            message: '请填写标题',
            trigger: 'change'
          }]
        },
        filterText: '',
        data: [],
        radio: 0,
        loading: false,
        userlist: [],
        form: {},
        infoMask: false,
        manMask: false,
        newMask: false,
        value: '',
        zrq: [],
        value1: '',
        inputName: '',
        tableFrom: {
          page: 1,
          limit: 10
        },
        tableFrom2: {
          page: 1,
          limit: 10
        },
        tableData: [],
        totalElements: 1
      }
    },
    mounted() {
      initData('api/area',{size:1000}).then(res => {
        this.zrq = res.content
      })
      initData('api/area/list').then(res => {
        this.data = res
      })
      this.initData()
    },
    methods: {
      clearDialog() {
        this.userlist = []
      },
      toDelete(e) {
        this.$confirm('确定删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          xiaoxi.del([e.msgId]).then(res => {
            this.initData()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },
      sub() {
        this.$refs['myform'].validate((valid) => {
          if (valid) {
            xiaoxi.add(this.form).then(res => {
              this.initData()
              this.newMask = false
              this.$message({
                message: '发送成功',
                type: 'success'
              })
            })
          }
        })

      },
      clear() {
        this.value = ''
        this.value1 = ''
        this.inputName = ''
        this.initData()
      },
      search() {
        this.initData()
      },
      openInfo(form) {
        this.form = form
        this.infoMask = true
      },
      closeMan() {
        this.manMask = false
        this.userlist = this.$refs.tree.getCheckedNodes()
        let arr = []
        this.userlist.forEach(item => {
          arr.push(item.id)
        })
        this.form.uids = arr.join(',')
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      checkMan() {
        this.manMask = true
      },
      initData() {
        this.loading = true
        initData('api/appMessage', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          blurry: this.inputName,
          type: this.value,
          createTime: this.value1
        }).then(res => {
          this.loading = false
          this.tableData = res.content
          this.totalElements = res.totalElements
        })
      },
      openNew() {
        this.form = {
          toType:1
        }
        this.newMask = true
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
      },
      handleCurrentChange2(val) {
        this.tableFrom2.page = val
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ydList {
    display: flex;
    flex-wrap: wrap;

    .ydItem {
      color: rgba(42, 130, 228, 1);
      font-size: 12px;
      line-height: 20px;
      border: 1px solid rgba(166, 166, 166, 1);
      border-radius: 4px;
      padding: 6px;
      margin: 0 5px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .manList {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .manItem {
      margin-right: 10px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      width: 60px;
      height: 60px;

      span {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        color: #fff;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background: rgba(56, 56, 56, 0.6);
      }

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

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
