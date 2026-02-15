<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import bcrypt from "bcryptjs";

const props = defineProps({
  addUser: Function,
});

const email = ref("");
const password = ref("");
const error = ref("");
const showPassword = ref(false);
const router = useRouter();

function login() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.Email.toLowerCase() === email.value.trim().toLowerCase(),
  );

  if (!user) {
    error.value = "Email ou mot de passe incorrect";
    return;
  }

  const isValid = bcrypt.compareSync(password.value, user.Password);

  if (!isValid) {
    error.value = "Email ou mot de passe incorrect";
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.dispatchEvent(new Event("user-changed"));
  router.push("/");
}
</script>

<template>
  <div class="login-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="welcome-icon">👋</div>
        <h2>Bon retour !</h2>
        <p>Connectez-vous pour accéder à votre calendrier.</p>
      </div>

      <form @submit.prevent="login" class="auth-form">
        <div class="input-group">
          <label>Email</label>
          <div class="input-wrapper">
            <span class="field-icon">✉️</span>
            <input
              type="email"
              v-model="email"
              placeholder="votre@email.com"
              required
            />
          </div>
        </div>

        <div class="input-group">
          <label>Mot de passe</label>
          <div class="input-wrapper">
            <span class="field-icon">🔒</span>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="••••••••"
              required
            />
            <span class="eye-toggle" @click="showPassword = !showPassword">
              {{ showPassword ? "🙈" : "👁️" }}
            </span>
          </div>
        </div>

        <div v-if="error" class="error-banner">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>

        <button class="submit-btn" :disabled="!email || !password">
          Se connecter
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Pas encore de compte ?
          <router-link to="/register">Créer un compte</router-link>
        </p>
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.auth-card {
  background: white;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.auth-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.auth-header p {
  color: #64748b;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 14px;
  font-size: 1.1rem;
  pointer-events: none;
}

input {
  width: 100%;
  padding: 14px 16px 14px 44px; /* Espace pour l'icône à gauche */
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f8fafc;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.eye-toggle {
  position: absolute;
  right: 14px;
  cursor: pointer;
  font-size: 1.2rem;
  user-select: none;
  transition: transform 0.2s;
}

.eye-toggle:hover {
  transform: scale(1.1);
}

.error-banner {
  background: #fef2f2;
  color: #ef4444;
  padding: 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #fee2e2;
}

.submit-btn {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
}

.submit-btn:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
}

.auth-footer a {
  color: #6366f1;
  text-decoration: none;
  font-weight: 700;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
