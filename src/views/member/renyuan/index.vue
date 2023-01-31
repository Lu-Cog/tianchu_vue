<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>人员管理</h4>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="goRouter">新增</el-button>
    </el-row>
    <div class="fromList">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead">
        <el-col :span='8' class="titleCol">
          <div class="ssjg">
            <span>所属机构</span>
            <treeselect v-model="dept.id" :options="depts" :load-options="loadDepts" class="treeSelect" style="width: 180px;"
              placeholder="选择机构" />
          </div>
          <div class="name">
            <span>姓名</span>
            <el-input class="xingming" v-model="inputName" placeholder="请输入内容"></el-input>
          </div>
        </el-col>
        <el-col :span='3'>
          <div class="btnflex">
            <el-button type="primary" @click="search()">查询</el-button>
            <el-button type="primary" plain @click="clear">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row class="rowtable">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#FAFAFA'}"  v-loading="loading">
          <el-table-column type="index" label="#" align='center'>
          </el-table-column>
          <el-table-column prop="nickName" label="姓名" align='center'>
          </el-table-column>
          <el-table-column align='center' prop="phone" label="账号">
          </el-table-column>
          <el-table-column prop="sfz" label="身份证" align='center'>
          </el-table-column>
          <el-table-column prop="areaId" label="责任区" align='center'>
            <template slot-scope="scope">
              <span v-for="item in zrq" v-if="scope.row.areaId==item.areaId">{{item.title}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lzzw" label="林长职务" align='center'>
            <template slot-scope="scope">
              <span v-for="item in dict.lzzw" v-if="scope.row.lzzw==item.value">{{item.label}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="zwlx" label="职务类型" align='center'>
            <template slot-scope="scope">
              <span v-for="item in dict.zwlx" v-if="scope.row.zwlx==item.value">{{item.label}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gzlx" label="工作类型" align='center'>
            <template slot-scope="scope">
              <span v-for="item in dict.gzlx" :style="{color:cColor['gzlx'+scope.row.gzlx]}" v-if="scope.row.gzlx==item.value">{{item.label}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
              <div style="font-size: 20px;">
                <i class="el-icon-view cur" @click="toView(scope.row)" style="color: rgba(42, 130, 228, 1);"></i>
                <i class="el-icon-edit cur" @click="toEdit(scope.row)"
                  style="color: rgba(67, 207, 124, 1);margin: 0 20px;"></i>
                <i class="el-icon-delete cur" @click="del(scope.row.id)" style="color: rgba(220, 23, 27, 1);"></i>
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
  </div>
</template>

<script>
  import cColor from '@/assets/styles/commonColor.scss'
  import {
    getDepts
  } from '@/api/system/dept'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    LOAD_CHILDREN_OPTIONS
  } from '@riophae/vue-treeselect'
  import {
    initData
  } from '@/api/data'
  import {
    del
  } from '@/api/system/user'
  export default {
    name: 'renyuan',
    computed :{
      cColor() {
        return cColor
      }
    },
    components: {
      Treeselect
    },
    dicts: ['lzzw', 'zwlx','gzlx'],
    data() {
      return {
        loading:false,
        zrq:[],
        inputName: '',
        tableFrom: {
          page: 1,
          limit: 10
        },
        tableData: [],
        totalElements:0,
        depts: [],
        dept: {
          id: null
        },
      }
    },
    created() {
      initData('api/area',{size:1000}).then(res => {
        this.zrq = res.content
      })
      this.initData()
      this.getDepts()
    },
    methods: {
      clear(){
        this.dept = {
          id: null
        }
        this.inputName = ''
        this.initData()
      },
      search() {
        this.initData()
      },
      getDepts() {
        getDepts({
          enabled: true
        }).then(res => {
          this.depts = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
        })
      },
      // 获取弹窗内部门数据
      loadDepts({
        action,
        parentNode,
        callback
      }) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          getDepts({
            enabled: true,
            pid: parentNode.id
          }).then(res => {
            parentNode.children = res.content.map(function(obj) {
              if (obj.hasChildren) {
                obj.children = null
              }
              return obj
            })
            setTimeout(() => {
              callback()
            }, 200)
          })
        }
      },
      del(id) {
        this.$confirm('此操作将永久删除该会员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del([id]).then(res => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      toEdit(data) {
        this.$router.push({
          name: 'add',
          params: data
        })
      },
      toView(data) {
        data.isView = 1
        this.$router.push({
          name: 'add',
          params: data
        })
      },
      initData() {
        this.loading = true
        initData('api/users', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          type: 2,
          blurry: this.inputName,
          deptId : this.dept.id
        }).then(res => {
          console.log(res);
          this.loading = false
          this.tableData = res.content
          this.totalElements = res.totalElements
        })
      },
      goRouter() {
        this.$router.push('/renyuan/add')
      },
      filterStutas(value, row) {
        return row.isQuan === Number(value);
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
<style>
  .vue-treeselect__control{
    height: 32px !important;
  }
</style>
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
