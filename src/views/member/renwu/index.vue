<template>
	<div class="page">
		<el-row type='flex' align='middle' justify='space-between' class="title">
			<h4>巡护任务管理</h4>
		</el-row>
		<div class="fromList">
			<el-row type='flex' align='middle' justify='space-between' class="fromHead">
				<el-col :span='21' class="titleCol">
					<div class="ssjg">
						<span>任务类型</span>
						<el-select v-model="rwlxvalue" placeholder="请选择">
							<el-option v-for="item in dict.rwlx" :key="item.value" :label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class="name">
						<span>任务名称</span>
						<el-input v-model="inputName" placeholder="请输入内容"></el-input>
					</div>
					<div class="name">
						<span>巡护人</span>
						<el-input v-model="nickName" placeholder="请输入内容"></el-input>
					</div>
					<div class="name">
						<span>选择时间</span>
						<date-range-picker v-model="createTime" style="width: 230px;" />
					</div>
					<div class="ssjg">
						<span>状态</span>
						<el-select v-model="work_status" placeholder="请选择">
							<el-option v-for="item in dict.work_status" :key="item.value" :label="item.label"
								:value="item.value">
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
				<el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#FAFAFA'}"
					v-loading="loading">
					<el-table-column type="index" label="#" align='center'>
					</el-table-column>
					<el-table-column prop="title" label="任务名称" align='center'>
					</el-table-column>
					<el-table-column prop="rwlx" label="任务类型" align='center'>
						<template slot-scope="scope">
							<el-tag effect="dark" :color="cColor['rwlx'+scope.row.label]" v-for="item in dict.rwlx"
								v-if="scope.row.label==item.value">
								{{item.label}}
							</el-tag>
							<!-- <span v-for="item in dict.rwlx" v-if="scope.row.label==item.value">{{item.label}}</span> -->
						</template>
					</el-table-column>
					<el-table-column prop="jjcd" label="紧急程度" align='center'>
						<template slot-scope="scope">
							<span v-for="item in dict.jjcd" :style="{color:cColor['jjcd'+scope.row.jjcd]}"
								v-if="scope.row.jjcd==item.value">{{item.label}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="地址" width='250' align='center'>
					</el-table-column>
					<el-table-column prop="startTime" label="开始时间" align='center'>
						<template v-slot="scope">
							<span>{{scope.row.startTime.split(' ')[0]}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="endTime" label="截止时间" align='center'>
						<template v-slot="scope">
							<span>{{scope.row.endTime.split(' ')[0]}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="nickName" label="巡护人" align='center'>
					</el-table-column>
					<el-table-column prop="note" label="任务内容" width='260' align='center'>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="180" align='center'>
						<template slot-scope="scope">
							<span v-for="item in dict.work_status" :style="{color:cColor['rwzt'+scope.row.status]}"
								v-if="scope.row.status==item.value">{{item.label}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align='center'>
						<template slot-scope="scope">
							<el-button type="primary" @click="openForm(scope.row)">详情</el-button>
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
		<el-dialog title="任务详情" :visible.sync="dialogFormVisible" top="5vh">
			<div class="headImg">
				<map-container v-if="dialogFormVisible" :data="datalist"></map-container>
				<!-- <img style="width: 100%;" src="https://img.js.design/assets/img/6204d3d566d3a16ffc89e3b6.png" alt=""> -->
				<img class="sjxq" @click="$router.push({path: '/member/shijian',query:{id: ''}})"
					src="@/assets/images/sjxq.png" alt="">
			</div>
			<el-form :model="form">
				<el-row :gutter='20'>
					<el-col :span='12'>
						<el-form-item label="">
							<div style="display: flex;align-items: center;">
								<img style="margin-right: 10px;" src="@/assets/images/icon_ad.png"
									alt=""><span>{{form.address}}</span>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span='12'>
						<el-form-item label="">
							<div style="display: flex;align-items: center;">
								<img style="margin-right: 10px;" src="@/assets/images/icon_jwd.png" alt=""><span>经度
									{{form.lon}} 纬度
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
									alt=""><span>巡护时间：{{form.createTime}}</span>
							</div>
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
					<el-col :span='16'>
						<el-form-item label="图片详情">
							<div class="imgBox">
								<el-image style="width: 100px; height: 100px;margin: 4px;" v-for="item in form.imgs"
									:key="item" :src="item" :preview-src-list="form.imgs">
								</el-image>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span='8'>
						<el-form-item label="护林员">
							<div class="hlimgBox">
								<img :src="form.avatarPath" alt="">
								<span>{{form.nickName}}</span>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <div v-if="form.status==2">
          <el-row :gutter='20'>
            <el-col :span='24'>
              <el-form-item label="处理结果">
                已处理
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter='20'>
            <el-col :span='24'>
              <el-form-item label="处理时间">
                2022年3月15日14:32:15
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter='20'>
            <el-col :span='24'>
              <el-form-item label="处理人">
                张三（工号：01100100）
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
                <div class="yuyin" @click="bofan()">
                  <img src="@/assets/images/icon_yuyin.png" alt=""><span>15'</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter='20'>
            <el-col :span='24'>
              <el-form-item label="照片详情">
                <div class="imgBox">
                  <img v-for="item in form.imgs" :src="item" alt="">
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button v-if="form.status==0" type="danger" @click="sub">撤 销</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import cColor from '@/assets/styles/commonColor.scss'
	import renwu from '@/api/member/renwu'
	import {
		initData
	} from '@/api/data'
	import DateRangePicker from '@/components/DateRangePicker'
	import MapContainer from '@/components/MapContainer/MapContainer'
	export default {
		name: 'renwu',
		components: {
			DateRangePicker,
			MapContainer
		},
		data() {
			return {
				loading: false,
				dialogFormVisible: false,
				createTime: '',
				rwlxvalue: '',
				inputName: '',
				nickName:'',
				work_status: '',
				totalElements: 0,
				tableFrom: {
					page: 1,
					limit: 10
				},
				tableData: [],
				form: {},
				datalist: [{
						lon: 116.478346,
						lat: 39.997361
					},
					{
						lon: 116.402796,
						lat: 39.936915
					}
				]
			}
		},
		computed: {
			cColor() {
				return cColor
			}
		},
		dicts: ['rwlx', 'jjcd', 'work_status', 'xhpcdw'],
		mounted() {
			this.initData()
		},
		methods: {
			openForm(form) {
				this.form = {
					...form
				}
				this.datalist = []
				renwu.getGps({
					workId: this.form.workId
				}).then(res => {
					res.forEach(item=>{
						this.datalist.push({lat:item.lat,lon:item.lon})
					})
				})
				this.form.imgs = this.form.imgs ? this.form.imgs.split(',') : ''
				this.dialogFormVisible = true
			},
			clear() {
				this.rwlxvalue = ''
				this.createTime = ''
				this.inputName = ''
				this.nickName = ''
				this.work_status = ''
				this.initData()
			},
			search() {
				this.initData()
			},
			bofan(url) {
				let audio = new Audio()
				audio.src = url
				audio.play()
			},
			sub() {
				renwu.edit(this.form).then(res => {
					this.dialogFormVisible = false
					this.initData()
					this.$message({
						message: '撤销成功',
						type: 'success'
					})
				})
			},
			initData() {
				this.loading = true
				initData('api/appWork', {
					page: this.tableFrom.page - 1,
					size: this.tableFrom.limit,
					createTime: this.createTime,
					blurry: this.inputName,
					nickName:this.nickName,
					label: this.rwlxvalue,
					status: this.work_status
				}).then(res => {
					this.loading = false
					this.tableData = res.list
					this.totalElements = res.totalElements
				}).catch(res => {
					this.loading = false
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
	.headImg {
		width: 100%;
		position: relative;

		.sjxq {
			cursor: pointer;
			width: 60px;
			height: 60px;
			position: absolute;
			top: 20px;
			right: 20px;
		}
	}

	.hlimgBox {
		width: 60px;
		height: 60px;
		position: relative;
		border-radius: 16px;
		overflow: hidden;

		span {
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			line-height: 20px;
			color: #fff;
			text-align: center;
			background: rgba(0, 0, 0, 0.3);
		}

		img {
			width: 100%;
			height: 100%;
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
