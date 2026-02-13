<script setup>
import { ref, computed } from "vue";
import bcrypt from "bcryptjs";
import { useRouter } from "vue-router";

const router = useRouter();
const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const newName = ref("");
const newFirstname = ref("");
const newEmail = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const message = ref("");
const showPassword = ref(false);

const isFormValid = computed(() => 
  newName.value && newFirstname.value && newEmail.value && newPassword.value && confirmPassword.value
);

const props = defineProps({ addUser: Function });

function submitForm() {
  if (!isFormValid.value) {
    message.value = "Veuillez remplir tous les champs";
    return;
  }
  if (!passwordRules.test(newPassword.value)) {
    message.value = "Le mot de passe ne respecte pas les critères de sécurité.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    message.value = "Les mots de passe ne correspondent pas";
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword.value, salt);

  const success = props.addUser({
    Name: newName.value.trim(),
    Firstname: newFirstname.value.trim(),
    Email: newEmail.value.trim(),
    Password: hashedPassword,
  });

  if (success) router.push("/login");
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Créer un compte</h2>
        <p>Organisez votre temps avec élégance</p>
      </div>

      <form @submit.prevent="submitForm" class="auth-form">
        <div class="input-row">
          <div class="input-group">
            <label>Nom</label>
            <input type="text" v-model="newName" placeholder="Doe" />
          </div>
          <div class="input-group">
            <label>Prénom</label>
            <input type="text" v-model="newFirstname" placeholder="John" />
          </div>
        </div>

        <div class="input-group">
          <label>Email</label>
          <input type="email" v-model="newEmail" placeholder="john.doe@example.com" />
        </div>

        <div class="input-group relative">
          <label>Mot de passe</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="newPassword"
            placeholder="••••••••"
          />
          <span class="eye-icon" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>

        <div class="input-group">
          <label>Confirmer le mot de passe</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="••••••••"
          />
        </div>

        <p v-if="message" class="error-msg">{{ message }}</p>

        <button :disabled="!isFormValid" class="submit-btn">
          S'inscrire
        </button>
      </form>

      <div class="rules-container">
        <p class="rules-title">Sécurité du mot de passe :</p>
        <ul class="password-rules">
          <li :class="{ ok: newPassword.length >= 8 }">8 caractères minimum</li>
          <li :class="{ ok: /[A-Z]/.test(newPassword) }">1 majuscule</li>
          <li :class="{ ok: /[a-z]/.test(newPassword) }">1 minuscule</li>
          <li :class="{ ok: /\d/.test(newPassword) }">1 chiffre</li>
          <li :class="{ ok: /[^A-Za-z\d]/.test(newPassword) }">1 caractère spécial</li>
        </ul>
      </div>
      
      <p class="footer-text">
        Déjà membre ? <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.auth-card {
  background: white;
  width: 100%;
  max-width: 500px;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h2 {
  font-size: 2rem;
  color: #1e293b;
  font-weight: 800;
}

.auth-header p {
  color: #64748b;
  margin-top: 5px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
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

.relative { position: relative; }

input {
  width: 100%;
  padding: 14px 16px;
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

.eye-icon {
  position: absolute;
  right: 15px;
  top: 38px;
  cursor: pointer;
  font-size: 1.2rem;
  user-select: none;
}

.submit-btn {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.4);
}

.submit-btn:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  background: #fef2f2;
  padding: 10px;
  border-radius: 8px;
}

/* Règles de mot de passe */
.rules-container {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.rules-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.password-rules {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.password-rules li {
  font-size: 0.8rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.password-rules li::before {
  content: '○';
  font-weight: bold;
}

.password-rules li.ok {
  color: #10b981;
  font-weight: 600;
}

.password-rules li.ok::before {
  content: '●';
}

.footer-text {
  text-align: center;
  margin-top: 25px;
  font-size: 0.9rem;
  color: #64748b;
}

.footer-text a {
  color: #6366f1;
  text-decoration: none;
  font-weight: 700;
}

@media (max-width: 480px) {
  .input-row { grid-template-columns: 1fr; }
  .password-rules { grid-template-columns: 1fr; }
}
</style>