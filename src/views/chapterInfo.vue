<template>
  <div class="novel-reader" :class="currentTheme">
    <!-- Reading Area -->
    <main class="reading-area" ref="scrollArea">
      <div class="container">
        <!-- Reading Settings -->
        <div class="reading-settings">
          <div class="font-settings">
            <span class="setting-label">字体大小：</span>
            <div class="font-size-options">
              <button
                class="font-size-btn"
                :class="{ active: fontSize === 'small' }"
                @click="setFontSize('small')"
              >
                小
              </button>
              <button
                class="font-size-btn"
                :class="{ active: fontSize === 'medium' }"
                @click="setFontSize('medium')"
              >
                中
              </button>
              <button
                class="font-size-btn"
                :class="{ active: fontSize === 'large' }"
                @click="setFontSize('large')"
              >
                大
              </button>
            </div>
          </div>

          <div class="theme-settings">
            <span class="setting-label">主题：</span>
            <div class="theme-options">
              <button
                class="theme-btn light-theme"
                :class="{ active: currentTheme === 'light-theme' }"
                @click="setTheme('light-theme')"
                title="白色主题"
              >
                <Sun :size="16" />
              </button>
              <button
                class="theme-btn dark-theme"
                :class="{ active: currentTheme === 'dark-theme' }"
                @click="setTheme('dark-theme')"
                title="黑色主题"
              >
                <Moon :size="16" />
              </button>
              <button
                class="theme-btn eye-care-theme"
                :class="{ active: currentTheme === 'eye-care-theme' }"
                @click="setTheme('eye-care-theme')"
                title="护眼模式"
              >
                <Eye :size="16" />
              </button>
            </div>
          </div>
          <div style="display: flex">
            <div class="auto-read">
              <button
                class="auto-read-btn"
                :class="{ active: isReading }"
                @click="toggleAutoRead"
              >
                <component :is="isReading ? Pause : Play" :size="16" />
                {{ isReading ? "停止朗读" : "开始朗读" }}
              </button>
            </div>
            <div class="voice-settings">
              <button
                class="voice-select-btn"
                @click="showVoiceSelector = true"
              >
                <Mic :size="16" />
                语音选择
              </button>
            </div>
          </div>
        </div>

        <!-- Chapter Title -->
        <div class="chapter-title">
          <h1>{{ novel?.title }}</h1>
        </div>

        <!-- Chapter Navigation -->
        <div class="chapter-navigation">
          <button class="nav-btn" @click="navigateChapter('prev')">
            <ChevronLeft :size="20" />
            上一章
          </button>
          <button class="nav-btn" @click="showTableOfContents = true">
            <List :size="20" />
            目录
          </button>
          <button class="nav-btn" @click="navigateChapter('next')">
            下一章
            <ChevronRight :size="20" />
          </button>
        </div>

        <!-- Chapter Content -->
        <div
          class="chapter-content"
          :class="{
            'font-small': fontSize === 'small',
            'font-medium': fontSize === 'medium',
            'font-large': fontSize === 'large',
          }"
          ref="contentRef"
        >
          <div
            v-for="(paragraphData, pIndex) in processedContent"
            :key="pIndex"
            class="paragraph"
          >
            <span
              v-for="(sentence, sIndex) in paragraphData.sentences"
              :key="sIndex"
              :data-paragraph="pIndex"
              :data-sentence="sIndex"
              :class="{
                'reading-sentence':
                  isReading &&
                  currentParagraph === pIndex &&
                  currentSentence === sIndex,
                'read-sentence':
                  isReading &&
                  (pIndex < currentParagraph ||
                    (pIndex === currentParagraph && sIndex < currentSentence)),
              }"
              class="sentence"
            >
              {{ sentence
              }}{{ sIndex < paragraphData.sentences.length - 1 ? "。" : "" }}
            </span>
          </div>
        </div>

        <!-- Chapter Navigation (Bottom) -->
        <div class="chapter-navigation">
          <button class="nav-btn" @click="navigateChapter('prev')">
            <ChevronLeft :size="20" />
            上一章
          </button>
          <button class="nav-btn" @click="showTableOfContents = true">
            <List :size="20" />
            目录
          </button>
          <button class="nav-btn" @click="navigateChapter('next')">
            下一章
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>
    </main>

    <!-- Table of Contents Modal -->
    <div class="modal" v-if="showTableOfContents">
      <div class="modal-content">
        <div class="modal-header">
          <h2>目录</h2>
          <button class="close-btn" @click="showTableOfContents = false">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="toc-list">
            <div
              v-for="chapter in chapters"
              :key="chapter.url"
              class="toc-item"
              :class="{ active: chapter.url === chapterUrl }"
              @click="selectChapter(chapter.url)"
            >
              {{ chapter.title }}
             
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Reading Controls -->
    <div class="floating-controls" v-if="isReading">
      <div class="control-panel">
        <button
          class="control-btn"
          @click="adjustReadingSpeed(-0.25)"
          title="减慢语速"
        >
          <Rewind :size="16" />
        </button>
        <button class="control-btn" @click="toggleAutoRead" title="暂停/继续">
          <component :is="isReading ? Pause : Play" :size="20" />
        </button>
        <button
          class="control-btn"
          @click="adjustReadingSpeed(0.25)"
          title="加快语速"
        >
          <FastForward :size="16" />
        </button>
        <div class="speed-indicator">{{ readingSpeed.toFixed(1) }}x</div>
      </div>
    </div>

    <!-- Voice Selector Modal -->
    <div class="modal" v-if="showVoiceSelector">
      <div class="modal-content voice-selector-modal">
        <div class="modal-header">
          <h2>选择语音</h2>
          <button class="close-btn" @click="showVoiceSelector = false">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="voice-list">
            <div
              v-for="voice in availableVoices"
              :key="voice.name"
              class="voice-item"
              :class="{
                active: selectedVoice && selectedVoice.name === voice.name,
              }"
              @click="selectVoice(voice as SpeechSynthesisVoice)"
            >
              <div class="voice-info">
                <div class="voice-name">{{ voice.name }}</div>
                <div class="voice-lang">{{ voice.lang }}</div>
              </div>
              <button class="preview-btn" @click.stop="previewVoice(voice as SpeechSynthesisVoice)">
                <Play :size="14" />
                试听
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch, computed } from "vue";
import {
  Search,
  Sun,
  Moon,
  Eye,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  List,
  Bookmark,
  X,
  Rewind,
  FastForward,
  Mic,
} from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import { getInfoData, getBooksData } from "../utils/api";

const router = useRouter();
const route = useRoute();

// 定义变量存储路由参数
interface RouteParams {
  categoryId: string;
  bookUrl: string;
  chapterId: string;
}

interface Chapter {
  url: string;
  title: string;
}

interface NovelData {
  title: string;
  content: string;
  chapters?: Chapter[];
}

// 定义变量存储路由参数
const categoryId = ref<string>("");
const bookUrl = ref<string>("");
const chapterId = ref<string>("");
const chapterUrl = ref<string>("");
// 响应式状态

const fontSize = ref("medium");
const currentTheme = ref("light-theme");
const isReading = ref(false);
const showTableOfContents = ref(false);
const currentParagraph = ref(0);
const contentRef = ref<HTMLElement | null>(null);
const readingSpeed = ref(1.0);
const currentSentence = ref(0);
const selectedVoice = ref<SpeechSynthesisVoice | null | Voice>(null);
const showVoiceSelector = ref(false);
let speechSynthesis: SpeechSynthesis | null = null;
let currentVoice: SpeechSynthesisVoice | null = null;

interface Voice {
  name: string;
  lang: string;
  localService: boolean;
}

const availableVoices = ref<Voice[]>([]);
// 暂停位置记录
const pausedPosition = reactive({
  paragraph: 0,
  sentence: 0,
});

const scrollArea = ref<HTMLElement | null>(null);
// 模拟小说数据
// const novel = reactive({
//   id: 1,
//   title: "寻找走失的舰娘",
//   author: "深海作家",
//   currentChapter: {
//     id: 1,
//     title: "第一章 荒凉港区上的初遇",
//     content: [
//       "入目的尽是断壁残垣，荒凉满目，电线拉扯着已经烧成黑炭的电线杆载??21??在地上，二层楼高的小楼破了一个大窟窿，仓库的排风扇也爬满了蜘蛛网，而码头上高大的龙门吊也在日晒雨淋下已经锈得不成样子。",
//       "苏顾踩着一地的碎砖走进这座曾经辉煌现在已经衰落的镇守府，这里已经看不出一点曾经的样子，舰娘全部都离开了，又遭到深海舰娘的报复，如今只剩下满目疮痍。",
//       "他在具城的时候听说这里有一座荒废的镇守府，抱着好奇不惜走了好长时间来到这里，自从被海浪卷入深海每次从这里的海难爬起来，渐渐的了解到这里是和他所熟知的世界格格不入的地方。这里有着舰娘的存在，那是一种继承了沉没战舰之魂的少女，操纵着舰装有着无比强大的战力。",
//       "这里的舰娘和他过去所熟悉的游戏意外的相似，只是毕业后的一段时间里为了工作而忙碌，备考也相当花时间。那一款以舰娘为原型进行女性化的收集游戏，以前也很喜欢，只是到后来已经很长的时间都没有再碰过了，到后来荒废下来也就荒废下来了。",
//       "如今来到这里，对于这个世界奇怪的世界观来了兴趣，听说在附近有一座荒废的镇守府才是兴致高昂的跑过来。",
//       "此时他踩着一地的碎砖碎瓦看着杂草丛生的败落镇守府，一种恍如隔世的感觉突然升起来。",
//       '"请离开这里，这里很危险的。"一个抱着褐发玩偶有着粉色短发戴着猫耳耳扣的小女孩突然出现在他的面前，女稚嫩的声音没有一点威严，反而让人觉得很有趣。',
//       '苏顾笑着问道："你是，我想一想，小提尔比茨，儿童节的提尔比茨，你是为了在寻找最强的建造公式而旅行吧，于是来到这座镇守府希望找到宝藏。"他认得对方的造型，自顾自的为对方强加了设定，以前游戏中的小提尔比茨的设定就是拥有最强的建造公式，所以他就一直在想小提尔比茨一定做着类似于中华小当家那样为了最强厨具而努力的事情，只是不同的是她是为了最强的建造公式而到处旅行。',
//       '"最强建造公式什么的无所谓啦，我本来是这个镇守府的舰娘，但是以前提督突然离开了，镇守府就变成了现在这个样子。但是我希望镇守府的大家一起沉浸在幸福中，只要找到提督就可以了，最后把大家从世界各地再找回来，建造最棒的镇守府。"小提尔比茨接着自己怀中的玩偶这样说着，小女孩沐浴在阳光和微风下宛如小天使一般。',
//       '小提尔比茨如此说着突然想到什么东西，婴儿肥的小手上突然出现一把舰船一般的小手枪指着自己对面那个戴着墨镜的大人，一脸的警惕，"我为什么要对你说这些，还有你为什么知道我有最强的建造公式，你到底是什么人？"',
//       '"嘿嘿，小宅我可熟悉的。"',
//     ],
//   },
//   chapters: [
//     { id: 1, title: "第一章 荒凉港区上的初遇" },
//     { id: 2, title: "第二章 重启的镇守府" },
//     { id: 3, title: "第三章 初次出击" },
//     { id: 4, title: "第四章 深海的威胁" },
//     { id: 5, title: "第五章 意外的发现" },
//   ],
// });

const novel = ref<NovelData>({ title: "", content: "" });

const chapters = ref<Chapter[]>([]);
// 监听路由变化
watch(
  () => [route.params.categoryId, route.params.bookUrl, route.params.chapterId],
  ([newCategoryId, newBookUrl, newChapterId]) => {
    if (newCategoryId) categoryId.value = String(newCategoryId);
    if (newBookUrl) bookUrl.value = String(newBookUrl);
    if (newChapterId) chapterId.value = String(newChapterId);

    // 调用 API 获取数据
    if (categoryId.value && bookUrl.value && chapterId.value) {
      const infoUrl = `/html/${bookUrl.value}/${chapterId.value}.html`;
      getInfoData(infoUrl).then((res) => {
        novel.value = res;
      });
      const url = `/html/${bookUrl.value}/`;
      getBooksData(url).then((res) => {
        chapters.value = res.chapters;
      });
      chapterUrl.value = `/html/${bookUrl.value}/${chapterId.value}.html`;
    }
  },
  { immediate: true }
);

// 方法


// 处理小说内容，拆分为段落和句子
interface ProcessedContent {
  sentences: string[];
}

const processedContent = computed<ProcessedContent[]>(() => {
  if (!novel.value.content) return [];
  // 移除 HTML 标签
  const textContent = novel.value.content.replace(/<[^>]*>/g, "");
  return textContent.split(/<br><br>/).map((paragraph) => ({
    sentences: paragraph.split(/[。！？]/).filter((s) => s.trim()),
  }));
});

const setFontSize = (size: string) => {
  fontSize.value = size;
  // 保存用户偏好
  localStorage.setItem("reader-font-size", size);
};

const setTheme = (theme: string) => {
  currentTheme.value = theme;
  // 保存用户偏好
  localStorage.setItem("reader-theme", theme);
};

const navigateChapter = (direction: string) => {
  if (direction === "next") {
    const nextChapterId = Number(chapterId.value) + 1;
    if (nextChapterId > chapters.value.length) {
      alert("已经是最后一章了");
      return;
    }
    router.push(
      `/bookInfo/${categoryId.value}/${bookUrl.value}/${nextChapterId}`
    );
  } else {
    const prevChapterId = Number(chapterId.value) - 1;
    if (prevChapterId < 1) {
      alert("已经是第一章了");
      return;
    }
    router.push(
      `/bookInfo/${categoryId.value}/${bookUrl.value}/${prevChapterId}`
    );
  }
  if (scrollArea.value) {
    scrollArea.value.scrollTo({ top: 0, behavior: "smooth" });
  }

};

const selectChapter = (infoUrl: string) => {

  const matchResult = infoUrl.match(/\/html\/(.*?)\.html$/);
  const extractedUrl = matchResult ? matchResult[1] : "";

  router.push(`/bookInfo/${categoryId.value}/${extractedUrl}`);
  showTableOfContents.value = false;
  
  // 重置朗读状态
    if (isReading.value) {
      stopReading();
    }
};


// 更新的自动朗读功能
const toggleAutoRead = () => {
  if (isReading.value) {
    pauseReading();
  } else {
    resumeReading();
  }
};

const startReading = () => {
  isReading.value = true;
  // 从头开始
  currentParagraph.value = 0;
  currentSentence.value = 0;
  pausedPosition.paragraph = 0;
  pausedPosition.sentence = 0;

  readSentence();
};

const resumeReading = () => {
  isReading.value = true;
  // 从暂停位置继续
  currentParagraph.value = pausedPosition.paragraph;
  currentSentence.value = pausedPosition.sentence;

  readSentence();
};

const pauseReading = () => {
  isReading.value = false;

  // 记录暂停位置
  pausedPosition.paragraph = currentParagraph.value;
  pausedPosition.sentence = currentSentence.value;
  speechSynthesis?.cancel();
};

const stopReading = () => {
  isReading.value = false;
  currentParagraph.value = -1;
  currentSentence.value = -1;

  // 重置暂停位置
  pausedPosition.paragraph = 0;
  pausedPosition.sentence = 0;
};

const readSentence = () => {
  if (
    !isReading.value ||
    currentParagraph.value >= processedContent.value.length
  ) {
    stopReading();
    return;
  }

  const currentParagraphData = processedContent.value[currentParagraph.value];

  // 如果当前段落的句子已读完，移到下一段落
  if (currentSentence.value >= currentParagraphData.sentences.length) {
    currentParagraph.value++;
    currentSentence.value = 0;

    if (currentParagraph.value >= processedContent.value.length) {
      stopReading();
      return;
    }

    // 段落间稍作停顿
    setTimeout(() => {
      if (isReading.value) {
        readSentence();
      }
    }, 300);
    return;
  }

  const sentence = currentParagraphData.sentences[currentSentence.value];
  if (!sentence || sentence.trim().length === 0) {
    // 跳过空句子
    currentSentence.value++;
    readSentence();
    return;
  }

  // 滚动到当前句子
  scrollToCurrentSentence();

  // 使用 Web Speech API 朗读句子
  if (speechSynthesis && selectedVoice.value) {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.voice = selectedVoice.value;
    utterance.rate = readingSpeed.value;

    utterance.onend = () => {
      if (isReading.value) {
        currentSentence.value++;
        readSentence();
      }
    };

    utterance.onerror = (event) => {
      console.error('语音朗读出错:', event.error);
      currentSentence.value++;
      readSentence();
    };

    speechSynthesis.speak(utterance);
  } else {
    console.warn('语音合成不可用，使用模拟阅读速度');
    // 语音合成不可用时，回退到模拟阅读速度
    setTimeout(() => {
      if (isReading.value) {
        currentSentence.value++;
        readSentence();
      }
    }, 300);
  }
};

const scrollToCurrentSentence = () => {
  if (contentRef.value) {
    const currentElement = contentRef.value.querySelector(
      `[data-paragraph="${currentParagraph.value}"][data-sentence="${currentSentence.value}"]`
    );
    if (currentElement) {
      currentElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
};

// 语音选择相关方法
const selectVoice = (voice: SpeechSynthesisVoice) => {
  selectedVoice.value = voice;
  localStorage.setItem("reader-voice", voice.name);
  showVoiceSelector.value = false;

  // 如果正在朗读，重新开始当前句子以应用新语音
  if (isReading.value) {
    speechSynthesis?.cancel();
    setTimeout(() => {
      if (isReading.value) {
        readSentence();
      }
    }, 100);
  }
};

const previewVoice = (voice: SpeechSynthesisVoice) => {
  if (speechSynthesis?.speaking) {
    speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance("这是语音预览，您好！");
  utterance.voice = voice;
  utterance.rate = readingSpeed.value;
  speechSynthesis?.speak(utterance);
};

const loadVoices = async() => {
  const voices = await speechSynthesis?.getVoices();
  availableVoices.value = voices?.filter(
    (v) => v.lang.includes("zh") && v.localService
  ) || [];
  if(!selectedVoice.value && availableVoices.value.length > 0) {
    // 直接赋值，因为类型已经匹配
    selectedVoice.value = availableVoices.value[0];
    // 保存用户偏好
    localStorage.setItem("reader-voice", availableVoices.value[0].name);
  }
};

const adjustReadingSpeed = (delta:  number) => {
  readingSpeed.value = Math.max(0.5, Math.min(2.5, readingSpeed.value + delta))
}

// 加载用户偏好
onMounted(async () => {
  // 加载字体大小偏好
  const savedFontSize = localStorage.getItem("reader-font-size");
  if (savedFontSize) {
    fontSize.value = savedFontSize;
  }

  // 加载主题偏好
  const savedTheme = localStorage.getItem("reader-theme");
  if (savedTheme) {
    currentTheme.value = savedTheme;
  }

  if (window.speechSynthesis) {
    speechSynthesis = window.speechSynthesis;

    // speechSynthesis.onvoiceschanged = async () => {
    //   await loadVoices(); // automatically reload voices
    // };

    await loadVoices(); // initial load
    setTimeout(() => {
      // 延迟加载，避免在页面加载时触发
      loadVoices();
    }, 1000);
  }
});

// 清理资源
onUnmounted(() => {
  // 不需要清理语音相关资源了
});

// 监听主题变化，应用到body
watch(currentTheme, (newTheme) => {
  document.body.className = newTheme;
});
</script>
<style lang="scss" scoped>
// Variables
$primary-color: #2563eb;
$secondary-color: #64748b;
$border-color: #e2e8f0;
$shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

// 主题颜色
$light-bg: #ffffff;
$light-text: #1e293b;
$light-secondary: #64748b;

$dark-bg: #1e293b;
$dark-text: #f8fafc;
$dark-secondary: #94a3b8;

$eye-care-bg: #f0f5e5;
$eye-care-text: #3c4c3c;
$eye-care-secondary: #6b7d6b;

// 响应式断点
$breakpoints: (
  "mobile": 768px,
  "tablet": 1024px,
  "desktop": 1440px,
  "large": 1920px,
);


// 主题混入
@mixin theme($bg, $text, $secondary) {
  background-color: $bg;
  color: $text;

  .reader-header {
    background-color: $bg;
    border-bottom: 1px solid rgba($text, 0.1);
  }

  .reading-settings {
    background-color: rgba($bg, 0.95);
    border-bottom: 1px solid rgba($text, 0.1);
  }

  .chapter-navigation {
    border-top: 1px solid rgba($text, 0.1);
    border-bottom: 1px solid rgba($text, 0.1);

    .nav-btn {
      color: $secondary;

      &:hover {
        color: $text;
        background-color: rgba($text, 0.05);
      }
    }
  }

  .chapter-content {
    color: $text;

    .reading-paragraph {
      background-color: rgba($text, 0.05);
    }
  }

  .modal-content {
    background-color: $bg;
    color: $text;
    border: 1px solid rgba($text, 0.1);
  }

  .toc-item {
    border-bottom: 1px solid rgba($text, 0.1);

    &:hover {
      background-color: rgba($text, 0.05);
    }

    &.active {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
    }
  }

  .floating-controls {
    .control-panel {
      background-color: $bg;
      border: 1px solid rgba($text, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .control-btn {
        color: $secondary;

        &:hover {
          color: $text;
          background-color: rgba($text, 0.05);
        }
      }

      .speed-indicator {
        color: $secondary;
      }
    }
  }
}

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
.novel-reader {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  // 主题样式
  &.light-theme {
    @include theme($light-bg, $light-text, $light-secondary);
  }

  &.dark-theme {
    @include theme($dark-bg, $dark-text, $dark-secondary);
  }

  &.eye-care-theme {
    @include theme($eye-care-bg, $eye-care-text, $eye-care-secondary);
  }
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 4vw;
  box-sizing: border-box;
  // @include hide-scrollbar;
  @include respond-to("mobile") {
    max-width: 750px;
    padding: 0 2rem;
  }

  @include respond-to("tablet") {
    max-width: 800px;
    padding: 0 2.5rem;
  }

  @include respond-to("desktop") {
    max-width: 900px;
    padding: 0 3rem;
  }

  @include respond-to("large") {
    max-width: 1000px;
    padding: 0 4rem;
  }
}

// Header
.reader-header {
  position: sticky;
  top: 0;
  z-index: 100;
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

      // &:hover {
      //   background-color: darken($primary-color, 10%);
      // }
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

  // &:hover {
  //   background: darken($primary-color, 10%);
  // }
}

.btn-secondary {
  background: transparent;
  color: $secondary-color;
  border-color: $border-color;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

// Reading Area
.reading-area {
  padding-bottom: clamp(3rem, 8vh, 5rem);
  flex: 1;
  overflow: auto;
  @include hide-scrollbar;
}

// Reading Settings
.reading-settings {
  position: sticky;
  top: 0;
  z-index: 90;
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  .setting-label {
    font-weight: 500;
    font-size: clamp(0.9rem, 2.5vw, 1rem);
  }

  .font-settings,
  .theme-settings,
  .auto-read {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .font-size-options {
    display: flex;
    gap: 0.3rem;

    .font-size-btn {
      width: 2rem;
      height: 2rem;
      border-radius: 4px;
      border: 1px solid $border-color;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      color: inherit;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      &.active {
        background: $primary-color;
        color: white;
        border-color: $primary-color;
      }
    }
  }

  .theme-options {
    display: flex;
    gap: 0.3rem;

    .theme-btn {
      width: 2rem;
      height: 2rem;
      border-radius: 4px;
      border: 1px solid $border-color;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.05);
      }

      &.active {
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.3);
      }

      &.light-theme {
        background: $light-bg;
        color: $light-text;
      }

      &.dark-theme {
        background: $dark-bg;
        color: $dark-text;
      }

      &.eye-care-theme {
        background: $eye-care-bg;
        color: $eye-care-text;
      }
    }
  }

  .auto-read-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid $border-color;
    background: transparent;
    color: inherit;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.9rem;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    &.active {
      background: $primary-color;
      color: white;
      border-color: $primary-color;
    }
  }
}

// Chapter Title
.chapter-title {
  padding: 2rem 0 1rem;
  text-align: center;

  h1 {
    font-size: clamp(1.5rem, 5vw, 2rem);
    font-weight: bold;
    margin: 0;
  }
}

// Chapter Navigation
.chapter-navigation {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin-bottom: 2rem;

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.2rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    transition: all 0.3s;
    border-radius: 4px;
  }
}

// Chapter Content
.chapter-content {
  line-height: 1.8;
  margin-bottom: 2rem;

  p {
    margin-bottom: 1.5rem;
    text-indent: 2em;
    transition: background-color 0.3s;
    padding: 0.5rem;
    border-radius: 4px;
  }

  &.font-small {
    font-size: clamp(0.9rem, 2.5vw, 1rem);
  }

  &.font-medium {
    font-size: clamp(1.1rem, 3vw, 1.2rem);
  }

  &.font-large {
    font-size: clamp(1.3rem, 3.5vw, 1.4rem);
  }
}

// Modal
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal-content {
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    .modal-header {
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $border-color;

      h2 {
        margin: 0;
        font-size: 1.5rem;
      }

      .close-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
      }
    }

    .modal-body {
      padding: 1rem 0;
      max-height: calc(80vh - 4rem);
      overflow-y: auto;
      @include hide-scrollbar;
      .toc-list {
        .toc-item {
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: background-color 0.3s;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
}

// Floating Controls
.floating-controls {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  .control-panel {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1.5rem;
    border-radius: 50px;

    .control-btn {
      background: transparent;
      border: none;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .speed-indicator {
      font-size: 0.9rem;
      font-weight: 500;
      min-width: 2.5rem;
      text-align: center;
    }
  }
}

// 移动端特殊适配
@media (max-width: 767px) {
  .reader-header .header-content {
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

  .reading-settings {
    flex-direction: column;
    align-items: flex-start;

    .font-settings,
    .theme-settings,
    .auto-read {
      width: 100%;
      justify-content: space-between;
    }
  }

  .chapter-navigation {
    flex-wrap: wrap;
    gap: 0.5rem;

    .nav-btn {
      flex: 1;
      justify-content: center;
      min-width: 40%;
    }
  }
}

// 在现有样式后添加

// Voice Settings
.voice-settings {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 190px;
  .voice-select-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid $border-color;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.9rem;
    color: inherit;

    &:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

// 句子级别的样式
.paragraph {
  margin-bottom: 1.5rem;
  text-indent: 2em;
  line-height: 1.8;

  .sentence {
    transition: all 0.3s ease;
    padding: 0.1rem 0.2rem;
    border-radius: 3px;

    &.reading-sentence {
      background: linear-gradient(
        120deg,
        rgba($primary-color, 0.2) 0%,
        rgba($primary-color, 0.1) 100%
      );
      color: $primary-color;
      font-weight: 500;
      box-shadow: 0 0 0 1px rgba($primary-color, 0.3);
    }

    &.read-sentence {
      opacity: 0.7;
      background: rgba(0, 0, 0, 0.03);
    }
  }
}

// 语音选择器模态框样式
.voice-selector-modal {
  width: 90%;
  max-width: 500px;

  .voice-list {
    max-height: 400px;
    overflow-y: auto;

    .voice-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.active {
        background-color: rgba($primary-color, 0.1);
        border-left: 3px solid $primary-color;

        .voice-name {
          color: $primary-color;
          font-weight: 600;
        }
      }

      &:last-child {
        border-bottom: none;
      }

      .voice-info {
        flex: 1;

        .voice-name {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.2rem;
        }

        .voice-lang {
          font-size: 0.8rem;
          color: $secondary-color;
        }
      }

      .preview-btn {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.4rem 0.8rem;
        border: 1px solid $border-color;
        border-radius: 16px;
        background: transparent;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.3s;

        &:hover {
          background: $primary-color;
          color: white;
          border-color: $primary-color;
        }
      }
    }
  }
}

// 主题适配语音选择器
.novel-reader {
  &.dark-theme {
    .voice-selector-modal {
      .voice-item {
        border-bottom-color: rgba(255, 255, 255, 0.1);

        &:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
      }
    }
  }

  &.eye-care-theme {
    .voice-selector-modal {
      .voice-item {
        border-bottom-color: rgba(60, 76, 60, 0.1);

        &:hover {
          background-color: rgba(60, 76, 60, 0.05);
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .reading-area .container .reading-settings {
    padding: 0.5rem;
    gap: 0.5rem;
    zoom: 0.6;
  }
  .modal .modal-content {
    zoom: 0.7;
  }
}
</style>