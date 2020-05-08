<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="用户信息">
          <div class="layout-logo">物联网平台</div>
          <div class="layout-nav">
            <MenuItem v-show="$store.state.rootShow" name="删除工程" @click.native="deletePrograme">
              <Icon type="ios-remove" />
              删除工程
            </MenuItem>
            <MenuItem name="用户信息" @click.native="userInfo">
              <Icon type="ios-list" />
              用户信息
            </MenuItem>
            <MenuItem name="退出登录" @click.native="backToLogin">
              <Icon type="ios-backspace"></Icon>
              退出登录
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout style="height:calc(100vh - 64px)">
        <Sider hide-trigger :style="{ background: '#fff' }">
          <Menu ref="side_menu" :active-name="0 - 0" :open-names="[0]" theme="light" width="auto" v-for="(projectInfo, n) in $store.state.project" :key="n">
            <Submenu :name="n" :key="n">
              <template slot="title">
                <Icon type="md-school"></Icon>
                {{ projectInfo.project_name }}
              </template>
              <MenuItem v-for="(areaInfo, i) in projectInfo.area_info" :key="i" :name="n - i" @click.native="getAreaInfo(n, i)">{{ areaInfo.area_name }}
                <Icon v-show="areaInfo.areaAbnormal" :class="{highlight:areaInfo.areaAbnormal}" size="15" type="md-warning" style="float: right;" />
              </MenuItem>
              <MenuItem v-show="$store.state.rootShow" class="el-icon-remove" name="icon_remove" @click.native="clickDeleteProject(n)"></MenuItem>
            </Submenu>
          </Menu>
        </Sider>

        <Modal v-model="button_deleteProject" title="删除项目" @on-ok="deleteProject">
          <p>确定要删除{{ $store.state.project_activeInfo.project_name }} 这个项目吗？</p>
        </Modal>

        <Layout :style="{ padding: '0 15px 15px' }">
          <Breadcrumb :style="{ margin: '8px 0' }" >
            <div v-show="$store.state.rootShow">
              <select-column
                :modal_addProject="modal_addProject"
                :modal_addArea="modal_addArea"
                :modal_addRoom="modal_addRoom"
                :modal_deleteArea="modal_deleteArea"
                @value_addProject="val => (this.modal_addProject = val)"
                @value_addArea="val => (this.modal_addArea = val)"
                @value_addRoom="val => (this.modal_addRoom = val)"
                @value_deleteArea="val => (this.modal_deleteArea = val)"
              >
                <Button type="text" @click="modal_addProject = true" slot="addProject">
                  新建项目
                  <Icon type="md-add" />
                </Button>
                <Button type="text" @click="modal_addArea = true" slot="addArea">
                  新建区域
                  <Icon type="md-add" />
                </Button>
                <Button type="text" @click="modal_addRoom = true" slot="addRoom">
                  新建房间
                  <Icon type="md-add" />
                </Button>
                <Button type="text" @click="modal_deleteArea = true" slot="deleteArea">
                  删除当前区域
                  <Icon type="md-remove" />
                </Button>
              </select-column>
            </div>
          </Breadcrumb>
          <Content :style="{ padding: '15px', background: '#fff' }"><router-view></router-view></Content>
        </Layout>
      </Layout>

      <el-dialog title="选择模式" :visible.sync="chooseShow" width="30%" :close-on-click-modal="false" :close-on-press-escape="false" :center="true">
        <el-radio v-model="radio" label="add">创建工程，成为管理员</el-radio>
        <div>
          <el-radio v-model="radio" label="join" style="margin-top: 10px;">加入已有工程:</el-radio>
          <el-input v-model="inputCode" v-show="radio === 'join'" placeholder="请输入工程逻辑码" style="margin-left: 8%;width: 60%;margin-top: 5px;"></el-input>
          <el-input v-model="inputAciveCode" v-show="radio === 'join'" placeholder="请输入激活码(选填)" style="margin-left: 8%;width: 60%;margin-top: 3px;"></el-input>
        </div>
        <span slot="footer" class="dialog-footer"><el-button type="primary" @click="comfirmAddOrJoin">确 定</el-button></span>
      </el-dialog>

      <el-dialog title="用户信息" :visible.sync="userInfoShow" width="30%">
        <el-table :data="code" border style="width: 100%">
          <el-table-column prop="logicCode" label="逻辑码" min-width="50%"></el-table-column>
          <el-table-column prop="activeCore" label="激活码" min-width="50%"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </Layout>
  </div>
</template>

<script>
import selectColumn from '@/components/content/selectColumn.vue';
const root = process.env.API_ROOT;

export default {
  data() {
    return {
      uid: '',
      modal_addProject: false,
      button_deleteProject: false,
      modal_addArea: false,
      modal_addRoom: false,
      modal_deleteArea: false,
      deleteProjectId: '',

      chooseShow: false,
      radio: '',
      inputCode: '',
      inputAciveCode: null,
      userInfoShow: false,
      code: [
        {
          logicCode: '',
          activeCore: ''
        }
      ]
    };
  },
  computed: {},
  watch: {
    openNames() {}
  },
  components: {
    selectColumn
  },
  mounted() {
    this.uid = this.$store.state.uid;

    this.$get(root+'/QueryProjectServlet', {
      uid: this.uid
      // uid: 122
    }).then(response => {
      console.log(response);
      if (response.programe === null) {
        this.chooseShow = true;
      } else {
        this.code[0].logicCode = response.programe.programe_code;
        if (response.identity === 'root') {
          this.$store.commit('setRootShow', true);
          console.log(this.$store.state.rootShow);
        }
        this.$store.commit('setPid', response.programe.programe_id);
        this.$store.commit('queryChangeProject', response.programe.project);
        if (response.programe.project.length > 0) {
          this.$store.commit('setProject_activeInfo', 0);
          if (response.programe.project[0].area_info.length) {
            this.$store.commit('setArea_activeInfo', 0);
            this.$router.push('/main/area').catch(err => {
              err;
            });
          }
        }
      }
    });
  },
  methods: {
    backToLogin() {
      this.$get(root+'/LogoutServlet', {
        uid: this.uid
      }).then(response => {
        // console.log(response)
        if (response.state === 'logout success') {
          this.$Notice.success({
            title: '退出登录成功'
          });
          this.$router.push('/user/signIn').catch(err => {
            err;
          });
          this.$store.commit('clearUid');
          // this.$cookies.remove('uid');
        } else {
          this.$Notice.error({
            title: '退出登录失败'
          });
        }
      });
    },
    getAreaInfo(projectIndex, areaIndex) {
      this.$store.commit('setProject_activeInfo', projectIndex);
      this.$store.commit('setArea_activeInfo', areaIndex);
      console.log(this.$store.state.area_activeInfo);
    },
    clickDeleteProject(index) {
      this.button_deleteProject = true;
      let project = this.$store.state.project;
      this.deleteProjectId = project[index].project_id;
      this.$store.commit('setProject_activeInfo', index);
    },
    deleteProject() {
      this.$get(root+'/DeleteProjectServlet', {
        uid: this.uid,
        sid: this.deleteProjectId
      }).then(response => {
        console.log(response);
        // this.selectAreaInfo = '';
        // this.selectRoomInfo = '';
        this.$get(root+'/QueryProjectServlet', {
          uid: this.uid
        }).then(res => {
          this.$store.commit('queryChangeProject', res.programe.project);
          // console.log(JSON.stringify(this.$store.state.project))
        });
        this.$message('删除项目成功');
      });
    },

    deletePrograme() {
      this.$get(root+'/DeleteProgrammeServlet', {
        uid: this.uid,
        pid: this.$store.state.pid
      }).then(response => {
        console.log(response);
        if (response.state === 'deleteProgramme success') {
          this.chooseShow = true;
        } else {
          this.$message({
            message: '删除工程失败',
            type: 'warning'
          });
        }
      });
    },

    userInfo() {
      this.userInfoShow = true;
      this.$get(root+'/ActiveCodeServlet', {
        uid: this.uid
      }).then(response => {
        console.log(response);
        if (response.state === 'get active code success') {
          this.code[0].activeCore = response.code;
        }
      });
    },

    comfirmAddOrJoin() {
      if (this.radio === '') {
        console.log(this.radio);
        this.$message({
          message: '请选择新建或加入工程',
          type: 'warning'
        });
      } else if (this.radio === 'add') {
        //新建工程
        this.$get(root+'/AddProgrammeServlet', {
          uid: this.uid
        }).then(res => {
          console.log(res);
          this.$get(root+'/QueryProjectServlet', {
            uid: this.uid
          }).then(response => {
            console.log(response);
            this.chooseShow = false;
            this.$store.commit('setRootShow', true);
            this.$store.commit('setPid', response.programe.programe_id);
          });
        });
      } else if (this.radio === 'join') {
        //导入工程
        if (this.inputCode === '') {
          this.$message({
            message: '请输入工程逻辑码',
            type: 'warning'
          });
        } else {
          this.$get(root+'/LoadDataServlet', {
            uid: this.uid,
            project_code: this.inputCode,
            active_code: this.inputAciveCode
          }).then(res0 => {
            console.log(res0);
            if (res0.state === 'load project success') {
              this.$get(root+'/QueryProjectServlet', {
                uid: this.uid
              }).then(response => {
                console.log(response);
                if (response.identity === 'user') {
                  console.log('我是user');
                } else {
                  this.$store.commit('setRootShow', true);
                }
                this.chooseShow = false;
                this.$store.commit('setPid', response.programe.programe_id);
                this.$store.commit('queryChangeProject', response.programe.project);
                if (response.programe.project.length > 0) {
                  this.$store.commit('setProject_activeInfo', 0);
                  if (response.programe.project[0].area_info.length) {
                    this.$store.commit('setArea_activeInfo', 0);
                    this.$router.push('/main/area').catch(err => {
                      err;
                    });
                  }
                }
                console.log(this.$store.state.rootShow);
              });
            } else {
              this.$message.error('导入工程失败');
            }
          });
        }
      }
    }
  }
};
</script>

<style>
.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  color: #ffffff;
  line-height: 30px;
  font-size: 20px;
  height: 30px;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 500px;
  margin: 0 auto;
  margin-left: 75%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.highlight {
  animation: myfirst 1s;
  animation-iteration-count: infinite;
}
@-webkit-keyframes myfirst {
  0% {
    color: #a00000;
  }
  50% {
    color: #5e5e5e;
  }
  100% {
    color: #a00000;
  }
}
.stateNormal {
  color: #306c14;
}
.stateError {
  color: #a00000;
}
</style>
