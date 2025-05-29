/*
 * @Author: 汪迎平
 * @Date: 2025-05-28 18:05:07
 * @LastEditTime: 2025-05-29 09:21:19
 * @LastEditors: 汪迎平
 * @Description: 首页TS类型
 */
export interface bookType {
    name: string;
    sortid: number;
    url: string;
}



export interface bookInfo {
    articlename: string;
    author: string;
    sortid: number;
    intro: string;
    url_img: string;
    url_list: string;
}