<template>
  <div @click="handler(data.applyService,data)" class="coupons-item relative" :class="['status'+status]">
    <div class="container flex">
      <div class="info flex1">
        <div class="name">{{data.couponName}}</div>
        <div class="desc">{{data.applyServiceDescribe}}</div>
        <div class="sub">{{desc}}{{type}}</div>
      </div>
      <div class="price flex0">
        <div class="num" v-if="data.couponType=='DISCOUNT_COUPON'">
          <span>{{desc}}</span><i>折</i>
        </div>
        <div class="num" v-else>
          <i>￥</i><span>{{data.reductionMoney/100}}</span>
        </div>

        <div class="btn right" v-if="status==0 && showbtn">
          <a>去使用</a>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="time">
        有效期{{data.startTime|formatTime('%Y-%m-%d')}}至{{data.endTime|formatTime('%Y-%m-%d')}}
      </div>
    </div>
  </div>
</template>

<script>
  import {couponStatus, couponType, DOWNLOAD} from "../../lib/config";
  import weuijs from 'weui.js'
  import {formatTime} from "../../lib/filter";
  import {couponsCache} from "../../lib/cache";

  export default {
    props: {
      data: {
        type: Object
      },
      next: {
        type: String
      },
      showbtn: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {};
    },
    computed: {
      status() {
        /*1-已失效 2-已使用*/
        let cs = couponStatus[this.data.couponStatus] || '';
        return cs ? cs.value : 0;
      },
      type() {
        return couponType[this.data.couponType] || '';
      },
      desc() {
        let type = this.data.couponType,
          ret = '',
          reduction = this.data.reductionMoney / 100,
          full = this.data.fullMoney / 100;
        switch (type) {
          case 'DISCOUNT_COUPON':
            reduction = reduction * 100;
            reduction = Math.round(reduction / 10) == reduction / 10 ? reduction / 10 : reduction;
            ret = `${reduction}`;
            break;
          case 'FULL_REDUCTION_COUPON':
            ret = `满${full}减${reduction}元`
            break;
          case 'DIRECT_REDUCTION_COUPON':
            ret = `${reduction}元`
            break;
        }
        return ret;
      }
    },
    filters: {formatTime},
    components: {},
    created() {
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {
      handler(opt, data) {
        if (typeof opt === 'string') {
          opt = JSON.parse(opt);
        }
        if (opt.indexOf('DOCPIC') >= 0) {
          if (this.next && this.next == 'select') {
            couponsCache.set(Object.assign(data, {
              desc: this.desc,
              type: this.type
            }));
            this.$router.go(-1);
            return;
          }
          this.$router.push('/internetroom');
        }
        else {
          weuijs.confirm('微信暂不支持该功能，请前往应用商店下载app来和医生视频问诊', () => {
            location.href = DOWNLOAD;
          });
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/public";

  .coupons-item + .coupons-item {
    margin-top: px2rem(20px, 750);
  }

  .coupons-item {
    $w: 690px;
    $h: 270px;
    margin-left: px2rem(30px, 750);
    @include w_h(px2rem($w, 750), px2rem($h, 750));
    background-image: url(../../../static/img/my/coupons-bg.png);
    @each $i in 1, 2 {
      &.status#{$i} {
        background-image: url("../../../static/img/my/coupons-bg-#{$i}.png");
      }
    }
    @include backgroundImageSet();
    .container {
      * {
        line-height: 1;
      }
      height: px2rem(200px, 750);
      padding-top: px2rem(40px, 750);
      padding-left: px2rem(30px, 750);
      padding-right: px2rem(30px, 750);
      .name {
        font-size: px2rem(34px, 750);
        color: #333333;
        font-weight: bold;
      }
      .desc, .sub {
        font-size: px2rem(24px, 750);
        color: #333333;
      }
      .desc {
        margin-top: px2rem(30px, 750);
      }
      .sub {
        margin-top: px2rem(16px, 750);
      }
      .num {
        i, span {
          color: #F4888C;
        }
        i {
          font-style: normal;
          font-size: px2rem(36px, 750);
        }
        span {
          font-size: px2rem(68px, 750);
        }
      }
      .btn {
        a {
          background-color: #F4888C;
          width: px2rem(100px, 750);
          @include h_lh(px2rem(42px, 750));
          display: inline-block;
          text-align: center;
          color: white;
          font-size: px2rem(22px, 750);
          margin-top: px2rem(30px, 750);
          border-radius: px2rem(21px, 750);
        }
      }
    }
    .bottom {
      padding-left: px2rem(30px, 750);
      height: px2rem(70px, 750);
      .time {
        font-size: px2rem(22px, 750);
        color: #333333;
        line-height: px2rem(70px, 750);
      }
    }
    .mask {
      @include t_r_b_l();
      background-color: rgba(153, 153, 153, .2);
    }

    /*已使用已失效*/
    &.status1, &.status2 {
      .container {
        .price {
          padding-top: px2rem(78px, 750);
        }
        .num {
          i, span {
            color: #999999;
          }
        }
      }
    }

  }


</style>
