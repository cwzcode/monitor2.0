<template>
  <div>
    <slot name="addProject"></slot>
    <slot name="addArea"></slot>
    <slot name="addRoom"></slot>
    <slot name="deleteArea"></slot>

    <Modal v-model="button_addProject" title="新建项目" @on-ok="addProject">
      <Input v-model="project_name" placeholder="项目名称" style="width: 300px" />
      <Input v-model="project_content" placeholder="项目描述" style="width: 300px" />
    </Modal>

    <Modal v-model="button_addArea" title="新建区域" @on-ok="addArea">
      <div>
        <Dropdown @on-click="selectProject0">
          <a href="javascript:void(0)" id="selectProjectName0">
            所在项目
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(projectName, p) in $store.getters.getProjectName" :key="p" :name="projectName">{{ projectName }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Input v-model="area_name" placeholder="区域名称" style="width: 300px;margin-top: 20px;" />
      <Input v-model="area_content" placeholder="区域描述" style="width: 300px" />
    </Modal>

    <Modal v-model="button_addRoom" title="新建房间" @on-ok="addRoom">
      <div>
        <Dropdown @on-click="selectProject1">
          <a href="javascript:void(0)" id="selectProjectName1">
            所在项目
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(projectName, p) in $store.getters.getProjectName" :key="p" :name="projectName">{{ projectName }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown @on-click="selectArea">
          <a href="javascript:void(0)" id="selectAreaName">
            所在区域
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(areaName, a) in areaName" :key="a" :name="areaName">{{ areaName }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Input v-model="room_name" placeholder="房间名称" style="width: 300px;margin-top: 20px;" />
      <Input v-model="room_content" placeholder="房间描述" style="width: 300px" />
      <!-- <input type="file" @change="uploadImg($event)" style="margin-top: 20px;" /> -->
      <img id="loadImg" style="height: auto;width: 300px;margin-top: 20px;" />
    </Modal>

    <Modal v-model="button_deleteArea" title="删除当前区域" @on-ok="deleteArea">
      <p>确定要删除{{ $store.state.project_activeInfo.project_name }} - {{ $store.state.area_activeInfo.area_name }}这个区域吗？</p>
    </Modal>
  </div>
</template>

<script>
  const root = process.env.API_ROOT;
  
export default {
  props: {
    modal_addProject: {
      type: Boolean,
      default: false
    },
    modal_addArea: {
      type: Boolean,
      default: false
    },
    modal_addRoom: {
      type: Boolean,
      default: false
    },
    modal_deleteArea: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uid: '',

      button_addProject: this.modal_addProject,
      button_addArea: this.modal_addArea,
      button_addRoom: this.modal_addRoom,
      button_deleteArea: this.modal_deleteArea,

      project_name: '',
      project_content: '',

      areaName: [],
      selectProjectIndex: '',
      selectAreaIndex: '',
      selectProjectId: '',
      area_name: '',
      area_content: '',

      selectAreaId: '',
      room_name: '',
      room_content: ''
    };
  },
  computed: {},
  mounted() {
    this.uid = this.$store.state.uid;
  },
  methods: {
    selectProject0(selectProjectName) {
      document.getElementById('selectProjectName0').innerHTML = selectProjectName;
      let project = this.$store.state.project;
      for (let i = 0; i < project.length; i++) {
        if (project[i].project_name === selectProjectName) {
          this.selectProjectId = project[i].project_id;
        }
      }
    },
    selectProject1(selectProjectName) {
      document.getElementById('selectProjectName1').innerHTML = selectProjectName;
      let project = this.$store.state.project;
      for (let i = 0; i < project.length; i++) {
        if (project[i].project_name === selectProjectName) {
          this.selectProjectId = project[i].project_id;
          this.selectProjectIndex = i;
        }
      }
      let area_name = [];
      let area = project[this.selectProjectIndex].area_info;
      for (let i = 0; i < area.length; i++) {
        area_name.push(area[i].area_name);
      }
      this.areaName = area_name;
    },
    selectArea(selectAreaName) {
      document.getElementById('selectAreaName').innerHTML = selectAreaName;
      let project = this.$store.state.project;
      let area = project[this.selectProjectIndex].area_info;
      for (let j = 0; j < area.length; j++) {
        if (area[j].area_name === selectAreaName) {
          this.selectAreaId = area[j].area_id;
          this.selectAreaIndex = j;
        }
      }
    },
    addProject() {
      this.$get(root+'/AddProjectServlet', {
        uid: this.uid,
        pid: this.$store.state.pid,
        project_name: this.project_name,
        project_content: this.project_content
      }).then(response => {
        console.log(response);
        // this.project_name = '';
        // this.project_content = '';
        this.$get(root+'/QueryProjectServlet', {
          uid: this.uid
        }).then(res => {
          this.$store.commit('queryChangeProject', res.programe.project);
        });
        this.$message({
          message: '增加项目成功',
          type: 'success'
        });
      });
    },
    addArea() {
      this.$get(root+'/AddAreaServlet', {
        // uid: this.uid,
        uid: this.uid,
        sid: this.selectProjectId,
        area_name: this.area_name,
        area_content: this.area_content
      }).then(response => {
        console.log(response);
        // this.area_name = '';
        this.$get(root+'/QueryProjectServlet', {
          // uid: this.$store.state.uid,
          uid: this.uid
        }).then(res => {
          this.$store.commit('queryChangeProject', res.programe.project);
        });
        this.$message({
          message: '增加区域成功',
          type: 'success'
        });
      });
    },
    deleteArea() {
      this.$get(root+'/DeleteAreaServlet', {
        // uid: this.uid,
        uid: this.uid,
        bid: this.$store.state.area_activeInfo.area_id
      }).then(response => {
        console.log(response);
        this.$get(root+'/QueryProjectServlet', {
          // uid: this.uid
          uid: this.uid
        }).then(res => {
          this.$store.commit('queryChangeProject', res.programe.project);
          this.$store.commit('setProject_activeInfo', this.$store.state.active_projectIndex);
          if (this.$store.state.project_activeInfo.area_info.length) {
            this.$store.commit('setArea_activeInfo', 0);
          }
        });
        this.$message('删除区域成功');
      });
    },
    addRoom() {
      this.$get(root+'/AddRoomServlet', {
        // uid: this.uid,
        uid: this.uid,
        bid: this.selectAreaId,
        room_name: this.room_name,
        room_content: this.room_content
      }).then(response => {
        console.log(response);
        this.$get(root+'/QueryProjectServlet', {
          // uid: this.$store.state.uid,
          uid: this.uid
        }).then(res => {
          this.$store.commit('queryChangeProject', res.programe.project);
          this.$store.commit('setProject_activeInfo', this.selectProjectIndex);
          this.$store.commit('setArea_activeInfo', this.selectAreaIndex);
          this.$router.push('/main/area').catch(err => {
            err;
          });
          this.$message({
            message: '增加房间成功',
            type: 'success'
          });
        });
      });
    }
  },
  watch: {
    modal_addProject(val) {
      this.button_addProject = val;
    },
    button_addProject(val) {
      this.$emit('value_addProject', val);
      if (val === false) {
        this.project_name = '';
        this.project_content = '';
      }
    },
    modal_addArea(val) {
      this.button_addArea = val;
    },
    button_addArea(val) {
      this.$emit('value_addArea', val);
      if (val === false) {
        this.area_name = '';
        this.area_content = '';
        document.getElementById('selectProjectName0').innerHTML = '所在项目';
      }
    },
    modal_addRoom(val) {
      this.button_addRoom = val;
    },
    button_addRoom(val) {
      this.$emit('value_addRoom', val);
      if (val === false) {
        this.room_name = '';
        this.room_content = '';
        document.getElementById('selectProjectName1').innerHTML = '所在项目';
        document.getElementById('selectAreaName').innerHTML = '所在区域';
      }
    },
    modal_deleteArea(val) {
      this.button_deleteArea = val;
    },
    button_deleteArea(val) {
      this.$emit('value_deleteArea', val);
    }
  }
};
</script>

<style></style>
