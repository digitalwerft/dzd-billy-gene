<template>
  <header class="nav">
    <div>
      <h3>DZD Query Machine</h3>
    </div>
    <div id="logoDiv">
      <img src="/img/logos/DZD_Pantone.png" alt="" width="195" height="65" id="logo">
    </div>
  </header>
  <user-input></user-input>
</template>

<script>
import UserInput from './components/queries/UserInput.vue'


export default {
  components: {
    UserInput,
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


.nav {
  display: flex;
  width: 100%;
  border-bottom: 7.5px solid #e42010;
  padding-left: 40%;
  padding-right: 40%;
}
</style>