<template>
  <Card style="width:300px;">
        <p slot="title">欢迎登录</p>
        <Form ref="loginInfo" :model="loginInfo" style="margin-top: 10px;">
           <FormItem prop="user">
              <Input type="text" v-model="loginInfo.user" placeholder="Username">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
          </FormItem>
          <FormItem prop="password">
              <Input type="password" v-model="loginInfo.password" placeholder="Password">
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
          </FormItem>
          <Button style="float: right;margin-top: -25px;font-size: 3px;color:darkgrey;" type="text" @click="modal_forgetPw = true">忘记密码？</Button>
          <forget-pw :modal_forgetPw="modal_forgetPw" v-model="modal_forgetPw"></forget-pw>
          <FormItem>
              <Button type="primary" style="width: 250px;margin-top: 5px;margin-left: 10px;" @click="loginTo('formInline')">登录</Button>
          </FormItem>
        </Form>
        <p style="margin-top: 20px;margin-bottom: 10px;text-align: center;font-size: 10px;color:darkgrey;">登录进入监控平台</p>
        <Button type="text" style="float: right;margin-top: -35px;" @click="toRegister">注册</Button>
    </Card>
</template>

<script>
import forgetPw from './forgetPw.vue'
const root = process.env.API_ROOT;

export default {
  components:{
    forgetPw
  },
  data () {
    return {
      modal_forgetPw: false,
      // show: true,
      loginInfo: {
        user: '',
        password: ''
      },
      uid: '',
    }
  },
  mounted () {
  },
  methods: {
    loginTo () {
      this.$get(root+'/LoginServlet', {
        username: this.loginInfo.user,
        password: this.loginInfo.password
      })
        .then((response) => {
          console.log(response)
          if (response.state === 'login success') {
            this.$Notice.success({
              title: '登录成功'
            })
            let uid = response.uid
            this.$store.commit('signChangeUid',uid)
            this.$router.push('/main')
            // this.$cookies.set('uid', idd, 60 * 60)
          } else {
            this.$Notice.error({
              title: '登录失败，用户名密码错误或用户不存在'
            })
          }
        })
    },
    toRegister(){
      this.$router.push('/user/register').catch(err => {err})
    }
  }
}
</script>

<style>
</style>
