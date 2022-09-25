<template>
  <view class="music-head" :style="{color:color}">
    <view class="music-head-icon" v-if="icon" :class="{'music-head-iconblack':iconBlack}">
      <text class="iconfont iconzuojiantou-copy" @tap="handletoBack"></text> | <text class="iconfont iconshouye"
        @tap="hanletoHome"></text>
    </view>

    <text>{{title}}</text>
  </view>
</template>

<script>
  export default {
    props: ['title', 'icon', 'color', 'iconBlack'],
    data() {
      return {

      };
    },
    methods: {
      handletoBack() {
        uni.navigateBack()
      },
      hanletoHome() {
        uni.navigateTo({
          url: '/pages/index/index'
        })
      }
    }
  }
</script>

<style scoped>
  .music-head {
    height: 75px;
    width: 100%;
    font-size: 16px;
    line-height: 80px;
    text-align: center;
    color: black;
    position: relative;
    z-index: 10;
  }

  .music-head-icon {
    position: absolute;
    left: 8px;
    top: 23px;
    width: 90px;
    height: 30px;
    background: rgba(0, 0, 0, 0.4);
    color: white;
    line-height: 31px;
    border-radius: 15px;
    display: flex;
    justify-content: space-evenly
  }

  .music-head-iconblack {
    color: black;
    border: 1px solid #eaeaea;
    background-color: white;
  }
</style>
