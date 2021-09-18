<template>
  <div>
    <add-or-edit-api-test-case
        :type="opsType"
        :apiTestCaseId="currentApiTestCaseId"
        :apiTestCaseData="currentApiTestCaseData"
        :apiModuleId="currentApiModuleId"

        @saveApiTestCase="saveApiTestCase"
        @cancelSaveApiTestCase="cancelSaveApiTestCase"
        v-if="showAddOrEditApiTestCase">

    </add-or-edit-api-test-case>


    <div v-else>

      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i> API项目
          </el-breadcrumb-item>
          <el-breadcrumb-item>API模块</el-breadcrumb-item>
          <el-breadcrumb-item>API测试用例</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-button @click="returnAPIModuleList" >返回</el-button>
        <el-button type="primary" @click="openAddPageElement" >创建API测试用例</el-button>
      </el-row>
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
            prop="api_module_name"
            label="API模块"
            sortable
            width="180">
        </el-table-column>
        <el-table-column
            prop="api_test_case_name"
            label="API测试用例"
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
                @click="openEditApiTestCase(scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="deleteApiTestCasePopup(scope.row)">删除</el-button>


          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>


</template>

<script>

import addOrEditApiTestCase from './addOrEditApiTestCase';
import {getApiTestCaseListRequest, deleteSingleApiTestCaseRequest} from '../../../api/apiTestCase';

export default {
  name: 'ApiTestCase',
  // type 用来标识是编辑还是创建
  props:['type', 'apiModuleId', 'apiTestCaseProjectId'],
  inject:['reload'],
  data() {
    return {
      tableData: [],
      moduleId: "",

      currentApiTestCaseId: 0,
      currentApiModuleId: 0,
      currentApiTestCaseData:0,
      showAddOrEditApiTestCase:false,





    }
  },
  mounted(){

  },
  methods: {

    openAddPageElement(){
      this.opsType = 'add';
      this.currentApiModuleId= this.moduleId
      this.currentApiTestCaseId = 0;
      this.currentApiTestCaseData = {};

      this.showAddOrEditApiTestCase = true
    },


    openEditApiTestCase(data){
      this.opsType = 'edit';
      this.currentApiTestCaseId = data.id;
      this.currentApiTestCaseData = data;
      console.log(data)

      this.showAddOrEditApiTestCase = true;
    },

    saveApiTestCase(){
      this.showAddOrEditApiTestCase = false
      this.getApiTestCaseFun();

    },

    cancelSaveApiTestCase(){
      this.showAddOrEditApiTestCase = false
      this.getApiTestCaseFun();

    },

    // 获取该模块下 API测试用例
    getApiTestCaseFun() {

      getApiTestCaseListRequest(this.moduleId).then(data => {
        console.log("这是api测试用例",data);
        if (true === data.data.success) {
          this.tableData = data.data.data;

        } else {
          this.$message.error("获取接口失败")
        }
      })
    },




    //删除单个Api测试用例元素
    deleteApiTestCasePopup(data){
      this.apiTestCaseId = data.id
      deleteSingleApiTestCaseRequest(this.apiTestCaseId).then(data => {
            console.log(data);
            if (true === data.data.success) {
              this.getApiTestCaseFun();
              this.$message.success("删除API测试用例成功")

            } else {
              this.$message.error("删除API测试用例失败")
            }
          }
      );
    },


    // 返回API模块列表
    returnAPIModuleList(){
      this.$parent.apiModuleList();

    }

  },

  components: {
    'add-or-edit-api-test-case': addOrEditApiTestCase
  },

  created() {
    console.log(this.apiModuleId, this.apiTestCaseProjectId)
    if ('enter'===this.type){
      this.moduleId = this.apiModuleId
      this.getApiTestCaseFun();

    }

  }


};
</script>

<style scoped>

</style>