<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form novalidate="novalidate" class="was-validated" @submit="onSubmit">
                  <h1>로그인</h1>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <input v-model="form.email" type="text" class="form-control" placeholder="Username">
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <input v-model="form.password" type="password" class="form-control" placeholder="Password">
                  </b-input-group>
                  <b-row>
                    <b-col cols="12" class="text-right">
                      <b-button type="submit" variant="primary" class="px-4">로그인</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        email: 'test01@cj.net',
        password: 'TmzkdlcpfL'
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      if (this.form.email !== '' && this.form.password !== '') {
        this.$http.post('/api/auth/login', this.form)
          .then((response) => {
            if (response.status === 200) {
              this.$session.start()
              this.$session.set('user-token', response.data.token)
              this.$session.set('user-id', response.data._id)
              this.$session.set('user-name', response.data.name)
              this.$session.set('user-email', response.data.email)
              this.$http.defaults.headers.common['Authorization'] = response.data.token
              this.$router.push('/')
            }
          }).catch((error) => {
            alert(error.response.data.message)
          })
      } else {
        alert('이메일 또는 비밀번호를 입력해주세요.')
      }
    }
  }
}
</script>
