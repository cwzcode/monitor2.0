<template>
  <div class="login">
    <router-view style="margin-top: 12%;margin-left: 20%;"></router-view>
  </div>
</template>

<script>

export default {
  name: 'login',
  components:{
  },
  mounted () {
    this.$router.push('/user/signIn').catch(err => {err})
  },
}
</script>

<style>
.login{
  background:url(../assets/images/back.jpg) ;
  background-size: cover;
  position: absolute;
  left:0px;
  top:0px;
  z-index: -1;
  width: 100%;
  height: 100%;
}
</style>
