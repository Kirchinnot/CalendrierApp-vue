<script setup>
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["edit", "delete"]);
</script>

<template>
  <div
    class="event-card"
    :style="{
      backgroundColor: event.color + '20', // Ajoute de la transparence à la couleur de fond
      borderLeftColor: event.color,
    }"
  >
    <div class="event-content">
      <span class="event-title">{{ event.title }}</span>
    </div>

    <div class="event-actions">
      <button
        @click.stop="emit('edit', event)"
        class="action-btn edit"
        title="Modifier"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
          ></path>
        </svg>
      </button>

      <button
        @click.stop="emit('delete', event.id)"
        class="action-btn delete"
        title="Supprimer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.event-card {
  padding: 10px 12px;
  margin: 2px 0;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 4px solid; /* Bordure colorée à gauche */
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 45px;
  position: relative;
  background-color: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  filter: brightness(1);
}

.event-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.event-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden; /* Coupe le texte proprement s'il est trop long */
}

.event-actions {
  display: flex;
  gap: 4px;
  opacity: 0; /* Invisibles par défaut */
  transition: opacity 0.2s ease;
  padding-left: 8px;
}

.event-card:hover .event-actions {
  opacity: 1; /* Apparaissent au survol */
}

.action-btn {
  background: white;
  border: 1px solid #f1f5f9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  color: #64748b;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.action-btn.edit:hover {
  background-color: #eff6ff;
  color: #3b82f6;
  border-color: #3b82f6;
}

.action-btn.delete:hover {
  background-color: #fef2f2;
  color: #ef4444;
  border-color: #ef4444;
}
</style>
