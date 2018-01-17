<template>
  <div id="app" data-tid="App">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  };
</script>

<style>
  html, body, #app {
    height: 100%;
  }

  #app {
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #1C7430;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @font-face {
    font-family: Krungthep;
    src: url("/static/fonts/Krungthep1.ttf");
  }

  button:active:focus {
    outline: none;
  }

  #app .button:active {
    color: #2196f3;
  }
</style>
