<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>{{disabled?'':form.id?'修改':'添加'}}人员</h4>
    </el-row>
    <div class="fromList">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="姓名" prop='nickName'>
              <el-input v-model="form.nickName" class="itemwid"  :disabled='disabled'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="工号" prop='workNo'>
              <el-input v-model="form.workNo" class="itemwid" :disabled='disabled'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="手机号" prop='phone'>
              <el-input v-model="form.phone" class="itemwid" :disabled='disabled'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="乡直联系单位">
              <el-input v-model="form.xzldw" class="itemwid" :disabled='disabled'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="身份证号">
              <el-input v-model="form.sfz" class="itemwid" :disabled='disabled'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="市直联系单位">
              <el-input v-model="form.szldw" class="itemwid" :disabled='disabled'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="责任区" prop='areaId'>
              <el-select v-model="form.areaId" filterable placeholder="请选择责任区" class="itemwid" @change="changeZrq" :disabled='disabled'>
                <el-option v-for="item in zrq" :key="item.areaId" :label="item.title" :value="item.areaId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="巡护区域" prop="workArea">
              <el-input v-model="form.workArea" class="itemwid" :disabled='disabled'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="部门">
              <treeselect v-model="form.dept.id" :disabled='disabled' :options="depts" :load-options="loadDepts" style="width: 300px"
                placeholder="选择机构" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="区域中心坐标" prop="lon">
              <el-input disabled v-model="latlng" class="itemwid" placeholder="请选择"></el-input>
              <el-button type="primary" @click="opanAddress" v-if="!disabled">定位</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="行政职务" prop="xzzw">
              <el-input v-model="form.xzzw" class="itemwid" :disabled='disabled'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="联系地址">
              <el-input v-model="form.address" class="itemwid" :disabled='disabled'></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span='10'>
            <el-form-item label="住址坐标" prop="lon">
              <el-input disabled v-model="latlng" class="itemwid" placeholder="请选择"></el-input>
              <el-button type="primary" @click="opanAddress">定位</el-button>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="林长职务" prop='lzzw'>
              <el-select v-model="form.lzzw" placeholder="请选择林长职务" :disabled='disabled' class="itemwid" @change="changeJob">
                <el-option v-for="item in lzzw" :key="item.label" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="出生日期">
              <el-date-picker v-model="form.birthday" type="date" class="itemwid" :disabled='disabled'/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="职务类型" prop="zwlx">
              <el-select v-model="form.zwlx" placeholder="请选择职务类型" class="itemwid" :disabled='disabled'>
                <el-option v-for="(item,index) in zwlx" :key="item.label" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工作类型" prop="gzlx">
              <el-select v-model="form.gzlx" placeholder="请选择工作类型" class="itemwid" :disabled='disabled'>
                <el-option v-for="(item,index) in dict.gzlx" :key="item.label" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="备注">
              <el-input type="textarea" :rows="3" style="width: 300px;" placeholder="请输入内容" v-model="form.note" :disabled='disabled'>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="密码" prop='password'>
              <el-input v-model="form.password" class="itemwid" :placeholder="form.id?'置空为不修改':'请设置密码'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="所属机构" prop='dept'>
              <treeselect v-model="form.dept.id" :options="depts" :load-options="loadDepts" style="width: 300px"
                placeholder="选择机构" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- <el-row :gutter='20'>
          <el-col :span='10'>
            <el-form-item label="责任区" prop='workArea'>
              <el-input v-model="form.workArea" class="itemwid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10'>
            <el-form-item label="员工职务" prop='jobs'>
              <el-select v-model="jobDatas" placeholder="请选择员工职务" multiple class="itemwid" @change="changeJob">
                <el-option v-for="item in jobs" :key="item.name" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->


        <el-form-item>
          <el-button v-if="!disabled" type="primary" @click="onSubmit('form')">立即{{form.id?'修改':'添加'}}</el-button>
          <el-button @click="$router.go(-1);">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="定位" :visible.sync="dialogTableVisible" top="3vh">
      <iframe id="mapPage" width="100%" height="800px" frameborder="0"
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=7BZBZ-VZO6J-47OFE-FRXSX-BWLWJ-AXBRW&referer=myapp"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import {
    lzzw,
    zwlx
  } from '../../../api/system/zd.js'
  import {
    getDepts,
    getDeptSuperior
  } from '@/api/system/dept'
  import {
    initData
  } from '@/api/data'
  import {
    addNew,
    edit
  } from '@/api/system/user'
  import {
    getAllJob
  } from '@/api/system/job'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    LOAD_CHILDREN_OPTIONS
  } from '@riophae/vue-treeselect'
  let userJobs = []
  export default {
    name: 'renyuan',
    components: {
      Treeselect
    },
    dicts: ['sjlx', 'qjlx','gzlx'],

    data() {
      var checkdept = (rule, value, callback) => {
        if (!value.id) {
          callback(new Error('请选择所属机构'));
        } else {
          callback();
        }
      };
      return {
        disabled:false,
        dialogTableVisible: false,
        depts: [],
        jobs: [],
        form: {
          username: null,
          nickName: null,
          password: null,
          jobs: [],
          dept: {
            id: null
          },
          phone: null,
          lon: null,
          lat: null,
          sfz: null,
          workArea: null,
          address: null,
          roles: [{
            id: 4
          }]
        },
        latlng: '',
        jobDatas: [],
        lzzw: [],
        zwlx: [],
        zrq:[],
        rules: {
          nickName: [{
              required: true,
              message: '请输入姓名',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur'
            }
          ],
          workNo: [{
            required: true,
            message: '请输入工号',
            trigger: 'blur'
          }],
          xzzw: [{
            required: true,
            message: '请输入行政部门',
            trigger: 'blur'
          }],
          phone: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              min: 11,
              max: 11,
              message: '请输入正确手机号',
              trigger: 'blur'
            }
          ],
          // password: [{
          //     required: true,
          //     message: '请输入密码',
          //     trigger: 'blur'
          //   },
          //   {
          //     min: 6,
          //     message: '不得少于 6 位字符',
          //     trigger: 'blur'
          //   }
          // ],
          // dept: [{
          //   required: true,
          //   validator: checkdept,
          //   trigger: 'blur'
          // }],
          areaId: [{
            required: true,
            message: '请选择责任区',
            trigger: 'change'
          }],
         lzzw: [{
           required: true,
           message: '请选择林长职务',
           trigger: 'change'
         }],
         zwlx: [{
           required: true,
           message: '请选择职务类型',
           trigger: 'change'
         }],
         gzlx: [{
           required: true,
           message: '请选择工作类型',
           trigger: 'change'
         }],
          workArea: [{
            required: true,
            message: '请填写巡护区域',
            trigger: 'blur'
          }],
          lon: [{
            required: true,
            message: '请选择经纬度',
            trigger: 'blur'
          }],
        }
      }
    },
    mounted() {
      let data = {
        username: null,
        nickName: null,
        password: null,
        jobs: [],
        dept: {
          id: null
        },
        phone: null,
        lon: null,
        lat: null,
        sfz: null,
        workArea: null,
        address: null,
        roles: [{
          id: 4
        }]
      }
      this.form = this.$route.params.id ? this.$route.params : data
      this.disabled = this.$route.params.isView==1?true:false
      if (this.$route.params.id) {
        this.getSupDepts(this.$route.params.dept.id)
        userJobs = []
        this.jobDatas = []
        let that = this
        this.rules.password = null
        this.form.jobs.forEach(function(job, index) {
          const data = {
            id: job.id
          }
          that.jobDatas.push(job.id)
          userJobs.push(data)
        })
      } else {
        this.getDepts()
      }
      this.latlng = this.$route.params.id ? this.$route.params.lat + '，' + this.$route.params.lon : null
      this.mapListener()
      this.getJobs()
      this.lzZw()
      this.zwLx()
      this.initData()
    },
    methods: {
      initData() {
        initData('api/area',{size:1000}).then(res => {
          this.zrq = res.content
        })
      },
      lzZw() {
        lzzw().then(res => {
          this.lzzw = res.content
        })
      },
      zwLx() {
        zwlx().then(res => {
          this.zwlx = res.content
        })
      },
      getSupDepts(deptId) {
        getDeptSuperior(deptId).then(res => {
          const date = res.content
          this.buildDepts(date)
          this.depts = date
        })
      },
      buildDepts(depts) {
        depts.forEach(data => {
          if (data.children) {
            this.buildDepts(data.children)
          }
          if (data.hasChildren && !data.children) {
            data.children = null
          }
        })
      },
      changeJob(value) {
        let that = this
        userJobs = []
        this.form.jobs = []
        value.forEach(function(data, index) {
          const job = {
            id: data
          }
          userJobs.push(job)
          that.form.jobs.push(job)
        })
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
      // 获取弹窗内岗位数据
      getJobs() {
        getAllJob(0).then(res => {
          this.jobs = res.content
        }).catch(() => {})
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.username = this.form.phone
            this.form.roles = [{
              id: 4
            }]
            this.form.jobs = userJobs
            if (this.form.id) {
              edit(this.form).then(res => {
                this.$message.success('修改成功');
                this.$router.go(-1); //返回上一层
              })
            } else {
              addNew(this.form).then(res => {
                this.$message.success('添加成功');
                this.$router.go(-1); //返回上一层
              })
            }

          } else {
            return false;
          }
        });
      },
      opanAddress() {
        this.dialogTableVisible = true
      },
      mapListener() {
        let that = this
        window.addEventListener('message', function(event) {
          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          let mapData = event.data;
          if (mapData && mapData.module == 'locationPicker') {
            that.form.workArea = mapData.poiname
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
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;

    .itemwid {
      width: 300px;
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
</style>
