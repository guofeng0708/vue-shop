export interface Product {
  id: number
  mer_id: number
  image: string
  recommend_image: string
  slider_image: string[]
  store_name: string
  store_info: string
  keyword: string
  bar_code: string
  cate_id: string
  price: string
  vip_price: string
  ot_price: string
  postage: string
  unit_name: string
  sort: number
  sales: number
  stock: string
  is_show: number
  is_hot: number
  is_benefit: number
  is_best: number
  is_new: number
  add_time: number
  is_postage: number
  is_del: number
  mer_use: number
  give_integral: string
  cost: string
  is_seckill: number
  is_bargain: null
  is_good: number
  is_sub: number
  is_vip: number
  ficti: number
  browse: number
  code_path: string
  soure_link: string
  video_link: string
  temp_id: number
  spec_type: number
  activity: string
  spu: string
  label_id: string
  command_word: string
  collect: number
  likes: number
  visitor: number
  cate_name: string
  stock_attr: boolean
  statusLoading?: boolean
}

export interface ProductType {
  type: number
  name: string
  count: number
}

export interface ProductListParams {
  page?: number
  limit?: number
  cate_id?: number
  type?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  store_name?: string
  sales?: 'normal' | 'desc' | 'asc'
}

export interface ProductCategory {
  add_time: string
  big_pic: string
  cate_name: string
  html: string
  id: number
  is_show: 0 | 1
  pic: string
  pid: number
  sort: number
}

export interface AttrRuleValue {
  value: string
  detail: string[]
  inputVisible?: boolean
  inputValue?: string
}

export interface ProductAttrTpl {
  id: number
  attr_name: string
  rule_name: string
  attr_value: string[]
  rule_value: AttrRuleValue[]
}

export interface IExpressTemplate {
  id: number
  name: string
}

export interface AttrTableHeader {
  align: string
  key: string
  minWidth: number
  title: string
}

export type ProductAttr = Record<string, any> & {
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

// export interface ProductAttr {
//   bar_code: string
//   brokerage: number
//   brokerage_two: number
//   cost: number
//   ot_price: number
//   pic: string
//   price: number
//   stock: number
//   vip_price: number
//   volume: number
//   weight: number
// }
