import request from '@/utils/request'
import { FileItem, FileCategory } from './types/file'

export const getFiles = (params: {
  page: number
  limit: number
  pid: number
}) => {
  return request<{
    count: number
    list: FileItem[]
  }>({
    method: 'GET',
    url: '/file/file',
    params
  })
}

export const getFileCategories = (params: {
  name: string
}) => {
  return request<{
    list: FileCategory[]
  }>({
    method: 'GET',
    url: '/file/category',
    params
  })
}

export const uploadFile = (data: {
  pid: number
  file: File
}) => {
  const fd = new FormData()
  fd.append('pid', data.pid.toString())
  fd.append('file', data.file)
  return request<{
    list: FileCategory[]
  }>({
    method: 'POST',
    url: '/file/upload',
    data: fd
  })
}
