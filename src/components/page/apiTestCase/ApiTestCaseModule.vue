<template>
  <div>
    <api-test-case
        :type="opsType"
        :apiModuleId="currentApiModuleId"
        :apiTestCaseProjectId="currentApiProjectId"
        v-if="showAddOrEditApiTestCase">
    </api-test-case>

    <div v-else>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i> API项目
          </el-breadcrumb-item>
          <el-breadcrumb-item>API模块</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-button @click="returnAPIProjectList" >返回</el-button>
      </el-row>
      <div>
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column
              prop="id"
              label="id"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="api_project_name"
              label="API项目名称"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="api_module_name"
              label="API模块名称"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="updata_time"
              label="更新时间"
              width="180">
          </el-table-column>

          <el-table-column
              prop="create_time"
              label="创建时间"
              width="180">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  @click="enterApiTestCaseModule(scope.row)">进入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {getSingleApiProjectModuleRequest} from '../../../api/apiModule';
import ApiTestCase from './ApiTestCase';

export default {
  name: 'ApiModel',
  props: ['type', 'apiProjectId', 'apiModuleId'],

  data() {
    return {
      tableData: [],


      apiProjectSelect: [],

      apiProjectSelectId: "",

      moduleId: "",

      projectId: "",
      apiTestCaseId: "",

      //当前ApiTestCase数据
      currentApiTestCaseData: {},

      showAddOrEditApiTestCase: false,
      opsType: "add",

      // 当前ApiModuleId
      currentApiModuleId: 0,

      // 当前ApiProjectId
      currentApiProjectId: 0,

    }
  },
  methods: {

    //获取 单个API项目中包含得所有模块
    getSingleAPIProjectModule(){
      getSingleApiProjectModuleRequest(this.projectId).then(data => {
            if (true === data.data.success) {
              console.log(data.data.data)
              this.tableData = data.data.data;
            } else {
              this.$message.info("获取接口失败")
            }
          }
      );
    },



    //进入项目-模块页面
    enterApiTestCaseModule(data){

      this.opsType = 'enter';
      this.currentApiModuleId = data.id;
      this.currentApiProjectId = this.projectId
      console.log("sssssss:",this.currentApiModuleId)

      this.showAddOrEditApiTestCase = true;

    },

    // 返回API项目列表
    returnAPIProjectList(){
      this.$parent.apiProjectList();

    },

    // 返回API模块列表
    apiModuleList(){
      this.showAddOrEditApiTestCase = false;
      this.getSingleAPIProjectModule()


    }







  },
  components: {
    'api-test-case': ApiTestCase,

  },
  created() {
    console.log(this.apiProjectId)
    if ('enter'=== this.type){
      this.projectId = this.apiProjectId
      this.getSingleAPIProjectModule()

    }



  }



};
</script>

<style scoped>

</style>