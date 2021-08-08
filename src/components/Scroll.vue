<template>
  <div class="scroll"
  ref="scrollRef"
  @touchstart="handleTouchStart"
  @touchmove="handleTouchMove"
  @touchend="handleTouchEnd"
  >
    <div ref="scrollcontainerRef" class="scroll-container" :style="{transform:'translateY(' + y + 'px)','transition-duration': transitionTime +'ms'}" style="transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'Scroll',
  setup () {
    const y = ref(0)
    const transitionTime = ref(0)
    let deltaY = 0
    let startY = 0
    let oldY = 0
    let time = 0
    let ismoved = false

    const isTouching = ref(false)
    const scrollcontainerRef = ref<HTMLElement | null>(null)
    const scrollRef = ref<HTMLElement | null>(null)

    const handleTouchStart = (e: TouchEvent) => {
      isTouching.value = true
      transitionTime.value = 0
      const touches = e.changedTouches
      const touch = touches[0]
      time = new Date().getTime()
      startY = touch.pageY
      oldY = y.value
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touches = e.changedTouches
      const touch = touches[0]
      deltaY = touch.pageY - startY
      y.value = oldY + deltaY
      ismoved = true
    }

    const handleTouchEnd = () => {
      time = new Date().getTime() - time
      if (time < 100 && ismoved) {
        const clientHeight = document.documentElement.clientHeight
        const scrollStrength = deltaY / time
        const endY = clientHeight * scrollStrength + y.value
        y.value = endY
        transitionTime.value = Math.min(2400, 800 * Math.abs(scrollStrength))
      }
      isTouching.value = false
      ismoved = false
      deltaY = 0
    }

    watch(isTouching, (newVal) => {
      const target = scrollcontainerRef.value as HTMLElement
      const targetHeight = target.clientHeight
      const scrollHeight = (scrollRef.value as HTMLElement).clientHeight
      if (y.value > 100 && !newVal) {
        y.value = 0
        transitionTime.value = 800
      } else if (y.value < -(targetHeight - scrollHeight + 100) && !newVal) {
        y.value = -(targetHeight - scrollHeight)
        transitionTime.value = 800
      }
    })
    // scroll组件的scrollto方法实现
    const scrollTo = (el: HTMLElement | number) => {
      let offsetTop
      if (el instanceof HTMLElement) {
        offsetTop = el.offsetTop
      } else {
        offsetTop = el
      }
      y.value = -offsetTop
      transitionTime.value = 800
    }
    return {
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      y,
      transitionTime,
      scrollcontainerRef,
      scrollRef,
      scrollTo
    }
  }
})
</script>
<style lang="less" scoped>
.scroll{
    overflow: hidden;
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
