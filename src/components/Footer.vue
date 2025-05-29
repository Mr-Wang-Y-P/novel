<!--
 * @Author: 汪迎平
 * @Date: 2025-05-29 08:27:05
 * @LastEditTime: 2025-05-29 16:55:21
 * @LastEditors: 汪迎平
 * @Description: 
-->

<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2024 书海阁. 所有权利保留.</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: white;
  border-top: 1px solid $border-color;
  padding: clamp(1.5rem, 4vh, 2.5rem) 0;
//   margin-top: clamp(3rem, 8vh, 5rem);
  text-align: center;
  color: $secondary-color;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
}
</style>