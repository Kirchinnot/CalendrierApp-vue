<script setup>
import { useEvents } from "@/composables/useEvents";
import EventCard from "./EventCard.vue";
import { ref } from "vue";
import { useToast } from "@/composables/useToast";

const { triggerToast } = useToast();

const props = defineProps({
  dayName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["day-click", "edit-event"]);
const { getEventsByDay, deleteEvent, clearDayEvents } = useEvents();
const dayEvents = getEventsByDay(props.dayName);

// --- États des Modales ---
const showConfirm = ref(false);
const showClearConfirm = ref(false);
const eventToDelete = ref(null);

// --- Fonctions existantes ---
const confirmDelete = (id) => {
  eventToDelete.value = id;
  showConfirm.value = true;
};

const handleDelete = () => {
  deleteEvent(eventToDelete.value);
  showConfirm.value = false;
  triggerToast("Événement supprimé avec succès !");
};

const handleClearAll = () => {
  clearDayEvents(props.dayName);
  showClearConfirm.value = false;
  triggerToast(`Toutes les tâches du ${props.dayName} ont été supprimées.`);
};

const onEdit = (event) => {
  emit("edit-event", event);
};

const draggedEvent = ref(null);

function handleDragStart(event) {
  draggedEvent.value = event;
}

function onDrop(dayName) {
  if (!draggedEvent.value) return;
  const oldDay = draggedEvent.value.date;
  draggedEvent.value.date = dayName;
  // Note: Assure-toi que ces fonctions sont dispos dans ton scope ou composable
  // removeEventFromDay(oldDay, draggedEvent.value.id);
  // addEventToDay(dayName, draggedEvent.value);
  draggedEvent.value = null;
}
</script>

<template>
  <div
    class="day-column"
    @click="emit('day-click', dayName)"
    @dragover.prevent
    @drop="onDrop(dayName)"
  >
    <div class="column-header">
      <span class="event-count">{{ dayEvents.length }} tâches</span>
      <button
        v-if="dayEvents.length > 0"
        @click.stop="showClearConfirm = true"
        class="clear-day-btn"
        title="Vider la journée"
      >
        Vider
      </button>
    </div>

    <div class="events-container">
      <TransitionGroup name="list">
        <EventCard
          v-for="event in dayEvents"
          :key="event.id"
          :event="event"
          @delete="confirmDelete"
          @edit="onEdit"
          @dragstart="handleDragStart"
        />
      </TransitionGroup>

      <div v-if="!dayEvents || dayEvents.length === 0" class="empty-state">
        <div class="plus-icon">+</div>
        <span>Libre</span>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showConfirm || showClearConfirm"
        class="confirm-overlay"
        @click="
          showConfirm = false;
          showClearConfirm = false;
        "
      >
        <div v-if="showConfirm" class="confirm-box" @click.stop>
          <div class="warning-icon">🗑️</div>
          <p>Confirmer la suppression ?</p>
          <div class="confirm-actions">
            <button @click="handleDelete" class="btn-danger">Supprimer</button>
            <button @click="showConfirm = false" class="btn-cancel">
              Annuler
            </button>
          </div>
        </div>

        <div v-if="showClearConfirm" class="confirm-box" @click.stop>
          <div class="warning-icon">⚠️</div>
          <h3>Vider la journée ?</h3>
          <p>
            Supprimer toutes les tâches du <strong>{{ dayName }}</strong> ?
          </p>
          <div class="confirm-actions">
            <button @click="handleClearAll" class="btn-danger">
              Tout supprimer
            </button>
            <button @click="showClearConfirm = false" class="btn-cancel">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.day-column {
  position: relative;
  border-right: 1px solid rgba(226, 232, 240, 0.6);
  min-height: 500px;
  padding: 12px 8px;
  background-color: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.day-column:last-child {
  border-right: none;
}

.day-column:hover {
  background-color: rgba(248, 250, 252, 0.8);
  box-shadow: inset 0 0 0 2px rgba(79, 70, 229, 0.05);
}

/* Header interne à la colonne */
.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 12px 4px;
  z-index: 5;
}

.event-count {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.clear-day-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  opacity: 0; /* Caché par défaut, apparaît au hover */
}

.day-column:hover .clear-day-btn {
  opacity: 1;
}

.clear-day-btn:hover {
  background: #fef2f2;
  transform: scale(1.05);
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

/* --- Modales --- */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.confirm-box {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  max-width: 350px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.warning-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.confirm-box h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.confirm-box p {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.confirm-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confirm-actions button {
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

/* --- États Vides --- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: #94a3b8;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.day-column:hover .empty-state {
  opacity: 1;
}

.plus-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
  border-radius: 50%;
  background: white;
  transition: all 0.2s ease;
}

.day-column:hover .plus-icon {
  border-color: #4f46e5;
  color: #4f46e5;
  transform: scale(1.1);
  border-style: solid;
}

/* --- Animations --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 768px) {
  .day-column {
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
    min-height: auto;
    padding: 20px 10px;
  }
}
</style>
