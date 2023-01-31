<template>
  <div class="page">
    <el-row :gutter='20'>
      <el-col :xs='9' :sm='8' :md='7' :lg='5' :lx='5'>
        <div class="scwj">
          <h3>文档管理</h3>
          <el-upload class="upload-demo" :action="fileUploadApi" :headers="headers"
            :show-file-list='false' :on-success="upfile" :before-upload='beforeUpload'>
            <el-button size="small" type="primary" icon='el-icon-upload'>点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </div>
        <div class="block">
          <p>分类</p>
          <el-tree :data="data" node-key="id" :highlight-current='true' ref="tree"
            @node-click='treeChange'>
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="data.type==1">
                <!-- <i @click.stop='edit(data)' class="el-icon-edit" style="color: rgba(67, 207, 124, 1);margin: 0 10px;"></i> -->
                <i class="el-icon-circle-plus-outline" style="color: rgba(42, 130, 228, 1);" @click.stop="append(data)"></i>
              </span>
              <span v-else>
                <i @click.stop='edit(data)' class="el-icon-edit" style="color: rgba(67, 207, 124, 1);margin: 0 10px;"></i>
                <i @click.stop='remove(data)' class="el-icon-delete" style="color: rgba(220, 23, 27, 1);"></i>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :xs='15' :sm='16' :md='17' :lg='19' :lx='19'>
        <div class="tabs">
          <ul class="tabsList">
            <li :class="{activeLi:activeLi==1}" @click="changetab(1)">全部</li>
            <li :class="{activeLi:activeLi==2}" @click="changetab(2)">图片</li>
            <li :class="{activeLi:activeLi==3}" @click="changetab(3)">文案</li>
          </ul>
          <el-input style="width: 20%;" placeholder="请输入内容" v-model="inputName" @change="initData()">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="list" v-loading='loading'>
          <nothing v-if="tableData.length<=0"></nothing>
          <div v-else class="item" v-for="(item,index) in tableData" :key="item.id">
            <div class="itemImg">
              <img :src="item.icon" alt="">
              <div class="tip">
                上传时间：{{item.createTime}}
              </div>
            </div>
            <h4>{{item.title}}</h4>
            <div class="caozuo" v-if="item.type2==1">
              <a :href="item.url" target="_blank"><i class="el-icon-view" style="color: rgba(42, 130, 228, 1);"></i></a>
              <i @click="urlToBlobAndDownload(item.url,item.title)" class="el-icon-download" style="color: #E6A23C;"></i>
              <i slot="reference" class="el-icon-delete" style="color: rgba(220, 23, 27, 1);" @click='remove2(item)'></i>
            </div>
            <div class="caozuo" v-else>
              <a :href="'http://view.officeapps.live.com/op/view.aspx?src='+item.url" target="_blank"><i class="el-icon-view" style="color: rgba(42, 130, 228, 1);"></i></a>
              <a :href="item.url" :download="item.title"><i class="el-icon-download" style="color: #E6A23C;"></i></a>
              <i slot="reference" class="el-icon-delete" style="color: rgba(220, 23, 27, 1);" @click='remove2(item)'></i>
            </div>
          </div>
          <div class="pageClass">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :page-sizes="[12, 24, 36, 48]" :page-size="tableFrom.limit" :current-page="tableFrom.page"
              layout="total, sizes, prev, pager, next, jumper" :total="totalElements">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="30%">
      <el-input v-model="flname" placeholder="请输入分类名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="flsub">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改分类" :visible.sync="dialogVisible2" width="30%">
      <el-input v-model="fldata.label" placeholder="请输入分类名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="flsub2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import wendang from '@/api/resources/wendang'
  import wendangFl from '@/api/resources/wendangFl'
  import Nothing from '@/components/nothing'
  import {
    initData
  } from '@/api/data'
  import {
    mapGetters
  } from 'vuex'
  import {
    getToken
  } from '@/utils/auth'
  let id = 1000;
  export default {
    components:{
      Nothing
    },
    data() {
      return {
        loading: false,
        headers: {
          'Authorization': getToken()
        },
        fileName: '',
        cateId: '',
        flname: '',
        fldata: {},
        inputName: '',
        dialogVisible: false,
        dialogVisible2: false,
        activeLi: 1,
        data: {},
        totalElements: 1,
        tableData: [],
        tableFrom: {
          page: 1,
          limit: 12
        },
      }
    },
    computed: {
      ...mapGetters([
        'fileUploadApi'
      ])
    },
    mounted() {
      this.initData()
      this.initData2()
    },
    methods: {
      urlToBlobAndDownload(url,title){
      	//实例化一个img对象
      	const img = new Image();
      	//设置img的图片路径
      	img.src = url;
      	//设置跨域解决
      	img.setAttribute('crossOrigin', 'Anonymous');
      	//img加载完后处理
      	img.onload = function() {
      		//创建一个canvas对象
              const canvas = document.createElement('canvas')
              //把图片的宽度设为canves的宽度
              canvas.width = img.width
              //把图片的高度设为canves的高度
              canvas.height = img.height
              //创建一个2d画布
              const ctx = canvas.getContext('2d')
              // 将img中的内容画到画布上
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
              // 将画布内容转换为Blob
              canvas.toBlob((blob) => {
                  // blob转为同源url
                  let blobUrl = window.URL.createObjectURL(blob)
                  // 创建a链接
                  const a = document.createElement('a')
                  a.href = blobUrl
                  a.download = title
                  // 触发a链接点击事件，浏览器开始下载文件
                  a.click()
              })
          }
      },
      initData2() {
        initData('api/appDocCate/list').then(res => {
          this.data = res
        })
      },
      initData() {
        this.loading = true
        initData('api/appDoc', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          blurry: this.inputName,
          cateId: this.cateId,
          type2: this.activeLi - 1
        }).then(res => {
          this.loading = false
          this.tableData = res.content
          this.totalElements = res.totalElements
        })
      },
      beforeUpload(file) {
        this.fileName = file.name
        if (!this.$refs.tree.getCurrentNode()) {
          this.$message({
            message: '请选择左侧子分类',
            type: 'warning'
          });
          return false
        }
        if (this.$refs.tree.getCurrentNode().id==1 || this.$refs.tree.getCurrentNode().id==2 ) {
          this.$message({
            message: '请选择左侧子分类',
            type: 'warning'
          });
          return false
        }
      },
      treeChange(data, flag, flag2) {
        this.cateId = data.id
        this.initData()
      },
      upfile(response, file, fileList) {
        if(response.code){
          if(response.code!=200){
            return this.$message({
              message:response.msg
            })
          }
        }

        let data = {
          title:response.name,
          icon:response.path,
          url:response.path,
          cateId :this.cateId
        }
        wendang.add(data).then(res => {
          this.initData()
          this.$message({
            message: '上传成功',
            type: 'success'
          });
        })
      },
      changetab(type) {
        this.activeLi = type
        this.initData()
      },
      flsub() {
        wendangFl.add({
          title: this.flname,
          fId: this.fldata.id,
          status: 1
        }).then(res => {
          this.dialogVisible = false
          this.flname = ''
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.initData2()
        })
      },
      flsub2() {
        wendangFl.edit(this.fldata).then(res => {
          this.fldata = {}
          this.dialogVisible2 = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.initData2()
        })
      },
      append(data) {
        this.fldata = data
        this.dialogVisible = true

      },
      edit(data) {
        this.fldata = {...data}
		this.fldata.cateId = data.id
		this.fldata.id = undefined
        this.dialogVisible2 = true

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
      },
      remove(data) {
        this.$confirm('确定删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          wendangFl.del([data.id]).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.initData2()
          })
        })

      },
      remove2(data) {
        this.$confirm('确定删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          wendang.del([data.docId]).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.initData()
          })
        })

      },
    }
  }
</script>

<style lang="scss" scoped>
  .list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    padding: 20px 20px 60px;
    background-color: #fff;
    border-radius: 10px;
    position: relative;

    .pageClass {
      position: absolute;
      bottom: 20px;
      right: 60px;
    }

    .item {
      box-shadow: 0 0 8px 6px rgba(0, 0, 0, .1);
      width: 290px;
      height: 202px;
      border-radius: 4px;
      margin: 0 26px 20px 0;
      overflow: hidden;

      .itemImg {
        position: relative;
        width: 100%;
        height: 132px;

        img {
          width: 100%;
          height: 100%;
        }

        .tip {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 4px;
          background-color: rgba(0, 0, 0, .4);
          color: #fff;
          font-size: 12px;
        }
      }

      h4 {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 10px 10px;
      }

      .caozuo {
        font-size: 20px;
        padding: 2px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .block {
    margin-top: 20px;
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;

    p {
      margin: 8px 0;
    }
  }

  .el-tree-node__content {
    height: 40px !important;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .page {
    padding: 20px;
  }

  .scwj {
    height: 54px;
    padding: 0 10px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
    }
  }

  .tabs {
    height: 54px;
    padding: 0 10px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ul {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0;

      li {
        white-space: nowrap;
        width: 114px;
        height: 40px;
        border-radius: 20px;
        line-height: 40px;
        text-align: center;
      }

      .activeLi {
        background: rgba(42, 130, 228, 1);
        color: #fff;
      }
    }
  }
</style>
