<template>
  <div v-if="type == 'image'">
    <ul v-for="(item,index) in value" :key="index" class="el-upload-list el-upload-list--picture-card" style="line-height: 0px !important;height: 0px !important;">
      <li tabindex="0" class="el-upload-list__item is-ready" :style="'width: '+width+'px;height: '+height+'px'">
        <div>
          <img :src="item" alt="" class="el-upload-list__item-thumbnail">
          <span class="el-upload-list__item-actions">
            <span v-if="index != 0" class="el-upload-list__item-preview" @click="moveMaterial(index,'up')">
              <i class="el-icon-back" />
            </span>
            <span class="el-upload-list__item-preview" @click="zoomMaterial(index)">
              <i class="el-icon-view" />
            </span>
            <span class="el-upload-list__item-delete" @click="deleteMaterial(index)">
              <i class="el-icon-delete" />
            </span>
            <span v-if="index != value.length-1" class="el-upload-list__item-preview"
              @click="moveMaterial(index,'down')">
              <i class="el-icon-right" />
            </span>
          </span>
        </div>
      </li>
    </ul>
    <div v-if="num > value.length" tabindex="0" class="el-upload el-upload--picture-card"
      :style="'width: '+width+'px;height: '+height+'px;'+'line-height:'+height+'px;'">
      <el-upload :action="imagesUploadApi" :class="{ disabled: uploadDisabled }" :show-file-list='false'
        :headers="headers" list-type="picture-card" :limit="num" :on-change="handleChange" :on-remove="handleRemove"
        :on-success="handleSuccess">
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>

    <el-dialog append-to-body :visible.sync="dialogVisible" width="35%">
      <img :src="url" alt="" style="width: 100%">
    </el-dialog>
  </div>

</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    getToken
  } from '@/utils/auth'
  import {
    upload
  } from '@/utils/upload'
  export default {
    name: 'MaterialList',
    computed: {
      ...mapGetters([
        'imagesUploadApi',
        'baseApi'
      ])
    },
    props: {
      // 素材数据
      value: {
        type: Array,
        default () {
          return []
        }
      },
      // 素材类型
      type: {
        type: String
      },
      // 素材限制数量，默认5个
      num: {
        type: Number,
        default () {
          return 5
        }
      },
      // 宽度
      width: {
        type: Number,
        default () {
          return 150
        }
      },
      // 宽度
      height: {
        type: Number,
        default () {
          return 150
        }
      }
    },
    data() {
      return {
        uploadDisabled: false,
        headers: {
          Authorization: getToken()
        },
        dialogVisible: false,
        url: ''
      }
    },

    methods: {
      moveMaterial(index, type) {
        if (type == 'up') {
          const tempOption = this.value[index - 1]
          this.$set(this.value, index - 1, this.value[index])
          this.$set(this.value, index, tempOption)
        }
        if (type == 'down') {
          const tempOption = this.value[index + 1]
          this.$set(this.value, index + 1, this.value[index])
          this.$set(this.value, index, tempOption)
        }
      },
      zoomMaterial(index) {
        this.dialogVisible = true
        this.url = this.value[index]
      },
      deleteMaterial(index) {
        const that = this
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          that.value.splice(index, 1)
          that.uploadDisabled = that.value.length >= that.num;
        })

      },
      handleChange(file, fileList) {
        this.uploadDisabled = fileList.length >= this.num;
      },
      handleRemove(file, fileList) {
        setTimeout(() => {
          this.uploadDisabled = fileList.length >= this.num;
        }, 500)
      },
      handleSuccess(response, file, fileList) {
        // this.value = []
        this.$set(this.value, this.value.length, response.path)
        // fileList.forEach(item => {
        //   this.$set(this.value, this.value.length, item.response.path)
        // })
        // console.log(fileList);
      }
    }
  }
</script>

<style>
  .disabled .el-upload--picture-card {
    display: none !important;
  }

  ::v-deep .el-icon-circle-close {
    color: red;
  }

  .material-name {
    padding: 8px 0px;
  }

  .col-do {
    text-align: center;
  }

  .button-do {
    padding: unset !important;
    font-size: 12px;
  }
  .is-ready {
    margin: 0 !important;
  }
</style>
