<script setup lang="ts">
  import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import type { Link } from "../../types"; // Removed VueCookies interface
import { getToken, isAuthenticated, removeToken } from "../../utils/auth";
import { getDisplayUrl, getPokoleUrl } from "../../utils/config";

  defineOptions({
    name: "LinksPage",
  });

  const router = useRouter();
  const links = ref<Link[]>([]);
  const deleting = ref<string | null>(null);

  const logout = () => {
    removeToken();
    router.replace("/login");
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  onBeforeMount(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const token = getToken();
    if (!token) {
      // Should be covered by isAuthenticated, but for type safety
      router.replace("/login");
      return;
    }

    fetch(getPokoleUrl() + "/api/me/links", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        links.value = res;
      })
      .catch(() => {
        // handle error
      });
  });

  const deleteLink = async (shortURL: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      deleting.value = shortURL;
      const res = await fetch(getPokoleUrl() + "/api/me/links/" + shortURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `Delete failed (${res.status})`);
      }

      // Remove from UI
      links.value = links.value.filter((l) => l.shortURL !== shortURL);
    } catch (e) {
      // Basic error feedback
      console.error(e);
      alert("Failed to delete link. Please try again.");
    } finally {
      deleting.value = null;
    }
  };
</script>

<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="brand">
        <img src="https://i.imgur.com/jGBJmfr.png" alt="Pokole Admin" class="brand-logo" />
      </div>
      <div class="nav-links">
        <router-link to="/admin" class="nav-item">Shorten</router-link>
        <router-link to="/admin/links" class="nav-item active">My Links</router-link>
        <button class="btn-text" @click="logout">Logout</button>
      </div>
    </nav>

    <main class="content">
      <div class="card list-card">
        <h2 class="section-title">Your Shortened Links</h2>

        <div v-if="links.length === 0" class="empty-state">
          <p>You haven't shortened any links yet.</p>
          <router-link to="/admin">
            <button class="btn primary">Shorten your first link</button>
          </router-link>
        </div>

        <div v-else class="link-list">
          <div v-for="link in links" :key="link.shortURL" class="link-item">
            <div class="link-details">
              <div class="long-url" :title="link.longURL">{{ link.longURL }}</div>
              <div class="short-url">
                <a :href="getDisplayUrl(link.shortURL)" target="_blank">{{ link.shortURL }}</a>
              </div>
            </div>
            <div class="link-stats">
              <span class="badget">Hits: {{ link.stats || 0 }}</span>
              <span class="created-date" v-if="link.created_on"
                >Created: {{ formatDate(link.created_on) }}</span
              >
              <div style="margin-top:6px;">
                <button
                  class="btn-danger"
                  :disabled="deleting === link.shortURL"
                  @click="deleteLink(link.shortURL)"
                >
                  <span v-if="deleting === link.shortURL">Deleting...</span>
                  <span v-else>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
  /* Reuse dashboard styles - ideally extract to layout */
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

  .nav-item:hover,
  .nav-item.router-link-active {
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

  .list-card {
    width: 100%;
    max-width: 800px;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-surface-hover);
    padding-bottom: 0.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 0;
    color: var(--color-text-muted);
  }

  .empty-state p {
    margin-bottom: 1rem;
  }

  .link-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .link-item {
    background: var(--color-surface-hover);
    padding: 1rem;
    border-radius: var(--radius-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform var(--transition-fast);
  }

  .link-item:hover {
    transform: translateX(4px);
    background: #3c4b60; /* custom lighten */
  }

  .link-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow: hidden;
  }

  .long-url {
    color: var(--color-text-muted);
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
  }

  .short-url a {
    color: var(--color-primary);
    font-weight: 600;
    font-size: 1.1rem;
  }

  .short-url a:hover {
    color: var(--color-secondary);
    text-decoration: underline;
  }

  .badget {
    background: var(--color-background);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-full);
    font-size: 0.8rem;
    color: var(--color-text-main);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .link-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .created-date {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  /* Delete button styles */
  .btn-danger {
    background: transparent;
    border: 1px solid rgba(255, 80, 80, 0.18);
    color: #ff6b6b;
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, transform 80ms ease;
  }

  .btn-danger:hover:not([disabled]) {
    background: rgba(255, 80, 80, 0.12);
    color: #ff4d4d;
    transform: translateY(-1px);
  }

  .btn-danger[disabled] {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
</style>
