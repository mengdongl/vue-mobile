<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- <VirList :listData="listData"></VirList> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VirList from '../components/VirList.vue'
export default defineComponent({
  name: 'Home',
  components: {
  },
  data () {
    return {
      listData: [1, 2, 3, 4]
    }
  }
})
</script>
