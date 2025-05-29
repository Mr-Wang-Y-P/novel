<template>
  <div class="bookInfo" :class="currentTheme">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <div class="container">
        <div class="breadcrumb-content">
          <a href="#" class="breadcrumb-item">书海阁</a>
          <span class="breadcrumb-separator">&gt;</span>
          <a href="#" class="breadcrumb-item">{{ novel.category }}</a>
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
                <span class="meta-value">{{ novel.lastUpdate }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">最新：</span>
                <span class="meta-value latest-chapter">
                  <a :href="`#chapter-${novel.latestChapter.id}`">{{
                    novel.latestChapter.title
                  }}</a>
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
              <div class="description-content">{{ novel.description }}</div>
            </div>
            <div class="novel-tags">
              <span class="tag-label">新书推荐：</span>
              <div class="tags-list">
                <a v-for="tag in novel.tags" :key="tag" href="#" class="tag">{{
                  tag
                }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter List -->
    <section class="chapter-list" ref="chapterList">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ novel.title }}最新章节列表</h2>
        </div>
        <div class="chapter-grid">
          <div
            v-for="(chapter, index) in novel.chapters"
            :key="chapter.id"
            class="chapter-item"
            @click="handleChapterClick(chapter)"
          >
            {{ chapter.title }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Search, Bookmark, BookOpen, Import } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
// 定义分类数据接口
interface Category {
  id: string;
  name: string;
}

// 定义章节数据接口
interface Chapter {
  id: number;
  title: string;
}

// 定义小说数据接口
interface Novel {
  id: number;
  title: string;
  author: string;
  category: string;
  status: string;
  lastUpdate: string;
  cover: string;
  description: string;
  tags: string[];
  latestChapter: {
    id: number;
    title: string;
  };
  chapters: Chapter[];
}

// 响应式状态
const searchQuery = ref<string>("");
const activeCategory = ref<string>("fantasy");
const currentTheme = ref<string>("light-theme");

// 分类数据
const categories: Category[] = [
  { id: "home", name: "首页" },
  { id: "fantasy", name: "玄幻" },
  { id: "urban", name: "都市" },
  { id: "romance", name: "言情" },
  { id: "martial", name: "武侠" },
  { id: "history", name: "历史" },
  { id: "scifi", name: "科幻" },
  { id: "game", name: "网游" },
  { id: "completed", name: "完本" },
];

// DOM 引用
const chapterList = ref<HTMLElement | null>(null);

// 小说数据
const novel = reactive<Novel>({
  id: 1,
  title: "万相之王",
  author: "天蚕土豆",
  category: "玄幻奇幻",
  status: "连载",
  lastUpdate: "2025-05-29 05:10:10",
  cover: "/placeholder.svg?height=300&width=220&text=万相之王",
  description: "天地间有万相，我李洛，终将成为那万相之王。11w0-2530",
  tags: [
    "北境冒险笔记",
    "乡村猎艳记",
    "从一人开始统治仙山",
    "通天之路",
    "老张的春天",
    "万相之王",
    "诡诱",
    "乡村猎艳记",
    "地也凹凸",
    "花都至尊",
  ],
  latestChapter: {
    id: 1661,
    title: "第一千六百六十一章 大古融约",
  },
  chapters: Array.from({ length: 75 }, (_, i) => ({
    id: i + 1,
    title: `${i + 1}章`,
  })),
});

// 方法定义

const handleSearch = () => {
  console.log("搜索:", searchQuery.value);
};

const setActiveCategory = (categoryId: string) => {
  activeCategory.value = categoryId;
};

const startReading = () => {
  console.log("开始阅读:", novel.title);
  alert("即将开始阅读：" + novel.title);
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
  console.log("点击章节:", chapter.title);
  //   alert('即将开始阅读：' + chapter.title)
  router.push(`/bookInfo/${novel.id}/${chapter.id}`);
};
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #2563eb;
$secondary-color: #64748b;
$background-color: #f8fafc;
$text-color: #1e293b;
$border-color: #e2e8f0;
$shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
$action-color: #f97316; // 橙色按钮

.bookInfo {
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  overflow: auto;
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
