/**
 * 公共基础接口封装
 */
import request from '@/utils/request'
import { ILoginInfo } from './types/common'

export const getLoginInfo = () => {
  return request<ILoginInfo>({
    method: 'GET',
    url: 'admin/login/info'
  })
}
