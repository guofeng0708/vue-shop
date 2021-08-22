<template>
  <h1>登陆</h1>
</template>

<script lang="ts" setup>
import { getLoginInfo } from '@/api/common'
import type { ILoginInfo } from '@/api/types/common'
import { onMounted, ref } from '@vue/runtime-core'

const list = ref<ILoginInfo['slide']>([])
onMounted(() => {
  getLoginInfo().then(data => {
    list.value = data.slide
  })
})
</script>

<style lang="scss" scoped>

</style>
