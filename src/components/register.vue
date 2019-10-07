<template>
  <div>
    <p class="md-title">Register</p>    
    <md-field>
      <md-icon>person</md-icon>
      <label for="user">Username</label>
      <md-input
        v-on:keyup.enter="register"
        class="input"
        name="user"
        type="user"
        v-model="user"
        required
      ></md-input>
    </md-field>

    <md-field>
      <md-icon>email</md-icon>
      <label for="email">Email</label>
      <md-input
        v-on:keyup.enter="register"
        class="input"
        name="email"
        type="email"
        v-model="email"
        required
      ></md-input>
    </md-field>

    <md-field>
      <md-icon>lock</md-icon>
      <label for="password">Password</label>
      <md-input
        v-on:keyup.enter="register"
        class="input"
        name="password"
        type="password"
        v-model="password"
        required
      ></md-input>
    </md-field>

    <md-field>
      <md-icon>lock</md-icon>
      <label for="password_confirm">Confirm password</label>
      <md-input
        v-on:keyup.enter="register"
        class="input"
        name="password_confirm"
        type="password"
        v-model="password_confirm"
        required
      ></md-input>
    </md-field>

    <p class="md-subheading error" v-for="error in errors" v-bind:key="error">{{error}}</p>
    <p class="md-subheading success" v-for="element in success" v-bind:key="element">{{element}}</p>

    <p class="error" v-if="disabled">Registration is currently disabled, try again later.</p>
    <md-button class="btn" @click="register" :disabled.sync="disabled">Register</md-button>
    <router-link to="/login">
      <md-button class="btn">Login instead</md-button>
    </router-link>
  </div>
</template>

<script>
import { api } from "../config.json";

export default {
  name: "register",
  data() {
    return {
      user: "",
      email: "",
      password: "",
      password_confirm: "",
      errors: [],
      success: [],
      disabled: false
    };
  },
  methods: {
    register() {
      if (!this.validateFields()) return;
      fetch(api + "/register", {
        method: "POST",
        headers: {
          username: this.user,
          email: this.email,
          password: this.password
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) return this.handleError(res.error);
          this.handleSuccess(res.success);
          return setTimeout(() => {
            return this.$router.replace("/login");
          }, 2000);
        });
    },
    validateFields() {
      this.errors = [];
      if (!this.user) this.errors.push("Please provide a username.");
      if (!this.email) this.errors.push("Please provide an email.");
      if (!this.password) this.errors.push("Please provide a password.");
      if (!this.password_confirm)
        this.errors.push("Please confirm your password.");
      if (this.password !== this.password_confirm)
        this.errors.push("The two passwords do not match.");
      if (this.errors.length) return false;
      return true;
    },
    handleError(error) {
      this.errors = [];
      return this.errors.push(error);
    },
    handleSuccess(success) {
      this.success = [];
      return this.success.push(success);
    }
  },
  beforeMount() {
    if (this.$cookies.isKey('token')) return this.$router.replace('/admin');

    fetch(`${api}/register`)
      .then(res => res.json())
      .then(res => (this.disabled = !res));
  }
};
</script>