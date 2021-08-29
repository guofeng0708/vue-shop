import request from '@/utils/request'
import { IUserLabel } from './types/user'

/**
 * 获取用户标签列表
 */
export const getUserLabels = () => {
  return request<{
    count: number
    list: IUserLabel[]
  }>({
    method: 'GET',
    url: '/user/user_label'
  })
}
