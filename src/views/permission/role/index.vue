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
            v-model="listParams.status"
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
        <el-form-item label="身份昵称">
          <el-input
            v-model="listParams.role_name"
            clearable
            placeholder="请输入身份昵称"
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
          添加角色
        </el-button>
      </template>
      <el-table
        :data="list"
        stripe
        style="width: 100%"
        v-loading="listLoading"
      >
        <el-table-column
          prop="id"
          label="ID"
        />
        <el-table-column
          prop="role_name"
          label="身份昵称"
        />
        <el-table-column
          prop="rules"
          label="权限"
        >
          <template #default="scope">
            <div
              class="text-nowrap"
              :title="scope.row.rules"
            >
              {{ scope.row.rules }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :loading="scope.row.statusLoading"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="100"
          align="center"
        >
          <template #default="scope">
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
        </el-table-column>
      </el-table>
      <app-pagination
        v-model:page="listParams.page"
        v-model:limit="listParams.limit"
        :list-count="listCount"
        :load-list="loadList"
        :disabled="listLoading"
      />
    </app-card>
  </page-container>
  <role-form
    v-model="formVisible"
    v-model:role-id="roleId"
    @success="handleFormSuccess"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getRoles, deleteRole, updateRoleStatus } from '@/api/role'
import type { IListParams, Role } from '@/api/types/role'
import { ElMessage } from 'element-plus'
import RoleForm from './RoleForm.vue'

const list = ref<Role[]>([]) // 列表数据
const listCount = ref(0)
const listLoading = ref(true)
const listParams = reactive({ // 列表数据查询参数
  page: 1, // 当前页码
  limit: 10, // 每页大小
  role_name: '',
  status: '' as IListParams['status']
})
const formVisible = ref(false)
const roleId = ref<number | null>(null)

onMounted(() => {
  loadList()
})

const loadList = async () => {
  listLoading.value = true
  const data = await getRoles(listParams).finally(() => {
    listLoading.value = false
  })
  data.list.forEach(item => {
    item.statusLoading = false // 控制切换状态的 loading 效果
  })
  list.value = data.list
  listCount.value = data.count
}

const handleQuery = async () => {
  listParams.page = 1 // 查询默认从第1页开始
  loadList()
}

const handleDelete = async (id: number) => {
  await deleteRole(id)
  ElMessage.success('删除成功')
  loadList()
}

const handleStatusChange = async (item: Role) => {
  item.statusLoading = true
  await updateRoleStatus(item.id, item.status).finally(() => {
    item.statusLoading = false
  })
  ElMessage.success(`${item.status === 1 ? '启用' : '禁用'}成功`)
}

const handleUpdate = (id: number) => {
  roleId.value = id
  formVisible.value = true
}

const handleFormSuccess = () => {
  formVisible.value = false
  loadList()
}

</script>

<style lang="scss" scoped>
.text-nowrap {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
