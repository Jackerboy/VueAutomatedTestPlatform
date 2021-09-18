<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> API项目
        </el-breadcrumb-item>
        <el-breadcrumb-item>API模块</el-breadcrumb-item>
        <el-breadcrumb-item>API测试用例</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="apiTestCaseFormRef" :model="apiTestCaseForm" label-width="120px" size="medium">
      <el-form-item label="API测试用例">
        <el-input v-model="apiTestCaseForm.api_test_case_name"  class="api_test_case_name"></el-input>
      </el-form-item>
      <el-form-item label="API接口文档地址">
        <el-input v-model="apiTestCaseForm.api_documentation"  class="api_documentation"></el-input>
      </el-form-item>
      <el-form-item label="域名">
        <el-select  v-model="api_environment"  placeholder="请选择域名"  id="selectApiEnvironment" @change="getSelectApiEnvironmentFun">
          <el-option v-for="item in environmentSelect" :key="item.id" :value="item.id" :label="item.api_environment_name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="请求地址">
        <el-input placeholder="请输入请求地址" v-model="apiTestCaseForm.api_url" class="input-with-select">
          <el-select v-model="api_method" slot="prepend" placeholder="请选择" class="address">
            <el-option v-for="option in api_method_options" :key="option.value" :label="option.text" :value="option.value">
            </el-option>
          </el-select>
        </el-input>
        <el-button @click="SendRequest">发送请求</el-button>
        <el-drawer
            title="请求结果!"
            :visible.sync="drawer"
            size="60%">
          <el-tabs style="height: 300px;width: 1620px;margin-left: 8px; " >
            <el-tab-pane label="请求信息">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="请求地址">
                  <p>{{requestsForm.requests_url}}</p>
                </el-collapse-item>

                <el-collapse-item title="headers" name="2">
                  <el-input
                      type="textarea"
                      :autosize="{ minRows: 10, maxRows: 15}"
                      v-model="requestsForm.requests_headers"
                      :readonly="true"
                      style="min-height: 54px;height: 222px;width: 532px;">
                  </el-input>
                </el-collapse-item>
                <el-collapse-item title="body" name="3">
                  <pre>{{JSON.stringify(requestsForm.requests_payload,  null, 4)}}</pre>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="响应信息">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="响应结果" name="1">
<!--                  <el-input-->
<!--                      type="textarea"-->
<!--                      :autosize="{ minRows: 9, maxRows: 10}"-->
<!--                      :readonly="true"-->
<!--                      placeholder="请输入内容"-->
<!--                      v-model="requestsForm.response_message"-->
<!--                      style="min-height: 54px;height: 222px;width: 532px;">-->
<!--                  </el-input>-->
                  <textarea style="margin: 0px; width: 498px; height: 394px;">{{JSON.parse(requestsForm.response_message,  null, 4)   }}</textarea>


                  <!--                  <pre class="pre_json">{{JSON.parse(requestsForm.response_message,  null, 4)   }}</pre>-->
                </el-collapse-item>
                <el-collapse-item title="响应时间" name="2">
                  <p>{{requestsForm.response_time}}</p>
                </el-collapse-item>
                <el-collapse-item title="状态码" name="3">
                  <p>{{requestsForm.requests_status_code}}</p>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="断言结果">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="断言结果" name="1">
                  <p>{{requestsForm.api_assert}}</p>
                </el-collapse-item>

              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="参数提取">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="参数提取" name="1">
<!--                  <textarea style="margin: 0px; height: 240px; width: 385px;">{{requestsForm.api_variable_results}}</textarea>-->
                  <json-viewer :value="requestsForm.api_variable_results" :expand-depth=5></json-viewer>

                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
          </el-tabs>
        </el-drawer>
      </el-form-item>
      <el-form-item label="参数类型">
        <el-radio-group v-model="apiTestCaseForm.api_parameter_types">
          <el-radio :label="1" value="1">form-data</el-radio>
          <el-radio :label="2" value="2">JSON</el-radio>
          <el-radio :label="3" value="3">x-www-form-urlencoded</el-radio>
          <el-radio :label="4" value="4">none</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-tabs :tab-position="tabPosition" style="height: 300px;width: 1620px;margin-left: 120px;">
        <el-tab-pane label="Header请求头">
          <el-input type="textarea" placeholder="请输入JSON格式参数" :rows="10" v-model="apiTestCaseForm.api_headers" style="min-height: 31px;width: 532px;height: 212px;"></el-input>
        </el-tab-pane>
        <el-tab-pane label="参数">

          <el-input type="textarea" placeholder="请输入JSON格式参数" :rows="10" v-model="apiTestCaseForm.api_parameter_body" style="min-height: 31px;width: 532px;height: 212px;"></el-input>

        </el-tab-pane>
        <el-tab-pane label="断言">
          <div>
            <el-table
                :data="assertionsData"
                style="width: 45%"
                max-height="200">

              <el-table-column prop="api_assert_type" label="断言类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.api_assert_type" placeholder="请选择">
                    <el-option v-for="api_assert_type_option in api_assert_type_options" :key="api_assert_type_option.value" :label="api_assert_type_option.text" :value="api_assert_type_option.value">
                    </el-option>
                  </el-select>
                </template>

              </el-table-column>

              <el-table-column prop="api_assert_text" label="断言(Value)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.api_assert_text" controls-position="right" ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="参数提取">
          <div>
            <el-table
                :data="apiParameterExtractionData"
                style="width: 90%"
                max-height="200">

              <el-table-column prop="api_value_variable" label="提取表达式" width="500">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.api_value_variable" placeholder="请用英文逗号逐层 ',' " controls-position="right" style="width: 453px" ></el-input>
                </template>
              </el-table-column>

              <el-table-column prop="api_key_variable" label="变量名称" width="500">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.api_key_variable" placeholder="请用  ${xxx}  命名" controls-position="right" style="width: 453px" ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="api_variable_results" label="变量结果" width="250px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.api_variable_results" placeholder="变量结果" controls-position="right" style="width: 200px" ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="操作">
                <template slot-scope="scope">
                   <el-button @click="AddParameterExtractionRow">添加行</el-button>
                  <el-button size="mini" type="danger" @click="DeleteParameterExtraction(scope.$index, apiParameterExtractionData)" style="margin-left: 0px; margin-right: 13px; padding-right: 28px; text-align: center; ">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-form-item size="large">
        <el-button type="primary" @click="saveApiTestCase">保存</el-button>
        <el-button @click="cancelSaveApiTestCase">取消</el-button>
      </el-form-item>

    </el-form>

  </div>


</template>

<script>
import {getApiEnvironmentRequest } from '../../../api/apiEnvironment';
import {addApiTestCaseRequest, updateSingleApiTestCaseRequest, getSingleApiTestCaseRequest, deBugApiTestCaseRequest} from '../../../api/apiTestCase';
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)


export default {
  name: 'addOrEditApiTestCase',
  // type 用来标识是编辑还是创建
  props:['type', 'apiTestCaseId', 'apiTestCaseData', 'apiModuleId'],
  data() {
    return {
      drawer: false,
      gridData: [],
      api_method_options: [
        { text: 'GET', value: 1 },
        { text: 'POST', value: 2 },
        { text: 'PUT', value: 3 },
        { text: 'DELETE', value: 4 },
      ],
      api_method: '',
      api_module_id: '',


      api_assert_type_options: [
        { text: '包含',
          value: 1
        },
        { text: '匹配',
          value: 2
        },
      ],

      api_environment: '',
      api_environment_options:[
        {
          api_environment_describe:'',
          api_environment_name: '',
          api_title: '',
          id: ''

        }
      ],

      requestsForm: {
        requests_url: "",
        requests_headers: "",
        requests_payload: "null",
        requests_status_code: "",
        response_message: "null",
        response_time: "",
        api_assert: "null",
        api_assert_type: "",
        api_variable_results: [
          {
            api_variable_results: ""

          }
        ],

      },


      apiTestCaseForm: {
        api_test_case_name: "",
        api_documentation: "",
        api_url: "",
        api_parameter_types: 2,
        api_headers: "{\"Content-Type\": \"application/json\"}",
        api_parameter_body: "{}",
        api_test_case_id: "",
      },
      tabPosition: 'top',
      environmentSelect: [],


      // 断言
      assertionsData:[
        {
          api_assert_type: 1,
          api_assert_text: "\"msg\":\"OK\"",

        }
      ],
      api_assert_text: '',


      apiParameterExtractionData:[
        {
          api_value_variable: "",
          api_key_variable: "",
          api_variable_results: ""

        }
      ],
      activeNames: "",


    };
  },

  methods: {
    saveApiTestCase() {
      if ('add' === this.type){
        this.addApiTestCase()
      }else {
        this.editApiTestCase()
      }
    },

    // 取消
    cancelSaveApiTestCase(){
      this.$parent.cancelSaveApiTestCase();

    },

    //添加Api测试用例
    addApiTestCase(){
      let req = JSON.parse(JSON.stringify(this.apiTestCaseForm));
      req.api_method = this.api_method;
      req.api_assert_type = this.assertionsData[0].api_assert_type;
      req.api_assert_text = this.assertionsData[0].api_assert_text;
      req.api_parameter_extraction = this.apiParameterExtractionData

      req.api_environment_id = this.api_environment
      req.api_module_id = this.apiModuleId


      console.log("这是获取到的",req);
      this.$refs.apiTestCaseFormRef.validate((valid) => {
        console.log(this.$refs.apiTestCaseFormRef.validate((valid)));
        if (valid) { // 代表校验通过
          addApiTestCaseRequest(req).then(data => {
            console.log(data)
            if (true === data.data.success) {
              this.$message.success("添加Api测试用例成功")
              this.$parent.saveApiTestCase();

            } else {
              this.$message.error(data.data.error.message)
            }
          })
        } else {  //校验失败
          return false;
        }

      });

    },




    //编辑Api测试用例
    editApiTestCase(){
      let req = JSON.parse(JSON.stringify(this.apiTestCaseForm));
      req.api_method = this.api_method;
      req.api_assert_type = this.assertionsData[0].api_assert_type;
      req.api_assert_text = this.assertionsData[0].api_assert_text;
      req.api_environment_id = this.api_environment
      req.api_module_id =  this.api_module_id
      req.api_parameter_extraction = this.apiParameterExtractionData

      console.log("这是获取到的",req);
      this.$refs.apiTestCaseFormRef.validate((valid) => {
        if (valid) { // 代表校验通过
          console.log(req);
          updateSingleApiTestCaseRequest(this.apiTestCaseData.id, req).then(data => {
            console.log(data)
            if (true === data.data.success) {
              this.$message.success("编辑Api测试用例成功")

              this.$parent.saveApiTestCase();

            } else {
              this.$message.error(data.data.error.message)
            }
          })
        } else {  //校验失败
          return false;
        }
      });
    },


    // 获取单个API测试用例
    getSingleApiTestCaseFun() {
      getSingleApiTestCaseRequest(this.apiTestCaseForm.api_test_case_id).then(data => {
        if (true === data.data.success) {
          let apiTestCase = data.data.data;
          let api_parameter_extraction = data.data.data.api_parameter_extraction
          this.apiTestCaseForm = {...apiTestCase }
          this.api_method = data.data.data.api_method

          this.assertionsData = [
            {
              api_assert_type : apiTestCase.api_assert_type,
              api_assert_text : apiTestCase.api_assert_text
            }
          ]

          this.apiParameterExtractionData = JSON.parse(JSON.stringify(api_parameter_extraction));

          this.api_environment = data.data.data.api_environment
          this.api_module_id = data.data.data.api_module


        } else {
          this.$message.info("获取接口失败")
        }
      })
    },








    // 获取域名
    getSelectApiEnvironmentFun(){
      getApiEnvironmentRequest().then(data =>{
        console.log(data);
        if (true === data.data.success) {

          this.environmentSelect = data.data.data;

        } else {
          this.$message.error("获取接口失败")
        }
      })


    },

    //添加参数提取行
    AddParameterExtractionRow(index, row){
      this.apiParameterExtractionData.push(
          {
            api_value_variable: "",
            api_key_variable: "",
            api_variable_results: ""
          }
      )

    },

    //删除参数提取行
    DeleteParameterExtraction(index, rows){
      rows.splice(index, 1);
    },

    // 发送请求
    SendRequest(){
      let req = JSON.parse(JSON.stringify(this.apiTestCaseForm));
      req.api_method = this.api_method;
      req.api_assert_type = this.assertionsData[0].api_assert_type;
      req.api_assert_text = this.assertionsData[0].api_assert_text;
      req.api_environment_id = this.api_environment
      req.api_parameter_extraction = this.apiParameterExtractionData
      // req.api_value_variable = this.apiParameterExtractionData;
      deBugApiTestCaseRequest(req).then(data =>{
        console.log(data);
        if (true === data.data.success) {
          this.$message.success("调试Api测试用例成功")
          console.log("这是请求url",data.data.data.api_url)
          this.jsonData = JSON.stringify(data.data.data.response_message, null, 4);

          console.log("这是请求json",data.data.data.api_variable_results)

          this.requestsForm.requests_url = data.data.data.api_url
          this.requestsForm.requests_headers = data.data.data.api_header
          this.requestsForm.requests_payload = data.data.data.api_body
          this.requestsForm.requests_status_code = data.data.data.api_code
          this.requestsForm.response_message = this.jsonData
          this.requestsForm.response_time = data.data.data.response_time
          this.requestsForm.api_assert = data.data.data.api_assert
          this.requestsForm.api_variable_results = data.data.data.api_parameter_extraction
          this.apiParameterExtractionData = this.requestsForm.api_variable_results



          // this.requestsForm.api_variable_results = data.data.data.api_variable_results



        }
        if (false === data.data.success){
          this.$message.error(data.data.error.message)
        }
      })


      console.log("发送")
      this.drawer = true

    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },

  },

  created() {
    console.log(this.apiTestCaseData)
    if ('edit'===this.type){
      this.getSelectApiEnvironmentFun()
      this.apiTestCaseForm.api_test_case_id =  this.apiTestCaseData.id

      this.getSingleApiTestCaseFun()



    }

    if ('add'===this.type){
      this.getSelectApiEnvironmentFun()
      console.log("这是模块id", this.apiModuleId)
    }

  },




};
</script>

<style scoped>
.api_test_case_name{
  width: 215px;
}
.address{
  width: 100px;
}
.input-with-select{
  width: 1000px;
}
.parameter{
  width: 1000px;
}
.assertions{
  width: 300px;
}
.requests_url{
  background: #00d1b2;
}
.pre_json{
  outline: 1px solid #ccc; padding: 5px; margin: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
  width: 500px;
  height: auto;


}
.api_documentation{
  width: 500px;
}




</style>