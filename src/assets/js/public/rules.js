/*
 * @Author: your name
 * @Date: 2020-11-18 16:19:05
 * @LastEditTime: 2020-11-18 16:26:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /oa_adminframe11.16/src/assets/js/public/rules.js
 */
const  validateRlues = {
    //手机号验证
    phone: (rule, value, callback) => {
        let reg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/;
        if (value === '') {
            callback(new Error('请输入手机号'));
        } else if(!reg.test(value)){
            callback(new Error('手机号格式错误'))
        }else{
            callback()
            // return true
        }
    }
}


export default validateRlues