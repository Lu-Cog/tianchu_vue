<template>
	<div ref="DOM">
		<el-row type='flex' align='middle' justify='space-between' class="title">
			<h4>巡护任务配置</h4>
			<crudOperation :permission="permission" />
		</el-row>
		<div class="app-container">
			<el-row type='flex' align='middle' justify='space-between' class="fromHead" v-if="crud.props.searchToggle">
				<el-col :span='18' class="titleCol">
					<div class="ssjg">
						<span>任务类型</span>
						<el-select v-model="query.label" placeholder="请选择">
							<el-option v-for="item in dict.rwlx" :key="item.label" :label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class="name">
						<span>任务名称</span>
						<el-input v-model="query.blurry" placeholder="请输入内容"></el-input>
					</div>
					<div class="name">
						<span>选择时间</span>
						<date-range-picker v-model="query.startTimes" style="width: 230px;" />
					</div>
					<div class="ssjg">
						<span>状态</span>
						<el-select v-model="query.status" placeholder="请选择">
							<el-option v-for="item in dict.status" :key="item.label" :label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span='3'>
					<rrOperation />
				</el-col>
			</el-row>
			<!--工具栏-->
			<div class="head-container">
				<el-dialog :close-on-click-modal="false" :visible.sync="showMask" :title="crud.status.title"
					width="70%">
					<el-form ref="form" :model="formView" :rules="rules" size="small" label-width="180px">
						<el-row :gutter='20'>
							<el-col :span='10'>
								<el-form-item label="任务名称：">
									<el-input v-model="formView.title" style="width: 100%;" placeholder="请输入" disabled>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="任务类型：">
									<el-select v-model="formView.label" placeholder="请选择" style="width: 100%;" disabled>
										<el-option v-for="item in dict.rwlx" :key="item.id" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='0'>
							<el-form-item label="任务内容：">
								<el-input type="textarea" :rows="5" style="width: 82%;" placeholder="请输入内容"
									v-model="formView.note" disabled>
								</el-input>
							</el-form-item>
						</el-row>
						<el-row :gutter='20'>
							<el-col :span='10'>
								<el-form-item label="开始时间：">
									<el-date-picker v-model="formView.startTime" type="date" style="width: 100%;"
										disabled />
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="截止时间：">
									<el-date-picker v-model="formView.endTime" type="date" style="width: 100%;"
										disabled />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='20'>
							<el-col :span='10'>
								<el-form-item label="巡护频次：">
									<el-input v-model="formView.num" style="width: 280px;" disabled />
									<el-select v-model="formView.danwei" placeholder="空" style="width: 60px;" disabled>
										<el-option v-for="item in dict.xhpcdw" :key="item.id" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="紧急程度：">
									<el-select v-model="formView.jjcd" placeholder="请选择" style="width: 100%;" disabled>
										<el-option v-for="item in dict.jjcd" :key="item.id" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='20' v-if="formView.num<=0">
							<el-col :span='10'>
								<el-form-item label="任务地址：">
									<el-input v-model="formView.address" style="width: 100%;" placeholder="请输入或选择"
										disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="具体坐标：">
									<el-input disabled v-model="formView.lon?formView.lon+','+formView.lat:formView.lat"
										style="width: 82%;" placeholder="请选择"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='20'>
							<el-col :span='10'>
								<el-form-item label="责任区选择：">
									<el-select v-model="formView.toAreaId" filterable placeholder="请选择责任区"
										style="width: 100%;" disabled>
										<el-option v-for="item in zrq" :key="item.areaId" :label="item.title"
											:value="item.areaId" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="状态">
									<el-radio-group v-model="formView.status" disabled>
										<el-radio v-for="item in dict.status" :key="item.label" :label="item.value">
											{{item.label}}
										</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="showMask=false">确认</el-button>
					</div>
				</el-dialog>
				<!--表单组件-->
				<el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU"
					:visible.sync="crud.status.cu > 0" :title="crud.status.title" width="70%" @close='clearDialog()'>
					<el-form ref="form" :model="form" :rules="rules" size="small" label-width="180px">
						<el-row :gutter='20'>
							<el-col :span='10'>
								<el-form-item label="任务名称：" prop="title">
									<el-input v-model="form.title" style="width: 100%;" placeholder="请输入"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="任务类型：" prop="label">
									<el-select v-model="form.label" placeholder="请选择" style="width: 100%;">
										<el-option v-for="item in dict.rwlx" :key="item.id" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='0'>
							<el-form-item label="任务内容：" prop="note">
								<el-input type="textarea" :rows="5" style="width: 82%;" placeholder="请输入内容"
									v-model="form.note">
								</el-input>
							</el-form-item>
						</el-row>

						<el-row :gutter='20'>
							<el-col :span='10'>
								<el-form-item label="开始时间：" prop="startTime">
									<el-date-picker v-model="form.startTime" type="date" style="width: 100%;"
										:disabled='form.peizhi==1' />
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="截止时间：" prop="endTime">
									<el-date-picker v-model="form.endTime" type="date" style="width: 100%;"
										:disabled='form.peizhi==1' />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='20'>
							<el-col :span='10'>
								<el-form-item label="巡护频次：" prop="num">
									<el-input type="number" v-model="form.num" style="width: 280px;"
										:disabled='form.peizhi==1' placeholder="不填默认为一次性巡护" @change="changeXhpc"
										@input="inputXhpc" />
									<el-select v-model="form.danwei" placeholder="空" style="width: 60px;"
										:disabled='form.peizhi==1'>
										<el-option v-for="item in dict.xhpcdw" :key="item.id" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="紧急程度：" prop="jjcd">
									<el-select v-model="form.jjcd" placeholder="请选择" style="width: 100%;">
										<el-option v-for="item in dict.jjcd" :key="item.id" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='20' v-if="form.num<=0">
							<el-col :span='10'>
								<el-form-item label="任务地址：" prop="address">
									<el-input v-model="form.address" style="width: 100%;" placeholder="请输入或选择">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="具体坐标：" prop="lon">
									<el-input disabled v-model="form.lon?form.lon+','+form.lat:form.lat"
										style="width: 82%;" placeholder="请选择"></el-input>
									<el-button type="primary" @click="opanAddress">定位</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter='20'>
							<el-col :span='10'>
								<el-form-item label="责任区选择：" prop="toAreaId">
									<el-select v-model="form.toAreaId" filterable placeholder="请选择责任区"
										style="width: 100%;">
										<el-option v-for="item in zrq" :key="item.areaId" :label="item.title"
											:value="item.areaId" />
									</el-select>
									<el-radio-group v-model="form.toType">
										<el-radio :label="1">全部</el-radio>
										<el-radio :label="2">林长</el-radio>
										<el-radio :label="3">护林员</el-radio>
										<el-radio :label="4">个人</el-radio>
									</el-radio-group>
									<div class="manList" v-if="form.toType==4">
										<div class="manItem" v-for="item in userlist">
											<img :src="item.img" alt="">
											<span>{{item.label}}</span>
										</div>
										<div class="manItem" @click="checkMan">
											<img style="cursor: pointer;" src="@/assets/images/fpry.png" alt="">
										</div>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='10'>
								<el-form-item label="状态" prop="status">
									<el-radio-group v-model="form.status">
										<el-radio v-for="item in dict.status" :key="item.label" :label="item.value">
											{{item.label}}
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
				<el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;">
					<el-table-column type="index" label="#" />
					<el-table-column prop="title" label="任务名称" />
					<el-table-column prop="label" label="任务类型">
						<template slot-scope="scope">
							<el-tag effect="dark" :color="cColor['rwlx'+scope.row.label]" v-for="item in dict.rwlx"
								v-if="scope.row.label==item.value">
								{{item.label}}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="jjcd" label="紧急程度">
						<template slot-scope="scope">
							<span v-for="item in dict.jjcd" :style="{color:cColor['jjcd'+scope.row.jjcd]}"
								v-if="scope.row.jjcd==item.value">{{item.label}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="地址" />
					<el-table-column prop="startTime" label="开始时间">
						<template v-slot="scope">
							<span>{{scope.row.startTime.split(' ')[0]}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="endTime" label="结束时间">
						<template v-slot="scope">
							<span>{{scope.row.endTime.split(' ')[0]}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="num" label="巡护频次">
						<template slot-scope="scope">
							<span v-if="!scope.row.danwei">一次性巡护</span>
							<div v-else>
								<span v-for="item in dict.xhpcdw"
									v-if="scope.row.danwei==item.value">{{scope.row.num+item.label+"/次"}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="note" label="任务内容" width='260'>
					</el-table-column>
					<el-table-column prop="status" label="状态">
						<template slot-scope="scope">
							<span v-for="item in dict.status" :style="{color:cColor['status'+scope.row.status]}"
								v-if="scope.row.status==item.value">{{item.label}}</span>
						</template>
					</el-table-column>
					<el-table-column v-if="checkPer(['admin','appWorkConfig:edit','appWorkConfig:del'])" label="操作"
						width="150px" align="center">
						<template slot-scope="scope">
							<div style="display: flex;align-items: center;">
								<i class="el-icon-view" style="color: rgba(42, 130, 228, 1);font-size: 20px;"
									@click="open(scope.row)"></i>
								<udOperation :data="scope.row" :permission="permission" />
							</div>
						</template>
					</el-table-column>
				</el-table>
				<!--分页组件-->
				<pagination />
			</div>
		</div>
		<el-dialog title="定位" :visible.sync="dialogTableVisible" top="3vh">
			<iframe id="mapPage" width="100%" height="800px" frameborder="0"
				src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=7BZBZ-VZO6J-47OFE-FRXSX-BWLWJ-AXBRW&referer=myapp"></iframe>
		</el-dialog>
		<el-dialog title="分配人员" :visible.sync="manMask" width="30%">
			<el-input placeholder="输入关键字进行过滤" v-model="filterText">
			</el-input>
			<el-tree class="filter-tree" :data="data" node-key="id" show-checkbox :filter-node-method="filterNode"
				ref="tree">
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click="manMask = false">取 消</el-button>
				<el-button type="primary" @click="closeMan">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import cColor from '@/assets/styles/commonColor.scss'
	import crudAppWorkConfig from '@/api/appWorkConfig'
	import CRUD, {
		presenter,
		header,
		form,
		crud
	} from '@crud/crud'
	import rrOperation from '@crud/RR.operation'
	import DateRangePicker from '@/components/DateRangePicker'
	import crudOperation from '@crud/CRUD.operation'
	import udOperation from '@crud/UD.operation'
	import pagination from '@crud/Pagination'
	import {
		initData
	} from '@/api/data'
	const defaultForm = {
		configId: null,
		title: null,
		type: null,
		areaId: null,
		zhiwuId: null,
		label: null,
		jjcd: null,
		note: null,
		address: null,
		toAreaId: null,
		toType: 1,
		lon: null,
		lat: null,
		startTime: null,
		endTime: null,
		num: null,
		danwei: null,
		uids: null,
		status: null,
		createTime: null,
		updateTime: null,
		peizhi: null
	}
	export default {
		name: 'AppWorkConfig',
		components: {
			pagination,
			crudOperation,
			rrOperation,
			udOperation,
			DateRangePicker
		},
		computed: {
			cColor() {
				return cColor
			}
		},
		dicts: ['rwlx', 'jjcd', 'status', 'xhpcdw'],
		mixins: [presenter(), header(), form(defaultForm), crud()],
		cruds() {
			return CRUD({
				title: '任务配置',
				url: 'api/workConfig',
				idField: 'configId',
				sort: 'configId,desc',
				crudMethod: {
					...crudAppWorkConfig
				},
				optShow: {
					add: true,
					edit: false,
					del: false,
					reset: true
				}
			})
		},
		mounted() {

			this.mapListener()
			this.initData()
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		data() {
			var checkEndDate = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('截止时间不能为空'));
				} else if (value < this.form.startTime) {
					callback(new Error('不能比开始时间晚'));
				} else {
					callback();
				}
			};
			var checkDay = (rule, value, callback) => {
				if (value > 0 && !this.form.danwei) {
					callback(new Error('请选择巡护单位'));
				} else if (value < 0) {
					callback(new Error('请填写正确的巡护频次'));
				} else {
					callback();
				}
			};
			return {
				userlist: [],
				filterText: '',
				data: [],
				radio: 0,
				formView: {},
				zrq: [],
				showMask: false,
				dialogTableVisible: false,
				manMask: false,
				permission: {
					add: ['admin', 'appWorkConfig:add'],
					edit: ['admin', 'appWorkConfig:edit'],
					del: ['admin', 'appWorkConfig:del']
				},
				rules: {
					title: [{
						required: true,
						message: '任务名称不能为空',
						trigger: 'blur'
					}],
					label: [{
						required: true,
						message: '请选择任务类型',
						trigger: 'change'
					}],
					note: [{
						required: true,
						message: '任务内容不能为空',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '任务地址不能为空',
						trigger: 'blur'
					}],
					lon: [{
						required: true,
						message: '具体坐标不能为空',
						trigger: 'change'
					}],
					startTime: [{
						required: true,
						message: '开始时间不能为空',
						trigger: 'blur'
					}],
					endTime: [{
						required: true,
						validator: checkEndDate,
						trigger: 'blur',
					}],
					num: [{
						validator: checkDay,
						trigger: 'blur',
					}],
					jjcd: [{
						required: true,
						message: '紧急程度不能为空',
						trigger: 'change',
					}],
					toAreaId: [{
						required: true,
						message: '责任区不能为空',
						trigger: 'change',
					}],
					status: [{
						required: true,
						message: '请选择状态',
						trigger: 'change',
					}],
				}
			}
		},
		methods: {
			changeXhpc(e) {
				if (e < 1) {
					this.form.num = ''
				} else {
					this.form.num = e
				}
			},
			inputXhpc(e) {
				if (e < 1) {
					this.form.num = ''
				} else {
					this.form.num = e
				}
			},
			clearDialog() {
				this.userlist = []
			},
			closeMan() {
				this.manMask = false
				this.userlist = this.$refs.tree.getCheckedNodes()
				let arr = []
				this.userlist.forEach(item => {
					arr.push(item.id)
				})
				this.form.uids = arr.join(',')
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			checkMan() {
				this.manMask = true
			},
			initData() {
				initData('api/area', {
					size: 1000
				}).then(res => {
					this.zrq = res.content
				})
				initData('api/area/list').then(res => {
					this.data = res
				})
			},
			opanAddress() {
				this.dialogTableVisible = true
			},
			open(from) {
				if (from.status != undefined) {
					from.status += ''
				}
				this.formView = from
				if (this.formView.num==0){
					this.formView.num = '不填默认为一次性巡护'
				}
				this.showMask = true
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
					that.dialogTableVisible = false
				}, false);
			},
			// 钩子：在获取表格数据之前执行，false 则代表不获取数据
			[CRUD.HOOK.beforeRefresh]() {
				return true
			}
		}
	}
</script>

<style scoped lang="scss">
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

	.fromHead {
		padding-bottom: 18px;
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
