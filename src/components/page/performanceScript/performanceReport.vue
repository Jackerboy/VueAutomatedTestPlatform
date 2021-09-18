<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 性能测试项目
        </el-breadcrumb-item>
        <el-breadcrumb-item>性能测试项目</el-breadcrumb-item>
        <el-breadcrumb-item>性能测试脚本</el-breadcrumb-item>
        <el-breadcrumb-item>性能测试报告</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-button @click="returnScriptList" >返回</el-button>
    </el-row>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          prop="performance_script_report_name"
          label="性能测试报告名称"
          sortable
          width="180"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="checkReport(scope.row)">查看报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div></div>
  </div>
</template>

<script>
import { performanceScriptReportRequest } from '../../../api/performanceScript';

export default {
    name: 'performanceReport',
    props: ['performanceScriptData'],
    data() {
        return {
            tableData: [],
            performanceScriptId: '',
            result_id: '',
            performance_script_report_name: '',
            performance_script_report_url: '',
            currentPerformanceScriptReportURL: {}
        };
    },
    mounted() {
        this.getPerformanceScriptReportFun();
    },
    methods: {
        // 获取测试报告
        getPerformanceScriptReportFun() {
            performanceScriptReportRequest(this.performanceScriptId).then(data => {
                if (true === data.data.success) {
                    this.tableData = data.data.data;
                } else {
                    this.$message.info('获取接口失败');
                }
            });
        },

        // 查看性能测试报告
        checkReport(data) {
            this.performance_script_report_name = data.performance_script_report_name;

            this.performance_script_report_url = data.file;
            this.currentPerformanceScriptReportURL = data.file;
            window.open(this.currentPerformanceScriptReportURL);
        },


      // 返回性能脚本列表
      returnScriptList(){
        this.$parent.returnPerformanceScriptList();
      },
    },

    components: {},

    created() {
        this.performanceScriptId = this.performanceScriptData.id;
    }
};
</script>

<style scoped>
</style>