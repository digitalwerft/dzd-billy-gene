<template>
  <Layout>
    <user-input></user-input>
  </Layout>
</template>

<script>
import UserInput from './components/queries/UserInput.vue'
import Layout from './components/Layout/Layout.vue';
import './styles/index.scss';

export default {
  components: {
    UserInput,
    Layout
  }
}

</script>

<style>
* {
  box-sizing: border-box;
}

html {
  font-family: sans-serif;
}

body {
  margin: 0;
}

#logoDiv {
  padding-left: 5%;
}

</style>