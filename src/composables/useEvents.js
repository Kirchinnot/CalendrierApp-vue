import { ref, computed, watch } from "vue";

// 1. Initialisation de l'état réactif
// On tente de récupérer les données sauvegardées dans le navigateur
const STORAGE_KEY = "calendar-events-data";
const savedData = localStorage.getItem(STORAGE_KEY);
const events = ref(JSON.parse(localStorage.getItem('calendar-events') || '[]'));

// 2. Persistance automatique
// Dès que la liste "events" change, on met à jour le LocalStorage
watch(
  events,
  (newEvents) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
  },
  { deep: true },
);

export function useEvents() {
  // Ajouter un nouvel événement
  const addEvent = (eventData) => {
    events.value.push({
      id: Date.now(), // Génère un ID unique basé sur le temps
      title: eventData.title,
      day: eventData.day,
      color: eventData.color || "#d1fae5",
    });
  };

  // Supprimer un événement
  const deleteEvent = (id) => {
    events.value = events.value.filter((event) => event.id !== id);
  };

  // Filtrer les événements par jour (utilisé par CalendarDay)
  const getEventsByDay = (dayName) => {
    return computed(() =>
      events.value.filter((event) => event.day === dayName),
    );
  };

  const updateEvent = (updatedEvent) => {
    const index = events.value.findIndex((e) => e.id === updatedEvent.id);
    if (index !== -1) {
      events.value[index] = { ...updatedEvent };
    }
  };

  const saveEvents = () => {
    localStorage.setItem('calendar-events', JSON.stringify(events.value));
  };

  const clearDayEvents = (dayName) => {
    // On ne garde que les événements qui ne sont PAS dans ce jour
    events.value = events.value.filter(event => event.day !== dayName);
    saveEvents(); // On sauvegarde les changements
  };

  return {
    events,
    addEvent,
    deleteEvent,
    getEventsByDay,
    updateEvent,
    clearDayEvents,
    saveEvents
  };
}