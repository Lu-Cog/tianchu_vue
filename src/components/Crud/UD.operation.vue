<template>
  <div style="font-size: 20px;display: flex;align-items: center;">
    <slot name="caozuo"></slot>
    <i v-permission="permission.edit" :loading="crud.status.cu === 2" :disabled="disabledEdit"
      @click="crud.toEdit(data)" class="el-icon-edit" style="color: rgba(67, 207, 124, 1);margin: 0 20px;"></i>
    <el-dropdown v-if="show==1">
      <span class="el-dropdown-link" style="display: flex;">
        <img src="@/assets/icons/more.png" alt="">
      </span>
      <el-dropdown-menu slot="dropdown">
        <slot name="caozuo2"></slot>
        <el-dropdown-item>
          <i @click="toDelete" :disabled="disabledDle" class="el-icon-delete"
            style="color: rgba(220, 23, 27, 1);font-size: 24px;"></i>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <i v-else-if="!disabledDle" @click="toDelete" class="el-icon-delete"
      style="color: rgba(220, 23, 27, 1);font-size: 24px;"></i>

    <!-- <el-button v-permission="permission.edit" :loading="crud.status.cu === 2" :disabled="disabledEdit" size="mini" type="primary" icon="el-icon-edit" @click="crud.toEdit(data)" /> -->

  </div>
</template>
<script>
  import CRUD, {
    crud
  } from '@crud/crud'
  export default {
    mixins: [crud()],
    props: {
      show: {
        type: Number
      },
      data: {
        type: Object,
        required: true
      },
      permission: {
        type: Object,
        required: true
      },
      disabledEdit: {
        type: Boolean,
        default: false
      },
      disabledDle: {
        type: Boolean,
        default: false
      },
      msg: {
        type: String,
        default: '确定删除本条数据吗？'
      }
    },
    data() {
      return {
        pop: false
      }
    },
    methods: {
      doCancel() {
        this.pop = false
        this.crud.cancelDelete(this.data)
      },
      toDelete() {
        this.$confirm('确定删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.crud.doDelete(this.data)
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      [CRUD.HOOK.afterDelete](crud, data) {
        if (data === this.data) {
          this.pop = false
        }
      },
      onPopoverShow() {
        setTimeout(() => {
          document.addEventListener('click', this.handleDocumentClick)
        }, 0)
      },
      onPopoverHide() {
        document.removeEventListener('click', this.handleDocumentClick)
      },
      handleDocumentClick(event) {
        this.pop = false
      }
    }
  }
</script>
