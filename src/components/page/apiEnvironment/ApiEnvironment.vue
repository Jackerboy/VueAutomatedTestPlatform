<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> API环境
                </el-breadcrumb-item>
                <el-breadcrumb-item>API环境</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-button type="primary" @click="addEnvironmentPopup" >创建API环境</el-button>
        </el-row>


        <el-dialog title="创建API环境" :visible.sync="addApiEnvironmentdialogFormVisible">
            <el-form :model="addApiEnvironmentData" :rules="rules" ref="addApiProjectFormRef">
                <el-form-item label="环境名称" label-width="100px" prop="api_environment_name">
                    <el-input v-model="addApiEnvironmentData.api_environment_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="环境标题" label-width="100px" prop="api_title">
                    <el-input v-model="addApiEnvironmentData.api_title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="环境描述" label-width="100px" prop="api_describe">
                    <el-input type="textarea" v-model="addApiEnvironmentData.api_environment_describe" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addApiEnvironmentdialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addApiEnvironment">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑环境" :visible.sync="editApiEnvironmentdialogFormVisible">
            <el-form :model="editApiEnvironmentData" :rules="rules" ref="editEnvironmentFormRef">
                <el-form-item label="环境名称" label-width="100px" prop="api_environment_name">
                    <el-input v-model="editApiEnvironmentData.api_environment_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="环境标题" label-width="100px" prop="api_title">
                    <el-input v-model="editApiEnvironmentData.api_title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目描述" label-width="100px" prop="api_describe">
                    <el-input type="textarea" v-model="editApiEnvironmentData.api_environment_describe" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editApiEnvironmentdialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editEnvironment">确 定</el-button>
            </div>
        </el-dialog>

        <div>
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <!--                    :default-sort = "{prop: 'date', order: 'descending'}">-->
                <el-table-column
                        prop="id"
                        label="id"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="api_environment_name"
                        label="环境名称"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="api_title"
                        label="环境标题"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="api_environment_describe"
                        label="环境描述"
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
                                @click="editApiEnvironmentPopup(scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="deleteEnvironmentPopup(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>

</template>

<script>
    import {getApiEnvironmentRequest, addApiEnvironmentRequest,getSingleApiEnvironmentRequest,updateSingleApiEnvironmentRequest, deleteSingleApiEnvironmentRequest} from '../../../api/apiEnvironment';

    export default {
        name: 'ApiEnvironment',
        data() {
            return {
                tableData: [],

                page: {
                    page: 1,
                    total: 0,
                    size: 10,

                },
                addApiEnvironmentdialogFormVisible: false,
                editApiEnvironmentdialogFormVisible: false,

                addApiEnvironmentData: {
                    api_environment_name: "",
                    api_title: "",
                    api_describe: ""
                },
                editApiEnvironmentData: {
                    api_environment_name: "",
                    api_title: "",
                    api_environment_describe: "",
                    id: 0,
                },
                apiEnvironmentId: "",
                apiEnvironmentData: "",

                rules: {
                    api_environment_name: [
                        {required: true, message: '请输入环境名称', trigger: 'blur'},
                    ],
                    api_title: [
                        {required: true, message: '请输入环境标题', trigger: 'blur'},
                    ],

                },
            }
        },
        methods: {


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
                this.getApiEnvironmentFun()
            },
            handleCurrentChange(index) {
                this.page.page = index;
                this.getApiEnvironmentFun()
            },

            //获取所有API环境列表
            getApiEnvironmentFun() {
                let req = {
                    page: this.page.page,
                    size: this.page.size,
                };
                getApiEnvironmentRequest(req).then(data => {
                    console.log(data);
                    if (true === data.data.success) {
                        this.tableData = data.data.data;
                        this.page.total = data.data.data.total;
                        this.page.page = data.data.data.page;
                        this.page.size = data.data.data.size;

                    } else {
                        this.$message.info("获取接口失败")
                    }
                })
            },

            // 添加API环境
            addApiEnvironment() {
                let req = JSON.parse(JSON.stringify(this.addApiEnvironmentData));

                this.$refs.addApiProjectFormRef.validate((valid) => {
                    if (valid) { // 代表校验通过
                        addApiEnvironmentRequest(req).then(data => {
                            console.log(data)
                            if (true === data.data.success) {
                                this.getApiEnvironmentFun();
                                this.addApiEnvironmentdialogFormVisible = false;
                                this.$message.info("创建项目成功")
                            } else {
                                this.$message.info("创建项目失败")
                            }
                        })
                    } else {  //校验失败
                        return false;
                    }
                });
            },

            // 添加API环境 弹窗
            addEnvironmentPopup(){
                this.addApiEnvironmentData = {
                    api_environment_name: "",
                    api_title: "",
                    api_describe: "",
                };
                this.addApiEnvironmentdialogFormVisible=true;
            },

            handleNodeClick(data) {
                this.currentServiceId = data.id;
            },


            //编辑API环境
            editEnvironment(){
                let req = JSON.parse(JSON.stringify(this.editApiEnvironmentData));

                this.$refs.editEnvironmentFormRef.validate((valid) => {

                    console.log(this.apiEnvironmentId);
                    if (valid) { // 代表校验通过
                        updateSingleApiEnvironmentRequest(this.apiEnvironmentId, req).then(data => {
                            console.log(data)
                            if (true === data.data.success) {
                                this.getApiEnvironmentFun();
                                this.editApiEnvironmentdialogFormVisible = false;
                                this.$message.info("编辑项目成功")
                            } else {
                                this.$message.info("编辑项目失败")
                            }
                        })
                    } else {  //校验失败
                        return false;
                    }
                });

            },

            //编辑API环境弹窗并获取单个API环境
            editApiEnvironmentPopup(data){

                this.apiEnvironmentId = data.id;
                this.apiEnvironmentData = data;
                this.editApiEnvironmentdialogFormVisible=true;

                console.log(this.apiEnvironmentId);
                console.log(this.apiEnvironmentData);

                getSingleApiEnvironmentRequest(this.apiEnvironmentId).then(data => {
                        console.log(data);
                        if (true === data.data.success) {
                            this.editApiEnvironmentData.api_environment_name = data.data.data.api_environment_name;
                            this.editApiEnvironmentData.api_describe = data.data.data.api_describe;
                            this.editApiEnvironmentData.api_title = data.data.data.api_title;
                        } else {
                            this.$message.info("获取接口失败")
                        }
                    }
                );

            },


            //删除单个API环境
            deleteEnvironmentPopup(data){

                this.apiEnvironmentId = data.id;
                this.apiEnvironmentData = data;

                console.log(this.apiEnvironmentId);
                console.log(this.apiEnvironmentData);

                deleteSingleApiEnvironmentRequest(this.apiEnvironmentId).then(data => {
                        console.log(data);
                        if (true === data.data.success) {
                            this.getApiEnvironmentFun();
                            this.$message.info("删除项目成功")

                        } else {
                            this.$message.info("删除项目失败")
                        }
                    }
                );

            },





        },
        created() {
            this.getApiEnvironmentFun();
        }
    };
</script>

<style scoped>

</style>