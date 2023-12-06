<template>
  <main font-sans text-black>
    <RouterView :key="$route.name + ($route.query.id || '') + ($route.query.platform || '')" />
  </main>
</template>
