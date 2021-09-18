<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../../assets/img/visit.jpg" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{name}}</div>
              <div>{{role}}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>{{last_login}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-text grid-con-icon"></i>
                <div class="grid-cont-right">
                  <a class="grid-num">{{ui_test_case_number}}</a>
                  <div>UI测试用例数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-text grid-con-icon"></i>
                <div class="grid-cont-right">
                  <a class="grid-num">{{api_test_case_number}}</a>
                  <div>API测试用例数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-text grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    <a class="grid-num" >{{performance_script_number}}</a>
                    </div>
                  <div>性能测试用例数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height:562px;">
          <el-calendar v-model="calendar">
          </el-calendar>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import {getSystemHomePageListRequest} from "../../api/systemHomePageList";

export default {
  name: 'dashboard',
  data() {
    return {
      name: localStorage.getItem('ms_username'),
      last_login: localStorage.getItem('last_login'),

      api_test_case_number: "",
      performance_script_number: "",
      ui_test_case_number: "",
      calendar: new Date(),



    };
  },
  components: {
    Schart
  },
  computed: {
    role() {
      return this.name === 'admin' ? '超级管理员' : '普通用户';
    }
  },
  methods: {

    //获取所有API项目列表
    getSystemHomePageListFun() {

      getSystemHomePageListRequest().then(data => {
        console.log(data);
        if (true === data.data.success) {
          this.ui_test_case_number = data.data.data.ui_test_case_number
          this.performance_script_number = data.data.data.performance_script_number
          this.api_test_case_number = data.data.data.api_test_case_number

        } else {
          this.$message.error("获取接口失败")
        }
      })
    },


  },
  created() {
    this.getSystemHomePageListFun();
  }
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
