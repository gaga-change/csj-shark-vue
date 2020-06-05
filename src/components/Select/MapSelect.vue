<template>
  <el-select
    :value="value"
    @change="handleChange"
    :placeholder="placeholder || '请选择'"
    clearable
    :loading="loading"
    :disabled="disabled"
  >
    <el-option
      v-for="item in mapConfig[map]"
      :key="item.value"
      :label="item.name"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    placeholder: String,
    value: Number,
    map: String,
    name: String,
    disabled: Boolean
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      'mapConfig': 'mapConfig',
    }),
    loading() {
      return this.mapConfig.loading
    }
  },
  watch: {
    mapConfig(val) {
      if (val.loading === true) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      const map = this.map
      if (!this.mapConfig[map]) {
        console.error(`MapSelect: 【${map}】枚举不存在`)
      } else if (this.value === undefined || this.value === null) {
        this.$emit('update:name', '')
      } else {
        let temp = this.mapConfig[map].find(v => v.key === this.value)
        if (!temp) {
          this.$emit('update', undefined)
        }
        this.$emit('update:name', temp && temp.value)
      }

    },
    handleChange(v) {
      const map = this.map
      let temp = this.mapConfig[map].find(item => item.key === v)
      this.$emit('update', v || undefined)
      this.$emit('update:name', temp && temp.value)
    }
  }
}
</script>