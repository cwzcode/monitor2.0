<template>
  <Card style="width:300px;">
          <p slot="title">注册</p>
          <Form ref="registerInfo" :model="registerInfo" style="margin-top: 10px;">
             <FormItem prop="user">
                <Input type="text" v-model="registerInfo.user" placeholder="Username" >
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" v-model="registerInfo.password" placeholder="Password" >
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <RadioGroup v-model="identity" style="float: right;margin-top: -15px;">
                    <Radio label="user">
                        <span>用户</span>
                    </Radio>
                    <Radio label="admin">
                        <span>管理员</span>
                    </Radio>
                </RadioGroup>
            <FormItem>
                <Button type="primary" style="width: 250px;margin-top: 15px;margin-left: 10px;" @click="logupTo">注册</Button>
            </FormItem>
            <FormItem>
                <Button type="text" @click="toSignIn" style="float: right;margin-top: -10px;font-size: 10px;color:darkgrey;" >已注册，返回登录</Button>
            </FormItem>
          </Form>
      </Card>
</template>

<script>
  const root = process.env.API_ROOT;
  
  export default {
    data () {
      return {
        registerInfo: {
          user: '',
          password: ''
        },
        identity: 'user',
        uid: '',
      }
    },
    mounted () {
    },
    methods: {
      logupTo () {
        this.$get(root+'/RegisterServlet', {
          username: this.registerInfo.user,
          password: this.registerInfo.password,
          identity: this.identity
        })
          .then((response) => {
            console.log(response.state)
            if (response.state === 'register success') {
              this.$Notice.success({
                title: '注册成功'
              })
              this.signIn()
            } else {
              this.$Notice.error({
                title: '注册失败,用户已存在'
              })
            }
          })
      },
      toSignIn(){
        this.$router.push('/user/signIn').catch(err => {err})
      }
    }
  }
</script>

<style>
</style>
