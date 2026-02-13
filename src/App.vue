<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);

function addUser(user) {
  // 1️⃣ Récupérer les utilisateurs existants
  const storedUsers = JSON.parse(localStorage.getItem("users")) || []; // 2️⃣ Vérifier si l'email existe déjà

  const exists = storedUsers.find((u) => u.Email === user.Email);
  if (exists) {
    alert("Cet email est déjà utilisé");
    return false;
  } // 3️⃣ Ajouter le nouvel utilisateur

  const newUser = { id: Date.now(), ...user };
  storedUsers.push(newUser); // 4️⃣ Sauvegarder dans le localStorage

  localStorage.setItem("users", JSON.stringify(storedUsers)); // 5️⃣ Mettre à jour le state Vue

  users.value = storedUsers;

  console.log("Utilisateur ajouté :", newUser);
  return true;
}

const handleLogout = () => {
  localStorage.removeItem("currentUser");
  router.push("/login");
};
</script>

<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <span class="logo-icon">📅</span>
          <span class="logo-text">PlanIt</span>
        </div>

        <div class="nav-links">
          <router-link to="/" class="nav-item">Calendar</router-link>
          <router-link to="/login" class="nav-item">Login</router-link>
          <router-link to="/register" class="nav-item">Register</router-link>
          <button @click="handleLogout" class="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <div :key="$route.path"> <component :is="Component" :addUser="addUser" />
          </div>
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 1. Reset & Fond global */
.app-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Inter', -apple-system, sans-serif;
}

/* 2. Navbar Style */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px); /* Effet flou */
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 3. Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-icon { font-size: 1.5rem; }
.logo-text {
  font-weight: 800;
  font-size: 1.25rem;
  background: linear-gradient(90deg, #4f46e5, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 4. Liens de navigation */
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.nav-item:hover, .router-link-active {
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
}

/* 5. Bouton Déconnexion */
.logout-btn {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

/* 6. Conteneur principal */
.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

/* 7. Animations de transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
