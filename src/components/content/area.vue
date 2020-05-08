<template>
  <div>
    <div style="width: 82%;float: left;position: relative;">
      <el-row>
        <el-col style="margin-left: 10px;width: 15%" v-for="(roomInfo, k) in $store.state.area_activeInfo.room_info" :key="k">
          <el-card :body-style="{ padding: '0px' }" style="margin-top: 10px;">
            <img class="photo" src="@/assets/images/平面图.jpg" @click="getActiveRoomInfo(k)" />
            <div style="padding: 8px;">
              <span>{{ roomInfo.room_name }}</span>
              <el-button v-show="$store.state.rootShow" type="text" class="button" style="float: right;margin-bottom: 5px;" @click="clickDelectRoom(k)">删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div style="margin-left: 64%;width: 16%;height: 78%;position:fixed;">
      <el-table v-show="$store.state.abnormalRoom.length === 0" :data="normalData" border style="width: 100%">
        <el-table-column prop="data" label="房间状态" minwidth="100%"></el-table-column>
      </el-table>
      <el-table v-show="$store.state.abnormalRoom.length !== 0" :data="$store.getters.uniqAbnormalRoom" border style="width: 100%;color: red;">
        <el-table-column prop="roomName" label="监控异常房间" minwidth="100%"></el-table-column>
      </el-table>
    </div>

    <Modal v-model="modal_deleteRoom" title="删除当前房间" @on-ok="delectRoom">
      <p>确定要删除{{ $store.state.area_activeInfo.area_name }}-{{ delectRoomName }}这个房间吗？</p>
    </Modal>
  </div>
</template>

<script>
 const root = process.env.API_ROOT;
 
export default {
  data() {
    return {
      uid: '',

      modal_deleteRoom: false,
      delectRoomIndex: 0,
      delectRoomName: '',

      normalShow: true,
      abnormalShow: true,

      normalData: [
        {
          data: '监控正常'
        }
      ]
    };
  },
  mounted() {
    this.uid = this.$store.state.uid;
  },
  methods: {
    getActiveRoomInfo(roomIndex) {
      this.$router.push('/main/room').catch(err => {
        err;
      });
      this.$store.commit('setRoom_activeInfo', roomIndex);
    },
    clickDelectRoom(roomIndex) {
      this.modal_deleteRoom = true;
      this.delectRoomIndex = roomIndex;
      this.delectRoomName = this.$store.state.area_activeInfo.room_info[this.delectRoomIndex].room_name;
    },
    delectRoom() {
      let delectRoomId = this.$store.state.area_activeInfo.room_info[this.delectRoomIndex].room_id;
      this.$get(root+'/DeleteRoomServlet', {
        uid: this.uid,
        cid: delectRoomId
      }).then(response => {
        console.log(response);
        // this.area_name = '';
        this.$get(root+'/QueryProjectServlet', {
          // uid: this.$store.state.uid,
          uid: this.uid
        }).then(res => {
          let projectIndex = this.$store.state.active_projectIndex;
          let areaIndex = this.$store.state.active_areaIndex;
          this.$store.commit('queryChangeProject', res.programe.project);
          this.$store.commit('setProject_activeInfo', projectIndex);
          this.$store.commit('setArea_activeInfo', areaIndex);
        });
        this.$message({
          message: '删除房间成功',
          type: 'success'
        });
      });
    }
  }
};
</script>

<style>
.photo {
  width: 100%;
  height: 150px;
  display: block;
}

.button {
  padding: 0;
  float: right;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

/* .clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
} */
</style>
