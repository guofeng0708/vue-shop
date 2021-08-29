export interface Role {
  id: number
  role_name: string
  rules: string
  level: number
  status: 0 | 1
  statusLoading?: boolean
}

export interface IListParams {
  page: number
  limit: number
  status: 0 | 1 | ''
  role_name: string
}

export interface RolePostData {
  role_name: string
  status: 0 | 1
  checked_menus: number[]
}

export interface EditRole {
  id: number
  level: number
  role_name: string
  rules: string
  status: 0 | 1
}

export interface Menu {
  pid: number
  id: number
  title: string
  expand: boolean
  children?: Menu[]
}
