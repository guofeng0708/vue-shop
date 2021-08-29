<template>
  <el-form
    label-position="left"
    label-width="50px"
  >
    <app-draggable
      v-model="props.modelValue"
      :options="{
        handle: '.el-icon-menu'
      }"
    >
      <el-form-item
        v-for="(item, index) in props.modelValue"
        :key="item.value"
        :label="item.value"
      >
        <template #label>
          <i class="el-icon-menu" />
        </template>
        <div>
          <el-tag
            closable
            effect="dark"
            @close="props.modelValue.splice(index, 1)"
          >
            {{ item.value }}
          </el-tag>
        </div>
        <div>
          <app-draggable
            style="display: inline-block;"
            v-model="item.detail"
          >
            <el-tag
              class="detail-item"
              v-for="(detail, detailIndex) in item.detail"
              :key="detail"
              closable
              effect="plain"
              @close="item.detail.splice(detailIndex, 1)"
            >
              {{ detail }}
            </el-tag>
          </app-draggable>
          <el-input
            class="input-new-tag"
            v-if="item.inputVisible"
            v-model="item.inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.prevent="handleInputConfirm(item)"
            @blur.prevent="handleInputConfirm(item)"
          />
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput(item)"
          >
            + New Tag
          </el-button>
        </div>
      </el-form-item>
    </app-draggable>
    <el-form-item v-if="!isAdd">
      <el-button
        type="primary"
        @click="isAdd = true"
      >
        添加新规格
      </el-button>
      <el-button
        type="success"
        @click="handleGenerate"
      >
        立即生成
      </el-button>
    </el-form-item>
    <el-form-item v-else>
      <el-form
        :model="attrForm"
        :rules="formRules"
        ref="form"
        inline
      >
        <el-form-item
          label="规格名称"
          prop="value"
        >
          <el-input v-model="attrForm.value" />
        </el-form-item>
        <el-form-item
          label="规格值"
          prop="detail"
        >
          <el-input v-model="attrForm.detail[0]" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleAddAttr"
          >
            确认
          </el-button>
          <el-button @click="isAdd = false">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import type { PropType } from 'vue'
import type { AttrRuleValue } from '@/api/types/product'
import { generateAttr } from '@/api/product'
import type { IElForm } from '@/types/element-plus'

const emit = defineEmits(['confirm', 'update:model-value'])

const props = defineProps({
  modelValue: {
    type: Array as PropType<AttrRuleValue[]>,
    default: () => []
  }
})

const saveTagInput = ref<HTMLInputElement | null>(null)

const attrForm = ref({
  value: '',
  detail: ['']
})

const isAdd = ref(false)

const formRules = {
  value: [
    { required: true, message: '请输入规则名称', trigger: 'change' }
  ],
  detail: [
    { required: true, message: '请输入规则值', trigger: 'change' }
  ]
}

const form = ref<IElForm | null>(null)

const handleGenerate = async () => {
  const data = await generateAttr(0, 1, {
    attrs: props.modelValue
  })
  emit('confirm', data.info)
}

const handleInputConfirm = (item: AttrRuleValue) => {
  if (item.inputValue?.length) {
    item.detail.push(item.inputValue)
  }
  item.inputVisible = false
  item.inputValue = ''
}

const showInput = async (item: AttrRuleValue) => {
  item.inputVisible = true
  await nextTick()
  saveTagInput.value?.focus()
}

const handleAddAttr = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  props.modelValue.push({
    value: attrForm.value.value,
    detail: attrForm.value.detail,
    inputVisible: false,
    inputValue: ''
  })
  isAdd.value = false
  form.value?.resetFields()
}
</script>

<style lang="scss" scoped>

.el-icon-menu {
  font-size: 20px;
  cursor: move;
}
.detail-item {
  margin-right: 10px;
}

.el-form-item {
  align-items: center;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
