<!--会议待办-->
<template>
    <div class="main_information">
        <!--会议查询-->
        <div class="form_search mb-16 radius_top_none">
            <div class="flex_layout search_info">
                <div class="search_input flex_layout">
                    <div class="search_input_info flex_layout">
                        <div style="width: 100px">实例标题：</div>
                        <el-input placeholder="请输入" v-model="subject"></el-input>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="btn btn_blue" @click="searchData"><span>查询</span></button>
                    <button type="button" class="btn btn_wathet" @click="resetData"><span>重置</span></button>
                </div>
            </div>
        </div>
        <!--会议表格-->
        <div class="form_main border_radius">
            <div class="form_table_title pb-16 flex_layout">
                <div class="table_title">会议待办</div>
            </div>
            <div class="form_table">
                <el-table :data="tableData" stripe style="width: 100%;height: 100%">
                    <el-table-column label="实例标题" prop="subject" min-width="300">
                        <template slot-scope="scope">
                            <div class="form_title_color form_limit" :title="scope.row.subject"
                                 @click="situation(scope.row)">
                                {{scope.row.subject}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="流程名称" prop="procDefName"></el-table-column>
                    <el-table-column label="任务环节" prop="name"></el-table-column>
                    <el-table-column label="送达时间" prop="createTime" width="200"
                                     :formatter="arrivaltime" sortable></el-table-column>
                    <el-table-column label="起草人" prop="ownerName"></el-table-column>
                </el-table>
            </div>
            <!--会议分页-->
            <div class="form_page">
                <el-pagination background layout="sizes,prev, pager, next"
                               :page-size="this.rowsSize" :page-sizes="[10, 20, 30, 40]" :total="tablePage"
                               :current-page="pageSize"
                               @size-change="handleSizeChange" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {dateFormat} from '@/assets/js/public'
    import {getMeetTransactData} from '@/api/meeting'

    export default {
        name: "meetList",
        data() {
            return {
                tableData: [],//表单数据
                tablePage: 0, //总页数
                pageSize: 1, //当前页
                rowsSize: 10, //条数
                subject: "", //搜索会议名称
                createDept: '',//搜索发起部门

            }
        },
        created() {
            this.getData()
        },
        methods: {
            //获取列表数据
            getData() {
                let data = {
                    "flowKey": "hyfasp",
                    "page": this.pageSize,
                    "rows": this.rowsSize,
                    "subject": this.subject,
                }
                getMeetTransactData(data).then(res => {
                    this.tableData = res.data.data.rows;
                    this.tablePage = res.data.data.total
                })
            },
            //下一页
            handleCurrentChange(val) {
                this.pageSize = val;
                this.getData()
            },
            //每页显示几条
            handleSizeChange(val) {
                this.rowsSize = val;
                this.getData()
            },
            //搜索
            searchData() {
                if (this.subject == '' && this.createDept == '') {
                    this.$message.error('请填写要查询的信息！！');
                } else {
                    this.pageSize = 1
                    this.getData();
                }
            },
            //重置
            resetData() {
                this.pageSize = 1;
                this.rowsSize = 10;
                this.subject = "";
                this.createDept = '';
                this.getData();
            },
            //时间格式化
            meetingtime(val) {
                return dateFormat(val.meetTime);
            },
            arrivaltime(val) {
                return dateFormat(val.receiveTime);
            },
            //链接跳转
            situation(row) {
                let url = process.env.VUE_APP_MEET + '/flow/task/taskApproveLead?id=' + row.taskId;
                window.open(url, "_blank");
            },
        }
    }
</script>