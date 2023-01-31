<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>事件管理</h4>
    </el-row>
    <div class="fromList">
      <el-row type='flex' align='middle' justify='space-between' class="fromHead">
        <el-col :span='18' class="titleCol">
          <div class="ssjg">
            <span>任务类型</span>
            <el-select v-model="rwlxvalue" placeholder="请选择">
              <el-option v-for="item in dict.sjlx" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="name">
            <span>任务名称</span>
            <el-input v-model="inputName" placeholder="请输入内容"></el-input>
          </div>
          <div class="name">
            <span>选择时间</span>
            <date-range-picker v-model="value1" style="width: 230px;" />
          </div>
          <div class="ssjg">
            <span>状态</span>
            <el-select v-model="event_status" placeholder="请选择">
              <el-option v-for="item in dict.event_status" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
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
          <el-table-column prop="title" label="任务名称" align='center'>
          </el-table-column>
          <el-table-column align='center' prop="rwlx" label="任务类型" width="180">
            <template slot-scope="scope">
              <el-tag effect="dark" :color="cColor['rwlx'+scope.row.type]" v-for="item in dict.sjlx" v-if="scope.row.type==item.value">
                {{item.label}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" width='250' align='center'>
          </el-table-column>
          <el-table-column prop="createTime" label="上报时间" align='center'>
            <template v-slot="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="180" align='center'>
            <template slot-scope="scope">
              <span v-for="item in dict.event_status" :style="{color:cColor['sjzt'+scope.row.status]}" v-if="scope.row.status==item.value">{{item.label}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="描述" width='400' align='center'>
          </el-table-column>

          <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
              <el-button v-if="scope.row.status!=2" type="primary" size="mini" @click="openForm2(scope.row)">立即处理
              </el-button>
              <el-button v-else type="success" @click="openForm(scope.row)" size="mini">查看详情</el-button>
              <!-- <el-button type="primary">详情</el-button> -->
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
    <el-dialog title="任务详情" :visible.sync="dialogFormVisible" top="2vh">
      <map-container v-if="dialogFormVisible" :data="[{lon:form.lon,lat:form.lat}]"></map-container>
      <el-form :model="form">
        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label="">
              <div style="display: flex;align-items: center;">
                <img style="margin-right: 10px;" src="@/assets/images/icon_ad.png" alt=""><span>{{form.address}}</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="">
              <div style="display: flex;align-items: center;">
                <img style="margin-right: 10px;" src="@/assets/images/icon_jwd.png" alt=""><span>经度 {{form.lon}} 纬度
                  {{form.lat}}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label="">
              <div style="display: flex;align-items: center;">
                <img style="margin-right: 10px;" src="@/assets/images/icon_time.png"
                  alt=""><span>上报时间：{{form.createTime}}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label="上报人">
              <div>{{form.nickName}}（工号：{{form.workNo}}）</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='16'>
            <el-form-item label="文字描述">
              <span>{{form.note}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="语音描述：">
              <div class="yuyin" v-if="form.voice" @click="bofan(form.voice)">
                <img src="@/assets/images/icon_yuyin.png" alt=""><span>播放</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='24'>
            <el-form-item label="图片详情">
              <div class="imgBox">
                <el-image style="width: 100px; height: 100px;margin: 4px;" v-for="(item,index) in form.imgs"
                  :key="index" :src="item" :preview-src-list="form.imgs">
                </el-image>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="form.reply">
          <el-row :gutter='20'>
            <el-col :span='24'>
              <el-form-item label="处理结果">
                <span v-for="item in dict.event_status" v-if="form.reply.status==item.value">{{item.label}}</span>
				<span v-if="form.actWay==1">（无需处理）</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter='20'>
            <el-col :span='24'>
              <el-form-item label="处理时间">
                {{form.reply.createTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter='20'>
            <el-col :span='24'>
              <el-form-item label="处理人">
                {{form.reply.nickName}}（工号：{{form.reply.workNo}}）
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter='20' v-if="form.actWay!=1">
            <el-col :span='16'>
              <el-form-item label="文字描述">
                {{form.reply.note}}
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label="语音描述：">
                <div class="yuyin" v-if="form.reply.voice" @click="bofan(form.reply.voice)">
                  <img src="@/assets/images/icon_yuyin.png" alt=""><span>播放</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter='20' v-if="form.actWay!=1">
            <el-col :span='24'>
              <el-form-item label="照片详情">
                <div class="imgBox">
                  <el-image style="width: 100px; height: 100px;margin: 4px;" v-for="(item,index) in form.reply.imgs"
                    :key="index" :src="item" :preview-src-list="form.reply.imgs">
                  </el-image>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeMan2()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="事件处理" :visible.sync="dialogFormVisible2" top="2vh" @close='clearDialog()'>
      <map-container v-if="dialogFormVisible2" :data="[{lon:form.lon,lat:form.lat}]"></map-container>
      <el-form :model="form">
        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label="">
              <div style="display: flex;align-items: center;">
                <img style="margin-right: 10px;" src="@/assets/images/icon_ad.png" alt=""><span>{{form.address}}</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="">
              <div style="display: flex;align-items: center;">
                <img style="margin-right: 10px;" src="@/assets/images/icon_jwd.png" alt=""><span>经度 {{form.lon}} 纬度
                  {{form.lat}}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label="">
              <div style="display: flex;align-items: center;">
                <img style="margin-right: 10px;" src="@/assets/images/icon_time.png"
                  alt=""><span>上报时间：{{form.createTime}}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label="上报人">
              <div>{{form.nickName}}（工号：{{form.workNo}}）</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='16'>
            <el-form-item label="文字描述">
              <span>{{form.note}}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="语音描述：">
              <div class="yuyin" v-if="form.voice" @click="bofan(form.voice)">
                <img src="@/assets/images/icon_yuyin.png" alt=""><span>播放</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='24'>
            <el-form-item label="图片详情">
              <div class="imgBox">
                <el-image style="width: 100px; height: 100px;margin: 4px;" v-for="(item,index) in form.imgs"
                  :key="index" :src="item" :preview-src-list="form.imgs">
                </el-image>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20'>
          <el-col :span='24'>
            <el-form-item label="处理方式">
              <el-radio-group v-model="replyform.actWay">
                <el-radio :label="1">无需处理</el-radio>
                <el-radio :label="2">立即处理</el-radio>
                <el-radio :label="3">分配处理人</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20' v-if="replyform.actWay==2">
          <el-col :span='24'>
            <el-form-item label="描述">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="replyform.note">
              </el-input>
              <div class="upImg">
                <!-- <img style="width: 148px;height: 148px;border-radius: 8px;margin: 0 4px;" v-for="img in replyform.imgs" :src="img" alt=""> -->
                <el-upload :action="imagesUploadApi" :headers="headers" list-type="picture-card"
                  :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success='handleSuccess'>
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="viewImg" alt="">
                </el-dialog>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='20' v-if="replyform.actWay==3">
          <el-col :span='24'>
            <el-form-item label="分配处理人">
              <div class="manList">
                <div class="manItem" v-if="userlist">
                  <img :src="userlist.img" alt="">
                  <span style="font-size: 12px;">{{userlist.label}}</span>
                </div>
                <div class="manItem" @click="checkMan">
                  <img style="cursor: pointer;" src="@/assets/images/fpry.png" alt="">
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sub">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配人员" :visible.sync="dialogFormVisible3">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree class="filter-tree" :data="data" :props="defaultProps" :filter-node-method="filterNode" ref="tree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="closeMan">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import MapContainer from '@/components/MapContainer/MapContainer'
  import cColor from '@/assets/styles/commonColor.scss'
  import {
    mapGetters
  } from 'vuex'
  import {
    getToken
  } from '@/utils/auth'
  import {
    initData
  } from '@/api/data'
  import shijian from '@/api/member/shijian'
  import DateRangePicker from '@/components/DateRangePicker'
  export default {
    name: 'renwu',
    components: {
      DateRangePicker,
      MapContainer
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
      return {
        datalist: [{
            lon: 116.478346,
            lat: 39.997361
          }
        ],
        userlist: '',
        filterText: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogVisible: false,
        viewImg: '',
        radio: 0,
        loading: false,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        form: {},
        replyform: {actWay:1},
        value1: '',
        rwlxvalue: '',
        value2: '',
        inputName: '',
        headers: {
          'Authorization': getToken()
        },
        tableFrom: {
          page: 1,
          limit: 10
        },
        tableData: [],
        totalElements: 1,
        event_status: '',
      }
    },
    dicts: ['sjlx', 'jjcd', 'event_status', 'xhpcdw'],
    computed: {
      ...mapGetters([
        'imagesUploadApi'
      ]),
      cColor() {
        return cColor
      }
    },
    mounted() {
      if(this.$route.params.eventId){
        console.log(this.$route.params,99);
        this.openForm2(this.$route.params)
      }
      initData('api/area/list',{fid:1}).then(res => {
        this.data = res
      })
      this.initData()
    },
    methods: {
      clearDialog() {
        this.userlist = ''
        this.replyform = {actWay:1}
      },
      sub() {
        if (this.replyform.actWay == 2) {
          if (!this.replyform.note) {
            return this.$message({
              message: '请填写描述'
            })
          }
        }
        if (this.replyform.actWay == 3) {
          if (!this.replyform.toUserId) {
            return this.$message({
              message: '请选择处理人'
            })
          }
        }
        this.replyform.eventId = this.form.eventId
        shijian.edit(this.replyform).then(res => {
          this.dialogFormVisible2 = false
          this.initData()
          this.$message({
            message: '处理成功',
            type: 'success'
          })
        })
      },
      closeMan() {
        this.dialogFormVisible3 = false
        this.userlist = this.$refs.tree.getCurrentNode()
        this.replyform.toUserId = this.userlist.id
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      checkMan() {
        this.dialogFormVisible3 = true
      },
      bofan(url) {
        let audio = new Audio()
        audio.src = url
        audio.play()
        console.log('播放');
      },
      handleSuccess(response, file, fileList) {
        let img = []
        fileList.forEach(item => {
          img.push(item.response.path)
        })
        this.replyform.imgs = img.join(',')
        console.log(response, file, fileList);
      },
      handleRemove(file, fileList) {
        let img = []
        fileList.forEach(item => {
          img.push(item.response.path)
        })
        this.replyform.imgs = img.join(',')
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.viewImg = file.url;
        this.dialogVisible = true;
      },
      openForm(form) {
        console.log(form);
        this.form = {
          ...form
        }
        this.form.imgs = this.form.imgs ? this.form.imgs.split(',') : ''
        if (this.form.reply) {
          if (!Array.isArray(this.form.reply.imgs)) {
            this.form.reply.imgs = this.form.reply.imgs ? this.form.reply.imgs.split(',') : ''
          }
        }

        this.dialogFormVisible = true
      },
      closeMan2() {
        this.dialogFormVisible = false
        this.form = {}
      },
      openForm2(form) {
        this.form = {
          ...form
        }
        this.form.imgs = this.form.imgs ? this.form.imgs.split(',') : ''
        this.dialogFormVisible2 = true
      },
      clear() {
        this.rwlxvalue = ''
        this.value1 = ''
        this.inputName = ''
        this.event_status = ''
        this.initData()
      },
      search() {
        this.initData()
      },
      initData() {
        this.loading = true
        initData('api/appEvent', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          createTime: this.value1,
          blurry: this.inputName,
          type: this.rwlxvalue,
          status: this.event_status
        }).then(res => {
          console.log(res);
          this.loading = false
          this.tableData = res.list
          this.totalElements = res.totalElements
        })
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

<style rel="stylesheet/scss" lang="scss" scoped>
  .upImg {
    margin-top: 20px;
  }

  .el-upload--picture-card {
    width: 100px;
    height: 100px;
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

  .imgBox {
    img {
      width: 80px;
      height: 80px;
      border-radius: 16px;
    }
  }

  .yuyin {
    user-select: none;
    cursor: pointer;
    background: rgba(42, 130, 228, 1);
    border-radius: 8px;
    width: 66px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #fff;
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
