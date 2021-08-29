export interface FileItem {
  att_dir: string
  att_id: number
  att_size: string
  att_type: string
  image_type: number
  module_type: number
  name: string
  pid: number
  real_name: string
  satt_dir: string
  time: number
}

export interface FileCategory {
  id: number
  pid: number
  name: string
  enname: string
  child?: FileCategory[]
}
