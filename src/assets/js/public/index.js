import moment from "moment";

//时间格式化
export function dateFormat(val) {
   let date = moment(val).format("YYYY-MM-DD");
   return date;
}

export function meetDate(val) {
   return moment(val).format("YYYY-MM-DD hh:mm");
}
