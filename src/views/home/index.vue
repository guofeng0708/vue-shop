<template>
  <h1>首页</h1>
  <!-- <p>{{ $store.state.count }}</p> -->
</template>

<script lang="ts" setup>
// import { useStore } from 'vuex'
import { useStore } from '../../store'

const store = useStore()

console.log(store.state.count)
</script>

<style lang="scss" scoped>

</style>
