<template>
  <div>
    <performance-script-result
      :performanceScriptId="currentPerformanceScriptId"
      :performanceScriptData="currentPerformanceScriptData"
      v-if="showPerformanceScriptResult"
    ></performance-script-result>

    <div v-else>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i> 性能测试项目
          </el-breadcrumb-item>
          <el-breadcrumb-item>性能测试项目</el-breadcrumb-item>
          <el-breadcrumb-item>性能测试脚本</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-button @click="returnProjectList" >返回</el-button>
        <el-button type="primary" @click="addPerformanceScriptPopup">创建性能脚本</el-button>
        <el-button @click="getSinglePerformanceProjectScript" >刷新</el-button>
      </el-row>

      <el-dialog
        title="创建性能脚本"
        :visible.sync="addPerformanceScriptdialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="addPerformanceScriptData" :rules="rules" ref="addPerformanceScriptFormRef">
          <el-form-item label="性能脚本名称" label-width="100px" prop="performance_script_name">
            <el-input v-model="addPerformanceScriptData.performance_script_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <el-upload
          :action="UploadUrl()"
          list-type="picture"
          ref="my-upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :multiple="false"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :on-change="handleChange"
          accept=".jmx"
          :show-file-list="true"
          :on-success="onSuccess"
          :on-error="onError"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jmx文件，且不超过500kb</div>
        </el-upload>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addDownloadPerformanceScript">下 载</el-button>
          <el-button @click="addScriptCancel">取 消</el-button>
          <el-button type="primary" @click="addPerformanceScript">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="编辑脚本"
        :visible.sync="editPerformanceScriptFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="editPerformanceScriptData" :rules="rules" ref="editPerformanceScriptRef">
          <el-form-item label="脚本名称" label-width="100px" prop="performance_script_name">
            <el-input
              v-model="editPerformanceScriptData.performance_script_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-upload
          :action="UploadUrl()"
          list-type="picture"
          ref="my-upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :multiple="false"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :on-change="handleChange"
          accept=".jmx"
          :show-file-list="true"
          :on-success="onEditSuccess"
          :on-error="onError"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jmx文件，且不超过500kb</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editDownloadPerformanceScript">下 载</el-button>
          <el-button @click="editScriptCancel">取 消</el-button>
          <el-button type="primary" @click="editPerformanceScript">确 定</el-button>
        </div>
      </el-dialog>

      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="id" sortable width="180"></el-table-column>
          <el-table-column prop="performance_project_name" label="性能项目名称" sortable width="180"></el-table-column>
          <el-table-column prop="performance_script_name" label="脚本名称" sortable width="180"></el-table-column>
          <el-table-column prop="performance_status" label="状态" sortable width="180"></el-table-column>
          <el-table-column prop="updata_time" label="更新时间" width="180"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="editPerformanceScriptPopup(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="performPerformanceScriptPopup(scope.row)"
              >执行</el-button>
              <el-button
                size="mini"
                type="success"
                @click="performanceScriptReportPopup(scope.row)"
              >查看测试报告</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deletePerformanceScriptPopup(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
    addPerformanceScriptRequest,
    getSinglePerformanceScriptRequest,
    updateSinglePerformanceScriptRequest,
    deleteSinglePerformanceScriptRequest,
    getSinglePerformanceProjectScriptRequest,
    uploadPerformanceScriptRequest,
    performPerformanceScriptRequest
} from '../../../api/performanceScript';
import { fileUrl } from '../../../api/common';
import { connect } from 'tls';
import performanceReport from './performanceReport';

export default {
    name: 'performanceScript',
    props: ['type', 'performanceProjectId'],

    data() {
        return {
            tableData: [],

            fileList: [{}],

            page: {
                page: 1,
                total: 0,
                size: 10
            },

            showPerformanceScriptResult: false,
            addPerformanceScriptdialogFormVisible: false,
            editPerformanceScriptFormVisible: false,

            addPerformanceScriptData: {
                performance_script_name: '',
                performance_project_id: this.projectId,
                performance_script: ''
            },

            apiProjectSelect: [],

            apiProjectSelectId: '',

            editPerformanceScriptData: {
                performance_script_name: '',
                performance_project_id: this.projectId,
                performance_script: '',
                id: 0
            },

            performanceScriptId: '',

            //当前performanceScriptId
            currentPerformanceScriptId: 0,

            //当前 performanceScript数据
            currentPerformanceScriptData: {},

            projectId: '',

            rules: {
                performance_script_name: [{ required: true, message: '请输入脚本名称', trigger: 'blur' }]
            }
        };
    },
    methods: {
        UploadUrl() {
            return fileUrl + 'api/backend/performance_test/performance_script_upload/';
        },

        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        handleChange(file, fileList) {
            console.log('wenujain----->', file, fileList);
            console.log('wenujain-2222---->', fileList[0]);
            if (fileList.length > 0) {
                this.fileList = [fileList[fileList.length - 1]]; // 这一步，是 展示最后一次选择的csv文件
            }
        },

        onError(res) {
            console.log('失败的回调' + JSON.stringify(res));
            this.$alert('创建失败', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    console.log('上传失败');
                }
            });
        },

        formatter(row, column) {
            return row.address;
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        handleSizeChange(size) {
            this.page.size = size;
            this.getSinglePerformanceProjectScript();
        },
        handleCurrentChange(index) {
            this.page.page = index;
            this.getSinglePerformanceProjectScript();
        },
        onEditSuccess(res) {
            this.$alert(res.data.result, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    console.log('上传成功');
                }
            });
            this.editPerformanceScriptData.performance_script = res.data.file;
            console.log('sssss', res.data.file);
        },

        onSuccess(res) {
            this.$alert(res.data.result, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    console.log('上传成功');
                }
            });
            this.addPerformanceScriptData.performance_script = res.data.file;
            console.log(res.data.file);
        },

        // 编辑弹框--下载jmeter脚本
        editDownloadPerformanceScript() {
            console.log(this.fileList[0].url);

            window.location.href = this.fileList[0].url;
        },

        // 添加弹框--下载jmeter脚本
        addDownloadPerformanceScript() {
            console.log(this.fileList[0].url);
            window.location.href = this.fileList[0].url;
        },

        // 添加性能脚本
        addPerformanceScript() {
            let req = JSON.parse(JSON.stringify(this.addPerformanceScriptData));

            this.$refs.addPerformanceScriptFormRef.validate(valid => {
                if (valid) {
                    // 代表校验通过
                    addPerformanceScriptRequest(req).then(data => {
                        console.log(data);
                        if (true === data.data.success) {
                            this.addPerformanceScriptdialogFormVisible = false;

                            this.getSinglePerformanceProjectScript();
                            this.$message.success('创建模块成功');
                        } else {
                            this.$message.error('创建模块失败');
                        }
                    });
                } else {
                    //校验失败
                    return false;
                }
            });
        },

        //取消脚本创建
        addScriptCancel() {
            this.addPerformanceScriptdialogFormVisible = false;
            this.$refs['my-upload'].clearFiles();
        },

        //取消脚本创建
        editScriptCancel() {
            this.editPerformanceScriptFormVisible = false;
            this.$refs['my-upload'].clearFiles();
        },

        // 添加页面 弹窗
        addPerformanceScriptPopup() {
            this.addPerformanceScriptData = {
                performance_script_name: '',
                performance_project_id: this.projectId,
                performance_script: ''
            };
            this.addPerformanceScriptdialogFormVisible = true;
        },

        handleNodeClick(data) {
            this.currentServiceId = data.id;
        },

        //编辑脚本
        editPerformanceScript() {
            let req = JSON.parse(JSON.stringify(this.editPerformanceScriptData));

            this.$refs.editPerformanceScriptRef.validate(valid => {
                console.log(this.projectId);
                if (valid) {
                    // 代表校验通过
                    updateSinglePerformanceScriptRequest(this.performanceScriptId, req).then(data => {
                        console.log(data);
                        if (true === data.data.success) {
                            this.getSinglePerformanceProjectScript();
                            this.editPerformanceScriptFormVisible = false;
                            this.$message.success('编辑页面成功');
                        } else {
                            this.$message.error('编辑页面失败');
                        }
                    });
                } else {
                    //校验失败
                    return false;
                }
            });
        },

        //编辑脚本弹窗并获取单个项目
        editPerformanceScriptPopup(data) {
            this.performanceScriptId = data.id;
            this.editPerformanceScriptData = data;

            // 获取单个脚本信息
            getSinglePerformanceScriptRequest(this.performanceScriptId).then(data => {
                console.log(data);
                if (true === data.data.success) {
                    this.editPerformanceScriptData.performance_script_name = data.data.data.performance_script_name;
                    this.editPerformanceScriptData.performance_project_id = data.data.data.performance_project_id;
                    this.fileList = data.data.data.performance_script_url;
                    console.log('这是获取性能项目id');
                    console.log(this.editPerformanceScriptData.performance_script);
                    this.editPerformanceScriptFormVisible = true;
                } else {
                    this.$message.error('获取接口失败');
                }
            });
        },

        //删除性能脚本
        deletePerformanceScriptPopup(data) {
            this.performanceScriptId = data.id;

            deleteSinglePerformanceScriptRequest(this.performanceScriptId).then(data => {
                console.log(data);
                if (true === data.data.success) {
                    this.getSinglePerformanceProjectScript();
                    this.$message.success('删除性能脚本成功');
                } else {
                    this.$message.error('删除性能脚本失败');
                }
            });
        },

        // 执行性能测试脚本
        performPerformanceScriptPopup(data) {
            console.log('开始执行了');
            performPerformanceScriptRequest(data.id).then(data => {
                this.getSinglePerformanceProjectScript();
                if (true === data.data.success) {
                    this.getSinglePerformanceProjectScript();
                    console.log(data.data.data);
                    this.$message.success('执行测试任务成功');

                }else if (false=== data.data.success){
                  this.$message.error(data.data.error.code.message)
                }else {
                    this.$message.error('获取接口失败');
                }
            });
        },

        // 查看性能测试报告
        performanceScriptReportPopup(data) {
            this.currentPerformanceScriptId = data.id;
            this.currentPerformanceScriptData = data;
            console.log(data);
            this.showPerformanceScriptResult = true;
        },


      returnPerformanceScriptList(){
        this.showPerformanceScriptResult = false;
        this.getSinglePerformanceProjectScript();

      },

        //获取 单个性能测试项目中包含得所有脚本
        getSinglePerformanceProjectScript() {
            getSinglePerformanceProjectScriptRequest(this.projectId).then(data => {
                if (true === data.data.success) {
                    this.tableData = data.data.data;
                } else {
                    this.$message.error('获取接口失败');
                }
            });
        },

      // 返回性能项目列表
      returnProjectList(){
        this.$parent.projectList();
      }
    },

    components: {
        'performance-script-result': performanceReport
    },
    created() {
        if ('enter' === this.type) {
            this.projectId = this.performanceProjectId;
            this.getSinglePerformanceProjectScript();
        }
    }
};
</script>

<style scoped>
</style>