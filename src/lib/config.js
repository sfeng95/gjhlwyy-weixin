export const CACHE_PREFIX = "gjhlwyy_" + window.version + "_";
export const API_URL = {
  "localhost": {
    api: "//nethos.diandianys.com/api/app",
    jssdkApi: "//test-api-ywfy.hztywl.cn/app",
    socket: "//nethoswebsocket.diandianys.com",
    appid: "wxa49f90b4ff678ef2",
    plat: "dev"
  },
  "nethosweb.diandianys.com": {
    api: "//nethos.diandianys.com/api/app",
    jssdkApi: "//test-api-ywfy.hztywl.cn/app",
    socekt: "//nethoswebsocket.diandianys.com",
    appid: "wxa49f90b4ff678ef2",
    plat: "dev"
  },
  "test-zheer-wx.hztywl.cn": {
    api: "//nethos.diandianys.com/api/app",
    jssdkApi: "//test-api-ywfy.hztywl.cn/app",
    socekt: "//nethoswebsocket.diandianys.com",
    appid: "wxa49f90b4ff678ef2",
    plat: "dev"
  },
  "pat-test.gjwlyy.com": {
    api: "//api-test.gjwlyy.com/api/app",
    jssdkApi: "//test-api-ywfy.hztywl.cn/app",
    socket: "doc-test.gjwlyy.com",
    appid: "wx3d274480f31f6de2",
    plat: "pro"
  },
  "www.gjwlyy.com": {
    api: "//api.gjwlyy.com/api/app",
    jssdkApi: "//api.ywfyhospital.com/app",
    socket: "socket.gjwlyy.com",
    appid: "wx3d274480f31f6de2",
    plat: "pro"
  }
}
export const openRealNameOauth = false

export const relationship = ["本人", "父母", "配偶", '子女', '亲戚', '朋友', '其他']

export const editForm = {
  "nethos.pat.info.modify": {
    id: "patId",
    name: "patName",
    card: "patIdcard"
  },
  "nethos.pat.compat.modify.v2": {
    id: "compatId",
    name: "compatName",
    card: "compatIdcard"
  }
}


export const docNav = [
  {name: "book", value: "预约挂号", open: false},
  {name: "pic", value: "图文问诊", open: true, price: ''},
  {name: "video", value: "视频问诊", open: true, price: ''},
  {name: "famous", value: "名医咨询", open: true, price: ''},
  {name: "team", value: "团队咨询", open: true}
]

export const baseParams = {
  channel: "3",
  format: "JSON",
  oper: "127.0.0.1",
  spid: "1001",
  version: '2.1.1'
}

export const password = "aAr9MVS9j1";

export const couponType = {
  DISCOUNT_COUPON: '折扣券',
  FULL_REDUCTION_COUPON: '满减券',
  DIRECT_REDUCTION_COUPON: '直减券'
}

export const couponStatus = {
  UNUSED: {text: '可用', value: 0},
  USED: {text: '已使用', value: 2},
  PAST_DUE: {text: '已过期', value: 1},
  NOT_AVAILABLE: {text: '不可用', value: 1}
}
