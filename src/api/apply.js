import config from "@/request/config";
import request from "@/request/request";
import qs from "qs";


export function getIssuesList(data) {
    return request({
        method: "get",
        url: config.baseBase + "/meetingService/meetingData/issuesList",
        params: data
    });
}

export function cancleMeetBooking(params) {
    return request({
        method: "get",
        url: config.baseBase + "/meetingService/meetingData/cancleMeetBooking",
        params
    });
}

export function saveMeetingInfo(data) {
    return request({
        method: "post",
        url: config.baseBase + "/meetingService/meetingData/saveMeetingInfo",
        data: data
    });
}

export function meetingFilesUpload(params) {
    return request({
        method: "get",
        url: config.baseBase + "/meetingService/meet/meetingFilesUpload",
        params
    });
}

//获取可用会议室接口
export function searchavailableroom(data) {
    return request({
        method: "post",
        url: config.baseSmart + "/api/v1.0/roombooking/searchavailableroom",
        data: data
    });
}

//办公区基础数据接口
export function searchcitybuildingfloorlayer(data) {
    return request({
        method: "post",
        url: config.baseSmart + "/api/v1.0/roombooking/oasearchroomlayer",
        data: data
    });
}

//办公区基础数据接口
export function oabooking(data) {
    return request({
        method: "post",
        url: config.baseSmart + "/api/v1.0/roombooking/oabooking",
        data: data
    });
}

export function roomAccesstoken(data) {
    return request({
        method: "post",
        url: config.baseTenant + "/api/v1.0/accesstoken/get",
        data: data
    });
}

export function createVideo(data) {
    return request({
        method: "post",
        url: config.baseVideo + "/meeting/main/create.do",
        data: data
    });
}
