<template>
  <div>
    <div class="name">
      <p>OPINION</p>
    </div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">OPINION</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/recommendation">Recommendation</b-nav-item>
          <b-nav-item v-if="isLogged" to="/watchlist">Watch list</b-nav-item>
          <b-nav-item v-if="isLogged" to="/seenlist">Seen list</b-nav-item>
          <b-nav-item v-if="isLogged" to="/reviews-user">Reviews</b-nav-item>
           <b-nav-item v-if="isLogged" to="/discussions-user">Discussions</b-nav-item>
          <!-- <b-nav-item to="/login">Login</b-nav-item> -->
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <!-- <b-dropdown-item href="#">Profile</b-dropdown-item> -->
            <b-dropdown-item v-if="isLogged" @click="logOut"
              >Logout</b-dropdown-item
            >
            <b-dropdown-item v-else to="/login">Login</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  computed: {
    isLogged() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user != null) return true;
      else return false;
    },
    isAdmin() {
      const user = JSON.parse(localStorage.getItem("user"));
      return this.isLogged && user.role == "ADMIN";
    },
    isUser() {
      const user = JSON.parse(localStorage.getItem("user"));
      return this.isLogged && user.role == "OPINION_USER";
    },
  },
  methods: {
    logOut() {
      localStorage.removeItem("user");
      window.location = "/";
      // window.location.reload(true);
    },
  },
};
</script>

<style lang="scss" scoped>
#nav a.router-link-exact-active {
  color: white;
}

.name {
  font-size: 50px;
  vertical-align: middle;
}
</style>
