<template>
  <div class="page">
    <app-header title="支付" ref="header">
      <i class="back" slot="back" @click.stop="back"></i>
    </app-header>
    <div class="payInfo" ref="main">
      <div class="notice center">
        请在{{shengyuTime}}内完成支付，超时订单自动取消
      </div>
      <div class="paySum border-1px">
        <span class="name">支付金额</span>
        <span><i>￥</i>{{ showFee }}</span>
      </div>
      <div class="payBy border-1px">
        <div @click="chooseCoupons" class="payByCenter">
          <div class="flex1">
            <img class="icon" src="../../../../static/img/coupons/coupons-pay.png" alt="">
            <span>礼券</span>
          </div>
          <div class="icon_sp_area flex0">
            <span class="flex0" v-if="coupons&&coupons.desc">{{this.showCoupon}}&nbsp;&nbsp;</span>
            <span class="flex0" v-else>{{count==0?'暂无可用优惠券':count+'张可用优惠券'}}&nbsp;&nbsp;</span>
            <img class="flex1" src="../../../../static/img/arrow.png" alt="">
          </div>
        </div>
      </div>
      <div class="payBy border-1px">
        <div class="payByCenter">
          <div class="flex1">
            <img class="icon" src="../../../../static/img/weixin1.jpg" alt="">
            <span>微信</span>
          </div>
          <div class="icon_sp_area flex0">
            <i @click="confirmPay=!confirmPay" :class="[confirmPay?'weui-icon-success':'weui-icon-circle']"></i>
          </div>
        </div>
      </div>
      <div class="confirmPay">
        <div class="confirmCenter">
          <button @click="goSuccess()">确认支付</button>
        </div>
      </div>
    </div>
    <toast v-if="showToast"></toast>
  </div>
</template>
<script>
  import header from "../../../base/header"
  import api from '../../../lib/api'
  import Toast from '../../../base/test'
  import weuijs from 'weui.js'
  import {formatTime} from "../../../lib/filter";
  import {couponsCache, tokenCache} from '../../../lib/cache'
  import {mainHeightMixin} from "../../../lib/mixin";
  import AppHeader from '../../../plugins/app-header'

  export default {
    data() {
      return {
        payWaitSeconds: 0,
        title: "支付",
        confirmPay: true,
        rightTitle: "",
        consultId: "",
        aboutConsult: {},
        count: 0,
        aboutConsultFee: "",
        returnInfo: "",
        appId: "",
        timeStamp: "",
        nonceStr: "",
        package: "",
        signType: "",
        paySign: "",
        showToast: false,
        coupons: {},
        shengyuTime: ""
      }
    },
    computed: {
      showFee() {
        let fee = parseFloat(this.aboutConsultFee) || 0;
        fee = fee * 100;
        if (Object.keys(this.coupons).length > 0) {
          let reductionMoney = this.coupons.reductionMoney;
          switch (this.coupons.couponType) {
            case 'FULL_REDUCTION_COUPON':
            case 'DIRECT_REDUCTION_COUPON':
              fee = fee - reductionMoney;
              break;
            case 'DISCOUNT_COUPON':
              fee = fee * reductionMoney / 100;
              break;
          }
        }
        fee = fee / 100;
        fee = Math.max(0, fee);
        return fee.toFixed(2);
      },
      showCoupon() {
        if (!this.coupons || Object.keys(this.coupons) == 0) {
          return '';
        }
        let fee = this.coupons.reductionMoney;
        switch (this.coupons.couponType) {
          case 'FULL_REDUCTION_COUPON':
          case 'DIRECT_REDUCTION_COUPON':
            fee = "￥" + fee / 100;
            break;
          case 'DISCOUNT_COUPON':
            fee = Math.round(fee / 10) == fee / 10 ? fee / 10 : fee;
            fee = fee + '折';
            break;
        }
        return fee;
      }
    },
    created() {
      let coupons = couponsCache.get();
      coupons && (this.coupons = coupons);
      this.consultId = this.$route.query.consultId
      this.getDetail();
      this.needDjs();
    },
    beforeDestroy() {
      couponsCache.set({})
    },
    methods: {
      needDjs() {
        let delta = this.payWaitSeconds;
        if (!delta) {
          setTimeout(this.needDjs, 1000);
        } else {
          if (delta > 0) {
            this.djs(delta * 1000);
          }
        }
      },

      djs(t) {
        if (t < 0) {
          this.$router.replace(`/team/consult/` + this.consultId);
          //this.cancel();
        } else {
          this.shengyuTime = formatTime(t, '%M:%S');
          setTimeout(() => {
            this.djs(t - 1000)
          }, 1000);
        }
      },

      back() {
        weuijs.confirm("您的订单已经生成，15分钟不支付会自动取消。", {
          title: "确定不支付吗？",
          buttons: [
            {
              label: "暂不支付", type: 'default', onClick: () => {
                let {query} = this.$route;
                if (query && query.consultId) {
                  this.$router.replace('/team/consult/' + query.consultId);
                } else this.$router.go(-1);
                /*let {query} = this.$route;
                if (query && query.back && query.back == 'list') {
                  this.$router.go(-1);
                } else if (this.aboutConsult.consultType == "DOCPIC") {
                  this.$router.go(-3);
                } else {
                  this.$router.go(-2);
                }*/
              }
            },
            {
              label: "继续支付", type: 'primary', onClick: () => {
              }
            }
          ]
        })
      },


      chooseCoupons() {
        let {consultType: currentService, consultFee: payMoney} = this.aboutConsult;
        this.count > 0 && (this.$router.push({
          path: '/coupons/select',
          query: {currentService, payMoney}
        }));
      },

      async cancel() {
        let loading = weuijs.loading("加载中...");
        let ret = await api('nethos.consult.info.cancel', {
          consultId: this.consultId
        });
        if (ret.code == 0) {
          weuijs.toast('超出支付时间，订单自动取消', {
            callback: () => {
              //this.$emit('cancel');
              this.$router.replace(`/team/consult/` + this.consultId);
            }
          })
        }
        loading.hide();
      },

      async getCouponsCount() {
        let loading = weuijs.loading("加载中...");
        let {consultType: currentService, consultFee: payMoney} = this.aboutConsult;
        payMoney = Math.round(payMoney * 100);
        let ret = await api("smarthos.coupon.mycoupon.unused.count", {payMoney, currentService});
        this.count = ret.obj;
        loading.hide();
      },

      async getDetail() {
        let loading = weuijs.loading("加载中...");
        let data = await api("nethos.consult.info.detail", {
          token: tokenCache.get(),
          consultId: this.consultId
        });
        if (data.code == 0) {
          this.payWaitSeconds = data.obj.payWaitSeconds;
          this.aboutConsult = data.obj.consult;
          this.aboutConsultFee = data.obj.consult.consultFee
        } else {
          weuijs.alert(data.msg)
        }
        loading.hide();
        await this.getCouponsCount();
      },

      async goSuccess() {
        if (!this.confirmPay) {
          weuijs.alert('请选择支付方式');
          return
        }

        if (typeof WeixinJSBridge === 'undefined') {
          weuijs.alert('请在微信当中打开');
          return
        }


//        location.href=`http://weixin.diandianys.com/wxpay/pay.html?back=${encodeURIComponent("https://nethosweb.diandianys.com/wechat/#/blankPage/"+this.consultId)}&amount=${(this.aboutConsultFee)*100}&obj=${this.consultId}`
        let that = this
        this.showToast = true
        let opts = {
          consultId: this.consultId,
          payChannel: "WECHAT"
        };

        if (that.coupons && that.coupons.desc) {
          opts.myCouponId = that.coupons.id;
        }

        let data = await api("nethos.consult.info.pay", opts);
        this.showToast = false
        if (data.code == 0 && data.obj) {
          if (data.obj.toUpperCase() == 'SUCCESS') {
            that.$router.replace({
              path: '/allConsultSuccess',
              query: {consultId: that.consultId}
            });
            return
          }


          this.returnInfo = JSON.parse(data.obj)
          let conf = {
            "appId": this.returnInfo.appid,     //公众号名称，由商户传入
            "timeStamp": this.returnInfo.time_stamp,         //时间戳，自1970年以来的秒数
            "nonceStr": this.returnInfo.nonce_str, //随机串
            "package": `prepay_id=${this.returnInfo.prepay_id}`,
            "signType": "MD5",         //微信签名方式：
            "paySign": this.returnInfo.pay_sign //微信签名
          }
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            conf,
            function (res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                that.$router.replace({
                  path: '/allConsultSuccess',
                  query: {consultId: that.consultId}
                })
              } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                console.log("支付过程中用户取消")
              } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                console.log("支付失败")
                weuijs.alert(JSON.stringify(res))
              }
            }
          );
        } else if (data.code == -2 && data.msg == '当前订单已支付') {
          weui.alert('当前订单已支付')
        } else if (data.code == 0 && !(data.obj)) {
          this.$router.replace({
            path: '/allConsultSuccess',
            query: {consultId: that.consultId}
          })
        } else {
          this.$weuijs.alert(data.msg);
        }
      }
    },
    components: {
      "VHeader": header,
      Toast,
      AppHeader
    },
    mixins: [mainHeightMixin]
  }
</script>
<style scoped lang="scss">
  @import '../../../common/public.scss';

  .weui-icon-success {
    color: $mainColor;
  }

  .notice {
    @include h_lh(50px);
  }

  .page {
    background-color: #F8F8F8;
  }

  .payInfo {
    .paySum {
      width: 100%;
      height: px2rem(230px, 750);
      display: flex;
      background-color: white;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span:first-child {
        font-size: px2rem(32px, 750);
        color: #f4888c;
      }
      span:last-child {
        i {
          font-style: normal;
          font-size: px2rem(36px, 750);
        }
        font-size: px2rem(72px, 750);
        color: #f4888c;
      }

    }
    .payMethod {
      height: 80rem/$rem;
      font-size: 28rem/$rem;
      color: #666666;
      background-color: rgb(245, 245, 245);
    }
    p {
      margin: 0;
      padding-left: 30rem/$rem;
      height: 50px;
      line-height: 50px;
    }
    .payBy {
      margin-top: 10px;
      background-color: white;
      width: 100%;
      height: 50px;
      .payByCenter {
        width: 690rem/$rem;
        height: 50px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon_sp_area {
          span, img {
            display: block;
          }
          span {
            color: #999;
          }
          img {
            height: 15px
          }
        }
        > div {
          display: flex;
          align-items: center;
          span {
            font-size: 32rem/$rem;
            color: #333333;
          }
          img.icon {
            margin-right: 5px;
            width: 50rem/$rem;
          }
        }
      }
    }
    .confirmPay {
      width: 100%;
      height: 80rem/$rem;
      margin-top: 50px;
      .confirmCenter {
        width: 690rem/$rem;
        margin: 0 auto;
      }
      button {
        width: 690rem/$rem;
        border: none;
        outline: medium;
        height: 80rem/$rem;
        border-radius: 7px;
        color: white;
        font-size: 32rem/$rem;
        background-color: $mainColor;
      }
    }
  }

</style>
