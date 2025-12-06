<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { getApiUrl } from '../../utils/config'
import { getToken, isAuthenticated, removeToken } from '../../utils/auth'

defineOptions({
  name: 'AdminPage'
})

const router = useRouter()

const longURL = ref('')
const custom = ref('')
const errors = ref<string[]>([])
const success = ref<string[]>([])


const validateFields = () => {
  errors.value = []
  success.value = []

  if (!longURL.value) errors.value.push("Please provide a valid URL to shorten.")
  return errors.value.length === 0
}

const shorten = () => {
  if (!validateFields()) return

  const token = getToken()
  if (!token) {
    router.replace('/login')
    return
  }

  fetch(getApiUrl() + "/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      custom: custom.value || "",
      URL: longURL.value,
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(res => {
    if (res.error) {
      errors.value = [res.error]
      return
    }
    // API returns { success: "...", URL: "short link" }
    success.value = [res.success]
  })
  .catch(() => {
    errors.value = ["Network error occurred."]
  })
}

const logout = () => {
  removeToken()
  router.replace("/login")
}

onBeforeMount(() => {
  if (!isAuthenticated()) {
    router.replace("/login")
  }
})
</script>

<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="brand">
        <img src="https://i.imgur.com/jGBJmfr.png" alt="Pokole Admin" class="brand-logo" />
      </div>
      <div class="nav-links">
        <router-link to="/admin" class="nav-item active">Shorten</router-link>
        <router-link to="/admin/links" class="nav-item">My Links</router-link>
        <button class="btn-text" @click="logout">Logout</button>
      </div>
    </nav>
    
    <main class="content">
      <div class="card action-card">
        <h2 class="section-title">Shorten a new URL</h2>
        
          <div class="form-group">
            <label>Long URL</label>
            <input v-model="longURL" @keyup.enter="shorten" type="text" class="input" placeholder="https://example.com/very-long-url" required />
          </div>

          <div class="form-group">
            <label>Custom Alias (Optional)</label>
            <input v-model="custom" @keyup.enter="shorten" type="text" class="input" placeholder="my-cool-link" />
          </div>

          <div v-if="errors.length" class="message error">
            <p v-for="error in errors" :key="error">{{ error }}</p>
          </div>

          <div v-if="success.length" class="message success">
            <p v-for="msg in success" :key="msg">{{ msg }}</p>

          </div>

          <div class="actions">
          <button class="btn primary" @click="shorten">Shorten URL</button>
          </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: var(--color-background);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-surface-hover);
}

.brand {
  /* Removed text gradient styles as we are using an image now */
  display: flex;
  align-items: center;
}

.brand-logo {
  height: 40px;
  width: auto;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  color: var(--color-text-muted);
  font-weight: 500;
}

.nav-item:hover, .nav-item.router-link-active {
  color: var(--color-primary);
}

.btn-text {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-weight: 500;
  font-family: inherit;
  font-size: 1rem;
}

.btn-text:hover {
  color: var(--color-secondary);
}

.content {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.action-card {
  width: 100%;
  max-width: 600px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-surface-hover);
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-main);
  font-weight: 500;
}

.message {
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  text-align: center;
}

.message.error {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.message.success {
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.actions {
  display: flex;
  justify-content: flex-end;
}


</style>
