<template>
  <div class="home">
    <Scroll class="list-container" @load="handleDateLoad" v-model="loading" :finished="finished">
      <div class="list">
            <div class="column">
                <div class="item">1</div>
                <div class="item big">2</div>
                <div class="item big">3</div>
                <div class="item">4</div>
                <div class="item">5</div>
                <div class="item big">6</div>
                <div class="item big">7</div>
                <div class="item">8</div>
                <div class="item">9</div>
                <div class="item big">10</div>
                <div class="item big">11</div>
                <div class="item">12</div>
                <div class="item">13</div>
                <div class="item big">14</div>
                <div class="item big">15</div>
                <div class="item"></div>
            </div>
            <div class="column">
                <div class="item big"></div>
                <div class="item big"></div>
                <div class="item"></div>
                <div class="item big"></div>
                <div class="item"></div>
                <div class="item big"></div>
                <div class="item big"></div>
                <div class="item"></div>
                <div class="item big"></div>
                <div class="item big"></div>
                <div class="item"></div>
                <div class="item big"></div>
                <div class="item big"></div>
                <div class="item big"></div>
                <div class="item"></div>
                <div class="item big"></div>
            </div>
        </div>
    </Scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Scroll from '@/components/Scroll.vue'
export default defineComponent({
  name: 'Home',
  components: {
    Scroll
  },
  setup () {
    const loading = ref(false)
    const finished = ref(false)
    const handleDateLoad = () => {
      console.log('加载！')
      loading.value = true
      setTimeout(() => {
        loading.value = false
        finished.value = true
        console.log('加载结束')
      }, 3000)
    }

    const handlescroll = (e: Event) => {
      console.log('handlescroll', e)
    }
    return {
      handleDateLoad,
      handlescroll,
      loading,
      finished
    }
  }
})
</script>
<style lang="less" scoped>
.list-container{
  height: 80vh;
}
.list{
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .column{
        width: 50%;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        box-sizing: border-box;
        padding: 0 5px;
    }
    .item{
        width: 100%;
        height: 200px;
        background-color: pink;
        box-sizing: border-box;
        margin-bottom: 5px;
        border-radius: 2px;
    }
    .big{
        height: 300px;
    }
}
</style>
