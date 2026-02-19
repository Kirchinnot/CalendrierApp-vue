<script setup>
import { useEvents } from "@/composables/useEvents";
import EventCard from "./EventCard.vue";
import { ref } from "vue";
import { useToast } from "@/composables/useToast";
const { triggerToast } = useToast();

const showConfirm = ref(false);
const eventToDelete = ref(null);

const confirmDelete = (id) => {
  eventToDelete.value = id;
  showConfirm.value = true;
};

const handleDelete = () => {
  deleteEvent(eventToDelete.value);
  showConfirm.value = false;
  triggerToast("Événement supprimé avec succès !");
};

const props = defineProps({
  dayName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["day-click", "edit-event"]);
const { getEventsByDay, deleteEvent } = useEvents();
const dayEvents = getEventsByDay(props.dayName);

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
  removeEventFromDay(oldDay, draggedEvent.value.id);
  addEventToDay(dayName, draggedEvent.value);
  draggedEvent.value = null;
}
</script>

<template>
  <div class="day-column" @click="emit('day-click', dayName)" @dragover.prevent @drop="onDrop(dayName)">
    <div class="day-overlay"></div>
    <div class="events-container">
      <TransitionGroup name="list">
        <EventCard
          v-for="event in dayEvents"
          :key="event.id"
          :event="event"
          @delete="confirmDelete"
          @edit="onEdit"
          @click.stop
          @dragstart="handleDragStart"
        />
      </TransitionGroup>

      <div v-if="!dayEvents || dayEvents.length === 0" class="empty-state">
        <div class="plus-icon">+</div>
        <span>Libre</span>
      </div>
    </div>
  </div>

  <div v-if="showConfirm" class="confirm-overlay">
    <div class="confirm-box">
      <p>Confirmer la suppression ?</p>
      <button @click="handleDelete">Oui</button>
      <button @click="showConfirm = false">Annuler</button>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.day-column {
  position: relative;
  border-right: 1px solid rgba(226, 232, 240, 0.6);
  min-height: 500px;
  padding: 12px 8px;
  background-color: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.day-column:last-child {
  border-right: none;
}

/* Effet au survol de la colonne entière */
.day-column:hover {
  background-color: rgba(248, 250, 252, 0.8);
  box-shadow: inset 0 0 0 2px rgba(79, 70, 229, 0.05);
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  z-index: 2;
}

/* Style de l'état vide (Empty State) */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: #94a3b8;
  opacity: 0; /* Caché par défaut */
  transition: opacity 0.3s ease;
}

.day-column:hover .empty-state {
  opacity: 1; /* Apparaît au survol pour inviter à l'action */
}

.plus-icon {
  font-size: 1.2rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
  border-radius: 50%;
}

/* Animation des cartes (TransitionGroup) */
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

/* Responsive */
@media (max-width: 768px) {
  .day-column {
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
    min-height: auto;
    padding: 20px 10px;
  }
}
/* 1. Amélioration de l'état vide (Empty State) */
.empty-state span {
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.plus-icon {
  /* On améliore l'existant */
  transition: all 0.2s ease;
  background: white;
}

.day-column:hover .plus-icon {
  border-color: #4f46e5;
  color: #4f46e5;
  transform: scale(1.1);
  border-style: solid;
}

/* 2. Overlay de confirmation (Arrière-plan flouté) */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.4); /* Backdrop sombre léger */
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: fadeIn 0.2s ease;
}

/* 3. Boîte de dialogue (Confirm Box) */
.confirm-box {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 320px;
  width: 90%;
  text-align: center;
}

.confirm-box p {
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

/* 4. Boutons de la modale */
.confirm-box button {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  margin: 0 5px;
}

/* Bouton Oui (Danger) */
.confirm-box button:first-of-type {
  background-color: #ef4444;
  color: white;
}

.confirm-box button:first-of-type:hover {
  background-color: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

/* Bouton Annuler */
.confirm-box button:last-of-type {
  background-color: #f1f5f9;
  color: #64748b;
}

.confirm-box button:last-of-type:hover {
  background-color: #e2e8f0;
  color: #475569;
}

/* Animation d'entrée */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
