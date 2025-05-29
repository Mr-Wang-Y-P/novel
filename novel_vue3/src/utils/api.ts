// 导入请求封装模块
import request from './request';
import { bookInfo } from '@/interface/dashBoard'
/**
 * 请求数据类型定义
 * @interface RequestData
 * @property {string} [bookUrl] - 书籍 URL
 * @property {string} [infoUrl] - 章节信息 URL
 * @property {number} [page] - 页码
 * @property {number} [pageSize] - 每页数量
 * @property {number} [sortid] - 分类 ID
 * @property {string} [searchValue] - 搜索关键词
 */
type RequestData = {
  bookUrl?: string;
  infoUrl?: string;
  page?: number;
  pageSize?: number;
  sortid?: number;
  searchValue ?: string;
};

/**
 * 请求配置类型定义
 * @interface RequestConfig
 * @property {string} url - 请求地址
 * @property {string} method - 请求方法
 * @property {RequestData} data - 请求数据
 */
type RequestConfig = {
  url: string;
  method: string;
  data: RequestData;
};

/**
 * 获取书籍数据接口
 * @param {string} bookUrl - 书籍 URL
 * @returns {Promise<any>} - 包含书籍数据的 Promise 对象
 */
export const getBooksData = (bookUrl: string): Promise<any> => {
  // 配置请求信息
  const config: RequestConfig = {
    url: '/getBooksData',
    method: 'post',
    data: { bookUrl }
  };
  return request(config);
};

/**
 * 获取章节数据接口
 * @param {string} infoUrl - 章节信息 URL
 * @returns {Promise<any>} - 包含章节数据的 Promise 对象
 */
export const getInfoData = (infoUrl: string): Promise<any> => {
  // 配置请求信息
  const config: RequestConfig = {
    url: '/getInfoData',
    method: 'post',
    data: { infoUrl }
  };
  return request(config);
};

/**
 * 获取所有类型数据接口
 * @returns {Promise<any>} - 包含所有类型数据的 Promise 对象
 */
export const getAllTypesData = (): Promise<any> => {
  // 配置请求信息
  const config: RequestConfig = {
    url: '/getAllTypes',
    method: 'post',
    data: { }
  };
  return request(config);
};

/**
 * 获取所有图书数据接口
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @param {number} sortid - 分类 ID
 * @returns {Promise<any>} - 包含所有图书数据的 Promise 对象
 */
export const getAllBooksData = (params: RequestData): Promise<{ total: number; page: number; pageSize: number; data: bookInfo[] }> => {
  // 配置请求信息
  const config: RequestConfig = {
    url: '/getAllBooks',
    method: 'post',
    data: params
  };
  return request(config);
};