<template>
  <div class="bookInfo" :class="currentTheme" ref="chapterList">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <div class="container">
        <div class="breadcrumb-content">
          <a href="#" class="breadcrumb-item">书海阁</a>
          <span class="breadcrumb-separator">&gt;</span>
          <span class="breadcrumb-item current">{{ novel.title }}</span>

          <div class="breadcrumb-actions">
            <a href="#" class="action-link" @click.prevent="scrollToBottom"
              >直达底部</a
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Novel Info -->
    <section class="novel-info">
      <div class="container">
        <div class="novel-info-content">
          <div class="novel-cover">
            <img :src="novel.cover" :alt="novel.title" />
          </div>
          <div class="novel-details">
            <h1 class="novel-title">{{ novel.title }}</h1>
            <div class="novel-meta">
              <div class="meta-item">
                <span class="meta-label">作者：</span>
                <span class="meta-value">{{ novel.author }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">状态：</span>
                <span class="meta-value">{{ novel.status }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">更新：</span>
                <span class="meta-value">{{ novel.updateDate }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">最新：</span>
                <span class="meta-value latest-chapter">
                  <!-- <a :href="`#chapter-${novel.latestChapter.id}`">{{
                    novel.latestChapter.title
                  }}</a> -->
                  {{ novel.latestChapter?.title }}
                </span>
              </div>
            </div>
            <div class="novel-actions">
              <button class="action-btn add-bookmark">
                <Bookmark :size="18" />
                加入书架
              </button>
              <button class="action-btn start-reading" @click="startReading">
                <BookOpen :size="18" />
                开始阅读
              </button>
            </div>
            <div class="novel-description">
              <div class="description-label">内容简介：</div>
              <div class="description-content">{{ novel.shortDesc }}</div>
              <div class="description-content">{{ novel.extraDesc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter List -->
    <section class="chapter-list">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ novel.title }}最新章节列表</h2>
        </div>
        <div class="chapter-grid">
          <!-- <a-list
            :style="{ width: `600px` }"
            :virtualListProps="{
              height: 560,
            }"
            :data="novel.chapters"
          >
            <template #item="{ item, index }">
              <a-list-item :key="index">
                <div class="chapter-item">
                  {{ item.title }}
                </div>
              </a-list-item>
            </template>
           
          </a-list> -->
          <div
            v-for="(chapter, index) in novel.chapters"
            :key="chapter.url"
            class="chapter-item"
            @click="handleChapterClick(chapter)"
          >
            {{ chapter.title }}
          </div>
        </div>
      </div>
    </section>
    <a-back-top
      target-container=".bookInfo"
      :style="{ position: 'absolute' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import { Search, Bookmark, BookOpen, Import } from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import { getBooksData } from "../utils/api";

const router = useRouter();
const route = useRoute();
const bookUrl = ref("");
const categoryType = ref(1);

// 定义分类数据接口
interface Category {
  id: string;
  name: string;
}

// 定义章节数据接口
interface Chapter {
  url: string;
  title: string;
}

// 定义小说数据接口
interface Novel {
  title?: string;
  author?: string;
  extraDesc?: string;
  shortDesc?: string;
  status?: string;
  lastUpdate: string;
  cover?: string;
  updateDate?: string;
  latestChapter?: {
    url: string;
    title: string;
  };
  chapters?: Chapter[];
}

// 响应式状态
const searchQuery = ref<string>("");
const activeCategory = ref<string>("fantasy");
const currentTheme = ref<string>("light-theme");

// DOM 引用
const chapterList = ref<HTMLElement | null>(null);

// 小说数据
const novel = ref<Novel>({
  title: "",
  author: "",
  extraDesc: "",
  shortDesc: "",
  status: "",
  lastUpdate: "",
  cover: "",
  updateDate: "",
  latestChapter: {
    url: "",
    title: "",
  },
  chapters: [],
});

const boolInfoId = ref<string>("");

// 监听路由参数变化
watchEffect(() => {
  const bookId = route.params.bookUrl;
  const categoryId = route.params.categoryId;
  // 判断 bookId 类型，若为数组则取首个元素，否则直接使用
  boolInfoId.value = Array.isArray(bookId) ? bookId[0] : bookId || "";

  if (bookId) {
    bookUrl.value = `/html/${bookId}/`;
    getBooksData(bookUrl.value).then((res) => {
      novel.value = res;
    });
  }
  if (categoryId) {
    const id = Number(categoryId);
    if (!isNaN(id)) {
      categoryType.value = id;
    } else {
      categoryType.value = -1;
    }
  } else {
    categoryType.value = -1;
  }
});

const startReading = () => {
  router.push(`/bookInfo/${categoryType.value}/${boolInfoId.value}/1`);
};

const scrollToBottom = () => {
  const container = chapterList.value;
  if (container) {
    container.scroll({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }
};

const handleChapterClick = (chapter: Chapter) => {
  console.log("点击章节:", chapter);
  //   alert('即将开始阅读：' + chapter.title)
  // bookInfo/:categoryId/:bookUrl/:chapterId
  const match = chapter.url.match(/\/html(.*?)\.html$/);
  const chapterPath = match ? match[1] : "";
  router.push(`/bookInfo/${categoryType.value}${chapterPath}`);
};
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #2563eb;
$secondary-color: #64748b;
$background-color: #fff;
$text-color: #1e293b;
$border-color: #e2e8f0;
$shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
$action-color: #f97316; // 橙色按钮

.bookInfo {
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  @include hide-scrollbar;
  padding: 1rem;
}

// Breadcrumb
.breadcrumb {
  background: white;
  padding: 0.8rem 0;
  border-bottom: 1px solid $border-color;

  .breadcrumb-content {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: $secondary-color;

    .breadcrumb-item {
      color: $secondary-color;
      text-decoration: none;

      &:hover {
        color: $primary-color;
      }

      &.current {
        color: $text-color;
        font-weight: 500;
      }
    }

    .breadcrumb-separator {
      margin: 0 0.5rem;
    }

    .breadcrumb-actions {
      margin-left: auto;
      display: flex;
      align-items: center;

      .action-link {
        color: $primary-color;
        text-decoration: none;
        font-size: 0.9rem;

        &:hover {
          text-decoration: underline;
        }
      }

      .action-separator {
        margin: 0 0.5rem;
        color: $secondary-color;
      }
    }
  }
}

// Novel Info
.novel-info {
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid $border-color;

  .novel-info-content {
    display: flex;
    gap: 2rem;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: center;
    }
  }

  .novel-cover {
    flex-shrink: 0;
    width: 180px;
    height: 240px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .novel-details {
    flex: 1;

    .novel-title {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 0 0 1rem;
      color: $text-color;
    }

    .novel-meta {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.8rem;
      margin-bottom: 1.5rem;

      .meta-item {
        display: flex;
        align-items: center;

        .meta-label {
          color: $secondary-color;
          margin-right: 0.5rem;
        }

        .meta-value {
          color: $text-color;
          font-weight: 500;

          &.latest-chapter {
            a {
              color: $primary-color;
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }

    .novel-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.8rem 2rem;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        border: none;

        &.add-bookmark {
          background: #e2e8f0;
          color: $text-color;

          &:hover {
            //background: darken(#e2e8f0, 5%);
          }
        }

        &.start-reading {
          background: $action-color;
          color: white;

          &:hover {
            //background: darken($action-color, 5%);
          }
        }
      }
    }

    .novel-description {
      margin-bottom: 1.5rem;

      .description-label {
        color: $secondary-color;
        margin-bottom: 0.5rem;
      }

      .description-content {
        color: $text-color;
        line-height: 1.6;
      }
    }

    .novel-tags {
      display: flex;
      align-items: flex-start;

      .tag-label {
        color: $secondary-color;
        margin-right: 0.5rem;
        white-space: nowrap;
      }

      .tags-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .tag {
          color: $primary-color;
          text-decoration: none;
          padding: 0.2rem 0.5rem;
          background: rgba($primary-color, 0.1);
          border-radius: 4px;
          font-size: 0.9rem;

          &:hover {
            background: rgba($primary-color, 0.2);
          }
        }
      }
    }
  }
}

// Chapter List
.chapter-list {
  padding: 2rem 0;
  flex: 1;
  // overflow: auto;
  .section-header {
    margin-bottom: 1.5rem;

    .section-title {
      font-size: 1.5rem;
      font-weight: bold;
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
        height: 1.2rem;
        background: $primary-color;
        border-radius: 2px;
      }
    }
  }

  .chapter-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 0.5rem;

    @include respond-to("mobile") {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to("tablet") {
      grid-template-columns: repeat(3, 1fr);
    }

    .chapter-item {
      padding: 0.8rem;
      border-bottom: 1px dashed $border-color;
      color: $text-color;
      text-decoration: none;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      &:hover {
        color: $primary-color;
      }
    }
  }
}
</style>
