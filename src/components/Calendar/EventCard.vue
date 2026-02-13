<template>
  <div class="overlay" v-if="visible">
    <div class="card">
      
      <!-- Bouton fermer -->
      <button class="close" @click="close">✕</button>

      <!-- Titre -->
      <h2>Add a new event</h2>
      <p class="day">{{ day }}</p>

      <!-- Input -->
      <input
        v-model="eventText"
        type="text"
        placeholder="New event"
        class="input"
      />

      <!-- Bouton -->
      <button class="submit" @click="submitEvent">
        Submit
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  day: {
    type: String,
    default: "Sunday"
  }
})

const emit = defineEmits(["add", "close"])

const visible = ref(true)
const eventText = ref("")

function submitEvent() {
  if (!eventText.value.trim()) return

  emit("add", eventText.value)
  eventText.value = ""
}

function close() {
  visible.value = false
  emit("close")
}
</script>

<style scoped>
.overlay {
  position: relative;
  width: 100%;
  height: 300px;
  background: #eef2f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  position: relative;
  width: 320px;
  background: white;
  border-radius: 14px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: #ffdede;
  color: #c0392b;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
}

h2 {
  margin: 0;
  font-size: 20px;
}

.day {
  color: #d35400;
  font-weight: bold;
}

.input {
  border: none;
  border-bottom: 2px solid #ccc;
  padding: 8px 4px;
  outline: none;
  font-size: 14px;
}

.submit {
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}

.submit:hover {
  background: #1e874b;
}
</style>
