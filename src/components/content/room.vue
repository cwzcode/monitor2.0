<template>
  <div id="rAndNview">
    <div style="float: left;">
      <Icon
        type="ios-arrow-back"
        size="30"
        @click="
          $router.push('/main/area').catch(err => {
            err;
          })
        "
      />
    </div>
    <div id="smaL">
      <div :class="{ disapead: !$store.state.rootShow }">
        <el-button type="danger" icon="el-icon-minus" circle style="margin-left: 85%;" @click="modal_deleteNode = true"></el-button>
      </div>
    </div>
    <div class="Img">
      <img id="roomImg" :class="{ rootImgSize: $store.state.rootShow, userImgSize: !$store.state.rootShow }" src="@/assets/images/平面图.jpg" @click="touchstart" />
    </div>
    <div>
      <el-tooltip effect="light" placement="top" v-for="(nodeInfo, x) in $store.state.room_activeInfo.node_info" :key="x">
        <div slot="content">
          <p>节点名称：{{ nodeInfo.node_name }}</p>
          <p>节点描述：{{ nodeInfo.node_content }}</p>
          <div>
            节点信息：
            <p v-for="(sensorInfo, s) in nodeInfo.sensor_info" :key="s" style="text-align: center;">{{ sensorInfo.sensor_type }}:{{ sensorInfo.sensor_value }}</p>
          </div>
        </div>
        <Icon id="Icon" :class="classChoose(nodeInfo)" :style="nodePosit(nodeInfo)" size="20" type="ios-disc" @click="getActiveNodeInfo(x)" />
      </el-tooltip>
    </div>

    <Modal v-model="modal_nodeInfo" title="传感器信息">
      <div slot="footer"><Button type="primary" size="large" @click="modal_nodeInfo = false">关闭</Button></div>
      <el-table :data="$store.state.node_activeInfo.sensor_info" border style="width: 100%">
        <el-table-column prop="sensor_type" label="类型" min-width="30%" align="center"></el-table-column>
        <el-table-column prop="sensor_limits" label="阈值" min-width="20%" align="center"></el-table-column>
        <el-table-column prop="sensor_value" label="数值" min-width="20%" align="center"></el-table-column>
        <el-table-column prop="sensor_status" label="状态" min-width="20%" align="center"></el-table-column>
      </el-table>
    </Modal>

    <Modal
      v-model="modal_addNode"
      title="新建节点"
      ok-text="下一步"
      @on-ok="
        modal_addNode = false;
        modal_selectSensor = true;
      "
    >
      <Input v-model="node_name" placeholder="节点名称" style="width: 300px" />
      <Input v-model="node_content" placeholder="节点描述" style="width: 300px" />
    </Modal>

    <Modal v-model="modal_selectSensor" title="选择传感器(最多8个)">
      <div slot="footer">
        <Button type="text" size="large" @click="">取消</Button>
        <Button
          type="text"
          size="large"
          @click="
            modal_addNode = true;
            modal_selectSensor = false;
          "
        >
          上一步
        </Button>
        <Button type="primary" size="large" @click="getSelectSensor">下一步</Button>
      </div>
      <div v-for="(sensorInfo, s) in haveSensorInfo" :key="s">
        <span style="display:inline-block;margin-left:20px;">{{ sensorInfo.sensorClass_name }}:</span>
        <br />
        <el-checkbox-group v-model="checkSensorList" :max="8">
          <el-checkbox v-for="(sensorName, e) in sensorInfo.sensor_name" :key="e" :label="sensorName + '/' + s + '/' + e">{{ sensorName }}</el-checkbox>
        </el-checkbox-group>
        <el-divider></el-divider>
      </div>
    </Modal>

    <Modal v-model="modal_sensorInfo" title="传感器信息" ok-text="添加" @on-ok="addNode">
      <el-table :data="addSensorInfo" border style="width: 100%">
        <el-table-column prop="type" label="传感器类型" min-width="25%" align="center"></el-table-column>
        <el-table-column prop="identifier" label="传感器编号" min-width="25%" align="center"></el-table-column>
        <el-table-column prop="isNot" label="传感器检测阈值" min-width="50%" align="center">
          <template slot-scope="scope">
            <div v-show="!scope.row.isNot">
              <!-- 非开关传感器 -->
              <el-input v-model="scope.row.minlimits" size="mini" style="width: 30%;" placeholder="最小值"></el-input>
              -
              <el-input v-model="scope.row.maxlimits" size="mini" style="width: 30%;" placeholder="最大值"></el-input>
            </div>

            <div v-show="scope.row.isNot">
              <!-- 开关传感器 -->
              <p style="text-align: center;">触发报警状态:</p>
              <el-radio v-model="scope.row.limits" label="0-0">开</el-radio>
              <el-radio v-model="scope.row.limits" label="1-1">关</el-radio>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </Modal>

    <Modal v-model="modal_deleteNode" title="选择要删除的节点" ok-text="删除" @on-ok="deleteNode">
      <div>
        <el-checkbox v-for="(nodeInfo, p) in $store.state.room_activeInfo.node_info" :key="p" v-model="nodeInfo.checked">{{ nodeInfo.node_name }}</el-checkbox>
      </div>
    </Modal>
  </div>
</template>

<script>
 const root = process.env.API_ROOT;
  
export default {
  data() {
    return {
      uid: '',

      imgPosition: {
        smaL: '',
        imgX: '',
        imgY: '',
        imgWH: ''
      },

      windowY: '',
      viewY: '',

      modal_nodeInfo: false,
      modal_addNode: false,
      modal_selectSensor: false,
      modal_sensorInfo: false,
      modal_deleteNode: false,

      node_durationX: '',
      node_durationY: '',

      haveSensorInfo: [
        {
          sensorClass_name: '开关量传感器',
          sensor_name: [
            '通用',
            '水银开关',
            '倾斜开关',
            '敲击',
            '震动开关',
            '轻触开关',
            '按键开关',
            '霍尔磁力',
            '线性霍尔',
            '磁簧开关',
            '循迹',
            '避障碍',
            '光遮断',
            '人体接触（热释红外)'
          ],
          sensor_identifier: ['010000', '010101', '010102', '010103', '010104', '010105', '010106', '010107', '010108', '010109', '010201', '010202', '010203', '010501'],
          sensorIsNOt: true
        },
        {
          sensorClass_name: '数字量量传感器',
          sensor_name: ['通用', '数字光强', '红外接收', '数字温湿度DHT11', '数字温湿度DHT22', '气温气压', 'mpu6050', '旋转编码器', 'XY摇杆', '超声波', '防水性超声波'],
          sensor_identifier: ['020000', '020201', '020202', '020501', '020502', '020503', '020601', '020602', '020603', '020604', '020605'],
          sensorIsNOt: false
        },
        {
          sensorClass_name: '模拟量量传感器',
          sensor_name: ['通用', '压力', '模拟霍尔', '模拟光强', '声音传感器', '液化石油气气体传感器', '烟雾', '酒精', '空气污染', '火焰', '土壤湿度', '模拟温度', '雨滴'],
          sensor_identifier: ['030000', '030101', '030102', '030201', '030301', '030401', '030402', '030403', '030404', '030501', '030502', '030503', '030504'],
          sensorIsNOt: false
        }
      ],
      checkSensorList: [],
      addSensorInfo: [],

      node_name: '',
      node_content: ''
    };
  },
  watch: {
    modal_sensorInfo(val) {
      if (!val) {
        (this.node_name = ''), (this.node_content = '');
        this.checkSensorList = [];
        this.addSensorInfo = [];
      }
    }
  },
  mounted() {
    this.uid = this.$store.state.uid;

    let viewWidth = document.getElementById('rAndNview').getBoundingClientRect().width;
    this.$store.commit('setViewWidth', viewWidth);

    this.imgPosition.smaL = document.getElementById('roomImg');
    this.imgPosition.imgX = this.imgPosition.smaL.getBoundingClientRect().left;
    this.imgPosition.imgY = this.imgPosition.smaL.getBoundingClientRect().top;
    this.imgPosition.imgWH = this.imgPosition.smaL.getBoundingClientRect().width;

    // this.imgPosition.imgWH = this.$store.state.viewWidth * 0.42;
    // this.imgPosition.imgX = this.$store.state.viewWidth * 0.25 + 239;
    // this.imgPosition.imgY = smaL.getBoundingClientRect().top;

    this.windowY = window.outerHeight;
    this.viewY = window.innerHeight;
  },
  methods: {
    classChoose(nodeInfo){
      if(nodeInfo.nodeState === "异常"){
        return "highlight"
      }
      else if(nodeInfo.nodeState === "正常"){
        return "stateNormal"
      }
      else{
        return "stateUnrelate"
      }
    },
    nodePosit(nodeInfo) {
      let left = parseFloat(this.imgPosition.imgX) + parseFloat(nodeInfo.node_left) * parseFloat(this.imgPosition.imgWH) - 10 + 'px';
      let top = parseFloat(this.imgPosition.imgY) + parseFloat(nodeInfo.node_top) * parseFloat(this.imgPosition.imgWH) - 10 + 'px';
      return 'left:' + left + ';top:' + top + ';';
    },
    getActiveNodeInfo(nodeIndex) {
      this.modal_nodeInfo = true;
      this.$store.commit('setNode_activeInfo', nodeIndex);
    },
    touchstart(e) {
      if (this.$store.state.rootShow === true) {
        this.modal_addNode = true;
        e.preventDefault();
        let imgX = this.imgPosition.imgX;
        let imgY = this.imgPosition.imgY;
        let imgWH = this.imgPosition.imgWH;
        this.node_durationX = (parseInt(e.screenX) - parseInt(imgX)) / parseInt(imgWH);
        this.node_durationY = (parseInt(e.screenY) - (this.windowY - this.viewY) - parseInt(imgY)) / parseInt(imgWH);
      }
    },
    getSelectSensor() {
      this.modal_sensorInfo = true;
      this.modal_selectSensor = false;
      console.log(this.checkSensorList);
      // this.selectSensor = this.checkSensorList;
      for (let m = 0; m < this.checkSensorList.length; m++) {
        let data = this.checkSensorList[m].split('/');
        let o = data[1];
        let n = data[2];
        let info = {
          type: data[0], //sensor类型
          identifier: this.haveSensorInfo[o].sensor_identifier[n],
          isNot: this.haveSensorInfo[o].sensorIsNOt
        };
        this.addSensorInfo.push(info);
      }
    },
    addNode() {
      let flag = 0;
      for (let i = 0; i < this.addSensorInfo.length; i++) {
        if (this.addSensorInfo[i].isNot) {
          if (!('limits' in this.addSensorInfo[i]) || this.addSensorInfo[i].limits === '') {
            this.modal_sensorInfo = true;
            flag = 1;
            this.$message({
              showClose: true,
              message: '请输入完整的传感器信息',
              type: 'warning'
            });
          }
        } else {
          if (
            !('minlimits' in this.addSensorInfo[i]) ||
            this.addSensorInfo[i].minlimits === '' ||
            !('maxlimits' in this.addSensorInfo[i]) ||
            this.addSensorInfo[i].maxlimits === ''
          ) {
            this.modal_sensorInfo = true;
            flag = 1;
            this.$message({
              showClose: true,
              message: '请输入完整的传感器信息',
              type: 'warning'
            });
          } else {
            this.addSensorInfo[i].limits = this.addSensorInfo[i].minlimits + '-' + this.addSensorInfo[i].maxlimits;
            delete this.addSensorInfo[i].minlimits;
            delete this.addSensorInfo[i].maxlimits;
          }
        }
      }
      if (!flag) {
        console.log(this.addSensorInfo);
        this.$post(root+'/AddNodeServlet', {
          node_info: {
            // uid: this.uid,
            uid: this.uid,
            cid: this.$store.state.room_activeInfo.room_id,
            name: this.node_name,
            content: this.node_content,
            sensor_info: this.addSensorInfo,
            position_left: this.node_durationX,
            position_top: this.node_durationY
          }
        }).then(response => {
          console.log(response);
          this.modal_sensorInfo = false;

          this.$get(root+'/QueryProjectServlet', {
            // uid: this.$store.state.uid,
            uid: this.uid
          }).then(res => {
            console.log(res.programe.project[this.$store.state.active_projectIndex])
            this.$store.commit('queryChangeProject', res.programe.project);
            this.$store.commit('setProject_activeInfo', this.$store.state.active_projectIndex);
            this.$store.commit('setArea_activeInfo', this.$store.state.active_areaIndex);
            this.$store.commit('setRoom_activeInfo', this.$store.state.active_roomIndex);

            this.$message({
              message: '增加节点成功',
              type: 'success'
            });
          });
        });
      }
    },
    deleteNode() {
      let nodes = this.$store.state.room_activeInfo.node_info;
      console.log(nodes);
      let selectDeleteNode = [];
      for (let o = 0; o < nodes.length; o++) {
        if ('checked' in nodes[o] && nodes[o].checked === true) {
          console.log(o);
          let data = {
            nid: nodes[o].node_id
            // uid: this.uid
          };
          console.log(data);
          selectDeleteNode.push(data);
          console.log(selectDeleteNode);
        }
      }
      console.log(selectDeleteNode);
      this.$post(root+'/DeleteNodesServlet', {
        uid: this.uid,
        node_info: selectDeleteNode
      }).then(response => {
        console.log(response);
        this.modal_deleteNode = false;

        this.$get(root+'/QueryProjectServlet', {
          // uid: this.uid
          uid: this.uid
        }).then(res => {
          this.$store.commit('queryChangeProject', res.programe.project);
          this.$store.commit('setProject_activeInfo', this.$store.state.active_projectIndex);
          this.$store.commit('setArea_activeInfo', this.$store.state.active_areaIndex);
          this.$store.commit('setRoom_activeInfo', this.$store.state.active_roomIndex);
        });
        this.$message('删除节点成功');
      });
    }
  }
};
</script>

<style>
#Icon {
  position: absolute;
  z-index: 1;
}

.disapead {
  display: none;
}

.rootImgSize {
  width: 40%;
  height: auto;
  margin-left: 25%;
}

.userImgSize {
  width: 46%;
  height: auto;
  margin-left: 25%;
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
  color: #515A6E;
}
.stateError {
  color: #a00000;
}
.stateUnrelate{
  color: #306c14;
}
</style>
