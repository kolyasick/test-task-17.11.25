<script setup lang="ts">
type Props = {
  error: string;
};

defineProps<Props>();
defineEmits<{
  (e: "retryLoad"): Promise<void>;
}>();
</script>

<template>
  <div v-if="error" class="error-message">
    <span>❌ {{ error }}</span>
    <button @click="$emit('retryLoad')" class="btn-retry">Повторить</button>
  </div>
</template>

<style scoped>
.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-retry {
  padding: 8px 16px;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

</style>
