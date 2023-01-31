<template>
  <div>
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>责任区管理</h4>
      <crudOperation :permission="permission" />
    </el-row>

    <div class="app-container">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead" v-if="crud.props.searchToggle">
        <el-col :span='10' class="titleCol">
          <div class="ssjg">
            <span>责任区</span>
            <el-input v-model="query.blurry" placeholder="请输入内容"></el-input>
          </div>
          <div class="ssjg">
            <span>上级责任区</span>
            <el-select v-model="query.fid" filterable placeholder="请选择责任区" class="itemwid">
              <el-option v-for="item in zrq" :key="item.areaId" :label="item.title" :value="item.areaId" />
            </el-select>
          </div>
        </el-col>
        <el-col :span='3'>
          <rrOperation />
        </el-col>
      </el-row>
      <!--工具栏-->
      <div class="head-container">
        <el-dialog :close-on-click-modal="false" top="5vh" :visible.sync="showMask" :title="crud.status.title"
          width="70%">
          <el-form ref="formView" :model="formView" :rules="rules" size="small" label-width="180px">
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="责任区：">
                  <el-input v-model="formView.title" style="width: 100%;" disabled />
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="灌木林地：">
                  <el-input v-model="formView.gmld" style="width: 100%;" disabled><template slot="append">公顷</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="上级责任区：">
                  <el-select v-model="formView.fid" placeholder="请选择责任区" class="itemwid" style="width: 100%;" disabled>
                    <el-option v-for="item in zrq" :key="item.areaId" :label="item.title" :value="item.areaId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="未成林地：">
                  <el-input v-model="formView.wcld" style="width: 100%;" placeholder="请输入" disabled><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="国土总面积：">
                  <el-input v-model="formView.gtzmj" style="width: 100%;" placeholder="请输入" disabled><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="苗圃地：">
                  <el-input v-model="formView.mpd" style="width: 100%;" placeholder="请输入" disabled><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="林地总面积：">
                  <el-input v-model="formView.ldzmj" style="width: 100%;" placeholder="请输入" disabled><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="无林木林地：">
                  <el-input v-model="formView.wlmld" style="width: 100%;" placeholder="请输入" disabled><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="有林地：">
                  <el-input v-model="formView.yld" style="width: 100%;" placeholder="请输入" disabled><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="辅助生产林地：">
                  <el-input v-model="formView.fzscld" style="width: 100%;" placeholder="请输入" disabled><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="森林覆盖率：">
                  <el-input v-model="formView.slfgl" style="width: 100%;" placeholder="请输入" disabled><template
                      slot="append">%</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="绿化率：">
                  <el-input v-model="formView.lhl" style="width: 100%;" placeholder="请输入" disabled><template
                      slot="append">%</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="图片">
                  <el-image v-if="formView.img" :src="formView.img"
                    style="width: 148px;height: 148px;margin-right: 8px;border-radius: 4px;"
                    :preview-src-list="formView.img.split(',')">
                  </el-image>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <!-- <el-col :span='10'>
                <el-form-item label="详情">
                  <el-input type="textarea" :rows="7" style="width: 100%;" placeholder="请输入内容" v-model="form.points" disabled>
                  </el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span='10'>
                <el-form-item label="状态">
                  <el-radio-group v-model="formView.status" disabled>
                    <el-radio v-for="item in dict.status" :key="item.label" :label="item.value">{{item.label}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-form-item label="详情">
                <div class="info" v-html="formView.content"></div>
              </el-form-item>
            </el-row>
            <!-- <el-form-item label="父级ID">
              未设置字典，请手动设置 Select
            </el-form-item> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button type="text" @click="crud.cancelCU">取消</el-button> -->
            <el-button type="primary" @click="showMask=false">确认</el-button>
          </div>
        </el-dialog>
        <!--表单组件-->
        <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
          :title="crud.status.title" width="70%">
          <el-form ref="form" :model="form" :rules="rules" size="small" label-width="180px">
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="责任区：" prop="title">
                  <el-input v-model="form.title" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="灌木林地：" prop="gmld">
                  <el-input v-model="form.gmld" style="width: 100%;"><template slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="上级责任区：">
                  <el-select v-model="form.fid" filterable placeholder="不填默认为首级" class="itemwid" style="width: 100%;">
                    <el-option :key="0" label="无" :value="0" />
                    <el-option v-for="item in zrq" :key="item.areaId" :label="item.title" :value="item.areaId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="未成林地：" prop="wcld">
                  <el-input v-model="form.wcld" style="width: 100%;" placeholder="请输入"><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="国土总面积：" prop="gtzmj">
                  <el-input v-model="form.gtzmj" style="width: 100%;" placeholder="请输入"><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="苗圃地：" prop="mpd">
                  <el-input v-model="form.mpd" style="width: 100%;" placeholder="请输入"><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="林地总面积：" prop="ldzmj">
                  <el-input v-model="form.ldzmj" style="width: 100%;" placeholder="请输入"><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="无林木林地：" prop="wlmld">
                  <el-input v-model="form.wlmld" style="width: 100%;" placeholder="请输入"><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="有林地：" prop="yld">
                  <el-input v-model="form.yld" style="width: 100%;" placeholder="请输入"><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="辅助生产林地：" prop="fzscld">
                  <el-input v-model="form.fzscld" style="width: 100%;" placeholder="请输入"><template
                      slot="append">公顷</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="森林覆盖率：" prop="slfgl">
                  <el-input v-model="form.slfgl" maxlength="5" style="width: 100%;" placeholder="请输入"><template
                      slot="append">%</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='10'>
                <el-form-item label="绿化率：" prop="lhl">
                  <el-input v-model="form.lhl" maxlength="5" style="width: 100%;" placeholder="请输入"><template
                      slot="append">%</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter='20'>
              <el-col :span='10'>
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio v-for="item in dict.status" :key="item.label" :label="item.value">{{item.label}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
          @selection-change="crud.selectionChangeHandler">
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column type="index" label="#"/>
          <el-table-column prop="title" label="责任区" />
          <el-table-column prop="fid" label="上级责任区">
            <template slot-scope="scope">
              <span v-for="item in zrq" v-if="scope.row.fid==item.areaId">{{item.title}}</span>
              <span v-if="scope.row.fid==0">无</span>
            </template>
          </el-table-column>
          <el-table-column prop="gtzmj" label="国土总面积" />
          <el-table-column prop="ldzmj" label="林地总面积" />
          <el-table-column prop="yld" label="有林地" />
          <el-table-column prop="gmld" label="灌木林地" />
          <el-table-column prop="wcld" label="未成林地" />
          <el-table-column prop="mpd" label="苗圃地" />
          <el-table-column prop="wlmld" label="无林木林地" />
          <el-table-column prop="fzscld" label="辅助生产林地" />
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span v-for="item in dict.status" v-if="scope.row.status==item.value">{{item.label}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="createTime" label="createTime" /> -->
          <el-table-column v-if="checkPer(['admin','appArea:edit','appArea:del'])" label="操作" width="150px"
            align="center">
            <template slot-scope="scope">
              <div style="display: flex;align-items: center;">
                <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);font-size: 20px;"
                  @click="open(scope.row)"></i>
                <udOperation :data="scope.row" :show='1' :permission="permission">
                  <template slot="caozuo2">
                    <el-dropdown-item @click.native='openMap(scope.row)'><img src="@/assets/icons/dt.png" alt="">
                     </el-dropdown-item>
                    <el-dropdown-item @click.native='openFwb(scope.row)'><img src="@/assets/icons/fwb.png" alt="">
                     </el-dropdown-item>
                  </template>
                </udOperation>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;color: rgba(42, 130, 228, 1);font-size: 16px;">面积单位（公顷）</div>
        <!--分页组件-->
        <pagination />
      </div>
    </div>
    <el-dialog :close-on-click-modal="false"  :before-close="close" title="富文本编辑器" width="50%" :visible.sync="dialogFormVisible2">
      <editor ref="editor" :content='formView.content' v-if="dialogFormVisible2"></editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="上传地图" :close-on-click-modal="false" :before-close="close" width="30%" top="2vh" :visible.sync="dialogMap">
      <el-upload v-if="dialogMap" :show-file-list='false' :action="imagesUploadApi" :headers="headers"
        :on-success='handleSuccess'>
        <el-button size="small" plain icon="el-icon-upload2" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">格式为：.jpg .png</div>
      </el-upload>
      <img :src="mapUrl" alt="" style="width: 100%;">
      <p>点位json:</p>
      <el-input type="textarea" :rows="7" style="width: 100%;" placeholder="点位json" v-model="formView.points">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="onSubmitMap">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    initData
  } from '@/api/data'
  import Editor from '../../components/Editor.vue'
  import {
    mapGetters
  } from 'vuex'
  import crudAppArea from '@/api/appArea'
  import {
    getToken
  } from '@/utils/auth'
  import CRUD, {
    presenter,
    header,
    form,
    crud
  } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  const defaultForm = {
    areaId: null,
    title: null,
    fid: null,
    gtzmj: null,
    ldzmj: null,
    yld: null,
    gmld: null,
    wcld: null,
    mpd: null,
    wlmld: null,
    fzscld: null,
    slfgl: null,
    lhl: null,
    img: null,
    points: null,
    content: null,
    status: null,
    createTime: null,
    updateTime: null
  }
  export default {
    name: 'AppArea',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      editor: Editor
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['status'],
    mounted() {
      this.zrqF()
    },
    cruds() {
      return CRUD({
        title: '责任区',
        url: 'api/area',
        idField: 'areaId',
        sort: 'areaId,desc',
        crudMethod: {
          ...crudAppArea
        },
        optShow: {
          add: true,
          edit: false,
          del: false,
          reset: true
        }
      })
    },
    computed: {
      ...mapGetters([
        'imagesUploadApi'
      ])
    },
    watch:{
      'crud.loading':{
        handler(oldN,newN){
          this.zrqF()
        }
      }
    },
    data() {
      return {
        dialogMap: false,
        mapUrl: '',
        zrq: [],
        formView: {},
        dialogFormVisible2: false,
        headers: {
          'Authorization': getToken()
        },
        dialogImageUrl: '',
        dialogVisible: false,
        showMask: false,
        permission: {
          add: ['admin', 'appArea:add'],
          edit: ['admin', 'appArea:edit'],
          del: ['admin', 'appArea:del']
        },
        rules: {
          title: [{
            required: true,
            message: '责任区不能为空',
            trigger: 'blur'
          }],
          gmld: [{
            required: true,
            message: '灌木林地不能为空',
            trigger: 'blur'
          }],
          wcld: [{
            required: true,
            message: '未成林地不能为空',
            trigger: 'blur'
          }],
          gtzmj: [{
            required: true,
            message: '国土总面积不能为空',
            trigger: 'blur'
          }],
          mpd: [{
            required: true,
            message: '苗圃地不能为空',
            trigger: 'blur'
          }],
          ldzmj: [{
            required: true,
            message: '林地总面积不能为空',
            trigger: 'blur'
          }],
          wlmld: [{
            required: true,
            message: '无林木林地不能为空',
            trigger: 'blur'
          }],
          yld: [{
            required: true,
            message: '有林地不能为空',
            trigger: 'blur'
          }],
          fzscld: [{
            required: true,
            message: '辅助生产林地不能为空',
            trigger: 'blur'
          }],
          slfgl: [{
            required: true,
            message: '森林覆盖率不能为空',
            trigger: 'blur'
          }],
          lhl: [{
            required: true,
            message: '绿化率不能为空',
            trigger: 'blur'
          }],
          status: [{
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }],
        }
      }
    },

    methods: {
      zrqF(){
        initData('api/area',{size:1000}).then(res => {
          this.zrq = res.content
        })
      },
      close() {
        this.formView = {}
        this.dialogMap = false
        this.dialogFormVisible2 = false
      },
      openFwb(form) {
        this.formView = form
        this.dialogFormVisible2 = true
      },
      openMap(form) {
        this.formView = form
        this.mapUrl = this.formView.img
        this.dialogMap = true
      },
      onSubmit() {
        this.formView.content = this.$refs.editor.editorContent
        crudAppArea.edit(this.formView).then(res => {
          this.$message.success('编辑成功');
          this.dialogFormVisible2 = false
        })
      },
      onSubmitMap() {
        this.formView.img = this.mapUrl
        crudAppArea.edit(this.formView).then(res => {
          this.$message.success('编辑成功');
          this.dialogMap = false
        })
      },
      handleSuccess(response, file, fileList) {
        this.mapUrl = response.path
        console.log(response, file, fileList);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        console.log(this.dialogImageUrl);
        this.dialogVisible = true;
      },
      open(form) {
        if (form.status != undefined) {
          form.status += ''
        }
        this.formView = form
        this.showMask = true
      },
      // 钩子：在获取表格数据之前执行，false 则代表不获取数据
      [CRUD.HOOK.beforeRefresh]() {
        return true
      }
    }
  }
</script>

<style scoped lang="scss">
  .fromHead {
    padding-bottom: 18px;
  }

  .info {
    width: 82%;
    padding: 10px;
    background-color: #F5F7FA;
    border-radius: 4px;
  }

  .imgBox {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
  }

  .w-e-up-btn {
    display: inline-block;
    color: #999;
    cursor: pointer;
    font-size: 60px;
    line-height: 1;
  }

  .title {
    margin: 20px 20px 0;
    height: 53px;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 20px;

    h4 {
      margin: 0;
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
</style>
