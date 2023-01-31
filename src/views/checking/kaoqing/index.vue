<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>考勤规则</h4>
      <div>
        <el-button type="primary" @click="addKq()">考勤规则配置</el-button>
      </div>
    </el-row>
    <div class="fromList">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead">
        <el-col :span='8' class="titleCol">
          <!-- <div class="ssjg">
            <span>所属机构</span>
            <treeselect v-model="dept.id" :options="depts" :load-options="loadDepts" style="width: 180px;"
              placeholder="选择机构" />
          </div> -->
          <div class="ssjg">
            <span>责任区</span>
            <el-select v-model="areaId" filterable placeholder="请选择责任区" style="width: 100%;">
              <el-option v-for="item in zrq" :key="item.areaId" :label="item.title" :value="item.areaId" />
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
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#FAFAFA'}" v-loading="loading">
          <el-table-column type="index" label="#" align='center'>
          </el-table-column>
          <!-- <el-table-column prop="dept_id" label="部门" align='center'>
          </el-table-column> -->
          <el-table-column align='center' prop="area" label="责任区">
            <template v-slot="scope">
              <span v-for="item in zrq" v-if="item.areaId == scope.row.areaId">{{item.title}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="num" label="打卡次数">
          </el-table-column>
          <el-table-column prop="address" label="地址" align='center'>
          </el-table-column>
          <el-table-column prop="lon" label="详细坐标" align='center'>
            <template v-slot="scope">
              <span>{{scope.row.lon?scope.row.lon+','+scope.row.lat:''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fanwei" label="打卡范围" align='center'>
          </el-table-column>
          <el-table-column prop="wifi" label="允许WIFI" align='center'>
          </el-table-column>
          <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
              <div style="font-size: 20px;">
                <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);" @click="addKq(scope.row,1)"></i>
                <i class="el-icon-edit" style="color: rgba(67, 207, 124, 1);margin: 0 20px;"
                  @click="addKq(scope.row,2)"></i>
                <i @click='toDelete(scope.row)' class="el-icon-delete" style="color: rgba(220, 23, 27, 1);font-size: 20px;"></i>
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
    <el-dialog title="打卡规则配" :visible.sync="addMask" width="30%">
      <el-form :model="form" label-width="80px" :rules="rules" ref="myform">
        <el-form-item label="责任区" prop="areaId">
          <el-select v-model="form.areaId" filterable placeholder="请选择责任区" style="width: 100%;" :disabled='showtype'>
            <el-option v-for="item in zrq" :key="item.areaId" :label="item.title" :value="item.areaId" />
          </el-select>
        </el-form-item>
        <el-form-item label="打卡次数" prop="num">
          <el-select v-model="form.num" placeholder="" style="width: 100%;" :disabled='showtype' placeholder="打卡次数">
            <el-option v-for="item in dict.dk_num" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打卡时间" prop="time1" v-if="form.num">
          <div style="display: inline-block; width: 100%;">
            <el-row :gutter="20" style="margin-bottom: 10px;">
              <el-col :span="12">
                <span>上午上班</span>
                <el-time-picker value-format='HH:mm:ss' v-model="form.time1" style="width: 100%;" placeholder="上午上班" :disabled='showtype'>
                </el-time-picker>
              </el-col>
              <el-col :span="12" v-if="form.num==4">
                <span>上午下班</span>
                <el-time-picker value-format='HH:mm:ss' v-model="form.time2" style="width: 100%;" placeholder="上午下班" :disabled='showtype'>
                </el-time-picker>
              </el-col>
              <el-col :span="12" v-else>
                <span>下午下班</span>
                <el-time-picker value-format='HH:mm:ss' v-model="form.time4" style="width: 100%;" placeholder="下午下班" :disabled='showtype'>
                </el-time-picker>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="form.num==4">
              <el-col :span="12">
                <span>下午上班</span>
                <el-time-picker value-format='HH:mm:ss' v-model="form.time3" style="width: 100%;" placeholder="下午上班" :disabled='showtype'>
                </el-time-picker>
              </el-col>
              <el-col :span="12">
                <span>下午下班</span>
                <el-time-picker value-format='HH:mm:ss' v-model="form.time4" style="width: 100%;" placeholder="下午下班" :disabled='showtype'>
                </el-time-picker>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="打卡地址">
          <el-input v-model="form.address" autocomplete="off" :disabled='showtype' placeholder="打卡地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="坐标">
          <el-input v-model="form.lonLat" autocomplete="off" style="width: 80%;" :disabled='showtype' placeholder="坐标" clearable>
          </el-input>
          <el-button type="primary" @click="opanAddress" v-if="!showtype">定位</el-button>
        </el-form-item>
        <el-form-item label="打卡范围" prop="fanwei">
          <el-input v-model="form.fanwei" autocomplete="off" :disabled='showtype' placeholder="打卡范围">
            <template slot="append">米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="允许WIFI">
          <el-input v-model="form.wifi" autocomplete="off" :disabled='showtype' placeholder="允许WIFI"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMask = false">取 消</el-button>
        <el-button v-if="!showtype" type="primary" @click="sub">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="定位" :visible.sync="mapMask" top="3vh">
      <iframe id="mapPage" width="100%" height="800px" frameborder="0"
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=7BZBZ-VZO6J-47OFE-FRXSX-BWLWJ-AXBRW&referer=myapp"></iframe>
    </el-dialog>
  </div>
</template>

<script>
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
  import kaoqing from '@/api/checking/kaoqing'
  export default {
    name: 'renyuan',
    dicts: ['dk_num'],
    components: {
      Treeselect
    },
    data() {
      return {
        rules: {
          areaId: [{
            required: true,
            message: '请选择责任区',
            trigger: 'change'
          }],
          num: [{
            required: true,
            message: '请选择打卡次数',
            trigger: 'change'
          }],
          time1: [{
            required: true,
            message: '请填写打卡时间',
            trigger: 'change'
          }],
          address: [{
            required: true,
            message: '请填写地址',
            trigger: 'change'
          }],
          lon: [{
            required: true,
            message: '请选择坐标',
            trigger: 'change'
          }],
          fanwei: [{
            required: true,
            message: '请填写范围',
            trigger: 'change'
          }],
          wifi: [{
            required: true,
            message: '请填写WiFi',
            trigger: 'change'
          }]
        },
        showtype: false,
        showtype2: false,
        loading: false,
        areaId: '',
        addMask: false,
        mapMask: false,
        inputName: '',
        zrq: [],
        depts: [],
        dept: {
          id: null
        },
        tableFrom: {
          page: 1,
          limit: 10
        },
        form: {
          lat: '',
          lon: '',
          address: '',
		  lonLat:'',
        },
        tableData: [],
        totalElements: 1,
      }
    },
    mounted() {
      this.getDepts()
      initData('api/area',{size:1000}).then(res => {
        this.zrq = res.content
      })
      this.mapListener()
      this.initData()
    },
    methods: {
      clear() {
        this.dept = {
          id: null
        }
        this.areaId = ''
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
      initData() {
        this.loading = true
        initData('api/appDakaConfig', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          dept_id: this.dept.id,
          areaId: this.areaId
        }).then(res => {
          this.loading = false
          this.tableData = res.content
          this.totalElements = res.totalElements
        })
      },
      toDelete(e) {
        this.$confirm('确定删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          kaoqing.del([e.id]).then(res => {
            this.initData()
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          })
        })


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
			that.form.lonLat = that.form.lon+','+that.form.lat
          }
          that.mapMask = false
        }, false);
      },
      opanAddress() {
        this.mapMask = true
      },
      sub() {
        if(!(this.form.wifi || this.form.lon)){
          return this.$message('请选择坐标或者填写WIFI');
        }
				if(!this.form.lonLat){
					this.form.lat = ''
					this.form.lon = ''
				}
        this.$refs['myform'].validate((valid) => {
          if (valid) {
            if (this.form.id) {
              kaoqing.edit(this.form).then(res => {
                this.initData()
                this.addMask = false
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                });
              })
            } else {
              kaoqing.add(this.form).then(res => {
                this.initData()
                this.addMask = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
              })
            }
          }
        })


      },
      addKq(form, type) {
        this.showtype = type == 1 ? true : false
        this.showtype2 = type == 2 ? true : false
        this.form = form?{...form,lonLat:form.lon?form.lon+','+form.lat:''} : {
          lon: '',
          lat: '',
		  lonLat:''
        },
        this.addMask = true
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
