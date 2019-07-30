<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
        >打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initData()
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    initData() {
      console.log(this.rows)
    },
    close() {
      this.visible && this.$emit('update:visible', false)
    },
    confirm() {

    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    }
  }
}
</script>