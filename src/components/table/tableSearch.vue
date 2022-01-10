<template>
    <!--部门查询-->
    <div class="form_search mb-16 radius_top_none">
        <div class="flex_layout search_info">
            <div class="search_input flex_layout">
                <div class="search_input_info flex_layout">
                    <div style="width: 100px">会议名称：</div>
                    <el-input placeholder="请输入" v-model="meetName"></el-input>
                </div>
                <div class="search_input_info flex_layout">
                    <div style="width: 80px">会议分类：</div>
                    <el-select v-model="meetType" placeholder="请选择">
                        <el-option v-for="item in classification"
                                   :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="search_btn">
                <button type="button" class="btn btn_blue" @click="searchData"><span>查询</span></button>
                <button type="button" class="btn btn_wathet" @click="resetData"><span>重置</span></button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tableSearch"
    }
</script>

<style scoped>

</style>