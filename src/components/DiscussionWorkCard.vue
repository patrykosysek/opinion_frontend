<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="6" md="4">
          <b-row>
            <b-col>
              <b-card
                header="Author"
                :title="this.author"
                style="max-width: 20rem;"
                tag="article"
                class="mb-2"
                :footer="getPostDate"
              >
                <b-container>
                  <b-row> </b-row>
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
                :header="this.topic"
                class="text-center"
              >
                <b-card-text>{{ this.text }}</b-card-text>
              </b-card>
              <hr />
              <h2>Answers</h2>
              <hr />
              <b-pagination
                v-if="show"
                align="center"
                v-model="currentPage"
                :per-page="perPage"
                :total-rows="rows"
                first-text="First"
                prev-text="Prev"
                next-text="Next"
                last-text="Last"
                @input="paginate(currentPage)"
              ></b-pagination>
              <b-card
                v-for="answer in displayAnswers"
                :key="answer.id"
                bg-variant="secondary"
                text-variant="white"
                :header="getAuthor(answer.author)"
                class="text-center"
                :footer="getAnswerDate(answer.createDate)"
              >
                <b-card-text>{{ answer.text }}</b-card-text>
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
  props: ["id", "type", "createDate", "topic", "title", "text"],
  data() {
    return {
      alertShow: false,
      alertVariant: "",
      alertText: "",
      currentPage: 1,
      perPage: 1,
      rows: 0,
      search: "",
      answers: [],
      displayAnswers: [],
      discussionInfo: [],
      author: "",
    };
  },
  computed: {
    getPostDate() {
      return "Create date: " + this.createDate;
    },
    show() {
      return this.rows > 0;
    },
  },
  mounted() {
    this.getDiscussionInfo();
  },
  methods: {
    async paginate(currentPage) {
      const start = (currentPage - 1) * this.perPage;
      this.displayAnswers = this.answers.slice(start, start + 1);
    },
    async getDiscussionInfo() {
      let url =
        "http://localhost:8080/api/discussion/" +
        this.type +
        "/" +
        this.id +
        "/information";
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
        method: "GET",
      });
      const data = await response.json();
      this.discussionInfo = data;
      this.answers = data.answers.content;
      this.rows = data.answers.totalElements;
      this.author = data.author;

      if (this.rows != 0) {
        this.displayAnswers = data.answers.content.slice(0, 1);
      }
    },
    getAnswerDate(x) {
      return "Create date: " + x;
    },
    getAuthor(x) {
      return "Author: " + x;
    },
  },
};
</script>

<style scoped></style>
