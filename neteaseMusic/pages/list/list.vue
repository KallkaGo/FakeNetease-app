<template>
  <view class="list">
    <view class="fixbg" :style="{'background-image':'url('+topList.coverImgUrl+')'}"></view>
    <musciHeader title="歌单" :icon='true' color="white"></musciHeader>
    <view class="container" v-show="!isLoading">
      <scroll-view scroll-y="true">
        <view class="list-head">
          <view class="list-head-img">
            <image :src="topList.coverImgUrl" mode=""></image>
            <text class="iconfont iconyousanjiao">{{topList.playCount | formatCount }}</text>
          </view>
          <view class="list-head-text">
            <view>{{topList.name}}</view>
            <view>
              <image src="../../static/wangyiyunyinyue.png" mode=""></image>{{topList.creator.nickname}}
            </view>
            <view>
              {{topList.description}}
            </view>
          </view>
        </view>
        <button open-type="share" class="list-share">
          <text class="iconfont iconicon-"></text>分享给微信好友
        </button>
        <view class="list-music">
          <view class="list-music-head">
            <text class="iconfont iconbofang1"></text>
            <text>播放全部</text>
            <text>(共{{topList.trackCount}}首)</text>
          </view>
          <view class="list-music-item" v-for="(item,index) in topList.tracks" @tap="handleDetail(item.id,item.name)">
            <view class="list-music-top">{{index + 1}}</view>
            <view class="list-music-song">
              <view>{{item.name}}</view>
              <view>
                <image v-if="privileges[index].flag >60 && privileges[index].flag <70" src="../../static/dujia.png"
                  mode=""></image>
                <image v-if="privileges[index].maxbr === 999000" src="../../static/sq.png" mode=""></image>
                <text>{{item.ar[0].name}}-{{item.name}}</text>
              </view>
            </view>
            <text class="iconfont iconbofang"></text>

          </view>

        </view>
      </scroll-view>

    </view>

  </view>
</template>

<script>
  import musciHeader from '@/components/musichead/musichead.vue'
  import {
    TopList
  } from '@/common/api.js'
  export default {
    data() {
      return {
        topList: {
          creator: {
            nickname: ''
          }
        },
        privileges: [],
        isLoading: true
      }
    },
    methods: {
      handleDetail(id, name) {
        uni.navigateTo({
          url: `/pages/detail/detail?songId=${id}&name=${name}`
        })
      },
      async getTopList(id) {
        try {
          const result = await TopList(id)
          if (result[1].data.code === 200) {
            const res = result[1].data.playlist
            const pri = result[1].data.privileges
            console.log('***', result[1].data.playlist.trackIds);
            this.$store.commit('initTopListIds', result[1].data.playlist.trackIds)
            this.topList = res
            this.privileges = pri
            this.isLoading = false
            uni.hideLoading()
            console.log('res', res);
          }
        } catch (e) {
          console.error(e);
        }


      }
    },
    components: {
      musciHeader
    },
    onLoad(options) {
      this.getTopList(options.id);
      uni.showLoading({
        title: "正在加载中......"
      })
    }
  }
</script>

<style scoped>
  .list-head {
    display: flex;
    margin: 30rpx;
  }

  .list-head-img {
    width: 264rpx;
    height: 264rpx;
    border-radius: 30rpx;
    overflow: hidden;
    position: relative;
    margin-right: 42rpx;
  }

  .list-head-img image {
    width: 100%;
    height: 100%;
  }

  .list-head-img text {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    font-size: 26rpx;
    color: white;
  }

  .list-head-text {
    flex: 1;
    color: #f0f2f7
  }

  .list-head-text view:nth-child(1) {
    color: white;
    font-size: 34rpx;
  }

  .list-head-text view:nth-child(2) {
    margin: 20rpx 0;
    display: flex;
    align-items: center;
    font-size: 24rpx;
  }

  .list-head-text view:nth-child(2) image {
    margin-right: 14rpx;
    width: 54rpx;
    height: 54rpx;
    border-radius: 50%;

  }

  .list-head-text view:nth-child(3) {
    line-height: 34rpx;
    font-size: 22rpx
  }

  .list-share {
    width: 330rpx;
    height: 74rpx;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 37rpx;
    color: white;
    text-align: center;
    line-height: 74rpx;
    font-size: 28rpx;
  }

  .list-share text {
    margin-right: 16rpx;
  }

  .list-music {
    background-color: white;
    border-radius: 50rpx;
    margin-top: 40rpx;
    overflow: hidden;
  }

  .list-music-head {
    height: 50rpx;
    margin: 30rpx 0 70rpx 22rpx;
  }

  .list-music-head text:nth-child(1) {
    height: 50rpx;
    font-size: 50rpx;

  }

  .list-music-head text:nth-child(2) {
    font-size: 30rpx;
    margin: 0 10rpx 0 26rpx;
  }

  .list-music-head text:nth-child(3) {
    font-size: 26rpx;
    color: #b2b2b2;
  }

  .list-music-item {
    display: flex;
    margin: 0 32rpx 66rpx 46rpx;
    align-items: center;
    color: #959595;
  }

  .list-music-top {
    width: 58rpx;
    line-height: 30rpx;
    padding-right: 20rpx;
    box-sizing: border-box;
  }

  .list-music-song {
    flex: 1;
    margin-left: 10rpx;

  }

  .list-music-song view:nth-child(1) {
    font-size: 28rpx;
    color: black;
    width: 70vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .list-music-song view:nth-child(2) {

    font-size: 20rpx;
    align-items: center;
    width: 70vw;
    white-space: nowrap;
    overflow: hidden;
    flex-wrap: nowrap;
    text-overflow: ellipsis;
  }

  .list-music-song view:nth-child(2) image {
    width: 32rpx;
    height: 20rpx;
    margin-right: 10rpx;

  }

  .list-music-song view:nth-child(2) text {
    font-size: 20rpx;
  }

  .list-music-item text {
    font-size: 50rpx;
    color: #c7c7c7;
  }
</style>
