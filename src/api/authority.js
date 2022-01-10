import request from "@/request/request";
import config from "@/request/config";

//获取组织结构
export function getOrganizationData(data) {
    return request({
        method: "post",
        url: config.baseBase + "/authorityService/foundation/authority/selectorOrg",
        data
    });
}

//获取人员列表
export function getUserData(data) {
    return request({
        method: "post",
        url: config.baseBase + "/authorityService/foundation/authority/selectorUser",
        data
    });
}
