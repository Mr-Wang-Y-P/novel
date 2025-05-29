<template>
  <div class="novel-website">
    <!-- Header -->
    <div class="sticky">
      <Header @search="onSearch" />

      <!-- Navigation -->
      <Navigation @category-change="onCategoryChange" />
    </div>
    <div class="body">
      <!-- Main Content -->
      <main class="main-content" v-show="categoryId === -1">
        <div class="container">
          <div class="content-grid">
            <!-- Featured Section -->
            <section class="featured-section">
              <h2 class="section-title">精品推荐</h2>
              <div class="featured-books skeleton" v-if="loadingSkip">
                <div
                  v-for="(book, index) in 6"
                  :key="index"
                  class="book-card featured"
                >
                  <div class="book-cover">
                    <!-- <img :src="book.url_img" :alt="book.articlename" /> -->
                  </div>
                  <div class="book-info">
                    <!-- <h3 class="book-title">{{ book.articlename }}</h3> -->
                    <!-- <p class="book-author">{{ book.author }}</p> -->
                    <!-- <p class="book-description">{{ book.intro }}</p> -->
                  </div>
                </div>
              </div>
              <div class="featured-books" v-else>
                <div
                  v-for="(book, index) in allBooks[1]"
                  :key="index"
                  class="book-card featured"
                >
                  <div class="book-cover">
                    <img :src="book.url_img" :alt="book.articlename" />
                  </div>
                  <div class="book-info">
                    <h3 class="book-title">{{ book.articlename }}</h3>
                    <p class="book-author">{{ book.author }}</p>
                    <p class="book-description">{{ book.intro }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Latest Updates -->
            <section class="updates-section">
              <h2 class="section-title">小说推荐</h2>
              <div
                class="skeleton"
                v-if="loadingSkip"
                v-for="([key, books], index) in Object.entries(skipArr)"
                :key="index"
              >
                <h3 class="section-subtitle">{{ getCategoryName(key) }}</h3>
                <div class="book-content">
                  <div v-for="(book, id) in books" :key="id" class="book-item">
                    <div class="book-cover-small"></div>
                    <div class="book-details"></div>
                  </div>
                </div>
              </div>
              <div
                v-if="!loadingSkip"
                v-for="([key, books], index) in Object.entries(allBooks)"
                :key="index"
              >
                <h3 class="section-subtitle">{{ getCategoryName(key) }}</h3>
                <div class="book-content">
                  <div v-for="(book, id) in books" :key="id" class="book-item">
                    <div class="book-cover-small">
                      <img :src="book.url_img" :alt="book.articlename" />
                    </div>
                    <div class="book-details">
                      <h4 class="book-title">{{ book.articlename }}</h4>
                      <p class="book-author">{{ book.author }}</p>
                      <p class="book-description">{{ book.intro }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <aside class="sidebar">
            <!-- Rankings -->
            <div class="sidebar-section">
              <h3 class="sidebar-title">热门排行</h3>
              <div class="ranking-list">
                <div
                  v-for="(book, index) in allBooks[1]"
                  :key="index"
                  class="ranking-item"
                >
                  <span class="rank-number" :class="{ top: index < 3 }">{{
                    index + 1
                  }}</span>
                  <div class="rank-info">
                    <h4 class="rank-title">{{ book.articlename }}</h4>
                    <p class="rank-author">{{ book.author }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Categories -->
            <div class="sidebar-section">
              <h3 class="sidebar-title">热门分类</h3>
              <div class="category-tags">
                <span
                  v-for="(tag, index) in typeList"
                  :key="index"
                  class="tag"
                  >{{ tag.name }}</span
                >
              </div>
            </div>
          </aside>
        </div>
      </main>

      <!-- 分类内容 -->
      <RouterView  v-if="categoryId !== -1"/>
      
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getAllTypesData, getAllBooksData } from "@/utils/api";
import { bookInfo, bookType } from "@/interface/dashBoard";
import Header from "@/components/Header.vue";
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const typeList = ref<Array<bookType>>([]);

const searchValue = ref<string>("");

const categoryId = ref<number>(-1);

const allBooks = ref<Record<number, bookInfo[]>>({});

const loadingSkip = ref<boolean>(false);

const skipArr = {
  0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  5: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};
// 定义 ref 来引用 .body 元素
const bodyRef = ref<HTMLElement | null>(null);
const currentList = ref<HTMLElement | null>(null);
const onCategoryChange = (sortid: number) => {
  // 在这里处理分类改变的逻辑，比如请求对应分类的数据
  console.log("选中的分类 ID:", sortid);
  categoryId.value = sortid;
  // 示例：可以根据分类 ID 过滤书籍列表
  // filteredBooks.value = allBooks.value.filter(book => book.categoryId === categoryId)
};

const onSearch = async (query: string) => {
  try {
    searchValue.value = query;
    // const results = await fetchSearchData(query)
    // searchResults.value = results
  } catch (error) {
    console.error("搜索出错:", error);
  }
};

// 定义计算属性，根据 sortid 获取分类名称
const getCategoryName = (key: string) => {
  const sortId = Number(key);
  const category = typeList.value.find((item) => item.sortid === sortId);
  return category ? category.name : "未知分类";
};

// 滚动到底部时触发的回调函数
const onScrollToBottom = () => {
  console.log('滚动到底部，可在此处添加加载更多数据的逻辑');
  // 你可以在这里添加加载更多数据的代码
  console.log('currentList',currentList.value)
};
// 滚动事件处理函数
const handleScroll = () => {
  if (bodyRef.value) {
    const { scrollTop, scrollHeight, clientHeight } = bodyRef.value;
    // 判断是否滚动到底部，留 50px 缓冲
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      onScrollToBottom();
    }
  }
};

onMounted(async () => {
  loadingSkip.value = true;
  try {
    typeList.value = (await getAllTypesData()) ?? [];
    if (typeList.value.length > 0) {
      for (let i = 0; i < typeList.value.length; i++) {
        const res = await getAllBooksData({
          sortid: typeList.value[i].sortid,
          pageSize: 6,
        });
        allBooks.value[typeList.value[i].sortid] = res.data;
      }
    }
    loadingSkip.value = false;
  } catch (error) {
    console.error("获取数据出错:", error);
  }
   if (bodyRef.value) {
    // 添加滚动事件监听器
    bodyRef.value.addEventListener('scroll', handleScroll);
  }
  categoryId.value = route.params.categoryId ? Number(route.params.categoryId) : -1;
});

onUnmounted(() => {
  if (bodyRef.value) {
    // 移除滚动事件监听器
    bodyRef.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style lang="scss" scoped>
// 根字体大小适配
html {
  font-size: 14px;

  @include respond-to("tablet") {
    font-size: 15px;
  }

  @include respond-to("desktop") {
    font-size: 16px;
  }

  @include respond-to("large") {
    font-size: 18px;
  }
}

// Base styles
.novel-website {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  background-color: $background-color;
  color: $text-color;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  .sticky {
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  .body {
    flex: 1;
    height: calc(100vh - 260px);
    display: flex;
    flex-direction: column;
  }
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 4vw;
  box-sizing: border-box;
  @include respond-to("mobile") {
    max-width: 750px;
    padding: 0 2rem;
  }
  .content-grid {
    max-width: 750px;
  }

  @include respond-to("tablet") {
    max-width: 1000px;
    padding: 0 2.5rem;
  }

  @include respond-to("desktop") {
    max-width: 1200px;
    padding: 0 3rem;
  }

  @include respond-to("large") {
    max-width: 1400px;
    padding: 0 4rem;
  }
}

// Header
.header {
  background: white;
  border-bottom: 1px solid $border-color;
  box-shadow: $shadow;

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
      padding: clamp(0.6rem, 1.5vh, 0.8rem) clamp(3rem, 6vw, 3.5rem)
        clamp(0.6rem, 1.5vh, 0.8rem) 1rem;
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

// Buttons
.btn-primary,
.btn-secondary {
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

// Navigation
.navigation {
  background: white;
  border-bottom: 1px solid $border-color;

  .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: clamp(1.5rem, 4vw, 3rem);
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    li {
      padding: clamp(0.8rem, 2vh, 1.2rem) 0;
      cursor: pointer;
      font-weight: 500;
      color: $secondary-color;
      transition: color 0.3s;
      position: relative;
      white-space: nowrap;
      font-size: clamp(0.9rem, 2.5vw, 1rem);

      &:hover,
      &.active {
        color: $primary-color;
      }

      &.active::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: $primary-color;
      }
    }
  }
}

// Main content
.main-content {
  padding: clamp(2rem, 5vh, 4rem) 0;

  .container {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(2rem, 5vw, 3rem);

    @include respond-to("tablet") {
      grid-template-columns: 1fr 280px;
    }

    @include respond-to("desktop") {
      grid-template-columns: 1fr 320px;
    }

    @include respond-to("large") {
      grid-template-columns: 1fr 360px;
    }
  }
}

.content-grid {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 5vh, 3rem);
}

// Section titles
.section-title {
  font-size: clamp(1.3rem, 4vw, 1.8rem);
  font-weight: bold;
  margin-bottom: clamp(1rem, 3vh, 1.5rem);
  color: $text-color;
  position: relative;
  padding-left: 1rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: clamp(1.2rem, 3vh, 1.5rem);
    background: $primary-color;
    border-radius: 2px;
  }
}

// Featured books
.featured-books {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 3vw, 2rem);

  @include respond-to("tablet") {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }

  @include respond-to("large") {
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  }
}

.book-card.featured {
  background: white;
  border-radius: 12px;
  padding: clamp(1rem, 3vw, 1.5rem);
  box-shadow: $shadow;
  display: flex;
  gap: clamp(1rem, 2vw, 1.5rem);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  }

  .book-cover {
    flex-shrink: 0;

    img {
      width: clamp(80px, 12vw, 120px);
      height: clamp(110px, 16vw, 160px);
      object-fit: cover;
      border-radius: 8px;
    }
  }

  .book-info {
    flex: 1;

    .book-title {
      font-size: clamp(1rem, 3vw, 1.3rem);
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: $text-color;
      line-height: 1.3;
    }

    .book-author {
      color: $secondary-color;
      margin-bottom: 0.8rem;
      font-size: clamp(0.8rem, 2.5vw, 0.9rem);
    }

    .book-description {
      color: $secondary-color;
      line-height: 1.5;
      margin-bottom: 1rem;
      font-size: clamp(0.8rem, 2.5vw, 0.9rem);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .book-meta {
      display: flex;
      gap: 0.8rem;
      flex-wrap: wrap;

      .category,
      .status {
        padding: 0.3rem 0.8rem;
        border-radius: 12px;
        font-size: clamp(0.7rem, 2vw, 0.8rem);
        font-weight: 500;
      }

      .category {
        background: rgba($primary-color, 0.1);
        color: $primary-color;
      }

      .status {
        background: rgba(#10b981, 0.1);
        color: #10b981;
      }
    }
  }
}

.book-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  @include respond-to("tablet") {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @include respond-to("desktop") {
    grid-template-columns: repeat(auto-fit, minmax(300px, 2fr));
  }
}
// Latest books
.book-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(0.8rem, 2vw, 1.2rem);

  @include respond-to("tablet") {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  @include respond-to("desktop") {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

.book-item {
  background: white;
  border-radius: 8px;
  padding: clamp(0.8rem, 2vw, 1.2rem);
  box-shadow: $shadow;
  display: flex;
  gap: clamp(0.8rem, 2vw, 1.2rem);
  transition: transform 0.3s;

  &:hover {
    transform: translateX(4px);
  }

  .book-cover-small {
    flex-shrink: 0;

    img {
      width: clamp(50px, 8vw, 70px);
      height: clamp(65px, 10vw, 90px);
      object-fit: cover;
      border-radius: 6px;
    }
  }

  .book-details {
    flex: 1;
    min-width: 0;

    .book-title {
      font-size: clamp(0.9rem, 2.5vw, 1.1rem);
      font-weight: 600;
      margin-bottom: 0.3rem;
      color: $text-color;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .book-author {
      color: $secondary-color;
      font-size: clamp(0.8rem, 2vw, 0.9rem);
      margin-bottom: 0.5rem;
    }

    .latest-chapter {
      color: $primary-color;
      font-size: clamp(0.8rem, 2vw, 0.9rem);
      margin-bottom: 0.3rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .update-time {
      color: $secondary-color;
      font-size: clamp(0.7rem, 1.8vw, 0.8rem);
    }
  }
}

// Sidebar
.sidebar {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4vh, 2.5rem);
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  padding: clamp(1rem, 3vw, 1.8rem);
  box-shadow: $shadow;
}

.sidebar-title {
  font-size: clamp(1rem, 3vw, 1.3rem);
  font-weight: bold;
  margin-bottom: clamp(1rem, 3vh, 1.5rem);
  color: $text-color;
}

// Rankings
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: clamp(0.6rem, 2vh, 1rem);
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: clamp(0.6rem, 2vw, 1rem);
  padding: clamp(0.4rem, 1vh, 0.6rem) 0;

  .rank-number {
    width: clamp(1.5rem, 4vw, 2rem);
    height: clamp(1.5rem, 4vw, 2rem);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(0.7rem, 2vw, 0.8rem);
    font-weight: bold;
    background: $background-color;
    color: $secondary-color;
    flex-shrink: 0;

    &.top {
      background: $primary-color;
      color: white;
    }
  }

  .rank-info {
    flex: 1;
    min-width: 0;

    .rank-title {
      font-size: clamp(0.8rem, 2.5vw, 1rem);
      font-weight: 500;
      margin-bottom: 0.2rem;
      color: $text-color;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rank-author {
      font-size: clamp(0.7rem, 2vw, 0.8rem);
      color: $secondary-color;
    }
  }
}

// Category tags
.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.4rem, 1vw, 0.8rem);
}

.tag {
  padding: clamp(0.3rem, 1vh, 0.5rem) clamp(0.6rem, 2vw, 1rem);
  background: $background-color;
  color: $secondary-color;
  border-radius: 16px;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: $primary-color;
    color: white;
  }
}



// 移动端特殊适配
@media (max-width: 767px) {
  .header .header-content {
    flex-direction: column;
    height: auto;
    padding: 1rem 0;
    gap: 1rem;
  }

  .search-box {
    max-width: 100% !important;
  }

  .user-actions {
    width: 100%;
    justify-content: center;
  }

  .navigation .nav-list {
    padding: 0 1rem;
  }

  .book-card.featured {
    flex-direction: column;
    text-align: center;

    .book-cover {
      align-self: center;
    }
  }

  .book-list {
    grid-template-columns: 1fr !important;
  }
  .book-content {
    grid-template-columns: 1fr !important;
  }
}

// 超大屏幕优化
@media (min-width: 1920px) {
  .container {
    max-width: 1600px;
  }

  .featured-books {
    grid-template-columns: repeat(2, 1fr);
  }

  .book-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

.skeleton {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}
</style>
