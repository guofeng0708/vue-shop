<template>
  <app-dialog-form
    :title="props.ruleId ? '编辑规则' : '添加规则'"
    :confirm="handleSubmit"
    width="60%"
    append-to-body
    @closed="handleDialogClosed"
    @open="handleDialogOpen"
  >
    <el-form
      label-width="110px"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      ref="form"
      :validate-on-rule-change="false"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="类型">
            <el-radio-group v-model="formData.auth_type">
              <el-radio :label="2">
                接口
              </el-radio>
              <el-radio :label="1">
                菜单（只显示三级）
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="名称"
            prop="menu_name"
          >
            <el-input v-model="formData.menu_name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="父级分类"
            prop="path"
          >
            <el-cascader
              v-model="formData.path"
              :options="menus"
              clearable
              :props="{ checkStrictly: true }"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
        <template v-if="formData.auth_type === 2">
          <el-col :span="12">
            <el-form-item
              label="请求方式"
              prop="methods"
            >
              <el-select v-model="formData.methods">
                <el-option
                  v-for="item in methods"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="接口地址"
              prop="api_url"
            >
              <el-input v-model="formData.api_url" />
            </el-form-item>
          </el-col>
        </template>
        <template v-else>
          <el-col :span="12">
            <el-form-item
              label="接口参数"
              prop="params"
            >
              <el-input v-model="formData.params" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="路由路径"
              prop="menu_path"
            >
              <el-input v-model="formData.menu_path" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="图标"
              prop="icon"
            >
              <el-input v-model="formData.icon" />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="12">
          <el-form-item
            label="权限标识"
            prop="unique_auth"
          >
            <el-input v-model="formData.unique_auth" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="排序"
            prop="sort"
          >
            <el-input v-model.number="formData.sort" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="状态"
            prop="is_show"
          >
            <el-radio-group v-model="formData.is_show">
              <el-radio :label="0">
                关闭
              </el-radio>
              <el-radio :label="1">
                开启
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否展示"
            prop="is_show_path"
          >
            <el-radio-group v-model="formData.is_show_path">
              <el-radio :label="0">
                否
              </el-radio>
              <el-radio :label="1">
                是
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </app-dialog-form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import * as menuApi from '@/api/menu'
import { ElMessage } from 'element-plus'
import type { Menu } from '@/api/types/menu'
import type { PropType } from 'vue'
import type { IElForm } from '@/types/element-plus'

const props = defineProps({
  ruleId: {
    type: Number as PropType<number | null>,
    default: null
  },
  pid: {
    type: Number as PropType<number | null>,
    default: null
  }
})
const emit = defineEmits(['success', 'update:rule-id', 'update:pid'])

const form = ref<IElForm | null>(null)
const formData = ref<{ path: number[] } & Omit<Menu, 'id' | 'children' | 'is_del' | 'path'>>({
  auth_type: 1,
  menu_name: '',
  pid: 0,
  params: '',
  controller: '',
  module: '',
  action: '',
  icon: '',
  path: [],
  menu_path: '',
  api_url: '',
  methods: '',
  unique_auth: '',
  header: '',
  is_header: 0,
  sort: 0,
  access: 0,
  is_show: 0,
  is_show_path: 1
})

const menuRules = {
  menu_path: [
    { message: '请输入路由路径', required: true, trigger: 'change' }
  ],
  unique_auth: [
    { message: '请输入权限标识', required: true, trigger: 'change' }
  ]
}

const apiRules = {
  methods: [
    { message: '请选择请求方式', required: true, trigger: 'change' }
  ],
  api_url: [
    { message: '请输入接口地址', required: true, trigger: 'change' }
  ]
}

const commonRules = {
  menu_name: [
    { message: '请输入按钮名称', required: true, trigger: 'change' }
  ]
}

const formRules = computed(() => {
  // 清除验证结果
  form.value?.clearValidate()
  return formData.value.auth_type === 1
    ? { ...menuRules, ...commonRules }
    : { ...apiRules, ...commonRules }
})

const menus = ref<Menu[]>([])

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(item => ({
  label: item,
  value: item
}))

const formLoading = ref(false)

const handleDialogOpen = async () => {
  formLoading.value = true
  await Promise.all([
    loadMenus(),
    loadMenu(),
    setDefaultMenuPath()
  ]).finally(() => {
    formLoading.value = false
  })
}

const loadMenus = async () => {
  const data = await menuApi.getMenuTree()
  menus.value = data
}

const setDefaultMenuPath = async () => {
  if (props.pid) {
    const menu = await menuApi.getMenu(props.pid)
    formData.value.pid = props.pid
    formData.value.path = [...menu.path, props.pid]
  }
}

const loadMenu = async () => {
  if (!props.ruleId) {
    return
  }
  const data = await menuApi.getMenu(props.ruleId)
  data.path = [
    ...data.path,
    data.id
  ]
  formData.value = data
}

const handleChange = (value: any) => {
  formData.value.pid = value[value.length - 1]
}

const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return
  console.log(formData.value.path)
  if (props.ruleId) {
    await menuApi.updateMenu(props.ruleId, formData.value)
  } else {
    await menuApi.createMenu(formData.value)
  }
  ElMessage.success('保存成功')
  emit('success')
}

const handleDialogClosed = () => {
  emit('update:rule-id', null)
  emit('update:pid', null)
  form.value?.clearValidate() // 清除验证结果
  form.value?.resetFields() // 清除表单数据
}
</script>

<style lang="scss" scoped></style>
