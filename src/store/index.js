import Vue from 'vue'
import Vuex from 'vuex'

//1.安装插件
Vue.use(Vuex)

//2.创建对象
const store = new Vuex.Store({
  state: {
    uid: '',
    pid: '', //gai

    abnormalRoom: [],

    //项目的总值与活跃值
    project: [],
    project_activeInfo: '',
    active_projectIndex: '',

    //活跃项目的区域总值与活跃值
    area: [],
    area_activeInfo: '',
    active_areaIndex: '',

    //活跃区域的房间总值与活跃值
    room: [],
    room_activeInfo: '',
    active_roomIndex: '',

    //活跃房间的节点总值与活跃值
    node: [],
    node_activeInfo: '',

    viewWidth: '',
  },
  mutations: {
    signChangeUid(state, uid) {
      state.uid = uid
    },
    setPid(state, pid) { //gai
      state.pid = pid
    },
    setRootShow(state, rootShow) { //gai
      state.rootShow = rootShow
    },
    clearUid(state) {
      state.uid = ''
    },
    queryChangeProject(state, project) {
      state.project = project
      state.abnormalRoom = []
      for (let i = 0; i < project.length; i++) {
        let area = project[i].area_info
        for (let j = 0; j < area.length; j++) {
          let room = area[j].room_info
          for (let m = 0; m < room.length; m++) {
            let node = room[m].node_info
            for (let n = 0; n < node.length; n++) {
              let sensor = node[n].sensor_info
              node[n].nodeState = "正常"
              for (let s = 0; s < sensor.length; s++) {
                if (sensor[s].sensor_status === "异常") {
                  node[n].nodeState = "异常"
                  let info = {
                    roomName: room[m].room_name
                  }
                  state.abnormalRoom.push(info)
                  area[j].areaAbnormal = true
                } else if(sensor[s].sensor_status === "未连接"){
                  node[n].nodeState = "未连接"
                  node[n].sensorAbnormal = false
                  area[j].roomAbnormal = false
                }
              }
            }
          }
        }
      }
    },
    setProject_activeInfo(state, projectIndex) {
      state.active_projectIndex = projectIndex
      state.project_activeInfo = state.project[projectIndex]
      // console.log(JSON.stringify(state.project_activeInfo))
    },
    setArea_activeInfo(state, areaIndex) {
      state.active_areaIndex = areaIndex
      state.area_activeInfo = state.project_activeInfo.area_info[areaIndex]
      // console.log(JSON.stringify(state.area_activeInfo))
    },
    setRoom_activeInfo(state, roomIndex) {
      state.active_roomIndex = roomIndex
      state.room_activeInfo = state.area_activeInfo.room_info[roomIndex]
      // console.log(JSON.stringify(state.room_activeInfo))
    },
    setNode_activeInfo(state, nodeIndex) {
      state.node_activeInfo = state.room_activeInfo.node_info[nodeIndex]
      for (let i = 0; i < state.node_activeInfo.sensor_info.length; i++) {
        if (state.node_activeInfo.sensor_info[i].sensor_limits === '1-1') { //替换表达
          state.node_activeInfo.sensor_info[i].sensor_limits = "关（报警）"
        } else if (state.node_activeInfo.sensor_info[i].sensor_limits === '0-0') {
          state.node_activeInfo.sensor_info[i].sensor_limits = "开（报警）"
        }
      }
      // console.log(JSON.stringify(state.node_activeInfo))
    },
    setViewWidth(state, viewWidth) {
      state.viewWidth = viewWidth
    }
  },
  actions: {

  },
  getters: {
    getProjectName(state) {
      let project_name = []
      let project = state.project
      for (let i = 0; i < project.length; i++) {
        project_name.push(project[i].project_name)
      }
      return project_name
    },
    uniqAbnormalRoom(state){
        var array = state.abnormalRoom;
        var temp = {}, r = [], len = array.length, val, type;
            for (var i = 0; i < len; i++) {
                val = array[i];
                type = typeof val;
                if (!temp[val]) {
                    temp[val] = [type];
                    r.push(val);
                } else if (temp[val].indexOf(type) < 0) {
                    temp[val].push(type);
                    r.push(val);
                }
            }
            return r;
    }
  },
  modules: {

  }
})

//3.导出对象
export default store
