<script setup>
import { ref } from "vue";
import { useEvents } from "@/composables/useEvents";
import CalendarGrid from "../components/Calendar/CalendarGrid.vue";
import EventModal from "@/components/Calendar/EventModal.vue";
import { useToast } from "@/composables/useToast";
const { triggerToast } = useToast();


const { addEvent, updateEvent } = useEvents();

const isModalOpen = ref(false);
const selectedDay = ref("Monday");
const editingEvent = ref(null);

const openModal = (day = "Monday") => {
  editingEvent.value = null; // Sécurité : on vide l'édition pour un nouvel ajout
  selectedDay.value = day;
  isModalOpen.value = true;
};

const openEditModal = (event) => {
  selectedDay.value = event.day;
  editingEvent.value = event;
  isModalOpen.value = true;
};

const handleConfirm = (eventData) => {
  if (editingEvent.value) {
    updateEvent(eventData);
    triggerToast("Événement modifié avec succès !");
  } else {
    addEvent(eventData);
    triggerToast("Événement ajouté avec succès !");
  }
  isModalOpen.value = false;
  editingEvent.value = null;
};
</script>

<template>
  <div class="calendar-page">
    <header class="app-header">
      <div class="header-content">
        <span class="badge">Planning hebdomadaire</span>
        <h1>Mon Calendrier</h1>
        <p>Gérez vos tâches et événements en un clic.</p>
      </div>
      <button @click="openModal('Monday')" class="add-event-btn">
        <span class="plus">+</span> Nouvel événement
      </button>
    </header>

    <main class="calendar-container">
      <CalendarGrid @day-click="openModal" @edit-event="openEditModal" />
    </main>

    <EventModal
      :is-open="isModalOpen"
      :day-name="selectedDay"
      :event-to-edit="editingEvent"
      @close="isModalOpen = false"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.calendar-page {
  min-height: calc(100vh - 80px); /* Ajusté pour la Navbar */
  padding: 40px 20px;
}

.app-header {
  max-width: 1300px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: space-between;
  align-items: center; /* Aligné au centre pour un look plus symétrique */
}

/* Petit badge au-dessus du titre */
.badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.header-content h1 {
  font-size: 2.8rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -1px;
  margin: 0;
}

.header-content p {
  color: #64748b;
  font-size: 1.1rem;
  margin-top: 8px;
}

/* Bouton stylisé avec dégradé */
.add-event-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.add-event-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.4);
  filter: brightness(1.1);
}

.add-event-btn:active {
  transform: translateY(0);
}

.plus {
  font-size: 1.4rem;
  line-height: 1;
}

.calendar-container {
  max-width: 1300px;
  margin: 0 auto;
}

/* Adaptabilité mobile */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .add-event-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>