<script setup lang="ts">
  import { onBeforeMount, ref } from "vue";
  import { useRouter } from "vue-router";
  import { isAuthenticated, setToken } from "../utils/auth";
  import { getApiUrl } from "../utils/config";

  defineOptions({
    name: "LoginPage",
  });

  const router = useRouter();

  const user = ref("");
  const password = ref("");
  const errors = ref<string[]>([]);
  const success = ref<string[]>([]);
  const disabled = ref(false);
  const disabledReason = ref<string | null>(null);

  const validateFields = () => {
    errors.value = [];
    if (!user.value) errors.value.push("Please provide a username or email.");
    if (!password.value) errors.value.push("Please provide a password.");
    return errors.value.length === 0;
  };

  const checkConnection = () => {
    fetch(`${getApiUrl()}/register`)
      .then(() => {})
      .catch(() => {
        disabled.value = true;
        disabledReason.value = "API not configured or unreachable.";
      });
  };

  const login = () => {
    if (!validateFields()) return;

    const currentApi = getApiUrl();
    errors.value = [];
    success.value = [];

    fetch(currentApi + "/login", {
      method: "POST",
      headers: {
        user: user.value,
        password: password.value,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          errors.value = [res.error];
          return;
        }
        success.value = ["Successfully logged in!"];
        setToken(res.token, res.expiresIn);
        setTimeout(() => {
          router.replace("/admin");
        }, 500);
      })
      .catch(() => {
        errors.value = ["Failed to connect to server. Check API URL configuration."];
      });
  };

  onBeforeMount(() => {
    if (isAuthenticated()) {
      router.replace("/admin");
      return;
    }
    checkConnection();
  });
</script>

<template>
  <div class="page-container">
    <div class="card auth-card">
      <h1 class="title">Welcome Back</h1>
      <p class="subtitle">Login to access your dashboard</p>

      <div class="form-group">
        <label>Email or Username</label>
        <input
          v-model="user"
          @keyup.enter="login"
          type="text"
          class="input"
          placeholder="Enter your credential"
          :disabled="disabled"
          required
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          v-model="password"
          @keyup.enter="login"
          type="password"
          class="input"
          placeholder="Enter your password"
          :disabled="disabled"
          required
        />
      </div>

      <div v-if="errors.length" class="message error">
        <p v-for="error in errors" :key="error">{{ error }}</p>
      </div>

      <div v-if="success.length" class="message success">
        <p v-for="msg in success" :key="msg">{{ msg }}</p>
      </div>

      <div v-if="disabled" class="message error">
        {{ disabledReason }}
      </div>

      <div class="actions">
        <button class="btn primary" @click="login" :disabled="disabled">Login</button>
        <router-link to="/register" class="register-link">
          <button class="btn secondary" :disabled="disabled">Register instead</button>
        </router-link>
      </div>

      <div class="config-section">
        <router-link to="/settings" class="settings-link">
          <button class="btn-text">Settings</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 1rem;
  }

  .auth-card {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 0.25rem;
    text-align: center;
  }

  .subtitle {
    color: var(--color-text-muted);
    text-align: center;
    margin-bottom: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 500;
    font-size: 0.9rem;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .btn.primary {
    width: 100%;
  }

  .btn.secondary {
    width: 100%;
    background: var(--color-surface-hover);
    color: var(--color-text-main);
  }

  .btn.secondary:hover {
    background: var(--color-surface);
    border: 1px solid var(--color-primary);
  }

  .message {
    padding: 0.75rem;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    text-align: center;
  }

  .message.error {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .message.success {
    background: rgba(34, 197, 94, 0.2);
    color: #86efac;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .register-link {
    width: 100%;
  }

  .config-section {
    border-top: 1px solid var(--color-surface-hover);
    padding-top: 1rem;
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
  }

  .btn-text {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    font-size: 0.85rem;
    text-decoration: underline;
  }

  .settings-link {
    text-decoration: none;
  }
</style>
