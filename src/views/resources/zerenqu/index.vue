<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>责任区管理</h4>
      <div>
        <el-button type="primary" icon='el-icon-circle-plus-outline' @click="dialogFormVisible=true">新增责任区</el-button>
      </div>
    </el-row>
    <div class="fromList">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead">
        <el-col :span='10' class="titleCol">
          <div class="ssjg">
            <span>责任区</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="ssjg">
            <span>上级责任区</span>
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
          <el-table-column prop="area" label="责任区" align='center'>
          </el-table-column>
          <el-table-column align='center' prop="sjarea" label="上级责任区">
          </el-table-column>
          <el-table-column align='center' prop="gtzmj" label="国土总面积">
          </el-table-column>

          <el-table-column prop="ldzmj" label="林地总面积" align='center'>
          </el-table-column>
          <el-table-column prop="yld" label="有林地" align='center'>
          </el-table-column>
          <el-table-column prop="gmld" label="灌木林地" align='center'>
          </el-table-column>
          <el-table-column prop="wcld" label="未成林地" align='center'>
          </el-table-column>
          <el-table-column prop="mpd" label="苗圃地" align='center'>
          </el-table-column>
          <el-table-column prop="wlmld" label="无林木林地" align='center'>
          </el-table-column>
          <el-table-column prop="fzscld" label="辅助生产林地" align='center'>
          </el-table-column>
          <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
              <div style="font-size: 20px;display: flex;align-items: center;">
                <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);"></i>
                <i class="el-icon-edit" style="color: rgba(67, 207, 124, 1);margin: 0 20px;"></i>
                <el-dropdown>
                  <span class="el-dropdown-link" style="display: flex;">
                    <img src="@/assets/icons/more.png" alt="">
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><img src="@/assets/icons/dt.png" alt=""></el-dropdown-item>
                    <el-dropdown-item  @click.native='open()'><img src="@/assets/icons/fwb.png" alt=""></el-dropdown-item>
                    <el-dropdown-item><i class="el-icon-delete"
                        style="color: rgba(220, 23, 27, 1);font-size: 24px;"></i>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
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

    <el-dialog title="新增责任区" width="70%" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="180px">
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="责任区：">
              <el-input v-model="form.num1" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="灌木林地：">
              <el-input v-model="form.num1" placeholder="请输入"><template slot="append">公顷</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="上级责任区：">
              <el-input v-model="form.num1" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="未成林地：">
              <el-input v-model="form.num1" placeholder="请输入"><template slot="append">公顷</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="国土总面积：">
              <el-input v-model="form.num1" placeholder="请输入"><template slot="append">公顷</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="苗圃地：">
              <el-input v-model="form.num1" placeholder="请输入"><template slot="append">公顷</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="林地总面积：">
              <el-input v-model="form.num1" placeholder="请输入"><template slot="append">公顷</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="无林木林地：">
              <el-input v-model="form.num1" placeholder="请输入"><template slot="append">公顷</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="有林地：">
              <el-input v-model="form.num1" placeholder="请输入"><template slot="append">公顷</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="辅助生产林地：">
              <el-input v-model="form.num1" placeholder="请输入"><template slot="append">公顷</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="富文本编辑器" width="50%" :visible.sync="dialogFormVisible2">
      <editor></editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Editor from '../../components/Editor.vue'
  export default {
    name: 'renyuan',
    components:{
      editor:Editor
    },
    data() {
      return {
        dialogFormVisible2:false,
        dialogFormVisible: false,
        value: '',
        inputName: '',
        form: {
          num1: null,
          num2: null,
          address: null,
          lon: null,
          lat: null,
        },
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
            area: '红花套镇',
            sjarea: '宜都市',
            gtzmj: '13223',
            ldzmj: '13223',
            yld: '13223',
            gmld: '13223',
            wcld: '13223',
            mpd: '13223',
            wlmld: '13223',
            fzscld: '13223',
          },
          {
            area: '红花套镇',
            sjarea: '宜都市',
            gtzmj: '13223',
            ldzmj: '13223',
            yld: '13223',
            gmld: '13223',
            wcld: '13223',
            mpd: '13223',
            wlmld: '13223',
            fzscld: '13223',
          },
        ],
      }
    },
    methods: {
      onSubmit() {

      },
      open(){
        this.dialogFormVisible2 = true
      },
      filtertype(value, row) {
        return row.type === Number(value);
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
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .text {
     text-align:left;
   }
  ::v-deep .w-e-text-container {
     height: 420px !important;
   }
  .el-dropdown-menu--small .el-dropdown-menu__item{
    padding: 6px 15px;
    display: flex;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
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
