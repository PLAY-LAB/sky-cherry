<template>
  <div class="animated fadeIn">
      <b-row>
        <b-col sm="2">
          <div>
            <div v-if="profile.name === ''">
              <img src="/static/img/avatars/profile_thumbnail.jpg" class="img-avatar" />
            </div>
            <div v-else class="header-icon-text mb-2" v-bind:style="{ background: getBgColor(profile.email), width: '100px', height: '100px', margin: 'auto', fontSize: '60px'}">
                {{ profileName }}
            </div>
            <p class="text-center"><strong>{{ profile.name }}</strong></p>
          </div>
          <div>
            <p class="text-center">LV: <strong v-bind:style="{ color: getLevelColor(profile.level) }">{{ profile.level }}</strong> / SI : <strong>{{ profile.si }}</strong></p>
            <p class="text-center">Cherry : <strong>{{ tokens }}</strong></p>
            <p class="text-center">Questions : <strong>{{ questions.length }}</strong></p>
            <p class="text-center">Answers : <strong>{{ answers.length }}</strong></p>
            <p class="text-center">Likes : <strong>{{ likes.length }}</strong></p>
            <p class="text-center">Comments : <strong>{{ comments.length }}</strong></p>
          </div>
          <br/>
          <div class="text-center mb-4">
            <b-button variant="success" :to="{name: 'Cherry Transfer'}" v-bind:style="{ borderRadius: '.3rem' }">Cherry Transfer</b-button>
          </div>
        </b-col>
        <b-col sm="10">
          <b-tabs>
            <b-tab title="정보" :active="$route.query.tab==='info'" v-if="$route.params.userId===$session.get('user-id')">
              <b-row>
                <b-col sm="12">
                  <b-row>
                    <b-col sm="6">
                      <b-form-group
                        label="성별/나이 :"
                        label-for="genderAndAge"
                        :label-cols="3"
                        :horizontal="true">
                        <b-form-input plaintext id="genderAndAge" type="text" v-bind:value="('male' === profile.gender ? '남' : '여') + '/' + $moment({}).diff($moment(profile.birthday), 'years')"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col sm="6">
                      <b-form-group
                        label="직업 :"
                        label-for="occupation"
                        :label-cols="3"
                        :horizontal="true">
                        <b-form-select id="occupation" v-model="form.occupation" :options="$store.state.occupation" class="mb-3" />
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="6">
                      <b-form-group
                        label="가족형태 :"
                        label-for="familyType"
                        :label-cols="3"
                        :horizontal="true">
                        <b-form-select id="familyType" v-model="form.familyType" :options="$store.state.familyType" class="mb-3" />
                      </b-form-group>
                    </b-col>
                    <b-col sm="6">
                      <b-form-group
                        label="관심사 :"
                        label-for="interest"
                        :label-cols="3"
                        :horizontal="true">
                        <b-form-select id="interest" v-model="form.interest" :options="$store.state.interest" class="mb-3" />
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="6">
                      <b-form-group
                        label="월평균소득 :"
                        label-for="monthlyIncome"
                        :label-cols="3"
                        :horizontal="true">
                        <b-form-select id="monthlyIncome" v-model="form.monthlyIncome" :options="$store.state.monthlyIncome" class="mb-3" />
                      </b-form-group>
                    </b-col>
                    <b-col sm="6">
                      <b-form-group
                        label="보유자산 :"
                        label-for="assets"
                        :label-cols="3"
                        :horizontal="true">
                        <b-form-select id="assets" v-model="form.assets" :options="$store.state.assets" class="mb-3" />
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="12">
                      <b-form-group
                        label="소득운영현황 :"
                        label-for="incomeManagement"
                        :horizontal="true">
                        <b-form-radio-group v-model="form.incomeManagement"
                                            :options="$store.state.incomeManagement"
                                            name="radioInline">
                        </b-form-radio-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="12">
                      <b-form-textarea v-model="form.description"
                                       placeholder="자기소개를 입력하세요."
                                       :rows="9"
                                       :max-rows="9">
                      </b-form-textarea>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12">
                  <br/>
                  <div class="text-right">
                    <b-button v-on:click="updateProfile">저장</b-button>
                  </div>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="알림" :active="$route.query.tab==='notification'" v-if="$route.params.userId===$session.get('user-id')">
              <b-list-group v-if="!notifications.length" flush>
                <b-list-group-item>
                    <span class="text-muted">활동 내역이 없습니다.</span>
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-for="notification in notifications" :key="notification.id" flush>
                <b-list-group-item v-if="notification.answer">
                  <b-link v-bind:style="{color: '#30CE92'}" :to="{ name: '프로필', params: { userId: notification.answer.createdBy._id }}">{{ notification.answer.createdBy.name }}</b-link><span class="text-muted">님이 당신의 질문에 답하였습니다.</span>
                  <b-link class="text-dark" :to="{ name: '질문 상세', params: { questionId: notification._id }}">"{{ notification.title }}"</b-link>
                  <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(notification.answer.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
                <b-list-group-item v-else>
                  <b-link v-bind:style="{color: '#30CE92'}" :to="{ name: '프로필', params: { userId: notification.like.createdBy._id }}">{{ notification.like.createdBy.name }}</b-link><span class="text-muted">님이 당신의 질문을 좋아합니다.</span>
                  <b-link class="text-dark" :to="{ name: '질문 상세', params: { questionId: notification._id }}">"{{ notification.title }}"</b-link>
                  <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(notification.like.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
              </b-list-group>
            </b-tab>
            <b-tab title="질문">
              <b-list-group v-if="!questions.length" flush>
                <b-list-group-item>
                    <span class="text-muted">활동 내역이 없습니다.</span>
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-for="question in questions" :key="question.id" flush>
                <b-list-group-item>
                  <b-link class="text-dark" :to="{ name: '질문 상세', params: { questionId: question._id }}">"{{ question.title }}"</b-link>
                  <span class="text-muted">{{ getDescription(question.description) }}<b-link class="text-muted" v-show="question.description.length > maxDescriptionLength" :to="{ name: '질문 상세', params: { questionId: question._id }}">more</b-link></span>
                  <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(question.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
              </b-list-group>
            </b-tab>
            <b-tab title="답변">
              <b-list-group v-if="!answers.length" flush>
                <b-list-group-item>
                    <span class="text-muted">활동 내역이 없습니다.</span>
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-for="answer in answers" :key="answer.id" flush>
                <b-list-group-item>
                  <b-link class="text-dark" :to="{ name: '질문 상세', params: { questionId: answer.question._id }}">"{{ answer.question.title }}"</b-link>
                  <span class="text-muted">{{ getDescription(answer.description) }}<b-link class="text-muted" v-show="answer.description.length > maxDescriptionLength" :to="{ name: '질문 상세', params: { questionId: answer.question._id }}">more</b-link></span>
                  <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(answer.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
              </b-list-group>
            </b-tab>
            <b-tab title="좋아요">
              <b-list-group v-if="!likes.length" flush>
                <b-list-group-item>
                    <span class="text-muted">활동 내역이 없습니다.</span>
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-for="like in likes" :key="like.id" flush>
                <b-list-group-item v-if="like.questionOrAnswerModel === 'Question'">
                    <b-link v-bind:style="{color: '#30CE92'}" :to="{ name: '프로필', params: { userId: like.questionOrAnswer.createdBy._id }}">{{ like.questionOrAnswer.createdBy.name }}</b-link><span class="text-muted">님의 질문을 좋아합니다.</span>
                    <b-link class="text-dark" :to="{ name: '질문 상세', params: { questionId: like.questionOrAnswer._id }}">"{{ like.questionOrAnswer.title }}"</b-link>
                    <span class="text-muted">{{ getDescription(like.questionOrAnswer.description) }}<b-link class="text-muted" v-show="like.questionOrAnswer.description.length > maxDescriptionLength" :to="{ name: '질문 상세', params: { questionId: like.questionOrAnswer._id }}">more</b-link></span>
                    <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(like.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
                <b-list-group-item v-else>
                    <b-link v-bind:style="{color: '#30CE92'}" :to="{ name: '프로필', params: { userId: like.questionOrAnswer.createdBy._id }}">{{ like.questionOrAnswer.createdBy.name }}</b-link><span class="text-muted">님의 답변을 좋아합니다.</span>
                    <b-link class="text-dark" :to="{ name: '질문 상세', params: { questionId: like.questionOrAnswer.question._id }}">"{{ like.questionOrAnswer.question.title }}"</b-link>
                    <span class="text-muted">{{ getDescription(like.questionOrAnswer.description) }}<b-link class="text-muted" v-show="like.questionOrAnswer.description.length > maxDescriptionLength" :to="{ name: '질문 상세', params: { questionId: like.questionOrAnswer.question._id }}">more</b-link></span>
                    <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(like.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
              </b-list-group>
            </b-tab>
            <b-tab title="댓글">
              <b-list-group v-if="!comments.length" flush>
                <b-list-group-item>
                    <span class="text-muted">활동 내역이 없습니다.</span>
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-for="comment in comments" :key="comment.id" flush>
                <b-list-group-item>
                    "{{ comment.question.title }}" <span class="text-muted" v-readMore:50="comment.description"></span> <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(comment.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
              </b-list-group>
            </b-tab>
            <b-tab title="Cherry" v-if="$route.params.userId===$session.get('user-id')">
              <b-list-group v-if="!events.length" flush>
                <b-list-group-item>
                    <span class="text-muted">활동 내역이 없습니다.</span>
                </b-list-group-item>
              </b-list-group>
              <b-list-group v-for="event in events" :key="event.id" flush>
                <b-list-group-item v-if="event.actionType === 'likeMyQuestion'">
                    <span class="text-muted">Wow~ 당신의 질문에 like가 발생해 <span v-bind:style="{color: '#ad2552'}"><strong>{{ event.tokens }} Cherry</strong></span>를 받았어요!</span>
                    <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(event.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
                <b-list-group-item v-else-if="event.actionType === 'likeMyAnswer'">
                    <span class="text-muted">Wow~ 당신의 답변에 like가 발생해 <span v-bind:style="{color: '#ad2552'}"><strong>{{ event.tokens }} Cherry</strong></span>를 받았어요.</span>
                    <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(event.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
                <b-list-group-item v-else-if="event.actionType === 'question'">
                    <span class="text-muted">질문을 올리고 <span v-bind:style="{color: '#30CE92'}"><strong>{{ event.tokens }} Cherry</strong></span>를 사용했어요.</span>
                    <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(event.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
                <b-list-group-item v-else-if="event.actionType === 'answer'">
                    <span class="text-muted">Wow~ 답변을 등록하고 <span v-bind:style="{color: '#ad2552'}"><strong>{{ event.tokens }} Cherry</strong></span>를 받았어요!</span>
                    <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(event.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
                <b-list-group-item v-else-if="event.actionType === 'signup'">
                    <span class="text-muted">Wow~ 회원 가입을 축하합니다! 환영 선물로 <span v-bind:style="{color: '#ad2552'}"><strong>{{ event.tokens }} Cherry</strong></span>를 받았어요.</span>
                    <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(event.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
                <b-list-group-item v-else-if="event.actionType === 'profile'">
                    <span class="text-muted">Wow~ 프로필을 업데이트하고 <span v-bind:style="{color: '#ad2552'}"><strong>{{ event.tokens }} Cherry</strong></span>를 받았어요.</span>
                    <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(event.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
                <b-list-group-item v-else>
                    <span class="text-muted">Wow~ Like을 누르고 <span v-bind:style="{color: '#ad2552'}"><strong>{{ event.tokens }} Cherry</strong></span>를 받았어요!</span>
                    <span v-bind:style="{color: '#EAA240'}">{{ $moment.utc(event.createdAt).local().fromNow() }}</span>
                </b-list-group-item>
              </b-list-group>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
  </div>
</template>

<script>
import striptags from 'striptags'

export default {
  name: 'Profile',
  components: {},
  created () {
    if (!this.$route.params.userId) {
      let userId = this.$session.get('user-id')
      this.$router.push('/profiles/' + userId)
    }

    this.fetchProfile()
    this.fetchTokens()
    this.fetchNotifications()
    this.fetchQuestions()
    this.fetchAnswers()
    this.fetchLikes()
    this.fetchComments()
    this.fetchEvents()
  },
  watch: {
    $route (to, from) {
      if (from.params.userId !== to.params.userId || from.query.tab !== to.query.tab) {
        location.reload()
      }
    }
  },
  data () {
    return {
      maxDescriptionLength: 50,
      profile: {},
      profileName: '',
      tokens: 0,
      questions: [],
      answers: [],
      likes: [],
      comments: [],
      events: [],
      form: {
        occupation: '',
        familyType: '',
        interest: '',
        monthlyIncome: '',
        assets: '',
        incomeManagement: '',
        description: ''
      }
    }
  },
  methods: {
    getDescription (description) {
      description = striptags(description)
      if (description.length > this.maxDescriptionLength) {
        return description.substr(0, this.maxDescriptionLength) + '...'
      }
      return description
    },
    fetchProfile () {
      this.profile = []
      this.$http.get('/api/users/' + this.$route.params.userId)
        .then((response) => {
          this.profile = response.data
          this.profileName = (this.profile.name !== '') ? this.profile.name.substring(0, 1) : ''

          this.form.occupation = response.data.occupation || this.$store.state.occupation[0].value
          this.form.familyType = response.data.familyType || this.$store.state.familyType[0].value
          this.form.interest = response.data.interest || this.$store.state.interest[0].value
          this.form.monthlyIncome = response.data.monthlyIncome || this.$store.state.monthlyIncome[0].value
          this.form.assets = response.data.assets || this.$store.state.assets[0].value
          this.form.incomeManagement = response.data.incomeManagement || ''
          this.form.description = response.data.description
        })
    },
    fetchTokens () {
      this.$http.get('/api/users/' + this.$route.params.userId + '/tokens')
        .then((response) => {
          this.tokens = response.data.tokens
        })
    },
    fetchNotifications () {
      this.notifications = []
      this.$http.get('/api/notifications')
        .then((response) => {
          this.notifications = response.data
        }).then(() => {
          var self = this
          this.notifications = this.notifications.slice().sort(function (a, b) {
            var compare1 = b.answer ? b.answer.createdAt : b.like.createdAt
            var compare2 = a.answer ? a.answer.createdAt : a.like.createdAt
            return self.$moment(compare1).valueOf() - self.$moment(compare2).valueOf()
          })
        }).catch((e) => {
          console.error(e)
        })
    },
    fetchQuestions () {
      this.questions = []
      this.$http.get('/api/questions', {
        params: {
          createdBy: this.$route.params.userId
        }
      })
        .then((response) => {
          this.questions = response.data
        })
    },
    fetchAnswers () {
      this.answers = []
      this.$http.get('/api/answers', {
        params: {
          createdBy: this.$route.params.userId,
          sort: 'desc'
        }
      })
        .then((response) => {
          this.answers = response.data
        })
    },
    fetchLikes () {
      this.likes = []
      this.$http.get('/api/likes', {
        params: {
          createdBy: this.$route.params.userId
        }
      })
        .then((response) => {
          this.likes = response.data
        })
    },
    fetchComments () {
      this.comments = []
    },
    fetchEvents () {
      this.events = []
      this.$http.get('/api/events', {
        params: {
          from: this.$route.params.userId,
          to: this.$route.params.userId
        }
      })
        .then((response) => {
          this.events = response.data
        })
    },
    updateProfile () {
      let loader = this.$loading.show()
      this.$http.put('/api/users/' + this.$route.params.userId, this.form)
        .then((response) => {
          this.fetchProfile()
        })
        .finally(() => loader.hide())
    },
    getBgColor (email) {
      if (email === 'test01@cj.net' || email === 'bittermoon@cj.net') {
        return '#6d0592'
      } else if (email === 'test02@cj.net' || email === 'chris@cj.net') {
        return '#026466'
      } else if (email === 'test03@cj.net' || email === 'miin_dong@cj.net') {
        return '#d34836'
      } else if (email === 'test04@cj.net' || email === 'hyungn11@cj.net') {
        return '#ff0084'
      } else if (email === 'test05@cj.net' || email === 'autumn091@cj.net') {
        return '#1769ff'
      } else {
        return '#ad2552'
      }
    },
    getLevelColor (level) {
      var color = ''
      switch (level) {
        case 'Black':
          color = 'black'
          break
        case 'Red':
          color = 'red'
          break
        case 'Green':
          color = 'green'
          break
        default:
          color = 'blue'
      }
      return color
    }
  }
}
</script>
