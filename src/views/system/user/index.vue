<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="deptName"
            clearable
            size="small"
            placeholder="输入部门名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getDeptDatas"
          />
        </div>
        <el-tree
          :data="deptDatas"
          :load="getDeptDatas"
          :props="defaultProps"
          :expand-on-click-node="false"
          lazy
          @node-click="handleNodeClick"
        />
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入名称或者邮箱搜索"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <date-range-picker v-model="query.createTime" class="date-item" />
            <el-select
              v-model="query.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <rrOperation />
            <!-- <el-button style="float: right;" type="primary" icon="el-icon-circle-plus-outline" @click="open(1)">注册账号</el-button> -->
          </div>
          <crudOperation show="" :permission="permission" />
        </div>
        <!--表单渲染-->
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
          <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
            <el-form-item label="绑定手机号" prop="phone">
              <el-input v-model.number="form.phone" placeholder="请输入手机号" style="width: 80%;" :disabled='form.id && form.bind!=1'/><el-button v-if="crud.status.add==1" style="width: 20%;" type="primary" @click='crud.bind'>绑定</el-button>
            </el-form-item>
           <el-form-item label="用户名">
             <el-input v-model="form.nickName" @keydown.native="keydown($event)" disabled/>
           </el-form-item>
           <el-form-item label="责任区">
             <el-select v-model="form.areaId" style="width: 100%;" filterable disabled>
               <el-option v-for="item in zrq" :key="item.areaId" :label="item.title" :value="item.areaId" />
             </el-select>
           </el-form-item>
           <el-form-item label="林长职务">
             <el-select v-model="form.lzzw" style="width: 100%;" disabled >
               <el-option v-for="item in dict.lzzw" :key="item.label" :label="item.label" :value="item.value" />
             </el-select>
           </el-form-item>
           <el-form-item label="职务类型">
             <el-select v-model="form.zwlx" style="width: 100%;" disabled>
               <el-option v-for="(item,index) in dict.zwlx" :key="item.label" :label="item.label" :value="item.value">
               </el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="登录账号">
             <el-input v-model="form.username" disabled></el-input>
           </el-form-item>
           <el-form-item label="密码" prop="password" v-if="crud.status.add==1">
             <el-input v-model="form.password" show-password placeholder="请输入密码"></el-input>
           </el-form-item>
            <!-- <el-form-item label="部门" prop="dept.id">
              <treeselect
                v-model="form.dept.id"
                :options="depts"
                :load-options="loadDepts"
                style="width: 178px"
                placeholder="选择部门"
              />
            </el-form-item> -->
            <!-- <el-form-item label="岗位" prop="jobs">
              <el-select
                v-model="jobDatas"
                style="width: 178px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeJob"
              >
                <el-option
                  v-for="item in jobs"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->

            <el-form-item label="状态">
              <el-radio-group v-model="form.enabled" :disabled="form.id === user.id">
                <el-radio
                  v-for="item in dict.user_status"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
              <el-select
                v-model="roleDatas"
                style="width: 437px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeRole"
              >
                <el-option
                  v-for="item in roles"
                  :key="item.name"
                  :disabled="level !== 1 && item.level <= level"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column :selectable="checkboxT" type="selection" width="55" />
          <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
          <el-table-column :show-overflow-tooltip="true" prop="nickName" label="昵称" />
          <el-table-column prop="gender" label="性别" />
          <el-table-column :show-overflow-tooltip="true" prop="phone" label="电话" />
          <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" />
          <el-table-column :show-overflow-tooltip="true" prop="dept" label="部门">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                :disabled="user.id === scope.row.id"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" />
          <el-table-column
            v-if="checkPer(['admin','user:edit','user:del'])"
            label="操作"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
                :disabled-dle="scope.row.id === user.id"
              >
                <template slot="caozuo">
                  <img style="cursor: pointer;" src="@/assets/icons/mima.png" alt="" @click="clearPwd">
                </template>
              </udOperation>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
    initData
  } from '@/api/data'
import crudUser from '@/api/system/user'
import { isvalidPhone } from '@/utils/validate'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import { getAll, getLevel } from '@/api/system/role'
import { getAllJob } from '@/api/system/job'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
let userRoles = []
let userJobs = []
const defaultForm = { id: null, username: null, nickName: null,areaId:null,lzzw:null,zwlx:null,password:null,bind:null, gender: '男', email: null, enabled: 'true', roles: [], jobs: [], dept: { id: null }, phone: null }
export default {
  name: 'User',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  cruds() {
    return CRUD({ title: '用户', url: 'api/users', crudMethod: { ...crudUser }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['user_status','lzzw','zwlx'],
  // watch:{
  //     'crud.status.title'(){//深度监听，可监听到对象、数组的变化
  //       this.form = defaultForm
  //     }
  // },
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      zrq:[],
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '', depts: [], deptDatas: [], jobs: [], level: 3, roles: [],
      jobDatas: [], roleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        // email: [
        //   { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        //   { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        // ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.crud.msg.add = '绑定成功'
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
    this.initData()
  },
  methods: {
    bind(){
      if (!this.form.phone) {
        return this.$message('请输入手机号');
      } else if (!isvalidPhone(this.form.phone)) {
        return this.$message('请输入正确的11位手机号码');
      }
      let data = {
        phone : this.form.phone
      }
      crudUser.getOne(data).then(res=>{
        res.bind = 1
        res.enabled = res.enabled+''
        this.form = res
      })
    },
    initData() {
      initData('api/area',{size:1000}).then(res => {
        this.zrq = res.content
      })
    },
    clearPwd(){
      this.$confirm('是否确定重置该账号登录密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '重置成功！ 默认密码123456'
        });
      })
    },
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false
      }
    },
    changeRole(value) {
      userRoles = []
      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
    },
    changeJob(value) {
      userJobs = []
      value.forEach(function(data, index) {
        const job = { id: data }
        userJobs.push(job)
      })
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getRoles()
      if (form.id == null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.dept.id)
      }
      this.getRoleLevel()
      this.getJobs()
      form.enabled = form.enabled.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.jobDatas = []
      this.roleDatas = []
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.getJobs(this.form.dept.id)
      this.jobDatas = []
      this.roleDatas = []
      userRoles = []
      userJobs = []
      const _this = this
      form.roles.forEach(function(role, index) {
        _this.roleDatas.push(role.id)
        const rol = { id: role.id }
        userRoles.push(rol)
      })
      form.jobs.forEach(function(job, index) {
        _this.jobDatas.push(job.id)
        const data = { id: job.id }
        userJobs.push(data)
      })
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (this.roleDatas.length === 0) {
        this.$message({
          message: '角色不能为空',
          type: 'warning'
        })
        return false
      }
      crud.form.roles = userRoles
      crud.form.jobs = userJobs
      return true
    },
    // 获取左侧部门数据
    getDeptDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getDepts(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.deptDatas = res.content
          }
        })
      }, 100)
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
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
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
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
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.crud.toQuery()
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudUser.edit(data).then(res => {
          this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll().then(res => {
        this.roles = res
      }).catch(() => { })
    },
    // 获取弹窗内岗位数据
    getJobs() {
      getAllJob().then(res => {
        this.jobs = res.content
      }).catch(() => { })
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(() => { })
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
