<template>
  <page-container>
    <app-card>
      <template #header>
        数据筛选
      </template>
      <el-form
        :inline="true"
        ref="form"
        :model="listParams"
        :disabled="listLoading"
        @submit.prevent="handleQuery"
      >
        <el-form-item label="状态">
          <el-select
            v-model="listParams.is_show"
            placeholder="请选择"
            clearable
          >
            <el-option
              label="全部"
              value=""
            />
            <el-option
              label="显示"
              :value="1"
            />
            <el-option
              label="不显示"
              :value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称">
          <el-input
            v-model="listParams.keyword"
            clearable
            placeholder="请输入规则名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </app-card>
    <app-card>
      <template #header>
        <el-button
          type="primary"
          @click="formVisible = true"
        >
          添加规则
        </el-button>
      </template>
      <!--
        启用树菜单：
          1. data 数据需要是树结构
          2. 给 vxe-table 组件设置 row-id
          3. 给 vxe-column 设置 tree-node
       -->
      <vxe-table
        :data="list"
        row-id="id"
        :tree-config="{ children: 'children' }"
        v-loading="listLoading"
      >
        <vxe-column
          field="id"
          title="ID"
        />
        <vxe-column
          field="menu_name"
          title="名称"
          tree-node
        />
        <vxe-column
          title="接口路径"
        >
          <template #default="{ row }">
            {{ row.api_url ? `[${row.methods}] ${row.api_url}` : '' }}
          </template>
        </vxe-column>
        <vxe-column
          field="unique_auth"
          title="前端权限"
        />
        <vxe-column
          field="menu_path"
          title="页面路由"
        />
        <vxe-column title="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.is_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              @change="handleStatusChange(row)"
            />
          </template>
        </vxe-column>
        <vxe-column
          title="操作"
          min-width="100"
        >
          <template #default="scope">
            <el-button
              type="text"
              @click="handleCreate(scope.row.id)"
            >
              添加规则
            </el-button>
            <el-button
              type="text"
              @click="handleUpdate(scope.row.id)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="确认删除吗？"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="text">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
    </app-card>
  </page-container>
  <rule-form
    v-model="formVisible"
    v-model:rule-id="ruleId"
    v-model:pid="pid"
    @success="handleFormSuccess"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getMenus, deleteMenu, updateMenuStatus } from '@/api/menu'
import type { Menu } from '@/api/types/menu'
import { ElMessage } from 'element-plus'
import RuleForm from './RuleForm.vue'

const list = ref<Menu[]>([]) // 列表数据
const listLoading = ref(true)
const listParams = reactive({ // 列表数据查询参数
  keyword: '',
  is_show: '' as 0 | 1 | ''
})
const formVisible = ref(false)
const ruleId = ref<number | null>(null)
const pid = ref<number | null>(null)

onMounted(() => {
  loadList()
})

const loadList = async () => {
  listLoading.value = true
  const data = await getMenus(listParams).finally(() => {
    listLoading.value = false
  })
  data.forEach(item => {
    item.statusLoading = false // 控制切换状态的 loading 效果
  })
  list.value = data
}

const handleQuery = async () => {
  loadList()
}

const handleDelete = async (id: number) => {
  await deleteMenu(id)
  ElMessage.success('删除成功')
  loadList()
}

const handleStatusChange = async (item: Menu) => {
  item.statusLoading = true
  await updateMenuStatus(item.id, item.is_show).finally(() => {
    item.statusLoading = false
  })
  ElMessage.success(`${item.is_show === 1 ? '启用' : '禁用'}成功`)
}

const handleUpdate = (id: number) => {
  ruleId.value = id
  formVisible.value = true
}

const handleFormSuccess = () => {
  formVisible.value = false
  loadList()
}

const handleCreate = (id: number) => {
  pid.value = id
  formVisible.value = true
}

</script>

<style lang="scss" scoped></style>
