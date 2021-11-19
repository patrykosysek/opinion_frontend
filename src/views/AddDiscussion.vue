<template>
  <div class="recommendation">
    <h1>{{ this.title }}</h1>
    <hr />
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alerText
    }}</b-alert>

    <b-container>
      <b-row>
        <b-col>
          <b-form-input
            class="input"
            v-model="discussion.topic"
            placeholder="Enter topic..."
          ></b-form-input>
          <b-form-textarea
            id="textarea"
            v-model="discussion.text"
            placeholder="Enter review..."
            rows="11"
            max-rows="11"
            :state="discussion.text.length > 0"
            no-resize
          ></b-form-textarea>

          <b-button @click="addDiscussion" class="btn" variant="primary"
            >Add discussion</b-button
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      type: this.$route.params.type,
      alertShow: false,
      alertVariant: "danger",
      alerText: "Cannot connect to the server",
      title: "",
      discussion: {
        topic: "",
        text: "",
      },
    };
  },
  mounted() {
    this.getTitle();
  },
  methods: {
    async getTitle() {
      let url =
        "http://localhost:8080/api/work-of-culture/" +
        this.type +
        "/" +
        this.id +
        "/information";

      const response = await fetch(url);
      const data = await response.json();

      this.title = data.title;
    },
    async addDiscussion() {
      if (this.discussion.text.length < 1 || this.discussion.topic.length < 1) {
        this.alertShow = true;
        this.alertVariant = "warning";
        this.alerText = "Fill topic and discussion text";
      } else {
        let url =
          "http://localhost:8080/api/discussion/" + this.type + "/" + this.id;

        const user = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.accessToken,
          },
          method: "POST",
          body: JSON.stringify(this.discussion),
        });

        const status = await response.status;
        console.log(response);
        if (status == 400) {
          this.alertShow = true;
          this.alertVariant = "warning";
          this.alerText = "Topic or discussion text too LONG!";
        } else if (status == 201) {
          this.alertShow = true;
          this.alertVariant = "success";
          this.alerText = "Discussion successfully added";
          this.discussion.text = "";
          this.discussion.topic = "";
        } else {
          this.alertShow = true;
          this.alertVariant = "danger";
          this.alerText = "Cannot connect to the server";
        }
      }
    },
  },
};
</script>

<style scoped>
.recommendation {
  padding: 30px;
}

.btn {
  margin: 10px;
}

.input {
  margin-bottom: 10px;
}

.text {
  font-weight: 700;
}
</style>
