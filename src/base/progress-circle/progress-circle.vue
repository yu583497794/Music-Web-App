<template>
  <div class="progress-circle">
    <!-- viewBox舞台大小 -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" mlns="http://www.w3.org.org/2000/svg" >
      <!-- 半径50 圆心50 50 -->
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <!-- dasharray周长 offset偏移 -->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent"
        :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'progress-circle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable';

.progress-circle {
  position: relative;

  circle {
    stroke-width: 8px;
    transform-origin: center;

    &.progress-background {
      // scale(0.9)确保是个⚪
      transform: scale(0.9);
      stroke: $color-theme-d;
    }

    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>
