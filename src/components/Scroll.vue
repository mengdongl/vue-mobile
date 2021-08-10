<template>
  <div class="scroll"
  ref="scrollRef"
  @touchstart.stop="handleTouchStart"
  @touchmove.stop="throttleHandleTouchMove"
  @touchend.stop="handleTouchEnd"
  >
    <div ref="scrollcontainerRef" class="scroll-container" :style="{transform:'translateY(' + y + 'px)','transition-duration': transitionTime +'ms'}" style="transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);">
        <slot></slot>
        <div class="scroll-loading" v-if="loading">
          <slot name="loading">
            加载中
          </slot>
        </div>
        <div class="scroll-finished" v-if="finished">
          <slot name="finished">
            没有更多了
          </slot>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch, watchEffect } from 'vue'
import { throttle } from '../utils/utils'
export default defineComponent({
  name: 'Scroll',
  props: {
    offset: {
      type: Number,
      default: 300
    },
    finished: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['load', 'update:modelValue'],
  setup (props, context) {
    const y = ref(0)
    const transitionTime = ref(0)
    let deltaY = 0
    let startY = 0
    let oldY = 0
    let ismoved = false
    let time = 0
    let speed = 0
    let speedY = 0

    const { finished, modelValue } = toRefs(props)
    const loading = computed({
      get: () => modelValue.value,
      set: val => {
        context.emit('update:modelValue', val)
      }
    })
    const isTouching = ref(false)
    const scrollcontainerRef = ref<HTMLElement | null>(null)
    const scrollRef = ref<HTMLElement | null>(null)
    const isScrollable = () => {
      const targetHeight = (scrollcontainerRef.value as HTMLElement).clientHeight
      const scrollHeight = (scrollRef.value as HTMLElement).clientHeight
      return targetHeight > scrollHeight
    }
    const handleTouchStart = (e: TouchEvent) => {
      if (!isScrollable()) {
        return
      }
      isTouching.value = true
      transitionTime.value = 0
      const touches = e.changedTouches
      const touch = touches[0]
      startY = touch.pageY
      oldY = y.value
    }
    const tap = (e:HTMLElement, eventName: string) => {
      const ev = document.createEvent('HTMLEvents')
      ev.initEvent(eventName, true, true)
      e.dispatchEvent(ev)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrollable()) {
        return
      }
      const touches = e.changedTouches
      const touch = touches[0]
      deltaY = touch.pageY - startY
      y.value = oldY + deltaY
      const oldspeedY = speedY
      time = new Date().getTime()
      speed = touch.pageY - oldspeedY
      speedY = touch.pageY
      ismoved = true
    }

    const throttleHandleTouchMove = throttle(handleTouchMove, 6)

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isScrollable()) {
        return
      }
      const touches = e.changedTouches
      const touch = touches[0]
      const clientHeight = document.documentElement.clientHeight
      time = new Date().getTime() - time
      if (Math.abs(speed) && ismoved && time < 20) {
        const speedrat = speed / 6
        const endY = clientHeight * speedrat + y.value
        y.value = endY
        transitionTime.value = Math.min(2400, 800 * Math.abs(speedrat))
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

    watch(y, () => {
      const target = scrollRef.value as HTMLElement
      tap(target, 'scroll')
    })

    watchEffect(() => {
      const target = scrollcontainerRef.value as HTMLElement
      const targetHeight = target.clientHeight
      const scrollHeight = (scrollRef.value as HTMLElement).clientHeight
      const offsetBottom = targetHeight - (Math.abs(y.value) + scrollHeight)
      if (offsetBottom < props.offset && !finished.value && !modelValue.value) {
        context.emit('load')
      }
    },
    {
      flush: 'post'
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
      throttleHandleTouchMove,
      handleTouchEnd,
      y,
      transitionTime,
      scrollcontainerRef,
      scrollRef,
      scrollTo,
      loading
    }
  }
})
</script>
<style lang="less" scoped>
.scroll{
    overflow: hidden;
    .scroll-container{
      .scroll-loading{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .scroll-finished{
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
}
</style>
