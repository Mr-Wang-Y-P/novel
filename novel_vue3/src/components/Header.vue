<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <h1 class="logo">书海阁</h1>
        <div class="search-box">
          <input 
            type="text" 
            placeholder="搜索小说、作者..." 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          >
          <button @click="handleSearch" class="search-btn">
            <Search :size="20" />
          </button>
        </div>
        <div class="user-actions">
          <button class="btn-secondary">阅读记录</button>
          <button class="btn-primary">书架</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'

// 定义 emits 选项
const emits = defineEmits(['search'])

// 明确指定 ref 的类型为 string
const searchQuery = ref<string>('')

// 明确指定函数的返回类型为 void
const handleSearch = (): void => {
  console.log('搜索:', searchQuery.value)
  // 触发 search 事件并传递搜索查询值
  emits('search', searchQuery.value)
}
</script>

<style lang="scss" scoped>


.header {
  background: white;
  border-bottom: 1px solid $border-color;
  box-shadow: $shadow;
  padding: 0 2rem;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: clamp(60px, 8vh, 80px);
    gap: 2vw;
  }

  .logo {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: bold;
    color: $primary-color;
    margin: 0;
    white-space: nowrap;
  }

  .search-box {
    display: flex;
    align-items: center;
    flex: 1;
    max-width: min(500px, 40vw);
    position: relative;

    input {
      width: 100%;
      padding: clamp(0.6rem, 1.5vh, 0.8rem) clamp(3rem, 6vw, 3.5rem) clamp(0.6rem, 1.5vh, 0.8rem) 1rem;
      border: 2px solid $border-color;
      border-radius: 25px;
      font-size: clamp(0.8rem, 2vw, 0.9rem);
      outline: none;
      transition: border-color 0.3s;

      &:focus {
        border-color: $primary-color;
      }
    }

    .search-btn {
      position: absolute;
      right: 0.5rem;
      background: $primary-color;
      color: white;
      border: none;
      border-radius: 50%;
      width: clamp(2rem, 4vw, 2.5rem);
      height: clamp(2rem, 4vw, 2.5rem);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        // background-color: darken($primary-color, 10%);
      }
    }
  }

  .user-actions {
    display: flex;
    gap: clamp(0.5rem, 2vw, 1rem);
  }
}

.btn-primary, .btn-secondary {
  padding: clamp(0.4rem, 1vh, 0.6rem) clamp(1rem, 3vw, 1.5rem);
  border-radius: 20px;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid;
  white-space: nowrap;
}

.btn-primary {
  background: $primary-color;
  color: white;
  border-color: $primary-color;

  &:hover {
    // background: darken($primary-color, 10%);
  }
}

.btn-secondary {
  background: transparent;
  color: $secondary-color;
  border-color: $border-color;

  &:hover {
    background: $background-color;
  }
}
</style>