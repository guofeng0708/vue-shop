<template>
  <page-container>
    <app-card>
      <template #header>
        数据筛选
      </template>
      <el-form
        ref="form"
        :model="listParams"
        :disabled="listLoading"
        label-width="70px"
        @submit.prevent="handleQuery"
      >
        <el-form-item label="商品分类">
          <el-select
            v-model="listParams.cate_id"
            placeholder="请选择"
            clearable
            @change="loadList"
          >
            <el-option
              label="全部"
              :value="0"
            />
            <el-option
              v-for="item in productCates"
              :key="item.id"
              :label="`${item.html}${item.cate_name}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input
            v-model="listParams.store_name"
            placeholder="请输入商品名称关键字"
            clearable
            style="width: 300px;"
          >
            <template #append>
              <el-button
                icon="el-icon-search"
                @click="loadList"
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品类目">
          <el-radio-group
            v-model="listParams.type"
            @change="loadList"
          >
            <el-radio :label="0">
              全部
            </el-radio>
            <el-radio
              v-for="item in productTypes"
              :key="item.type"
              :label="item.type"
            >
              {{ `${item.name}(${item.count})` }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </app-card>
    <app-card>
      <template #header>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('/admin/product/add_product')"
        >
          添加商品
        </el-button>
        <el-button
          :loading="updateProductsShowLoading"
          @click="handleUpdateProductsShow"
        >
          批量上架
        </el-button>
        <el-button
          :loading="updateProductsUnshowLoading"
          @click="handleUpdateProductsUnshow"
        >
          批量下架
        </el-button>
        <el-button
          icon="el-icon-document"
          :loading="exportExcelLoading"
          @click="handleExportExcel"
        >
          导出表格
        </el-button>
      </template>
      <el-table
        :data="list"
        v-loading="listLoading"
        style="width: 100%"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="expand">
          <template #default="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="商品分类">
                <span>{{ props.row.cate_name }}</span>
              </el-form-item>
              <el-form-item label="市场价格">
                <span>{{ props.row.ot_price }}</span>
              </el-form-item>
              <el-form-item label="成本价">
                <span>{{ props.row.cost }}</span>
              </el-form-item>
              <el-form-item label="收藏数量">
                <span>{{ props.row.collect }}</span>
              </el-form-item>
              <el-form-item label="虚拟销量">
                <span>{{ props.row.ficti }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="id"
          label="商品ID"
        />
        <el-table-column
          prop="id"
          label="商品图片"
        >
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="store_name"
          label="商品名称"
        />
        <el-table-column
          prop="price"
          label="商品售价"
        />
        <el-table-column
          prop="sales"
          label="销量"
          sortable="custom"
        />
        <el-table-column
          prop="stock"
          label="库存"
        />
        <el-table-column
          prop="sort"
          label="排序"
        />
        <el-table-column
          label="状态"
          width="150"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.is_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :loading="scope.row.statusLoading"
              active-text="上架"
              inactive-text="下架"
              @change="handleUpdateStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          min-width="120px"
          label="操作"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <el-button type="text">
              编辑
            </el-button>
            <el-button type="text">
              查看评论
            </el-button>
            <el-popconfirm
              :title="row.is_del ? '确定恢复商品吗？' : '确定移到回收站吗？'"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button type="text">
                  {{ row.is_del ? '恢复商品' : '移到回收站' }}
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
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import * as productApi from '@/api/product'
import { ElMessage } from 'element-plus'
import type { Product, ProductListParams, ProductType, ProductCategory } from '@/api/types/product'
// import { jsonToExcel } from '@/utils/export-to-excel'

const productTypes = ref<ProductType[]>([])
const productCates = ref<ProductCategory[]>([])
const list = ref<Product[]>([])
const listCount = ref(0)
const listLoading = ref(false)
const listParams = reactive<ProductListParams>({
  page: 1,
  limit: 10,
  cate_id: 0,
  type: 0,
  store_name: '',
  sales: 'normal'
})
const selectionItems = ref<Product[]>([])
const updateProductsShowLoading = ref(false)
const updateProductsUnshowLoading = ref(false)
const exportExcelLoading = ref(false)

onMounted(() => {
  loadList()
  loadProductCates()
})

const handleSelectionChange = (val: Product[]) => {
  selectionItems.value = val
}

const loadList = async () => {
  listLoading.value = true
  const data = await productApi.getProducts(listParams).finally(() => {
    listLoading.value = false
  })
  data.list.forEach(item => {
    item.statusLoading = false
  })
  list.value = data.list
  listCount.value = data.count

  // 更新商品类型
  loadProductTypes()
}

const loadProductCates = async () => {
  const data = await productApi.getCategoryTree(1)
  productCates.value = data
}

const loadProductTypes = async () => {
  const data = await productApi.getProductTypes()
  productTypes.value = data.list
}

const handleQuery = () => {
  listParams.page = 1
  loadList()
}

const handleUpdateStatus = async (item: Product) => {
  item.statusLoading = true
  await productApi.updateProductStatus(item.id, item.is_show).finally(() => {
    item.statusLoading = false
  })
  ElMessage.success(`${item.is_show ? '上架' : '下架'}成功`)
  loadList()
}

const handleDelete = async (id: number) => {
  await productApi.removeProduct(id)
  loadList()
}

const handleSortChange = ({ prop, order }: { prop: string, order: 'descending' | 'ascending' | null }) => {
  let sales: ProductListParams['sales'] = 'normal'
  switch (order) {
    case 'ascending':
      sales = 'asc'
      break
    case 'descending':
      sales = 'desc'
      break
  }
  listParams.sales = sales
  loadList()
}

const handleUpdateProductsShow = async () => {
  if (!selectionItems.value.length) {
    return ElMessage.warning('请选择商品')
  }
  updateProductsShowLoading.value = true
  await productApi.updateProductsShow(selectionItems.value.map(item => item.id)).finally(() => {
    updateProductsShowLoading.value = false
  })
  ElMessage.success('批量上架成功')
  loadList()
}

const handleUpdateProductsUnshow = async () => {
  if (!selectionItems.value.length) {
    return ElMessage.warning('请选择商品')
  }
  updateProductsUnshowLoading.value = true
  await productApi.updateProductsUnshow(selectionItems.value.map(item => item.id)).finally(() => {
    updateProductsUnshowLoading.value = false
  })
  ElMessage.success('批量下架成功')
  loadList()
}

const handleExportExcel = async () => {
  if (!selectionItems.value.length) {
    return ElMessage.warning('请选择商品')
  }
  exportExcelLoading.value = true
  try {
    const { jsonToExcel } = await import('@/utils/export-to-excel')
    jsonToExcel({
      data: selectionItems.value,
      header: {
        id: '编号',
        store_name: '商品名称',
        price: '价格'
      },
      fileName: '测试.xlsx',
      bookType: 'xlsx'
    })
  } catch (err) {
    console.error(err)
  }
  exportExcelLoading.value = false
}

</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.demo-table-expand {
  font-size: 0;
  :deep(label) {
    width: 90px;
    color: #99a9bf;
  }
  :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}

</style>
