<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>标记点管理——{{this.$route.query.title}}</h4>
      <div class="">
        <el-button type="success" icon='el-icon-download'>批量导入</el-button>
        <el-button type="warning" icon='el-icon-upload2'>批量导出</el-button>
        <el-button type="primary" icon='el-icon-circle-plus-outline'  @click.stop="addBjd()">新增图标</el-button>
        <el-button type="primary" @click="$router.go(-1);">返回</el-button>
      </div>
    </el-row>
    <el-row>
      <div class="fromList">
        <el-row type='flex' align='middle' justify='space-between' class="fromHead">
          <el-col :span='12' class="titleCol">
            <div class="ssjg">
              <span>名称</span>
              <el-input v-model="inputName" placeholder="请输入内容"></el-input>
            </div>
            <div class="ssjg">
              <span>编号</span>
              <el-input v-model="codeno" placeholder="请输入内容"></el-input>
            </div>
            <div class="ssjg">
              <span>地址</span>
              <el-input v-model="address" placeholder="请输入内容"></el-input>
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
            <el-table-column prop="icon" label="图标" align='center'>
              <template v-slot="scope">
                <img style="width: 60px;height: 60px;border-radius: 10px;" :src="fimg" alt="">
              </template>
            </el-table-column>
            <el-table-column align='center' prop="title" label="名称">
            </el-table-column>
            <el-table-column align='center' prop="codeno" label="编号">
            </el-table-column>
            <el-table-column prop="address" label="地址" align='center'>
            </el-table-column>
            <el-table-column prop="lon" label="坐标" align='center'>
              <template v-slot="scope">
                <span>{{scope.row.lon+','+scope.row.lat}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align='center'>
              <template v-slot="scope">
                <div style="font-size: 20px;">
                  <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);" @click="addBjd(scope.row,1)"></i>
                  <i class="el-icon-edit" style="color: rgba(67, 207, 124, 1);margin: 0 20px;" @click="addBjd(scope.row)"></i>
				  <i class="el-icon-delete" style="color: rgba(220, 23, 27, 1);" @click="del(scope.row)"></i>
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
    </el-row>
    <el-dialog :title="'标记点管理——'+this.$route.query.title" :visible.sync="bjdMask" width="30%">
      <el-form :model="form" label-width="100px" :rules="rules" ref="myform">
        <el-form-item label="图标">
          <img style="width: 100px;height: 100px;border-radius: 10px;" :src="fimg" alt="">
        </el-form-item>
        <el-form-item label="所属类型">
          <el-input v-model="this.$route.query.title" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title" autocomplete="off" :disabled='showtype'></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="codeno">
          <el-input v-model="form.codeno" autocomplete="off" :disabled='showtype'></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" autocomplete="off" :disabled='showtype'></el-input>
        </el-form-item>
        <el-form-item label="坐标" prop="lon">
          <el-input v-model="form.lon+','+form.lat" autocomplete="off" style="width: 80%;" :disabled='showtype'></el-input>
          <el-button v-if="!showtype" type="primary" @click="opanAddress">定位</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bjdMask = false">取 消</el-button>
        <el-button v-if="!showtype" type="primary" @click="addSub">{{form.id?'修 改':'新 增'}}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="定位" :visible.sync="mapMask" top="3vh">
      <iframe id="mapPage" width="100%" height="800px" frameborder="0"
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=7BZBZ-VZO6J-47OFE-FRXSX-BWLWJ-AXBRW&referer=myapp"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import biaojidianItem from '@/api/resources/biaojidianItem'
  import {
    initData
  } from '@/api/data'
  import {
    mapGetters
  } from 'vuex'
  import { getToken } from '@/utils/auth'
  export default{
    data(){
      return{
        rules: {
          title:[{
            required: true,
            message: '请填写标题',
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
          codeno: [{
            required: true,
            message: '请填写编码',
            trigger: 'change'
          }]
        },
        showtype:false,
        inputName:'',
        codeno:'',
        address:'',
        fimg:'',
        mapMask:false,
        dialogImageUrl: '',
        dialogVisible: false,
        headers:{
          'Authorization': getToken()
        },
        loading:false,
        bjdMask:false,
        id:'',
        tableFrom: {
          page: 1,
          limit: 10
        },
        tableData:[],
        totalElements:1,
        form:{
          address:'',
          lat:'',
          lon:''
        },
      }
    },
    computed: {
      ...mapGetters([
        'imagesUploadApi'
      ])
    },
    mounted() {
      this.mapListener()
      this.id = this.$route.query.id
      this.fimg = this.$route.query.img
      this.initData()
    },
    methods:{
      addSub(){
        this.form.cateId = this.id
        this.$refs['myform'].validate((valid) => {
          if (valid) {
            biaojidianItem.add(this.form).then(res=>{
              this.bjdMask = false
              this.$message({
                message:this.form.id?'修改成功':'添加成功',
                type:'success'
              })
              this.initData()
            })
          }

        })
      },
      del(item){
		  this.$confirm('确定删除本条数据吗?', '提示', {
		    confirmButtonText: '确定',
		    cancelButtonText: '取消',
		    type: 'warning'
		  }).then(() => {
		  biaojidianItem.del([item.id]).then(res=>{
			this.$message({
			  message:'删除成功',
			  type:'success'
			})
			this.initData()
		  })
		  })
        
      },
      clear() {
        this.codeno = ''
        this.inputName = ''
        this.address = ''
        this.initData()
      },
      search() {
        this.initData()
      },
      opanAddress() {
        this.mapMask = true
      },
      handleSuccess(response, file, fileList){
        this.form.img = response.path
        console.log(response, file, fileList);
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
          }
          that.mapMask = false
        }, false);
      },
      addBjd(item,type){
        this.showtype = type==1?true:false
        this.form = item?{...item}:{
          address:'',
          lat:'',
          lon:''
        }
        this.bjdMask = true
      },
      initData() {
        this.loading = true
        initData('api/appWorkCoverPoint', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          blurry: this.inputName,
          cateId:this.id,
          codeno:this.codeno,
          address:this.address
        }).then(res => {
          console.log(res);
          this.loading = false
          this.tableData = res.content
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

<style lang="scss" scoped>
  .page {
    padding: 20px;

    .title {
      height: 55px;
      background-color: #fff;
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 20px;

      h4 {
        margin: 0;
      }
      .listType{
        font-size: 24px;
        margin-left: 40px;
      }
      .title_r{
        display: flex;
        align-items: center;
      }
    }
    .list{
      background-color: #fff;
      padding: 20px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .item{
        padding: 20px 30px;
        border-radius: 4px;
        margin: 0 34px 40px;
        box-shadow: 0 0 20px 4px rgba(0, 0, 0, .1);
        .item_head{
          display: flex;
          align-items: center;
          .svg{
            font-size: 72px;
            margin-right: 24px;
          }
          .head_r{
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            h4,p{
              margin: 0;
            }
            p{
              color: rgba(166, 166, 166, 1);
              font-size: 14px;
              span{
                color: rgba(56, 56, 56, 1);
                font-size: 30px;
              }
            }
          }
        }
        .item_cz{
          margin-top: 24px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-size: 24px;
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
    }

  }
</style>
