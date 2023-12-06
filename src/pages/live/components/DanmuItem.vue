<script setup lang="ts">
defineProps({
  source: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div>
    <span font-bold>{{ source.user.trim() }}</span> : <span text-sm>{{ source.msg.trim() }}</span>
  </div>
</template>
