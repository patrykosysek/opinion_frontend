<template>
  <div class="login">
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alerText
    }}</b-alert>
    <b-container>
      <b-row>
        <b-col>
          <b-form-group
            id="input-group-1"
            label="Email address:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="login.email"
              type="email"
              placeholder="Enter email"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group
            id="input-group-2"
            label="Password:"
            label-for="input-2"
          >
            <b-form-input
              id="input-2"
              v-model="login.password"
              type="password"
              placeholder="Enter password"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form @submit="onSubmit" v-if="show">
        <b-button style="width: 10%" type="submit" variant="primary"
          >Login</b-button
        >
      </b-form>
      <div class="reg">
        <p>U don't have account ?</p>
        <b-link to="/registration">Registration</b-link>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
      show: true,
      user: {
        id: null,
        role: null,
        email: null,
        nickname: null,
        accessToken: null,
      },
      entry:{
        userId: null
      },
      alertShow: false,
      alertVariant: "success",
      alerText: "Successful login",
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();

      try {
        const response = await fetch("http://localhost:8080/api/auth", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(this.login),
        });
        const data = await response.json();

        this.user.id = data.user.id;
        this.entry.userId = data.user.id;
        this.user.email = data.user.email;
        this.user.nickname = data.user.nickname;
        this.user.accessToken = data.accessToken;
        this.user.role = data.role;
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(this.user));
        this.logEntry();

        window.location = "/";
      } catch (error) {
        console.log(error);
        this.alertShow = true;
        this.alertVariant = "danger";
        this.alerText = "Login failed";
        this.login.email = "";
        this.login.password = "";
      }
    },
    async logEntry(){
    const response = await fetch("http://127.0.0.1:8000/api/add-entries", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(this.entry),
        });
        console.log(response);
  },
  },
};
</script>

<style scoped>
.login {
  padding: 30px;
}

.reg {
  padding: 10px;
}
</style>
