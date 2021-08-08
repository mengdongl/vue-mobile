<template>
  <div class="home">
    <Scroll></Scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Scroll from '@/components/Scroll.vue'
export default defineComponent({
  name: 'Home',
  components: {
    Scroll
  }
})
</script>
