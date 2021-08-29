<template>
  <el-table
    :data="props.modelValue"
    border
  >
    <slot name="prepend" />
    <el-table-column
      label="图片"
      min-width="100"
    >
      <template #default="{ row }">
        <el-input v-model="row.pic" />
      </template>
    </el-table-column>
    <el-table-column
      label="售价"
      min-width="155"
    >
      <template #default="{ row }">
        <el-input-number
          v-model.number="row.price"
          controls-position="right"
          :min="0"
        />
      </template>
    </el-table-column>
    <el-table-column
      min-width="155"
      label="成本价"
    >
      <template #default="{ row }">
        <el-input-number
          v-model.number="row.cost"
          controls-position="right"
          :min="0"
        />
      </template>
    </el-table-column>
    <el-table-column
      min-width="155"
      label="原价"
    >
      <template #default="{ row }">
        <el-input-number
          v-model.number="row.ot_price"
          controls-position="right"
          :min="0"
        />
      </template>
    </el-table-column>
    <el-table-column
      min-width="155"
      label="库存"
    >
      <template #default="{ row }">
        <el-input-number
          v-model.number="row.stock"
          controls-position="right"
          :min="0"
        />
      </template>
    </el-table-column>
    <el-table-column
      label="商品编号"
      min-width="155"
    >
      <template #default="{ row }">
        <el-input v-model="row.bar_code" />
      </template>
    </el-table-column>
    <el-table-column
      min-width="155"
      label="重量（KG）"
    >
      <template #default="{ row }">
        <el-input-number
          v-model.number="row.weight"
          controls-position="right"
          :min="0"
        />
      </template>
    </el-table-column>
    <el-table-column
      min-width="155"
      label="体积(m³)"
    >
      <template #default="{ row }">
        <el-input-number
          v-model.number="row.volume"
          controls-position="right"
          :min="0"
        />
      </template>
    </el-table-column>
    <slot name="append" />
  </el-table>
</template>
<script lang="ts" setup>
// import { ref } from 'vue'
import type { PropType } from 'vue'
import type { ProductAttr } from '@/api/types/product'

const props = defineProps({
  modelValue: {
    type: Array as PropType<ProductAttr[]>,
    default: () => []
  }
})

// const data = ref([])
</script>

<style lang="scss" scoped>
</style>
