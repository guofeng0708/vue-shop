<template>
  <h1>{{ props.msg }}</h1>

  <abc />
  <foo :test="'render'" />
</template>

<script lang="tsx" setup>
import foo from './foo'
const abc = <h1>abc</h1>
const props = defineProps({
  msg: {
    type: String,
    required: true
  }
})

</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
