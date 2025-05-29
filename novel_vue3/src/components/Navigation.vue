<template>
  <nav class="navigation">
    <div class="container">
      <ul class="nav-list">
        <li
          v-for="(category, index) in categories"
          :key="index"
          :class="{ active: activeCategory === category.sortid }"
          @click="setActiveCategory(category.sortid)"
        >
          {{ category.name }}
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getAllTypesData } from "@/utils/api";
import { bookType } from "@/interface/dashBoard";
import { useRouter, useRoute } from "vue-router";

// 定义 emits 选项
const emits = defineEmits(["category-change"]);

const activeCategory = ref<number>(-1);

const categories = ref<bookType[]>([]);

const router = useRouter();
const route = useRoute();
const setActiveCategory = (categoryId: number) => {
  activeCategory.value = categoryId;
  // // 触发 category-change 事件并传递 categoryId
  emits("category-change", categoryId);
  if(categoryId === -1){
    router.push(`/`);
  } else {
    router.push(`/bookList/${categoryId}`);
  }
  // router.push(`/bookList/${categoryId}`);
};

// 监听 route.params.categoryId 变化
watch(
  () => route.params.categoryId,
  (newCategoryId, oldCategoryId) => {
    if (newCategoryId !== oldCategoryId) {
      console.log("route 参数变化，新的 categoryId:", newCategoryId);
      activeCategory.value = newCategoryId ? Number(newCategoryId) : -1;
      emits("category-change", activeCategory.value);
    }
  },
  { immediate: false }
);

onMounted(async () => {
  try {
    const res = await getAllTypesData();
    categories.value = res;
    categories.value.unshift({ sortid: -1, name: "首页", url: "/shouye" });
  } catch (error) {
    console.error("获取分类数据失败:", error);
  }
  console.log("route", route.params.categoryId);
  
  activeCategory.value = route.params.categoryId ? Number(route.params.categoryId) : -1;
  emits("category-change", activeCategory.value);
});
</script>

<style lang="scss" scoped>
// 已有样式可保持不变，这里可复制 Dashboard.vue 中的对应样式
.navigation {
  background: white;
  border-bottom: 1px solid $border-color;
  padding: 0 1rem;
  .nav-list {
    display: flex;
    justify-content: center;
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
</style>
