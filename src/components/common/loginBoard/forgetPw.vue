<template>

  <Modal
    v-model="modal"
    title="忘记密码"
    @on-ok=""
    @on-cancel="closeModal_forgetPw">
    <Input v-model="newInfo.find_name" placeholder="用户名" style="width: 300px" />
    <Input v-model="newInfo.new_password" placeholder="新密码" style="width: 300px" />
    <Input v-model="newInfo.confirm_password" placeholder="新密码确定" style="width: 300px" />
  </Modal>

</template>

<script>
  const root = process.env.API_ROOT;
export default {
  props: {
    "modal_forgetPw": {
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      modal:this.modal_forgetPw,
      newInfo:{
        find_name: '',
        new_password: '',
        confirm_password: ''
      }
    }
  },
  watch:{
    modal_forgetPw(val){
      this.modal = val
    },
    modal(val){
      this.$emit('input',val)
    }
  },
  methods:{
    closeModal_forgetPw(){
      this.$emit('closeModal_forgetPw',this.modal_forgetPw)
    }
  }
}
</script>
<style>
</style>
