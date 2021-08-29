import request from '@/utils/request'
import {
  Product,
  ProductType,
  ProductListParams,
  ProductCategory,
  AttrRuleValue,
  ProductAttrTpl,
  IExpressTemplate,
  AttrTableHeader,
  ProductAttr
} from './types/product'

/**
 * 获取商品类目列表
 * @returns 商品类目列表
 */
export const getProductTypes = () => {
  return request<{
    list: ProductType[]
  }>({
    method: 'GET',
    url: '/product/product/type_header'
  })
}

/**
 * 获取商品列表
 * @param params 查询参数
 * @returns 商品列表
 */
export const getProducts = (params?: ProductListParams) => {
  return request<{
    count: number
    list: Product[]
  }>({
    method: 'GET',
    url: '/product/product',
    params
  })
}

/**
 * 保存新增或编辑
 * @param id 商品ID
 * @param data 商品数据
 * @returns null
 */
export const saveProduct = (id: number, data: any) => {
  return request({
    method: 'POST',
    url: `/product/product/${id}`,
    data
  })
}

/**
 * 获取商品
 * @param id 商品id
 * @returns 商品
 */
export const getProduct = (id: number) => {
  return request<{
    tempList: {
      id: number
      name: string
    }[]
    cateList: {
      value: number
      label: string
      disabled: number
    }[]
    productInfo: {
      cate_id: string[]
      is_sub: number[]
      activity: string[]
      label_id: string[]
      coupons: string[]
      description: string
      items: string[]
      attrs: string[]
      attr: {
        pic: string
        vip_price: number
        price: number
        cost: number
        ot_price: number
        stock: number
        bar_code: string
        weight: number
        volume: number
        brokerage: number
        brokerage_two: number
      }
    } & Omit<Product, 'cate_id' | 'is_sub' | 'activity' | 'label_id' | 'collect' | 'likes' | 'visitor' | 'cate_name' | 'stock_attr'>
  }>({
    method: 'GET',
    url: `/product/product/${id}`
  })
}

export const getCategoryTree = (type: 0 | 1) => {
  return request<ProductCategory[]>({
    method: 'GET',
    url: `/product/category/tree/${type}`
  })
}

/**
 * 商品上下架操作
 */
export const updateProductStatus = (id: number, status: number) => {
  return request({
    method: 'PUT',
    url: `/product/product/set_show/${id}/${status}`
  })
}

/**
 * 商品加入/移除回收站
 */
export const removeProduct = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/product/product/${id}`
  })
}

/**
 * 获取商品规格模板
 */
export const getAttrs = () => {
  return request<ProductAttrTpl[]>({
    method: 'GET',
    url: '/product/product/get_rule'
  })
}

/**
 * 生成商品属性
 */
export const generateAttr = (id: number, type: 0 | 1, data: {
  attrs: AttrRuleValue[]
}) => {
  return request<{
    info: {
      attr: AttrRuleValue[]
      header: AttrTableHeader[]
      value: ProductAttr[]
    }
  }>({
    method: 'POST',
    url: `/product/generate_attr/${id}/${type}`,
    data
  })
}

/**
 * 获取运费模板
 */
export const getExpressTemplate = () => {
  return request<IExpressTemplate[]>({
    method: 'GET',
    url: '/product/product/get_template'
  })
}

/**
 * 获取商品规格列表
 */
export const getProductRules = () => {
  return request({
    method: 'GET',
    url: '/product/product/rule'
  })
}

/**
 * 批量上架
 */
export const updateProductsShow = (ids: number[]) => {
  return request({
    method: 'PUT',
    url: '/product/product/product_show',
    data: {
      ids
    }
  })
}

/**
 * 批量下架
 */
export const updateProductsUnshow = (ids: number[]) => {
  return request({
    method: 'PUT',
    url: '/product/product/product_unshow',
    data: {
      ids
    }
  })
}
