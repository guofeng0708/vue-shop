export interface Menu {
  id: number
  pid: number
  icon: string
  menu_name: string
  module: string
  controller: string
  action: string
  api_url: string
  methods: string
  params: string
  sort: number
  is_show: 0 | 1
  is_show_path: number
  access: number
  menu_path: string
  path: string
  auth_type: 1 | 2
  header: string
  is_header: number
  unique_auth: string
  is_del: number
  statusLoading?: boolean
  children: Menu[]
}
