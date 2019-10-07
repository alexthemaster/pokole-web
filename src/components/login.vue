<template>
  <div>
    <p class="md-title">Login</p>    
    <md-field>
      <md-icon>person</md-icon>
      <label for="user">Email or Username</label>
      <md-input
        v-on:keyup.enter="login"
        class="input"
        name="user"
        type="user"
        v-model="user"
        required
      ></md-input>
    </md-field>

    <md-field>
      <md-icon>lock</md-icon>
      <label for="password">Password</label>
      <md-input
        v-on:keyup.enter="login"
        class="input"
        name="password"
        type="password"
        v-model="password"
        required
      ></md-input>
    </md-field>

    <p class="md-subheading error" v-for="error in errors" v-bind:key="error">{{error}}</p>
    <p class="md-subheading success" v-for="element in success" v-bind:key="element">{{element}}</p>

    <md-button class="btn" @click="login">Login</md-button>
    <router-link to="/register"><md-button class="btn" :disabled.sync="disabled">Register instead</md-button></router-link>
  </div>
</template>

<script>
import { api } from "../config.json";

export default {
  name: "login",
  data() {
    return {
      user: "",
      password: "",
      errors: [],
      success: [],
      disabled: false
    };
  },
  methods: {
    login() {
      if (!this.validateFields()) return;
      fetch(api + "/login", {
        method: "POST",
        headers: {
          user: this.user,
          password: this.password
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) return this.handleError(res.error);
          this.handleSuccess('Successfully logged in!');
          this.$cookies.set('token', res.token, res.expiresIn);
          return setTimeout(() => {
            return this.$router.replace('/admin');            
          }, 2000);
        });
    },
    validateFields() {
      this.errors = [];
      if (!this.user) this.errors.push("Please provide an username or email.");
      if (!this.password) this.errors.push("Please provide a password.");
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