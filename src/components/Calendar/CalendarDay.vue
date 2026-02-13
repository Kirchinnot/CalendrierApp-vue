<script setup>
import { useEvents } from '@/composables/useEvents';
import EventCard from './EventCard.vue';

const props = defineProps({
  dayName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['day-click', 'edit-event']);
const { getEventsByDay, deleteEvent } = useEvents();
const dayEvents = getEventsByDay(props.dayName);

const onEdit = (event) => {
  emit('edit-event', event);
}
</script>

<template>
  <div class="day-column" @click="emit('day-click', dayName)">
    <div class="day-overlay"></div>
    <div class="events-container">
      <TransitionGroup name="list">
        <EventCard 
          v-for="event in dayEvents" 
          :key="event.id" 
          :event="event"
          @delete="deleteEvent"
          @edit="onEdit"
          @click.stop />
      </TransitionGroup>
      
      <div v-if="!dayEvents || dayEvents.length === 0" class="empty-state">
        <div class="plus-icon">+</div>
        <span>Libre</span>
      </div>
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
</style>