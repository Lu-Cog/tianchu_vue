<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>短信模板</h4>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="goRouter">新增</el-button>
    </el-row>
    <div class="fromList">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead">
        <el-col :span='15' class="titleCol">
          <div class="ssjg">
            <span>模板名称</span>
            <el-input v-model="inputName" placeholder="请输入内容"></el-input>
          </div>
          <div class="name">
            <span>模板编码</span>
            <el-input v-model="inputName" placeholder="请输入内容"></el-input>
          </div>
          <div class="name">
            <span>状态</span>
            <el-select v-model="value" placeholder="请选择">
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
          <el-table-column prop="mbName" label="模板名称" align='center'>
          </el-table-column>
          <el-table-column align='center' prop="mbNo" label="模板编码">
          </el-table-column>
          <el-table-column prop="info" label="内容" align='center'>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align='center'>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align='center'>
          </el-table-column>
          <el-table-column prop="content" label="备注" align='center'>
          </el-table-column>
          <el-table-column prop="stutas" label="状态" align='center'
            :filters="[{ text: '有效', value: '1' }, { text: '无效', value: '2' }]"
            :filter-method="filterStutas" filter-placement="bottom-end">
            <template slot-scope="scope">
              <span style="color: #67C23A;" v-if="scope.row.stutas==1">有效</span>
              <span style="color: #F56C6C;" v-if="scope.row.stutas==2">无效</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align='center'>
            <div style="font-size: 20px;">
              <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);margin: 0 20px;"></i>
              <i class="el-icon-edit" style="color: rgba(67, 207, 124, 1);"></i>
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
  </div>
</template>

<script>
  export default {
    name: 'renyuan',
    data() {
      return {
        value: '',
        value1:'',
        inputName: '',
        options: [{
          value: 1,
          label: '机构1'
        }, {
          value: 2,
          label: '机构2'
        }, {
          value: 3,
          label: '机构3'
        }, {
          value: 4,
          label: '机构4'
        }, {
          value: 5,
          label: '机构5'
        }],
        tableFrom: {
          page: 1,
          limit: 10
        },
        tableData: [{
            mbName:'模板名称',
            mbNo:'KSS991233',
            info:'湖北省2022年林长管理规范文件',
            createTime:'2022-04-15  14:06:28',
            updateTime:'2022-04-15  14:06:28',
            content:'备注',
            stutas:1
          },
          {
              mbName:'模板名称',
              mbNo:'KSS991233',
              info:'湖北省2022年林长管理规范文件',
              createTime:'2022-04-15  14:06:28',
              updateTime:'2022-04-15  14:06:28',
              content:'备注',
              stutas:2
            },
        ],
      }
    },
    methods: {
      goRouter() {
        this.$router.push('/renyuan/add')
      },
      filterStutas(value, row) {
        return row.weekType === Number(value);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.tableFrom.limit = val
      },
      handleCurrentChange(val) {
        this.tableFrom.page = val
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
