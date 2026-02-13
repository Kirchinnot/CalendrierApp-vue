<script setup>
import CalendarDay from "./CalendarDay.vue";

const days = [
  "Monday", "Tuesday", "Wednesday", 
  "Thursday", "Friday", "Saturday", "Sunday",
];

defineEmits(['day-click', 'edit-event']);
</script>

<template>
  <div class="calendar-wrapper">
    <div class="calendar-header">
      <div v-for="day in days" :key="day" class="day-label">
        <span class="day-short">{{ day.substring(0, 3) }}</span>
        <span class="day-full">{{ day }}</span>
      </div>
    </div>

    <div class="calendar-body">
      <CalendarDay
        v-for="day in days"
        :key="day"
        :dayName="day"
        @day-click="$emit('day-click', $event)"
        @edit-event="$emit('edit-event', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.calendar-wrapper {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 20px; /* Coins plus arrondis */
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 
              0 10px 10px -5px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  transition: all 0.3s ease;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f8fafc; /* Gris très léger */
  border-bottom: 1px solid #e2e8f0;
}

.day-label {
  padding: 20px 5px;
  text-align: center;
}

.day-full {
  display: block;
  font-weight: 700;
  color: #1e293b;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Cache le nom court par défaut */
.day-short {
  display: none;
  font-weight: 700;
  color: #1e293b;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-height: 600px; /* Un peu plus d'espace vertical */
  background-image: 
    linear-gradient(to right, #f1f5f9 1px, transparent 1px);
  background-size: calc(100% / 7) 100%;
}

/* Responsive : Adaptation tablette et mobile */
@media (max-width: 1024px) {
  .day-full { display: none; }
  .day-short { display: block; }
}

@media (max-width: 768px) {
  .calendar-header {
    display: none; /* On cache l'en-tête en mode liste mobile */
  }
  
  .calendar-body {
    grid-template-columns: 1fr;
    background-image: none;
  }

  .calendar-wrapper {
    border-radius: 12px;
    box-shadow: none;
    border: none;
    background: transparent;
  }
}
</style>