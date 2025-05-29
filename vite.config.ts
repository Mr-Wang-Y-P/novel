/*
 * @Author: 汪迎平
 * @Date: 2025-05-28 16:52:17
 * @LastEditTime: 2025-05-29 08:23:21
 * @LastEditors: 汪迎平
 * @Description: 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // 指定开发服务器端口
    port: 4000,
    // 监听所有地址，包括局域网和公网地址，以便通过 IP 访问
    host: true 
  },
  resolve:{   
    //别名配置，引用src路径下的东西可以通过@如：import Layout from '@/layout/index.vue'
    alias:[   
      {
        find:'@',
        replacement:resolve(__dirname,'src') 
      }
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 注意这里使用的是 scss 而不是 sass，并且使用 @use 替代 @import
        additionalData: `@use "@/styles/variable.scss" as *;`
      }
    }
  }
})