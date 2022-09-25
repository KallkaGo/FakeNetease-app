<template>
  <view class="search">
    <musciHeader title="歌单" :icon='true' color="black" iconBlack="true"></musciHeader>
    <view class="container">
      <scroll-view scroll-y="true">
        <view class="index-search">
          <text class="iconfont iconsearch"></text>
          <input type="text" placeholder="搜索歌曲" v-model="inputword" @confirm="hanleSearch" @input="handleSuggset">
          <text v-show="searchType!== 1" class="iconfont iconguanbi" @tap="handletoClose"></text>
        </view>
        <block v-if="searchType == 1">
          <view class="search-history">
            <view class="search-history-head">
              <text>历史记录</text>
              <text class="iconfont iconlajitong" @tap="handleClear"></text>
            </view>
            <view class="search-history-list">
              <block v-for="(item,index) in searchHistory" :key="index">
                <view @tap="handleSearchWord(item)">{{item}}</view>
              </block>
            </view>
          </view>
          <view class="search-hot">
            <view class="search-hot-head">热搜榜</view>
            <view class="search-hot-item" v-for="(item,index) in searchHotdata" :key="index">
              <view :class="[(index + 1) <=3 ? 'search-hot-top3' : 'search-hot-top']">
                {{index + 1}}
              </view>
              <view class="search-hot-word" @tap="handleSearchWord(item.searchWord)">
                <view>
                  {{item.searchWord}}
                  <image :src="item.iconUrl" mode="aspectFill"></image>
                </view>
                <view>{{item.content}}</view>
              </view>
              <text class="search-hot-count">{{item.score}}</text>
            </view>
          </view>
        </block>
        <block v-else-if="searchType == 2">
          <view class="search-result">
            <view class="search-result-item" v-for="(item,index) in searchResult" :key="index"
              @tap="handleToDetail(item.id)">
              <view class="search-result-word">
                <view>{{item.name}}</view>
                <view>{{item.ar[0].name}}-{{item.al.name}}</view>
              </view>
              <text class="iconfont iconbofang"></text>
            </view>
          </view>
        </block>
        <block v-if="searchType == 3">
          <view class="search-suggest">
            <view class="search-suggest-title">
              搜索'{{inputword}}'
            </view>
            <view class="search-suggest-item" v-for="(item,index) in searchResult" :key="index"
              @tap="handleToSearch(item.keyword)">
              <text class="iconfont iconsearch"></text>
              {{item.keyword}}
            </view>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  import {
    SearchHot,
    SearchWord,
    SearchSuggest
  } from ' ../../common/api.js'
  import musciHeader from '@/components/musichead/musichead.vue'
  export default {
    data() {
      return {
        searchType: 1,
        searchHotdata: [],
        inputword: '',
        searchHistory: [],
        searchResult: []
      }
    },
    onLoad() {
      SearchHot().then((res) => {
        if (res[1].statusCode === 200) {
          this.searchHotdata = res[1].data.data
        }
      })
      uni.getStorage({
        key: 'searchHissory',
        success: (res) => {
          console.log(res);
          this.searchHistory = res.data
        }
      })
    },
    methods: {
      handleToSearch(word) {
        this.hanleSearch(word)

      },
      async handleSuggset(ev) {
        console.log('ev', ev);
        let value = ev.detail.value
        if (!value) {
          this.searchType = 1
          return
        }
        try {
          const res = await SearchSuggest(value)
          if (res[1].statusCode === 200) {
            this.searchResult = res[1].data.result.allMatch
            this.searchType = 3
          }
        } catch (e) {
          console.error(e)
        }

      },
      handleToDetail(id) {
        uni.navigateTo({
          url: `/pages/detail/detail?songId=${id}`
        })
      },
      handletoClose() {
        this.inputword = ''
        this.searchType = 1
      },
      handleClear() {
        this.searchHistory = []
        uni.removeStorage({
          key: 'searchHissory',
          success: () => {
            uni.showToast({
              title: '清除成功',
              icon: 'none'
            })
          }
        })
      },
      hanleSearch() {
        console.log('触发了');
        this.searchHistory.unshift(this.inputword)
        this.searchHistory = [...new Set(this.searchHistory)]
        if (this.searchHistory.length > 10) {
          this.searchHistory.length = 10
        }
        uni.setStorage({
          key: 'searchHissory',
          data: this.searchHistory
        })
        this.getSearchList(this.inputword)
      },
      async getSearchList(word) {
        try {
          const res = await SearchWord(word)
          if (res[1].statusCode === 200) {
            this.searchResult = res[1].data.result.songs
            this.searchType = 2
          }
          console.log('res', res);
        } catch (e) {
          console.error(e)
        }

      },
      handleSearchWord(word) {
        this.inputword = word
      }
    },
    components: {
      musciHeader
    }
  }
</script>

<style scoped>
  .index-search {
    display: flex;
    align-items: center;
    height: 70rpx;
    margin: 10rpx 30rpx 30rpx 30rpx;
    background: #f7f7f7;
    border-radius: 50rpx;
  }

  .index-search text {
    font-size: 25rpx;
    margin: 0 26rpx;
  }

  .index-search input {
    font-size: 28rpx;
    flex: 1;
  }

  .search-history {
    margin: 0 30rpx 50rpx 30rpx;
    font-size: 26rpx;
  }

  .search-history-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 36rpx;
  }

  .search-history-list {
    display: flex;
    flex-wrap: wrap;

  }

  .search-history-list view {
    padding: 16rpx 24rpx;
    border-radius: 40rpx;
    margin-right: 30rpx;
    margin-bottom: 30rpx;
    background-color: #f7f7f7;
  }

  .search-hot {
    margin: 0 30rpx;
    font-size: 26rpx;
  }

  .search-hot-head {
    margin-bottom: 36rpx;
  }

  .search-hot-item {
    display: flex;
    align-items: center;
    margin-bottom: 58rpx;

  }

  .search-hot-top3 {
    color: #fb2222;
    width: 60rpx;
    margin-left: 8rpx;
  }

  .search-hot-top {
    color: #878787;
    width: 60rpx;
    margin-left: 8rpx;
  }

  .search-hot-word {
    flex: 1;
  }

  .search-hot-word image {
    width: 48rpx;
    height: 22rpx;
  }

  .search-hot-word view:nth-child(1) {
    font-size: 30rpx;
    color: black;
  }

  .search-hot-word view:nth-child(2) {
    font-size: 24rpx;
    color: #878787;
  }

  .search-hot-count {
    color: #878787;
  }

  .search-result {
    border-top: 2px solid #e4e4e4;
    padding: 30rpx;
  }

  .search-result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30rpx;
    margin-bottom: 30rpx;
    border-bottom: 2px solid #e4e4e4;
  }

  .search-result-word {}

  .search-result-word view:nth-child(1) {
    font-size: 28rpx;
    color: #235790;
    margin-bottom: 12rpx;
  }

  .search-result-word view:nth-child(2) {
    font-size: 22rpx;
    color: #878787;
  }

  .search-result-item text {
    font-size: 50rpx;
  }

  .search-suggest {
    border-top: 2px solid #e4e4e4;
    padding: 30rpx;
    font-size: 26rpx;
  }

  .search-suggest-title {
    color: #4574a5;

  }

  .search-suggest-item {
    color: #5d5d5d;
    margin-top: 74rpx;
  }

  .search-suggest-item text {
    color: #bdbdbd;
    margin-right: 28rpx;
    vertical-align: middle;
  }
</style>
