<template>
  <view>

    <musciHeader title="网易云音乐" :icon="false"></musciHeader>
    <view class="container">
      <scroll-view scroll-y="true">
        <view class="index-search" @tap="handletoSearch">
          <text class="iconfont iconsearch"></text>
          <input type="text" placeholder="搜索歌曲">
        </view>
        <view v-if="isLoading">
          <m-for-skeleton :avatarSize="200" :row="3" :loading="isLoading" isarc="square" v-for="(item,key) in 10"
            :key="key" :titleStyle='{}' :title="false">
          </m-for-skeleton>
        </view>

        <view v-else class="index-list">
          <view class="index-list-item" v-for="(item,index) in musicList" :key="item.updateFrequency"
            @tap="handleCLick(item)">
            <view class="index-list-img">
              <image :src="item.coverImgUrl" mode=""></image>
              <text>{{item.updateFrequency}}</text>
            </view>
            <view class="index-list-text">
              <view v-for="(k,t) in item.tracks" :key="k.id">
                {{`${index +1}.${k.first} - ${k.second}`}}
              </view>
            </view>
          </view>

        </view>

      </scroll-view>
    </view>
  </view>
</template>

<script>
  import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
  import musciHeader from '@/components/musichead/musichead.vue'
  import {
    topList
  } from '@/common/api.js'
  export default {
    data() {
      return {
        musicList: [],
        isLoading: true
      }
    },
    onLoad() {
      this.getList()
    },
    components: {
      musciHeader,
      mForSkeleton
    },
    methods: {
      handletoSearch() {
        uni.navigateTo({
          url: '/pages/search/search'
        })
      },
      handleCLick(data) {
        uni.navigateTo({
          url: `/pages/list/list?id=${data.id}`
        })
      },
      async getList() {
        let _this = this
        try {
          const result = await topList()
          if (result.list.length > 0) {
            result.list.length = 4
            _this.musicList = result.list
            this.isLoading = false
          }


        } catch (e) {
          console.error(e)
        }
      }
    }
  }
</script>

<style scoped>
  .index-search {
    display: flex;
    align-items: center;
    height: 70rpx;
    margin: 70rpx 30rpx 30rpx 30rpx;
    background: #f7f7f7;
    border-radius: 50rpx;
  }

  .index-search text {
    font-size: 25rpx;
    margin-right: 26rpx;
    margin-left: 28rpx;
  }

  .index-search input {
    font-size: 28rpx;
    flex: 1;
  }

  .index-list {
    margin: 0 30rpx;
  }

  .index-list-item {
    display: flex;
    margin-bottom: 34rpx;
  }

  .index-list-img {
    height: 212rpx;
    width: 212rpx;
    position: relative;
    border-radius: 30rpx;
    overflow: hidden;
    margin-right: 22rpx;
  }

  .index-list-img image {
    width: 100%;
    height: 100%;

  }

  .index-list-img text {
    position: absolute;
    left: 12rpx;
    bottom: 16rpx;
    color: white;
    font-size: 20rpx;
  }

  .index-list-text {
    font-size: 24rpx;
    line-height: 66rpx;
  }

  .index-list-text view {
    width: 400rpx;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
