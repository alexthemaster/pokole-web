<template>
  <div>
    <p class="md-title">Shorten URL</p>
    <md-field>
      <label for="longURL">Long URL</label>
      <md-input class="input" name="longURL" v-model="longURL" required></md-input>
    </md-field>

    <md-field>
      <label for="custom">Custom</label>
      <md-input class="input" name="custom" v-model="custom"></md-input>
      <md-button class="btn" style="bottom: 8px;" @click="shorten">Shorten</md-button>
    </md-field>

    <p class="md-subheading error" v-for="error in errors" v-bind:key="error">{{error}}</p>
    <p class="md-subheading success" v-for="element in success" v-bind:key="element">{{element}}</p>

    <router-link to="/admin/links">
      <md-button class="btn">List of shortened URLs</md-button>
    </router-link>

    <md-button class="btn" style="float: right" @click="logout">Logout</md-button>
  </div>
</template>

<script>
import { api } from "../../config.json";

export default {
  name: "admin",
  data() {
    return {
      longURL: "",
      custom: "",
      errors: [],
      success: []
    };
  },
  beforeMount() {
    if (!this.$cookies.isKey("token")) return this.$router.replace("/login");
  },
  methods: {
    logout() {
      if (confirm("Press OK to log out!")) this.$router.replace("/logout");
    },
    shorten() {
      if (!this.validateFields()) return;
      fetch(api + "/shorten", {
        method: "POST",
        headers: {
          custom: this.custom ? this.custom : "",
          URL: this.longURL,
          Authorization: `Bearer ${this.$cookies.get("token")}`
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) return this.handleError(res.error);
          this.handleSuccess(res.success, res.URL);
        });
    },
    validateFields() {
      this.errors = [];
      this.success = [];
      if (!this.longURL)
        this.errors.push("Please provide a valid URL to shorten.");
      if (this.errors.length) return false;
      return true;
    },
    handleError(error) {
      this.errors = [];
      return this.errors.push(error);
    },
    handleSuccess(...success) {
      this.success = [];
      return this.success.push(...success);
    }
  }
};
</script>