import {getRequest, postRequest, deleteRequest,putRequest} from "./common";

// 获取所有项目测试用例
export const getSystemHomePageListRequest = () =>{
    return getRequest("api/backend/system_home_page_list/")

};