<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="not-found-container">
    <div class="bg-blur circle-1"></div>
    <div class="bg-blur circle-2"></div>

    <div class="content-card">
      <h1 class="glitch-text">404</h1>
      <div class="text-group">
        <h2>Perdu dans le temps ?</h2>
        <p>La page que vous recherchez semble avoir disparu du calendrier.</p>
      </div>

      <div class="actions">
        <button @click="router.push('/')" class="btn-primary">
          <span class="icon">🏠</span> Retour
        </button>

        <!-- <button @click="router.push('/login')" class="btn-secondary">
          <span class="icon">🔑</span> Se connecter
        </button> -->
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
.not-found-container {
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* Cercles décoratifs pour l'effet moderne */
.bg-blur {
  position: absolute;
  filter: blur(80px);
  z-index: -1;
  border-radius: 50%;
  opacity: 0.4;
}
.circle-1 {
  width: 300px;
  height: 300px;
  background: #6366f1;
  top: 10%;
  left: 15%;
}
.circle-2 {
  width: 250px;
  height: 250px;
  background: #3b82f6;
  bottom: 15%;
  right: 10%;
}

.content-card {
  text-align: center;
  max-width: 500px;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

h1 {
  font-size: clamp(6rem, 15vw, 10rem);
  font-weight: 900;
  line-height: 1;
  margin: 0;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -5px;
}

.text-group h2 {
  font-size: 1.8rem;
  color: #1e293b;
  margin: 10px 0;
  font-weight: 800;
}

.text-group p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

/* Boutons */
button {
  width: 100%;
  max-width: 250px;
  padding: 14px 20px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.5);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #4f46e5;
  border: 2px solid rgba(79, 70, 229, 0.1);
}

.btn-secondary:hover {
  background: white;
  border-color: #4f46e5;
  transform: scale(1.05);
}

.icon {
  font-size: 1.2rem;
}

/* Animation de l'entrée */
.content-card {
  animation:
    fadeIn 0.8s ease-out,
    float 4s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
