<template>
    <div>
        <!--表格-->
        <TableData :tHeader='tHeader' :formData="formData"></TableData>
    </div>
</template>

<script>
    import TableData from './tableData'
    import {dateFormat} from "@/assets/js/public";

    export default {
        name: "tableIndex",
        components: {
            TableData
        },
        props: {
            //菜单栏
            tHeader: {
                type: Array,
                required: true
            },
            //数据
            formData:{
                type:Array,
                required: true
            }
        },
        methods: {
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
                if (this.meetName == '' && this.meetType == '') {
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
                this.meetName = "";
                this.meetType = '';
                this.getData();
            },
            //时间格式化

            arrivaltime(val) {
                return dateFormat(val.createTime);
            },
            //链接跳转
            addmeeting() {
                let url = process.env.VUE_APP_MEET + '/form/formBus/hyfa/edit?canExport=true&type=DEPT&parentGridId=grid';
                window.open(url, '_black');
            },
            notice(row) {
                let url = process.env.VUE_APP_MEET + '/meeting/meet/meetingInfo/sendSelectorByMeetingModule?id=' + row.id + '&type=NOTICE';
                window.open(url, '_blank')
            },
            management(row) {
                let url = process.env.VUE_APP_MEET + '/meeting/meet/meetToDo/meetToDoManageList?meetId=' + row.id + '&parentGridId=grid&keyId=' + row.id;
                window.open(url, '_blank')
            },
            situation(row) {
                let url = process.env.VUE_APP_MEET + '/meeting/meet/meetAttendance/meetAttendanceList?meetId=' + row.id + '&parentGridId=grid&keyId=' + row.id;
                window.open(url, '_blank')
            },
            shared(row) {
                let url = process.env.VUE_APP_MEET + '/meeting/issue/issueShareRecord/issueShareRecordList?issueId=' + row.id + '&shareType=2';
                window.open(url, '_blank')

            }
        }
    }
</script>

<style scoped>

</style>