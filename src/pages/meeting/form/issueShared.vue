<!--共享议题库-->
<template>
    <div class="main_information">
        <!--共享查询-->
        <div class="form_search mb-16 radius_top_none">
            <div class="flex_layout search_info">
                <div class="search_input flex_layout">
                    <div class="search_input_info flex_layout">
                        <div style="width: 100px">议题编号：</div>
                        <el-input placeholder="请输入" v-model="issueNum"></el-input>
                    </div>
                    <div class="search_input_info flex_layout">
                        <div style="width: 100px">议题名称：</div>
                        <el-input placeholder="请输入" v-model="issueName"></el-input>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="btn btn_blue" @click="searchData"><span>查询</span></button>
                    <button type="button" class="btn btn_wathet" @click="resetData"><span>重置</span></button>
                </div>
            </div>
        </div>
        <!--共享表格-->
        <div class="form_main border_radius">
            <div class="form_table_title pb-16 flex_layout">
                <div class="table_title">共享议题库</div>
            </div>
            <div class="form_table">
                <el-table :data="tableData" stripe style="width: 100%;height: 100%">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="议题编号" prop="issueNum"></el-table-column>
                    <el-table-column label="议题名称" prop="issueName" min-width="150">
                        <template slot-scope="scope">
                            <div class="form_title_color form_limit" :title="scope.row.issueName"
                                 @click="detail(scope.row)">
                                {{scope.row.issueName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="汇报人及职务" prop="reporterAndRel"></el-table-column>
                    <el-table-column label="列席领导或共享" prop="presentMember"></el-table-column>
                    <el-table-column label="添加时间" prop="createTime" :formatter="meetingtime" sortable>
                        <template slot="header" slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="点击排序" placement="top">
                                <span>添加时间</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间" prop="updateTime" :formatter="arrivaltime" sortable>
                        <template slot="header" slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="点击排序" placement="top">
                                <span>更新时间</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="30">
                        <template slot-scope="scope">
                            <div class="form_operation">
                                <div title="明细" @click="detail(scope.row)">
                                    <img src="../../../assets/images/icon/detail.png" alt="">
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--共享分页-->
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
    import {delectIssueData, getIssueSharedData} from '@/api/meeting'

    export default {
        name: "issueUnit",
        data() {
            return {
                tableData: [],//表单数据
                tablePage: 0, //总页数
                pageSize: 1, //当前页
                rowsSize: 10, //条数
                issueNum: "", //搜索议题编号
                issueName: '',//搜索议题名称
            }
        },
        created() {
            this.getData()
        },
        methods: {
            //获取列表数据
            getData() {
                let data = {
                    "page": this.pageSize,
                    "rows": this.rowsSize,
                    "issueNum": this.issueNum,
                    "issueName": this.issueName
                }
                getIssueSharedData(data).then(res => {
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
                if (this.issueNum == '' && this.issueName == '') {
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
                this.issueNum = "";
                this.issueName = '';
                this.getData();
            },
            //时间格式化
            meetingtime(val) {
                return dateFormat(val.createTime);
            },
            arrivaltime(val) {
                return dateFormat(val.updateTime);
            },
            //链接跳转
            detail(row) {
                let url = process.env.VUE_APP_MEET + '/form/formBus/yt/get?id=' + row.id + '&parentGridId=grid&keyId=' + row.id
                window.open(url, "_blank");
            },
        }
    }
</script>
<style scoped>
</style>