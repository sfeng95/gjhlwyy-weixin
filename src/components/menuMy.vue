<template>
  <div class="page">
    <v-header :title="title" :rightTitle="rightTitle"></v-header>
    <div class="myArea">
      <!--<div class="blank border-1px"></div>-->
      <div class="avatar border-1px">
        <router-link to="/my/data" tag="div" class="avatarCenter">
          <div class="leftWord" v-if="patientInfo">
            <img class="profile" alt="" :src="patientInfo|patAva" :data-gender="patientInfo.patGender"
                 @error="__avaError($event)">
          </div>
          <div class="rightWord">
            <div v-if="patientInfo">
                            <span>{{ patientInfo.patName
                              }} <i
                                :class="[patientInfo.sysCommonPatVo.isRealnameAuth?'ok':'no']">{{patientInfo.sysCommonPatVo.isRealnameAuth ? "已认证" : "未认证"}}</i></span>
              <span>{{ patientInfo.patGender|getGender}} {{ patientInfo.age }}岁</span>

            </div>
            <img class="look" src="../../static/img/查看更多.png" alt="">
          </div>
        </router-link>
      </div>
      <div class="blank border-1px"></div>
      <div class="weui-cells weuiMargin">
        <a class="weui-cell weui-cell_access" href="javascript:;" @click="goMyConsult()">
          <div class="weui-cell__hd"><img src="../../static/img/my/ic_interrogation@2x.png" alt=""
                                          style="width:20px;margin-right:7px;display:block"></div>
          <div class="weui-cell__bd">
            <p>我的咨询</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a class="weui-cell weui-cell_access" href="javascript:;" @click="goMyBookNumber()">
          <div class="weui-cell__hd"><img src="../../static/img/my/ic_register@2x.png" alt=""
                                          style="width:20px;margin-right:7px;display:block"></div>
          <div class="weui-cell__bd">
            <p>我的挂号</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a class="weui-cell weui-cell_access" href="javascript:;" @click="goUsualPatient()">
          <div class="weui-cell__hd"><img src="../../static/img/my/ic_Contacts@2x.png" alt=""
                                          style="width:20px;margin-right:7px;display:block"></div>
          <div class="weui-cell__bd">
            <p>常用就诊人</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <div class="blank border-1px"></div>

        <router-link to="/coupons/my" class="weui-cell weui-cell_access">
          <div class="weui-cell__hd"><img src="../../static/img/my/my-coupons.png" alt=""
                                          style="width:22px;margin-right:7px;display:block"></div>
          <div class="weui-cell__bd">
            <p>我的礼券</p>
          </div>
          <div class="weui-cell__ft"></div>
        </router-link>
        <router-link v-if="activityStatus" to="/coupons/recommended" class="weui-cell weui-cell_access">
          <div class="weui-cell__hd"><img src="../../static/img/my/recommended.png" alt=""
                                          style="width:22px;margin-right:7px;display:block"></div>
          <div class="weui-cell__bd">
            <p>推荐有礼</p>
          </div>
          <div class="weui-cell__ft"></div>
        </router-link>

        <a class="weui-cell weui-cell_access" href="javascript:;" @click="goCostLog()">
          <div class="weui-cell__hd"><img src="../../static/img/my/ic_consumption@2x.png" alt=""
                                          style="width:20px;margin-right:7px;display:block"></div>
          <div class="weui-cell__bd">
            <p>消费记录</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <div class="blank border-1px"></div>
        <a class="weui-cell weui-cell_access" href="javascript:;" @click="goAccount()">
          <div class="weui-cell__hd"><img src="../../static/img/my/我的收入.png" alt=""
                                          style="width:20px;margin-right:7px;display:block"></div>
          <div class="weui-cell__bd">
            <p>账户相关</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <!--<a class="weui-cell weui-cell_access" href="javascript:;">-->
        <!--<div class="weui-cell__hd"><img src="../../static/img/my/ic_help@2x.png" alt="" style="width:20px;margin-right:7px;display:block"></div>-->
        <!--<div class="weui-cell__bd">-->
        <!--<p>使用帮助</p>-->
        <!--</div>-->
        <!--<div class="weui-cell__ft"></div>-->
        <!--</a>-->
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import header from '../base/header'
  import api from '../lib/api'
  import {avaErrorMixin, isBindMixin, isLoginMixin} from "../lib/mixin"
  import {tokenCache} from '../lib/cache'
  import patAva from "../utils/consultPatAva"
  import weuijs from "weui.js"
  import {getGender} from "../lib/filter";

  export default {
    filters: {
      patAva, getGender
    },
    mixins: [isLoginMixin, isBindMixin, avaErrorMixin],
    data() {
      return {
        title: "我的",
        rightTitle: "",
        healthTitle: "健康资讯",
        healthRightTitle: "",
        serviceTitle: "服务",
        serviceRightTitle: "",
        indexTitle: "首页",
        indexRightTitle: "",
        patientInfo: "",
        previewImg: null,
        tellPath: "",
        activityStatus: false
      }
    },
    created() {
      this.tellPath = this.$route.path
      let loading = weuijs.loading("加载中...");
      this._isBind().then((res) => {
        loading.hide();
        if (res !== false) {
          this.patientInfo = res;
          this.getCoupons();
          localStorage.setItem('patMobile', res.patMobile)
        } else {
          this.$router.replace({
            path: "/bindRelativePhone",
            query: {backPath: this.tellPath}
          });
        }
      })
    },
    methods: {
      goAbout() {
        this.$router.push('/about')
      },
      goAccount() {
        this.$router.push('/accountAbout')
      },
      goMyWait() {
        this.$router.push('/myWait')
      },
      goMyBookNumber() {
        this.$router.push('/myBookNumber')
      },
      goUsualPatient() {
        this.$router.push('/usualPatient')
      },
      goHealthFile() {
        this.$router.push('/HealthFile')
      },
      goMyConsult() {
        this.$router.push('/myConsult/commented')
      },
      goCostLog() {
        this.$router.push('/expenseHistory')
      },
      goProfile() {
        this.$router.push('/myProfile/healthIndex/beautify')
      },
      selectImg(e) {
        this.$refs.upload.click()
      },
      onFileChange(e) {
        console.log(e)
        var file = e.target.files[0]
        this.createImage(file)
      },
      createImage(file) {
        if (typeof FileReader === "undefined") {
          alert("您的浏览器不支持图片上传，请升级您的浏览器")
          return false
        }
        let that = this
        let fileName = file.name
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
          api("nethos.system.atta.upload.image.base64", {
            base64: this.result,
            originalName: fileName
          }).then((data) => {
            this.previewImg = data.obj.attaId
            that.$set(that.$data, 'previewImg', data.obj.attaId)
            console.log(this.previewImg)
            api("nethos.pat.info.modify", {
              token: tokenCache.get(),
              patId: that.patientInfo.patId,
              patAvatar: this.previewImg,
            }).then((data) => {
              if (data.code == 0) {
                console.log(that.patientInfo.patId)
                console.log(this.previewImg)
                console.log(data, '666')
                location.reload()
              } else {
                alert(data.msg)
              }
            })
          })
        }
      },
      async getCoupons() {
        let loading = weuijs.loading("加载中...");
        let ret = await api('smarthos.coupon.activity.details', {
          userScene: 'INVITE_REGISTER'
        });
        if (ret.code == 0) {
          this.activityStatus = ret.obj.activityStatus
        } else {
          //this.$refs.msg.show(ret.msg||"接口错误"+ret.code);
        }
        loading.hide();
      },
    },
    components: {
      "VHeader": header
    },
    mounted() {
      this.$nextTick(() => {
        this.tellPath = this.$route.path
      })
    },
    watch: {
      "$route": function () {
        this.tellPath = this.$route.path
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../common/public';

  .myArea {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 98rem/$rem;
    .avatar {
      width: 100%;
      height: 85px;
      background-color: white;
      .avatarCenter {
        width: 690rem/$rem;
        height: 80px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        .leftWord {
          img.profile {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
        .rightWord {
          height: 80px;
          width: 690rem/$rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          > div {
            display: flex;
            flex-direction: column;
          }
          img.look {
            width: 16rem/$rem;
            height: 20rem/$rem;
          }
          span {
            height: 25px;
            font-size: 32rem/$rem;
            font-family: PingFangSC;
            color: #333333;
            i {
              font-style: normal;
              &.ok {
                color: $mainColor;
              }
              &.no {
                color: red;
              }

            }
          }
          span:nth-child(2), span:nth-child(3) {
            color: #999999;
          }
        }
      }
    }
    .blank {
      width: 100%;
      height: 20rem/$rem;
      background-color: rgb(245, 245, 245);
    }
    .weuiMargin {
      margin: 0;
      p {
        font-size: 32rem/$rem;
        color: #333333;
      }
    }
  }

  .footer {
    width: 100%;
    height: 98rem/$rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    display: flex;
    > div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10rem/$rem;
      img {
        height: 70rem/$rem;
      }
    }

    /*background-color: #3CC51F;*/
  }

  input {
    display: none !important;
  }
</style>
