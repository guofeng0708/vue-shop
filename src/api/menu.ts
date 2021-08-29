import request from '@/utils/request'
import { IFormData } from './types/form'
import { Menu } from './types/menu'

// 获取权限列表
export const getMenus = (params: {
  is_show: 0 | 1 | ''
  keyword: string
}) => {
  return request<Menu[]>({
    method: 'GET',
    url: '/setting/menus',
    params
  })
}

// 添加权限
export const createMenu = (data: {
  path: number[]
} & Omit<Menu, 'id' | 'children' | 'is_del' | 'path'>) => {
  return request({
    method: 'POST',
    url: '/setting/menus',
    data
  })
}

// 获取添加权限规则表单
export const getMenuTree = () => {
  return request<IFormData>({
    method: 'GET',
    url: '/setting/menus/create'
  }).then(data => {
    const findData = data.rules.find(item => item.field === 'menu_list')
    return (findData && findData.props && findData.props.data) || []
  })
}

// 修改权限规则
export const updateMenu = (id: number, data: { path: number[] } & Omit<Menu, 'id' | 'children' | 'is_del' | 'path'>) => {
  return request({
    method: 'PUT',
    url: `/setting/menus/${id}`,
    data
  })
}

// 删除权限
export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/setting/menus/${id}`
  })
}

// 获取单个规则
export const getMenu = (id: number) => {
  return request<{
    path: number[]
  } & Omit<Menu, 'path'>>({
    method: 'GET',
    url: `/setting/menus/${id}`
  })
}

// 修改状态
export const updateMenuStatus = (id: number, isShow: 0 | 1) => {
  return request({
    method: 'PUT',
    url: `/setting/menus/show/${id}`,
    data: {
      is_show: isShow
    }
  })
}
