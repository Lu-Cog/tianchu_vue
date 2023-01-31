<template>
  <div class="page">
    <el-row type='flex' align='middle' justify='space-between' class="title">
      <h4>巡护标记点管理</h4>
      <div class="title_r">
        <el-upload
          class="upload-demo"
          action
          :on-change="handleChange"
          :show-file-list="false"
          :limit="1"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :auto-upload="false"
        >
          <el-button  type="success" icon='el-icon-download'>批量导入</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</div> -->
        </el-upload>
        <!-- <el-button type="success" icon='el-icon-download'>批量导入</el-button> -->
        <download-excel
              class = "export-excel-wrapper"
              :data = "tableData"
              :fields = "json_data"
              name = "标记点.xls">
              <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
              <el-button type="warning" icon='el-icon-upload2'>批量导出</el-button>
        </download-excel>
        <el-button type="primary" icon='el-icon-circle-plus-outline'  @click.stop="addItem()">新增图标</el-button>
        <div class="listType">
          <svg-icon @click="changeType(1)" :icon-class="listType==1?'icon_kapian':'icon_kapianS'" />
          <svg-icon @click="changeType(2)" :icon-class="listType==2?'icon_listS':'icon_list'" />
        </div>
      </div>
    </el-row>
    <el-row>
      <div class="list" v-if="listType==1"  v-loading='loading'>
        <div class="item" v-for="(item,index) in tableData" :key="item.id">
          <div class="item_head" @click="goRouter(item)">
            <img :src="item.img" alt="">
            <div class="head_r">
              <h4>{{item.title}}</h4>
              <p>已标记数量<span style="margin: 0 4px;">{{item.num}}</span>个</p>
            </div>
          </div>
          <div class="item_cz">
            <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);" @click="addItem(item,1)"></i>
            <i class="el-icon-edit" style="color: rgba(67, 207, 124, 1);" @click="addItem(item)"></i>
            <i @click='del(item)' class="el-icon-delete" style="color: rgba(220, 23, 27, 1);"></i>
          </div>
        </div>
        <div class="item" @click="addItem()">
          <div class="addItem">
            <img src="@/assets/images/add.png" alt="">
            <div class="head_r">
              新增图标
            </div>
          </div>
        </div>
      </div>
      <div class="fromList" v-else>
        <el-row type='flex' align='middle' justify='space-between' class="fromHead">
          <el-col :span='8' class="titleCol">
            <div class="ssjg">
              <span>名称</span>
              <el-input v-model="inputName" placeholder="请输入内容"></el-input>
            </div>
            <div class="ssjg">
              <span>编号</span>
              <el-input v-model="codeno" placeholder="请输入内容"></el-input>
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
          <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#FAFAFA'}"
            v-loading='loading' @row-click='rowClick'>
            <el-table-column type="index" label="#" align='center'>
            </el-table-column>
            <el-table-column prop="img" label="图标" align='center'>
              <template v-slot="scope">
                <img style="width: 50px;height: 50px;" :src="scope.row.img" alt="">
              </template>
            </el-table-column>
            <el-table-column align='center' prop="title" label="名称">
            </el-table-column>
            <el-table-column align='center' prop="codeno" label="编号">
            </el-table-column>
            <!-- <el-table-column prop="address" label="地址" align='center'>
            </el-table-column>
            <el-table-column prop="lon" label="坐标" align='center'>
              <template v-slot="scope">
                <span>{{scope.row.lon+','+scope.row.lat}}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" align='center'>
              <template v-slot="scope">
                <div style="font-size: 20px;">
                  <i class="el-icon-view" style="color: rgba(42, 130, 228, 1);" @click.stop="addItem(scope.row,1)"></i>
                  <i class="el-icon-edit" style="color: rgba(67, 207, 124, 1);margin: 0 20px;"
                    @click.stop="addItem(scope.row)"></i>
                  <i class="el-icon-delete" @click.stop='del(scope.row)' style="color: rgba(220, 23, 27, 1);"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pageClass">
            <!-- <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 30, 40]" :page-size="tableFrom.limit" :current-page="tableFrom.page"
              layout="total, sizes, prev, pager, next, jumper" :total="totalElements">
            </el-pagination> -->
          </div>
        </el-row>
      </div>
    </el-row>
    <el-dialog :title="showtype?form.title:form.id?'修改分类':'添加分类'" :visible.sync="addMask" width="35%">
      <el-form :model="form" label-width="100px" :rules="rules" ref="myform">
        <el-form-item label="图标上传" prop="img">
          <div style="display: flex;justify-content: space-between;align-items: center;width: 100%;flex-wrap: wrap;">
            <div>
              <MaterialList v-if="addMask" v-model="formImg" type="image" :num="1" :width="150" :height="150" />
              <p style="text-align: center;margin: 0;">亮图</p>
            </div>
            <div>
              <MaterialList v-if="addMask" v-model="formImg2" type="image" :num="1" :width="150" :height="150" />
              <p style="text-align: center;margin: 0;">灰图</p>
            </div>
            <div>
              <MaterialList v-if="addMask" v-model="formImg3" type="image" :num="1" :width="150" :height="150" />
              <p style="text-align: center;margin: 0;">标注图</p>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="标记点名称" prop="title">
          <el-input v-model="form.title" autocomplete="off" :disabled='showtype'></el-input>
        </el-form-item>
        <el-form-item label="标记点编码" prop="codeno">
          <el-input v-model="form.codeno" autocomplete="off" :disabled='showtype'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMask = false">取 消</el-button>
        <el-button v-if="!showtype" type="primary" @click="addSub">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import MaterialList from '@/components/material'
  import biaojidian from '@/api/resources/biaojidian'
  import {
    initData
  } from '@/api/data'
  import {
    mapGetters
  } from 'vuex'
  import {
    getToken
  } from '@/utils/auth'
  export default {
    components: {
      MaterialList
    },
    data() {
      var checkImg = (rule, value, callback) => {
        if (this.formImg.length<=0) {
          return callback(new Error('请上传所有图标'));
        }
        if (this.formImg2.length<=0) {
          return callback(new Error('请上传所有图标'));
        }
        if (this.formImg3.length<=0) {
          return callback(new Error('请上传所有图标'));
        }
        callback()
      };
      return {
        json_data:{
          "名称":"title",
          "编号":"codeno",
          "亮图":"img",
          "灰图":"img2",
          "标注图":"img3",
          "已标记数量":"num",
        },
        rules: {
          img: [{
            required: true,
            validator: checkImg,
            trigger: 'change'
          }],
          title: [{
            required: true,
            message: '请填写标题',
            trigger: 'change'
          }],
          codeno: [{
            required: true,
            message: '请填写编码',
            trigger: 'change'
          }]
        },
        formImg:[],
        formImg2:[],
        formImg3:[],
        fileTemp: "",
        file:"",
        showtype: false,
        loading: false,
        inputName: '',
        codeno: '',
        addMask: false,
        headers: {
          'Authorization': getToken()
        },
        tableFrom: {
          page: 1,
          limit: 1000
        },
        listType: 1,
        form: {
          img: '',
          img2: '',
          img3: '',
          title: '',
          code: ''
        },
        tableData: [],
        totalElements: 1,
      }
    },
    computed: {
      ...mapGetters([
        'imagesUploadApi'
      ])
    },
    mounted() {
      this.initData()
    },
    methods: {
      handleChange(file,fileList){
        // console.log(file)
        this.fileTemp = file.raw;
        if(this.fileTemp){
          // console.log(this.fileTemp.type)
          if(this.fileTemp.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            this.fileTemp.type == "application/vnd.ms-excel"){
            this.importfxx(this.fileTemp)
          }else{
            this.$message({
              type:"warning",
              message:"附件格式错误，请删除后重新上传!"
            });
          }
        }

      },
       importfxx(obj) {
        console.log(obj)
        let _this = this;
        // 通过DOM取文件数据
        this.file = obj;
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb; //读取完成的数据
          var outdata;
          var reader = new FileReader();
          reader.onload = function(e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            var XLSX = require("xlsx");
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), {
                //手动转化
                type: "base64"
              });
            } else {
              wb = XLSX.read(binary, {
                type: "binary"
              });
            }
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
            let arr = [];
            outdata.map(v => {
              let obj = {};
              obj.img = v["亮图"];
              obj.title = v["名称"];
              obj.codeno = v["编号"];
              obj.img2 = v["灰图"];
              obj.img3 = v["标注图"];
              obj.num = v["已标记数量"];
              arr.push(obj);
              _this.tableData.push(obj);
            });
            console.log(arr,'arr');
            return arr;
          };
          reader.readAsArrayBuffer(f);
        };

        if (rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
      },
      rowClick(row, column, event) {
        this.$router.push({
          path: '/biaojidian/item',
          query: {
            ...row
          }
        });
      },
      clear() {
        this.codeno = ''
        this.inputName = ''
        this.initData()
      },
      search() {
        this.initData()
      },
      handleSuccess(res, file, filelist) {
        this.form.img = res.path
      },
      initData() {
        this.loading = true
        initData('api/appWorkCover', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          blurry: this.inputName,
          codeno: this.codeno
        }).then(res => {
          console.log(res);
          this.loading = false
          this.tableData = res.content
          this.totalElements = res.totalElements
        })
      },
      addSub() {
        this.form.status = 1
        this.form.img = this.formImg.join(',')
        this.form.img2 = this.formImg2.join(',')
        this.form.img3 = this.formImg3.join(',')
        this.$refs['myform'].validate((valid) => {
          if (valid) {
            biaojidian.add(this.form).then(res => {
              this.addMask = false
              this.initData()
              if (this.form.id) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              }
            })
          }
        })

      },
      del(item) {
        this.$confirm('确定删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          biaojidian.del([item.id]).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.initData()
          })
        })

      },
      addItem(item, type) {
        this.showtype = type == 1 ? true : false
        if (item) {
          if (!Array.isArray(item.img)) {
            this.formImg = item.img ? item.img.split(',') : []
          }else{
            this.formImg = item.img
          }
          if (!Array.isArray(item.img2)) {
            this.formImg2 = item.img2 ? item.img2.split(',') : []
          }else{
            this.formImg2 = item.img2
          }
          if (!Array.isArray(item.img3)) {
            this.formImg3 = item.img3 ? item.img3.split(',') : []
          }else{
            this.formImg3 = item.img3
          }
          this.form = {
            ...item
          }


        } else {
          this.formImg = []
          this.formImg2 = []
          this.formImg3 = []
          this.form = {
            img: '',
            img2: '',
            img3: '',
            title: '',
            code: ''
          }
        }

        this.addMask = true
      },
      goRouter(row) {
        this.$router.push({
          path: '/biaojidian/item',
          query: {
            ...row
          }
        });
      },
      changeType(type) {
        this.listType = type
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

<style lang="scss" scoped>
  .export-excel-wrapper{
    margin: 0 10px;
  }
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

      .listType {
        font-size: 24px;
        margin-left: 40px;
      }

      .title_r {
        display: flex;
        align-items: center;
      }
    }

    .list {
      background-color: #fff;
      padding: 20px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .item {
        width: 265px;
        height: 166px;
        padding: 20px 30px;
        border-radius: 4px;
        margin: 0 26px 40px;
        box-shadow: 0 0 20px 4px rgba(0, 0, 0, .1);

        .addItem {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          color: rgba(42, 130, 228, 1);
          font-size: 18px;
          font-weight: 700;
        }

        .item_head {

          display: flex;
          align-items: center;

          img {
            width: 72px;
            height: 72px;
            border-radius: 8px;
            margin-right: 24px;
          }

          .head_r {
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            h4,
            p {
              margin: 0;
            }

            p {
              color: rgba(166, 166, 166, 1);
              font-size: 14px;

              span {
                color: rgba(56, 56, 56, 1);
                font-size: 30px;
              }
            }
          }
        }

        .item_cz {
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
