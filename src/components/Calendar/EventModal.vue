<script setup>
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  isOpen: Boolean,
  dayName: String,
  eventToEdit: Object,
});

const emit = defineEmits(["close", "confirm"]);
const title = ref("");
const inputFocus = ref(null); // Pour l'auto-focus

const resetAndClose = () => {
  title.value = "";
  emit("close");
};

const submit = () => {
  if (!title.value.trim()) return;

  if (props.eventToEdit) {
    emit("confirm", { ...props.eventToEdit, title: title.value });
  } else {
    emit("confirm", {
      title: title.value,
      day: props.dayName,
      color: "#4f46e5", // Couleur par défaut plus moderne (Indigo)
    });
  }
  title.value = "";
};

// Gère le remplissage du titre et l'auto-focus
watch(
  () => props.isOpen,
  async (opened) => {
    if (opened) {
      title.value = props.eventToEdit ? props.eventToEdit.title : "";
      // Attend que le DOM soit prêt pour mettre le focus sur l'input
      await nextTick();
      inputFocus.value?.focus();
    }
  },
);
</script>

<template>
  <Transition name="modal-bounce">
    <div v-if="isOpen" class="modal-overlay" @click.self="resetAndClose">
      <div class="modal-card">
        <header class="modal-header">
          <div class="header-titles">
            <h3>{{ eventToEdit ? "Edit Event" : "New Event" }}</h3>
            <p class="subtitle">{{ dayName }}</p>
          </div>
          <button @click="resetAndClose" class="close-btn">&times;</button>
        </header>

        <main class="modal-body">
          <div class="input-wrapper">
            <label class="input-label">Title</label>
            <input
              v-model="title"
              placeholder="Ex: Meeting with team..."
              @keyup.enter="submit"
              ref="inputFocus"
              class="styled-input"
            />
          </div>
        </main>

        <footer class="modal-footer">
          <button @click="resetAndClose" class="btn-cancel">Cancel</button>
          <button @click="submit" class="btn-save" :disabled="!title.trim()">
            {{ eventToEdit ? "Update Event" : "Create Event" }}
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6); /* Fond plus sombre et bleuté */
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-card {
  background: white;
  width: 95%;
  max-width: 420px;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.header-titles h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.subtitle {
  color: #6366f1;
  font-weight: 600;
  margin: 4px 0 0;
  font-size: 0.9rem;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
}

.styled-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.2s;
}

.styled-input:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.modal-footer {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
}

.btn-save {
  flex: 2;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-save:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
}

/* Animation Bounce */
.modal-bounce-enter-active {
  animation: bounce 0.3s;
}
.modal-bounce-leave-active {
  animation: bounce 0.2s reverse;
}

@keyframes bounce {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
