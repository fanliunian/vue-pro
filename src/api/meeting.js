import config from "@/request/config";
import request from "@/request/request";
import qs from "qs";

//目录
export function getMenu() {
    return request({
        method: "get",
        url: config.baseMeet + "/meetingService/meetingData/getMeetingMenu"
    });
}

//首页
export function getMeetIndex() {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/mainJson"
    });
}

//我的会议
export function getMeetListData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/meetingToDoLitJson",
        data: qs.stringify(data)
    });
}

//我的会议
export function getMeetTransactData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/pendingFlowJson",
        data: qs.stringify(data)
    });
}

//单位议题库
export function getIssueUnitData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/issueLibraryListJson?type=MANAGER",
        data: qs.stringify(data)
    });
}

//部门议题库
export function getIssueDepartmentData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/issueLibraryListJson?type=DEPT",
        data: qs.stringify(data)
    });
}

//共享议题库
export function getIssueSharedData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/issueListJsonByShared",
        data: qs.stringify(data)
    });
}

//删除议题库
export function delectIssueData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/removeIssue",
        params: data
    });
}

//会议库分类接口
export function getClassificationData() {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/getMeetTypeList"
    });
}

//单位会议库
export function getConferenceUnitData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/meetingInfoListJson?type=MANAGER",
        data: qs.stringify(data)
    });
}

//部门会议库
export function getConferenceDepartmentData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/meetingInfoListJson?type=DEPT",
        data: qs.stringify(data)
    });
}

//共享会议库
export function getConferenceSharedData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/getShareMeetInfoListJson",
        data: qs.stringify(data)
    });
}

//会议库删除
export function removeMeeting(data) {
    return request({
        method: "DELETE",
        url: config.baseMeet + "/meetingService/meetingData/removeMeeting",
        params: data
    });
}

//会议预定
export function getMeetingScheduledData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingRoomData/meetingOccupyCase",
        data: qs.stringify(data)
    });
}

//会议预定人员id返回
export function MeetingRoomById(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingRoomData/getMeetingRoomById",
        data: qs.stringify(data)
    });
}

//会议预定保存是否冲突
export function MeetingisTimeConflict(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingRoomData/isTimeConflict",
        data: qs.stringify(data)
    });
}

//会议预定保存
export function MeetingApplySave(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingRoomData/wdxMeetingApplySave",
        data: qs.stringify(data)
    });
}

//会议室审批
export function getMeetExamineData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/wdxApplicationData/wdxMeetingApplyListJson",
        data: qs.stringify(data)
    });
}

//会议室审批删除
export function delectMeetExamineData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/wdxApplicationData/remove",
        params: data
    });
}

//会议室管理
export function getMeetManageData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingRoomData/meetingRoomListJson",
        data: qs.stringify(data)
    });
}

//会议室管理删除
export function delectManageData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingRoomData/remove",
        params: data
    });
}

//会议室管理楼层获取
export function BuildingDialog() {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/dormBuildingData/dormBuildingDialog"
    });
}

//会议室管理楼层保存
export function SaveMeetingRoom(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingRoomData/saveMeetingRoom",
        data: qs.stringify(data)
    });
}

//会议室字典
export function getMeetDictionaryData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/sysDictionaryData/sysDictionaryListJson",
        data: qs.stringify(data)
    });
}

//会议室字典删除
export function delectMeetDictionaryData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/sysDictionaryData/remove",
        params: data
    });
}

//会议室字典表明细
export function getSysDictionary(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/sysDictionaryData/getSysDictionaryJson",
        data: qs.stringify(data)
    });
}

//会议室字典表明细
export function SaveSysDictionary(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/sysDictionaryData/saveSysDictionary",
        data: qs.stringify(data)
    });
}

//会议室栋管理
export function getMeetBuildingData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/dormBuildingData/dormBuildingListJson",
        data: qs.stringify(data)
    });
}

//会议室栋管理删除
export function delectMeetBuildingData(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/dormBuildingData/remove",
        params: data
    });
}

//会议室栋编辑详情
export function getDormBuilding(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/dormBuildingData/getDormBuildingJson",
        data: qs.stringify(data)
    });
}

//会议室栋保存
export function saveDormBuilding(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/dormBuildingData/saveDormBuilding",
        data: qs.stringify(data)
    });
}

//发送会议通知保存
export function meetinDoNotice(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/doNotice",
        data: data
    });
}

//发送会议分发保存
export function sendMinutes(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meeting/meet/meetNoticeRecord/rest/sendMinutes",
        data: data
    });
}

//云公司发送会议通知
export function sendMeetNotice(data) {
    return request({
        method: "get",
        url: config.baseMeet + "/meeting/meet/meetNoticeRecord/rest/sendMeetNotice",
        params: data
    });
}

//云公司结束状态改变
export function changeMeetState(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meeting/meet/meetingInfo/changeMeetState",
        data: qs.stringify(data)
    });
}

export function getisAttendMan(params) {
    return request({
        method: "get",
        url: config.baseMeet + "/meetingService/meetingData/getisAttendMan",
        params
    });
}

export function saveMeetSendMsg(data) {
    return request({
        method: "post",
        url: config.baseMeet + "/meetingService/meetingData/saveMeetSendMsg",
        data: qs.stringify(data)
    });
}

export function getMeetSendMsgListJson(params) {
    return request({
        method: "get",
        url: config.baseMeet + "/meetingService/meetingData/getMeetSendMsgListJson",
        params
    });
}