<template>
    <!--表格数据-->
    <div class="form_main border_radius">
        <div class="form_table_title pb-16 flex_layout flex_between">
            <div class="table_title">部门会议库</div>
            <div class="wtsc_title_btn">
                <button type="button" class="btn btn_blue"><span>新增会议</span></button>
            </div>
        </div>
        <div class="form_table">
            <el-table :data="formData" stripe style="width: 100%;height: 100%">
                <template v-for="(item,index) in tHeader">
                    <!--判断是否为标题-->
                    <el-table-column v-if="item.columnType ==='title'" :key="index.prop"
                                     :label="item.label" :prop="item.prop" :min-width="item.width">
                        <template slot-scope="scope">
                            <div class="form_title_color form_limit">{{scope.row[item.prop]}}</div>
                        </template>
                    </el-table-column>
                    <!--判断是否为时间-->
                    <el-table-column v-else-if="item.columnType ==='time'" :key="index.prop"
                                     :label="item.label" :prop="item.prop" sortable
                                     :formatter="item.funName"></el-table-column>
                    <!--判断是否为操作栏（内容较多）-->
                    <el-table-column v-else-if="item.columnType ==='operation' || item.columnNumber =='more' "
                                     :key="index.prop"
                                     :label="item.label" :prop="item.prop">
                        <template slot-scope="scope">
                            <el-dropdown trigger="click">
                                <div class="el-dropdown-link pointer">
                                    <img src="@/assets/images/icon/more.png" alt="">
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                    <div class="form_operation" v-for="opera in item.operationName" :key="opera.name"
                                         @click="openUrl(scope.row)">
                                        <div :title="opera.name">
                                            <img :src="opera.img" alt="">
                                        </div>
                                    </div>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                    <!--普通文本-->
                    <el-table-column v-else :key="index.prop"
                                     :label="item.label" :prop="item.prop" :min-width="item.width">
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <!--        &lt;!&ndash;部门分页&ndash;&gt;-->
        <!--        <div class="form_page">-->
        <!--            <el-pagination background layout="sizes,prev, pager, next"-->
        <!--                           :page-size="this.rowsSize" :page-sizes="[10, 20, 30, 40]" :total="tablePage"-->
        <!--                           :current-page="pageSize"-->
        <!--                           @size-change="handleSizeChange" @current-change="handleCurrentChange">-->
        <!--            </el-pagination>-->
        <!--        </div>-->
    </div>
</template>

<script>
    import {dateFormat} from "@/assets/js/public";

    export default {
        name: "tableData",
        props: {
            //菜单
            tHeader: {
                type: Array,
                required: true
            },
            //数据
            formData: {
                type: Array,
                required: true
            }
        },
        methods: {
            openUrl(row, url) {
                window.open(url, '_blank')
            }
        }
    }
</script>

<style scoped>

</style>