<!--
 * @Author: 汪迎平
 * @Date: 2025-05-29 11:51:17
 * @LastEditTime: 2025-05-30 10:17:20
 * @LastEditors: 汪迎平
 * @Description: 书籍列表页面
-->
<template>
  <div class="books-list" ref="booksList">
    <main class="novel-list-container">
      <div class="container">
        <div class="novel-grid">
          <!-- 数据加载时显示骨架屏 -->
          <template v-if="loadingSkip">
            <div v-for="i in 20" :key="i" class="novel-card skeleton">
              <div class="novel-cover skeleton-placeholder"></div>
              <div class="novel-info">
                <h3 class="novel-title skeleton-placeholder"></h3>
                <p class="novel-author skeleton-placeholder"></p>
                <p class="novel-description skeleton-placeholder"></p>
              </div>
            </div>
          </template>
          <!-- 数据加载完成显示书籍列表 -->
          <template v-else>
           
              <div v-for="(novel, index) in novels" :key="index" class="novel-card" @click="jumpCharpter(novel)">
              <div class="novel-cover">
                <img
                  :src="novel.url_img"
                  :alt="novel.articlename"
                  @error="handleImageError"
                />
              </div>
              <div class="novel-info">
                <h3 class="novel-title">{{ novel.articlename }}</h3>
                <p class="novel-author">{{ novel.author }}</p>
                <p class="novel-description">{{ novel.intro }}</p>
              </div>
            </div>
            
          </template>
        </div>
        <div v-if="loading">
          <div class="loading-container">
            <span>正在加载更多...</span>
          </div>
        </div>
        <div v-if="noMoreData">
          <div class="no-results">
            <span>没有更多数据了</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";
import { debounce } from "lodash";
import { bookInfo, bookType } from "@/interface/dashBoard";
import { getAllBooksData } from "@/utils/api";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const categoryId = ref<number>(1);

const loadingSkip = ref(false);

const page = ref(1);
const loading = ref(false);
const noMoreData = ref(false);
const novels = ref<bookInfo[]>([]);
const booksList = ref<HTMLElement | null>(null); // 定义 ref 来存储元素引用


// 原始的滚动事件处理函数
const originalHandleScroll = () => {
  if (booksList.value) {
    const { scrollTop, scrollHeight, clientHeight } = booksList.value;
    // 判断是否滚动到底部，留 50px 缓冲
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      onScrollToBottom();
    }
  }
};

// 使用 debounce 包装原始函数，设置延迟时间为 300ms
const handleScroll = debounce(originalHandleScroll, 300);

// 滚动到底部时触发的回调函数
const onScrollToBottom = () => {
  console.log('滚动到底部，可在此处添加加载更多数据的逻辑');
  fetchData();
};

// 获取书籍数据
const fetchNovels = async () => {
  if (loading.value || noMoreData.value) return;

  loading.value = true;
  try {
    const res = await getAllBooksData({
      sortid: categoryId.value, // 使用父组件传来的 categoryId
      page: page.value,
      pageSize: 30,
    });
    const newData = [...novels.value,...res.data];
    novels.value = newData;

    if (res.data.length < 30) {
      noMoreData.value = true;
    } else {
      page.value++;
    }
  } catch (error) {
    console.error("获取书籍数据出错:", error);
  } finally {
    loading.value = false;
    loadingSkip.value = false; // 显示骨架屏;
  }
};

// 图片加载错误处理
const handleImageError = (event: Event) => {
  //   event.target.src = '/placeholder.svg?height=280&width=210&text=加载失败';
};

onMounted(() => {
  console.log("route", route.params.categoryId);
  categoryId.value = Number(route.params.categoryId);
  fetchNovels();
  if (booksList.value) {
    // 添加滚动事件监听器
    booksList.value.addEventListener('scroll', handleScroll);
  }
});

// 监听 route.params.categoryId 变化
watch(
  () => route.params.categoryId,
  (newCategoryId, oldCategoryId) => {
    if (newCategoryId !== oldCategoryId) {
      categoryId.value = Number(newCategoryId);
      page.value = 1; // 重置页码
      noMoreData.value = false; // 重置没有更多数据状态
      loadingSkip.value = true; // 显示骨架屏;
      novels.value = []; // 清空数据
      fetchNovels();
    }
  },
  { immediate: false }
);
const jumpCharpter = (novel: bookInfo) => {
  const match = novel.url_list.match(/\/html\/(\d+)\//);
  const bookInfoUrl = match ? match[1] : '';
  router.push(`/bookInfo/${novel.sortid}/${bookInfoUrl}`);
};
const fetchData = () => {
  fetchNovels();
};

</script>

<style lang="scss" scoped>
.books-list {
  padding: 2rem;
  flex: 1;
  height: 100%;
  overflow: auto;
  @include hide-scrollbar;
  .novel-list-container {
    width: 100%;
    height: 100%;
    .container {
      width: 100%;
      height: 100%;
    }
  }
  .novel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
  }

  .novel-card {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s;
    cursor: pointer;
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .novel-cover {
      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }
    }

    .novel-info {
      padding: 1rem;

      .novel-title {
        margin: 0 0 0.5rem;
        font-size: 1.2rem;
      }

      .novel-author {
        margin: 0 0 1rem;
        color: #666;
      }

      .novel-description {
        margin: 0 0 1rem;
        color: #888;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .novel-meta {
        display: flex;
        gap: 1rem;
        color: #666;

        span {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
      }
    }
  }

  .loading-container {
    margin-top: 2rem;
    text-align: center;
  }

  .no-results {
    text-align: center;
    color: #888;
    font-size: 1.2rem;
  }
}

.skeleton {
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  animation: pulse 1.5s infinite;
}

.skeleton-placeholder {
  background-color: #e0e0e0;
  border-radius: 4px;
}

.novel-card.skeleton {
  .novel-cover {
    width: 100%;
    height: 300px;
  }

  .novel-info {
    padding: 1rem;

    .novel-title {
      width: 80%;
      height: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .novel-author {
      width: 60%;
      height: 1rem;
      margin-bottom: 1rem;
    }

    .novel-description {
      width: 90%;
      height: 3rem;
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
