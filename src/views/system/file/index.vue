<template>
  <page-container>
    <app-card>
      <template #header>
        素材分类
      </template>
      <el-form
        ref="form"
        :model="listParams"
        :disabled="listLoading"
        inline
        @submit.prevent="handleQuery"
      >
        <el-form-item>
          <el-select
            v-model="listParams.pid"
            filterable
            placeholder="请选择"
            @change="loadList"
          >
            <el-option
              :value="0"
              label="全部"
            />
            <el-option
              v-for="item in fileCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit">
            添加分类
          </el-button>
        </el-form-item>
      </el-form>
    </app-card>
    <app-card>
      <template #header>
        <el-button
          type="primary"
          @click="emit('confirm', multipleSelection)"
        >
          使用选中图片
        </el-button>
        <el-upload
          action="xxx"
          multiple
          :limit="3"
          :http-request="handleUpload"
          :show-file-list="false"
        >
          <el-button
            type="primary"
          >
            上传图片
          </el-button>
        </el-upload>
        <el-button
          type="danger"
        >
          删除图片
        </el-button>
        <el-select
          placeholder="图片移动至"
          v-model="moveCate"
        >
          <el-option
            v-for="item in fileCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </template>
      <el-table
        :data="list"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column label="图片">
          <template #default="{ row }">
            <el-image
              :key="row.att_id"
              style="width: 50px; height: 50px"
              :src="row.att_dir"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="图片名称"
          prop="real_name"
        />
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
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getFiles, getFileCategories, uploadFile } from '@/api/file'
import type { FileItem, FileCategory } from '@/api/types/file'

const emit = defineEmits(['confirm'])
const fileCategories = ref<FileCategory[]>([])
const list = ref<FileItem[]>([]) // 列表数据
const listCount = ref(0)
const listLoading = ref(true)
const listParams = reactive({ // 列表数据查询参数
  page: 1, // 当前页码
  limit: 10, // 每页大小
  pid: 0
})
const multipleSelection = ref<FileItem[]>([])

const moveCate = ref('')

onMounted(() => {
  loadList()
  loadFileCategories()
})

const handleSelectionChange = (val: FileItem[]) => {
  multipleSelection.value = val
}

const loadList = async () => {
  listLoading.value = true
  const data = await getFiles(listParams).finally(() => {
    listLoading.value = false
  })
  list.value = data.list
  listCount.value = data.count
}

const loadFileCategories = async () => {
  const data = await getFileCategories({ name: '' })
  fileCategories.value = data.list
}

const handleQuery = async () => {
  listParams.page = 1 // 查询默认从第1页开始
  loadList()
}

const handleUpload = async ({ file }: { file: File }) => {
  console.log(file)
  await uploadFile({
    pid: listParams.pid,
    file
  })
  loadList()
}

</script>

<style lang="scss" scoped></style>
