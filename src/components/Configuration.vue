<script setup lang="ts">
  import { ref } from "vue";
import { useRouter } from "vue-router";
import { getPokoleUrl, setPokoleUrl } from "../utils/config";

  defineOptions({
    name: "ConfigurationPage",
  });

  const router = useRouter();
  const PokoleUrl = ref(getPokoleUrl());
  const message = ref("");
  const isError = ref(false);

  const saveConfig = () => {
    message.value = "";
    isError.value = false;

    setPokoleUrl(PokoleUrl.value);

    const currentUrl = getPokoleUrl();
    fetch(`${currentUrl}/api/register`) // Using /register as a health check since it's public
      .then((res) => res.json())
      .then(() => {
        message.value = "Configuration saved and connection verified!";
        setTimeout(() => {
          router.back();
        }, 1500);
      })
      .catch(() => {
        message.value = "Configuration saved, but could not connect to API.";
        isError.value = true;
      });
  };

  const goBack = () => {
    router.back();
  };
</script>

<template>
  <div class="page-container">
    <div class="card config-card">
      <h1 class="title">Settings</h1>
      <p class="subtitle">Set a custom Pokole URL (advanced users)</p>

      <div class="form-group">
        <label>API URL</label>
        <div class="input-group">
          <input v-model="PokoleUrl" type="text" class="input" placeholder="http://localhost:8080" />
        </div>
        <small class="hint">The address of your Pokole API.</small>
      </div>

      <div v-if="message" :class="['message', isError ? 'error' : 'success']">
        {{ message }}
      </div>

      <div class="actions">
        <button class="btn primary" @click="saveConfig">Save & Verify</button>
        <button class="btn secondary" @click="goBack">Back</button>
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

  .config-card {
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

  .hint {
    font-size: 0.8rem;
    color: var(--color-text-muted);
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
</style>
