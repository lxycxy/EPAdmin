<!-- Message.vue -->
<template>
  <transition name="fade">
    <div v-if="message" class="message" :class="message.type">
      <p>{{ message.text }}</p>
      <button @click="closeMessage">Close</button>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

export default defineComponent({
  setup() {
    const message = ref<Message | null>(null);

    const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
      message.value = { text, type };
    };

    const closeMessage = () => {
      message.value = null;
    };

    return {
      message,
      showMessage,
      closeMessage
    };
  }
});
</script>

<style scoped>
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

.success {
  border-color: green;
}

.error {
  border-color: red;
}

.info {
  border-color: blue;
}
</style>
