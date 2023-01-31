<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="10">
          <div class="chart-wrapper flex-start">
            <div style="width: 40%;">
              <div class="mbfz">
                <h3>全市护林员总人数</h3>
                <p>{{indexInfo.allman}}人</p>
              </div>
              <div class="jdt">
                <el-progress :stroke-width="14" color='#23BCCA' :show-text='false'
                  :percentage="parseInt(indexInfo.hlyman/indexInfo.allman*100)"></el-progress>
                <div><span>巡护员人数</span><span>{{indexInfo.hlyman}} <span>人</span> </span></div>
              </div>
              <div class="jdt">
                <el-progress :stroke-width="14" color='#FF8D1A' :show-text='false' :percentage="parseInt(indexInfo.lzman/indexInfo.allman*100)">
                </el-progress>
                <div><span>林长人数</span><span>{{indexInfo.lzman}}<span>人</span></span></div>
              </div>
            </div>
            <pie-chart :data="pieData" />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="14">
          <div class="chart-wrapper">
            <div class="chart_title">
              <h3>巡护任务情况</h3>
              <div class="pietab">
                <div class="item cur" :class="{active:activeTab==1}" @click="changeTab(1)">
                  月报
                </div>
                <div class="item cur" :class="{active:activeTab==2}" @click="changeTab(2)">
                  周报
                </div>
              </div>
            </div>
            <div class="flex-start">
              <bar-chart :data="barData"/>
              <div class="yuebao">
                <div class="yuebao_top">
                  <h3>事件上报</h3>
                  <div class="flex-btw">
                    <div class="btw_l">
                      <p class="nump"><span>{{indexInfo.sjsb.num}}<span class="span">起</span></span><span>{{indexInfo.sjsb.tage>0?'+'+indexInfo.sjsb.tage:'-'+indexInfo.sjsb.tage}}%</span></p>
                      <p class="tipp">上报各类事件次数</p>
                    </div>
                    <line-chart :chart-data="lineChartData" :data="indexInfo.data" :width="'100px'" />
                  </div>
                </div>
                <div class="yuebao_top">
                  <h3>事件处理</h3>
                  <div class="flex-btw">
                    <div class="btw_l">
                      <p class="nump"><span>{{indexInfo.sjcl.num}}<span class="span">起</span></span><span>{{indexInfo.sjcl.tage>0?'+'+indexInfo.sjcl.tage:'-'+indexInfo.sjcl.tage}}%</span></p>
                      <p class="tipp">处理各类事件次数</p>
                    </div>
                    <line-chart :chart-data="lineChartData2" :data="indexInfo.data" :width="'100px'" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="14">
          <div class="chart-wrapper h196">
            <el-row type='flex' align='center' justify='space-between'>
              <span>常用功能</span>
              <img style="cursor: pointer;" @click="openMaskSet" src="@/assets/icons/icon_sz.png" alt="">
            </el-row>
            <el-row type='flex' align='center' justify='center' v-if="indexMenuC.length<=0" style="margin: 20px;">
              <div style="margin: 40px;color: #999;">
                暂无菜单，请点击右上角配置
              </div>
            </el-row>
            <el-row type='flex' align='center' justify='space-between' style="margin: 20px;">
              <div class="setItem" v-for="(item,index) in indexMenuC" :key="index" @click="golink(item.path)">
                <img class="cur" :src="item.img" alt="">
                <span>{{item.title}}</span>
              </div>
            </el-row>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="10">
          <div class="chart-wrapper h196">
            <el-row type='flex' align='center' justify='space-between'>
              <span>我的代办</span>
            </el-row>
            <el-row type='flex' align='center' justify='space-between' style="height: 90%;">
              <el-col :xs="12" :sm="12" :lg="12" class="renwu">
                <div class="renwu_l">
                  <div class="title">
                    <span>任务调度</span><img src="@/assets/icons/sjx.png" alt="">
                  </div>
                  <div class="num">
                    <span>{{indexInfo.rwdd.num}}</span>件
                  </div>
                </div>
                <div class="renwu_r">
                  <div class="renwu_r_top">
                    <span></span><span>紧急事件</span><span>{{indexInfo.rwdd.num1}}件</span>
                  </div>
                  <div class="renwu_r_bom">
                    <span></span><span>普通事件</span><span>{{indexInfo.rwdd.num2}}件</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :lg="12" class="renwu">
                <div class="renwu_l">
                  <div class="title">
                    <span>考勤管理</span><img src="@/assets/icons/sjx.png" alt="">
                  </div>
                  <div class="num">
                    <span>{{indexInfo.kqgl.num}}</span>件
                  </div>
                </div>
                <div class="renwu_r">
                  <div class="renwu_r_top">
                    <span></span><span>请假管理</span><span>{{indexInfo.kqgl.num1}}件</span>
                  </div>
                  <div class="renwu_r_bom">
                    <span></span><span>打卡管理</span><span>{{indexInfo.kqgl.num2}}件</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row type='flex' align='center' justify='space-between' class="sl">
        <span>事件管理</span>
        <span style="cursor: pointer;" @click="golink('/member/shijian')">详情</span>
      </el-row>
      <el-row class="rowtable">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#FAFAFA'}"  v-loading="loading">
          <el-table-column type="index" label="#" align='center'>
          </el-table-column>
          <el-table-column prop="title" label="任务名称" width="180" align='center'>
          </el-table-column>
          <el-table-column align='center' prop="rwlx" label="任务类型" width="180">
            <template slot-scope="scope">
              <el-tag effect="dark" :color="cColor['rwlx'+scope.row.type]" v-for="item in dict.sjlx" v-if="scope.row.type==item.value">
                {{item.label}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" width="230" align='center'>
          </el-table-column>
          <el-table-column prop="createTime" label="更新时间" width="180" align='center'>
            <template v-slot="scope">
              <span>{{scope.row.createTime.split(' ')[0]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="180" align='center'>
            <template slot-scope="scope">
              <span v-for="item in dict.event_status" :style="{color:cColor['sjzt'+scope.row.status]}" v-if="scope.row.status==item.value">{{item.label}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="描述" align='center'>
          </el-table-column>
          <el-table-column label="操作" width="180" align='center'>
            <template v-slot="scope">
              <el-button type="primary" size='small' @click="chuli(scope.row)">立即处理</el-button>
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
    <el-dialog title="常用功能设置" :visible.sync="setMask">
      <div class="mysetList">
        <div class="mysetitem" v-for="(item,index) in indexMenuC" :key="index" >
          <img :src="item.img" alt="">
          <span>{{item.title}}</span>
          <img class="jian cur" @click="remove(item.id)" src="@/assets/images/01.png">
        </div>
      </div>
      <div class="mysetList">
        <div class="mysetitem" v-for="(item,index) in indexMenu" :key="index" >
          <img :src="item.img" alt="">
          <span>{{item.title}}</span>
          <img class="jian cur" @click="add(item.id)" src="@/assets/images/02.png">
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setMask = false">取 消</el-button>
        <el-button type="primary" @click="setMask = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import homeApi from '@/api/home'
  import cColor from '@/assets/styles/commonColor.scss'
  import {
    initData
  } from '@/api/data'
  import GithubCorner from '@/components/GithubCorner'
  import PanelGroup from './dashboard/PanelGroup'
  import LineChart from './dashboard/LineChart'
  import RadarChart from '@/components/Echarts/RadarChart'
  import PieChart from '@/components/Echarts/PieChart'
  import BarChart from '@/components/Echarts/BarChart'
  export default {
    name: 'Dashboard',
    components: {
      GithubCorner,
      PanelGroup,
      LineChart,
      RadarChart,
      PieChart,
      BarChart
    },
    dicts: ['sjlx', 'jjcd', 'event_status', 'xhpcdw'],
    computed: {
      cColor() {
        return cColor
      }
    },
    data() {
      return {
        indexInfo:{},
        pieData:[],
        barData:{},
        setMask: false,
        activeTab: 2,
        tableFrom: {
          page: 1,
          limit: 10
        },
        lineChartData: {},
        lineChartData2: {},
        loading: false,
        totalElements: 1,
        event_status: '',
        tableData: [],
        indexMenu:[],
        indexMenuC:[]
      }
    },
    mounted() {
      this.initData()
      this.getIndex()
      this.getIndexMenu()
    },
    methods: {
      getIndexMenu(){
        homeApi.getIndexMenu().then(res=>{
          this.indexMenu = []
          this.indexMenuC = []
          res.forEach(item=>{
            if(item.check==1){
              this.indexMenuC.push(item)
            }else{
              this.indexMenu.push(item)
            }
          })
        })
      },
      getIndex(){
        let data = {
          type:this.activeTab
        }
        homeApi.getIndex(data).then(res=>{
          this.indexInfo = res
          let a = {
            value:this.indexInfo.hlyman,
            name:"护林员人数"
          }
          let b = {
            value:this.indexInfo.lzman,
            name:"林长人数"
          }
          this.pieData = [a,b]
          this.barData = {
            data:this.indexInfo.data,
            data1:this.indexInfo.data1,
            data2:this.indexInfo.data2
          }
          this.lineChartData = {
            expectedData: this.indexInfo.sjsb.list,
            type: 1,
          }
          this.lineChartData2 = {
            expectedData: this.indexInfo.sjcl.list,
            type: 2,
          }
        })
      },
      initData() {
        this.loading = true
        initData('api/appEvent', {
          page: this.tableFrom.page - 1,
          size: this.tableFrom.limit,
          status: -1
        }).then(res => {
          this.loading = false
          this.tableData = res.list
          this.totalElements = res.totalElements
        })
      },
      add(id){
        let data = {
          type : 1,
          id : id
        }
        homeApi.edit(data).then(res=>{
          this.getIndexMenu()
        })
      },
      remove(id){
        let data = {
          type : 2,
          id : id
        }
        homeApi.edit(data).then(res=>{
          this.getIndexMenu()
        })
      },
      chuli(row){
        this.$router.push({
            name:'Shijian',
            params:row
        })
        // this.$router.push('/member/shijian')
      },
      openMaskSet() {
        this.setMask = true
      },
      golink(url) {
        this.$router.push(url)
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
      changeTab(type) {
        this.activeTab = type
        this.getIndex()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .mysetList{
    margin-bottom: 20px;
    border: 1px solid rgba(42, 130, 228, 1);
    border-radius: 8px;
    min-height: 130px;
    display: flex;
    flex-wrap: wrap;
    .mysetitem{
      margin:20px 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      img{
        margin-bottom: 20px;
      }
      .jian{
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .setItem{
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      margin-bottom: 20px;
    }
  }
  .rowtable {
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 20px;
    background-color: #fff;

    .ctextz {
      color: red;
    }

    .ctext {
      color: rgba(35, 188, 202, 1);
    }

    .pageClass {
      display: flex;
      justify-content: flex-end;
      margin: 20px;
    }
  }

  .sl {
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 20px;

    span {
      line-height: 20px;

      &:last-child {
        color: rgba(30, 91, 214, 1);
        font-size: 12px;
      }
    }
  }

  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .h196 {
      height: 196px;
    }

    .flex-start {
      display: flex;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px;
      margin-bottom: 32px;
      border-radius: 10px;

      .chart_title {
        display: flex;
        justify-content: space-between;

        h3 {
          margin: 0;
        }

        .pietab {
          display: flex;
          align-items: center;
          background-color: #F9F9F9;
          border-radius: 20px;

          .item {
            padding: 7px 40px;
            border-radius: 20px;
          }

          .active {
            background: rgba(42, 130, 228, 1);
            color: #fff;
          }
        }
      }

      .yuebao {
        margin-left: 30px;
        width: 40%;

        .yuebao_top {
          &:first-child {
            border-bottom: 1px solid rgba(0, 0, 0, .05);
          }

          h3 {
            margin: 30px 0 0;
          }

          .flex-btw {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .btw_l {
              .nump {
                display: flex;
                justify-content: space-between;
                align-items: center;

                span {
                  white-space: nowrap;
                  color: rgba(56, 56, 56, 1);
                  font-size: 24px;

                  &:last-child {
                    color: rgba(30, 91, 214, 1);
                    font-size: 12px;
                  }

                  .span {
                    color: rgba(166, 166, 166, 1);
                    font-size: 14px;
                  }
                }
              }

              .tipp {
                white-space: nowrap;
                color: rgba(120, 120, 120, 1);
                font-size: 14px;
              }
            }
          }
        }
      }

      .mbfz {
        padding: 10px;
        flex-shrink: 0;
        width: 228px;
        height: 90px;
        color: #fff;
        margin-bottom: 40px;
        background: url('../assets/icons/mbfz.png');
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        h3,
        p {
          margin: 0;
        }
      }

      .jdt {
        margin-bottom: 40px;

        div {
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            color: rgba(166, 166, 166, 1);
            font-size: 14px;

            &:last-child {
              color: rgba(56, 56, 56, 1);
              font-size: 24px;

              span {
                color: rgba(166, 166, 166, 1);
                font-size: 14px;
              }
            }
          }
        }
      }

      .renwu {
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;

        &:first-child {
          border-right: 1px solid #eee;
        }

        .renwu_l {
          .title {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            color: rgba(209, 209, 209, 1);
            font-size: 14px;

            span {
              margin-right: 22px;
            }
          }

          .num {
            color: rgba(57, 57, 57, 1);
            font-size: 14px;
            font-weight: 800;

            span {
              font-size: 30px;
            }
          }
        }

        .renwu_r {
          margin-right: 20px;
          color: rgba(57, 57, 57, 1);
          font-size: 14px;

          .renwu_r_top {
            margin-bottom: 10px;

            span {
              &:first-child {
                display: inline-block;
                margin-right: 10px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(35, 188, 202, 1);
              }

              &:last-child {
                margin-left: 10px;
              }
            }
          }

          .renwu_r_bom {
            span {
              &:first-child {
                margin-right: 10px;
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(255, 141, 26, 1);
              }

              &:last-child {
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
