<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="6" md="4">
          <b-row>
            <b-col>
              <b-card
                :title="getAuthor"
                style="max-width: 20rem;"
                tag="article"
                class="mb-2"
                :footer="getPostDate"
              >
                <b-container>
                  <b-row>
                    <b-col>
                      <b-button-group vertical>
                        <b-button
                          @click="this.upVote"
                          :disabled="this.upv"
                          v-b-tooltip.hover
                          variant="success"
                          >▲</b-button
                        >
                        <p
                          v-show="render"
                          class="like"
                          :style="`--color: ${color}`"
                        >
                          {{ this.displaylikes }}
                        </p>
                        <b-button
                          @click="this.downVote"
                          :disabled="this.dwv"
                          v-b-tooltip.hover
                          variant="danger"
                          >▼</b-button
                        >
                      </b-button-group>
                    </b-col>
                  </b-row>
                </b-container>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" md="8">
          <b-row class="mb-2">
            <b-col>
              <b-card
                bg-variant="info"
                text-variant="white"
                header="Review"
                class="text-center"
              >
                <b-card-text>{{ this.comment }}</b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  props: ["comment", "id", "type", "createDate", "author", "userLike", "likes","changeLikes"],
  data() {
    return {
      disable: null,
      displaylikes: null,
      render: true,
      color: "black",
    };
  },
  computed: {
    upv() {
      if (this.disable == null || this.disable == false) return false;
      if (this.disable == true) return true;

      return true;
    },
    dwv() {
      if (this.disable == null || this.disable == true) return false;
      if (this.disable == false) return true;

      return true;
    },
    getAuthor() {
      return "Author: " + this.author;
    },
    getPostDate() {
      return "Create date: " + this.createDate;
    },
  },
  mounted() {
    this.setDisable();
    this.setLikes();
    this.changeColor();
  },
  methods: {
    setDisable() {
      if (this.userLike == null) this.disable = null;
      if (this.userLike == true) this.disable = true;
      if (this.userLike == false) this.disable = false;
    },
    changeColor() {
      if (this.displaylikes >= 0) this.color = "green";
      else this.color = "red";
    },
    setLikes() {
      this.displaylikes = this.likes;
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.render = false;
      this.changeColor();

      this.$nextTick(() => {
        // Add the component back in
        this.render = true;
      });
    },
    async downVote() {
      let url =
        "http://localhost:8080/api/review/" +
        this.type +
        "/" +
        this.id +
        "/dislike";

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
        method: "PATCH",
      });
      const data = await response.json();
      if (data.id == this.id) {
        this.displaylikes = data.likes;
        this.disable = data.userLike;
        this.forceRerender();
        this.changeLikes(data.id,data.likes,data.userLike);
      }
    },
    async upVote() {
      let url =
        "http://localhost:8080/api/review/" +
        this.type +
        "/" +
        this.id +
        "/like";

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
        method: "PATCH",
      });
      const data = await response.json();
      if (data.id == this.id) {
        this.displaylikes = data.likes;
        this.disable = data.userLike;
        this.forceRerender();
        this.changeLikes(data.id,data.likes,data.userLike);
      }
    },
  },
};
</script>

<style scoped>
.like {
  font-size: 5vh;
  font-weight: 700;
  padding: -10px;
  --color: black;
  color: var(--color);
}

.comment {
  font-weight: 700;
  font-size: 2vh;
}
</style>
