<template>
  <div class="animation">
    <img class="animation__image"
         :style="{height: animation.height + 'px', width: animation.width + 'px'}"
         :src="`/static/cards/${animation.card.name}.png`"
         alt=""
         ref="image"
    >
  </div>
</template>

<style scoped>
  .animation__image {
    position: absolute;
    animation-name: disappear;
    animation-delay: 100ms;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
    top: var(--animation-start-top);
    right: var(--animation-start-right);
  }

  @keyframes disappear {
    from {
      opacity: 1;
    }

    to {
      top: 0;
      right: 0;
      opacity: 0;
    }
  }
</style>

<script>
  export default {
    name: 'game-page-card-disappear-animation',
    props: ['animation'],
    mounted() {
      this.$el.style.setProperty('--animation-start-top', this.animation.top + 'px');
      this.$el.style.setProperty('--animation-start-right', this.animation.right + 'px');
      this.$refs.image.classList.add('animation__image');
    }
  };
</script>
