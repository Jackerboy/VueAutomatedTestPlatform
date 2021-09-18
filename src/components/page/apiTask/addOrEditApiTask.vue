<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> API任务管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>API项目</el-breadcrumb-item>
        <el-breadcrumb-item>API任务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form  ref="apiTestTaskFormRef" :model="apiTestTaskForm" label-width="100px">
      <el-form-item label="API测试任务"  prop="api_test_task_name">
        <el-input v-model="apiTestTaskForm.api_test_task_name"  class="api_test_task_name" ></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="describe">
        <el-input type="textarea" v-model="apiTestTaskForm.describe" style="width: 230px;"></el-input>
      </el-form-item>

      <el-form-item label="API业务测试">
        <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :props="defaultProps"

            ref="tree"
            @check-change="handleBucketClick"
            :default-expanded-keys="[]"
            :default-checked-keys="defaultTask"

            style="width: 500px;">
        </el-tree>
      </el-form-item>


      <div class="page-element-class">
        <el-form-item>
          <el-button type="primary" @click="saveApiTestTask">保存</el-button>
          <el-button type="default" @click="cancelSaveApiTestTask">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getApiCaseTreeRequest, getSingleApiTestTaskRequest, addAPITestTaskRequest, updateSingleApiTestTaskRequest} from '../../../api/apiTestTask';

export default {
  inject:['reload'],
  name: 'addOrEditApiTask',
  props: ['type', 'apiTestTaskId', 'apiTestTaskData', 'projectId'],
  data(){

    return{
      apiTestTaskForm: {
        api_test_task_name: "",
        api_test_task_id: "",
        describe: ""

      },
      count:"",//倒计时

      data: [],

      defaultProps: {
        label: "label",
        children: "children"

      },

      cases: [],
      defaultTask: [],
      api_project_id: ""


    }


  },
  mounted() {


  },
  methods: {


    //保存测试任务
    saveApiTestTask(){
      if ('add'===this.type){
        this.addApiTestTask()

      }else {
        this.editApiTestTask()
      }


    },

    handleBucketClick(data){
      // console.log(data.api_test_cases_id)

    },


    //取消保存测试任务
    cancelSaveApiTestTask(){

      this.$emit('cancelSaveApiTestTask')


    },

    //创建测试任务
    addApiTestTask(){
      this.apiTestTaskForm.api_test_task_id = 0;

      let req = JSON.parse(JSON.stringify(this.apiTestTaskForm));

      console.log(this.$refs.tree.getCheckedNodes(true))
      let case_id = this.$refs.tree.getCheckedNodes(true)
      this.cases = []
      for (let i=0; i<case_id.length;i++){
        this.cases[i] = case_id[i].api_test_cases_id

      }
      console.log("这是cases", this.cases)

      req.cases = this.cases
      req.api_project_id =  this.api_project_id


      console.log("这是获取到的",req);
      this.$refs.apiTestTaskFormRef.validate((valid) => {

        console.log(this.$refs.apiTestTaskFormRef.validate((valid)));
        if (valid) { // 代表校验通过
          addAPITestTaskRequest(req).then(data => {
            console.log(data)
            if (true === data.data.success) {
              this.showAddOrEditApiTestCase = false;
              this.$message.success("添加API测试任务成功")
              this.$emit('saveApiTestTask')

            } else {
              this.$message.error("添加APi测试任务失败")
            }
          })
        } else {  //校验失败
          return false;
        }

      });

    },

    //编辑测试任务
    editApiTestTask(){

      let req = JSON.parse(JSON.stringify(this.apiTestTaskForm));

      console.log(this.$refs.tree.getCheckedNodes(true))
      let case_id = this.$refs.tree.getCheckedNodes(true)
      this.cases = []
      for (let i=0; i<case_id.length;i++){
        this.cases[i] = case_id[i].api_test_cases_id

      }
      console.log("这是cases", this.cases)

      req.cases = this.cases
      req.api_project_id =  this.api_project_id



      console.log("这是获取到的",req);
      this.$refs.apiTestTaskFormRef.validate((valid) => {
        console.log("这是id：",this.apiTestTaskForm.api_test_task_id)
        console.log(this.$refs.apiTestTaskFormRef.validate((valid)));
        if (valid) { // 代表校验通过
          updateSingleApiTestTaskRequest(this.apiTestTaskForm.api_test_task_id,req).then(data => {
            console.log(data)
            if (true === data.data.success) {
              this.showAddOrEditApiTestCase = false;
              this.$message.success("编辑UI测试任务成功")
              this.$emit('saveApiTestTask')

            } else {
              this.$message.info("编辑UI测试任务失败")
            }
          })
        } else {  //校验失败
          return false;
        }



      });
    },

    //获取测试用例树形结构
    getApiCaseTreeFun(){
      console.log("API项目ID",this.api_project_id)
      getApiCaseTreeRequest(this.api_project_id).then(data =>{
        if (true === data.data.success){
          let apiTestTask = data.data.data;
          let req = JSON.parse(JSON.stringify(apiTestTask));
          console.log("apiTestTask：", req)
          for(var i =0;i<req.length;i++){
            let children = req[i].children
            req[i].label = req[i].api_project_name

            for(var j=0;j<children.length;j++){
              console.log(children.length)
              req[i].children[j].label = req[i].children[j].api_test_case_name
              req[i].children[j].id = req[i].children[j].api_test_cases_id
            }
          }
          console.log("uiTestTask222222222：", req)
          this.data = req
        }else {
          this.$message.info("获取接口失败")
        }

      })

    },

    // 获取单独Api测试任务信息
    getSingleApiTestTaskFun() {
      getSingleApiTestTaskRequest(this.apiTestTaskForm.api_test_task_id).then(data =>{
        if (true === data.data.success){
          let apiTestTask = data.data.data;
          console.log(apiTestTask)


          let req = JSON.parse(JSON.stringify(apiTestTask));
          console.log("apiTestTask2333333333333：", req.cases)


          this.defaultTask = JSON.parse(data.data.data.cases)
          console.log(this.defaultTask)

          console.log(typeof (this.defaultTask))


          console.log("这是默认选中返回得数据：", this.defaultTask)



        }else {
          this.$message.info("获取接口失败")
        }

      })
    },






    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());

    },
    setCheckedKeys(){
      this.$refs.tree.setCheckedKeys([]);
    }

  },
  created() {


    if ('edit'===this.type){
      console.log("编辑测试任务222222")
      console.log(this.apiTestTaskData)
      this.api_project_id = this.projectId
      this.apiTestTaskForm = {
        api_test_task_name: this.apiTestTaskData.api_test_task_name,
        api_test_task_id: this.apiTestTaskData.id,
        describe: this.apiTestTaskData.describe

      }
      console.log("编辑测试任务")
      console.log("编辑测试任务",this.apiTestTaskForm.api_test_task_id )
      this.getApiCaseTreeFun()
      this.getSingleApiTestTaskFun()




    }

    if ('add'===this.type){
      console.log("新增测试任务", this.projectId)
      this.api_project_id = this.projectId

      this.getApiCaseTreeFun()



    }




  },

};
</script>

<style scoped>
.api_test_task_name{
  width: 230px;
}

</style>