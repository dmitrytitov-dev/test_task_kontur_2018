<template>
  <div class="main">
    <div class="a">0123456789 — serif</div>
    <div class="b">0123456789 — sans-serif</div>
    <div class="c">0123456789 — monospace</div>
    <div class="d">0123456789 — cursive</div>
    <div class="e">0123456789 — fantasy</div>
    <div class="f">0123456789 — system-ui</div>
    <div class="g">0123456789 — krungthep</div>
  </div>
</template>

<style scoped>
  .main {
    font-size: 32px;
    line-height: 2;
  }

  .a {
    font-family: serif;
  }

  .b {
    font-family: sans-serif;
  }

  .c {
    font-family: monospace;
  }

  .d {
    font-family: cursive;
  }

  .e {
    font-family: fantasy;
  }

  .f {
    font-family: system-ui;
  }

  .g {
    font-family: Krungthep;
  }
</style>

<script>
  export default {
    name: 'temp'
  };
</script>
