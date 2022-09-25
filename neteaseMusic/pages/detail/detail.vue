<template>
  <view>
    <view class="fixbg" :style="{'background-image':'url('+songDetail.al.picUrl+')'}"></view>
    <musciHeader :title="songName" :icon='true' color="white"></musciHeader>
    <view class="container" v-show="!isLoading">
      <scroll-view scroll-y="true">
        <view class="detail-play" @tap="handlePlay">
          <image :class="{'detail-play-run ':IsRotate}" :src="songDetail.al.picUrl" mode=""></image>
          <text class="iconfont" :class="Isplay"></text>
          <view class="needle"></view>
        </view>
        <view class="detail-lyric">
          <view class="detail-lyric-wrap" :style="{transform:'translateY('+ -(lyricIndex - 1) * 82 +'rpx)'}">
            <view class="detail-lyric-item" :class="{active: lyricIndex == index}" v-for="(item,index) in lyric"
              :key="index">
              {{item.lyric}}
            </view>
          </view>
        </view>
        <view class="detail-like">
          <view class="detail-like-head">喜欢这首歌的人也听</view>
          <view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleTosimi(item.id)">
            <view class="detail-like-img">
              <image :src="item.album.picUrl" mode=""></image>
            </view>
            <view class="detail-like-song">
              <view>{{item.name}}</view>
              <view class="">
                <image v-if="item.privilege.flag >60 && item.privilege.flag <70" src="../../static/dujia.png" mode="">
                </image>
                <image v-if="item.privilege.maxbr === 999000" src="../../static/sq.png" mode=""></image>
                {{item.artists[0].name}}-{{item.name}}
              </view>
            </view>
            <text class="iconfont iconbofang"></text>
          </view>
        </view>
        <view class="detail-comment">
          <view class="detail-comment-head">精彩评论</view>
          <view class="detail-comment-item" v-for="(item,index) in SongcommentList" :key="index">
            <view class="detail-comment-img">
              <image :src="item.user.avatarUrl" mode=""></image>
            </view>
            <view class="detail-comment-content">
              <view class="detail-comment-content-title">
                <view class="detail-comment-content-name">
                  <view class="">{{item.user.nickname}}</view>
                  <view class="">{{item.time | formatTime}}</view>
                </view>
                <view class="detail-comment-like">{{item.likedCount | formatCount}}
                  <text class="iconfont iconlike"></text>
                </view>

              </view>
              <view class="detail-comment-text">
                {{item.content}}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  import musciHeader from '@/components/musicScroll/musicScroll.vue'
  import {
    SongDetail,
    SongSimi,
    SongComment,
    SongLyric,
    SongUrl
  } from '../../common/api.js'
  export default {
    data() {
      return {
        isLoading: true,
        IsRotate: true,
        Isplay: 'iconpause',
        lyricIndex: 0,
        songName: '',
        songId: '',
        songDetail: {
          al: {
            picUrl: ''
          }
        },
        songSimi: [{
          artists: [{
            name: ''
          }],
          album: {
            picUrl: ''
          },
          privilege: {
            maxbr: 0,
            flag: 0
          }
        }],
        SongcommentList: [],
        lyric: []
      }
    },
    methods: {
      handleTosimi(id) {
        this.getMusic(id)
      },
      listenLyric() {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          for (var i = 0; i < this.lyric.length; i++) {
            if (this.bgAudio.currentTime > this.lyric[this.lyric.length - 1].time) {
              this.lyricIndex = this.lyric.length - 1
              break;
            }
            if (this.bgAudio.currentTime > this.lyric[i].time && this.bgAudio.currentTime < this.lyric[i + 1]
              .time) {
              this.lyricIndex = i
              break
            }
          }
        }, 100)
      },
      handlePlay() {
        if (this.bgAudio.paused) {
          this.bgAudio.play()
        } else {
          this.bgAudio.pause()
        }
        this.IsRotate = !this.IsRotate
        this.Isplay == 'iconpause' ? 'iconbofang1' : 'iconpause'
      },
      formatTimetoSecond(value) {
        let arr = value.split(':')
        return parseFloat(arr[0] * 60) + Number(parseFloat(arr[1]).toFixed(1))
      },
      getMusic(id) {
        this.$store.commit('nextId', id)
        Promise.all([SongDetail(id), SongSimi(id), SongComment(id), SongLyric(id), SongUrl(id)]).then((res) => {
          uni.showLoading({
            title: "正在加载中......"
          })
          this.isLoading = true
          if (res[0][1].statusCode === 200) {
            this.songDetail = res[0][1].data.songs[0]
            this.songName = this.songDetail.name
          }
          if (res[1][1].statusCode === 200) {
            this.songSimi = res[1][1].data.songs
          }
          if (res[2][1].statusCode === 200) {
            this.SongcommentList = res[2][1].data.hotComments
          }
          if (res[3][1].statusCode === 200) {
            let lyric = res[3][1].data.lrc.lyric
            let reg = /\[([^\]]+)\]([^\[]+)/g
            var result = []
            lyric.replace(reg, ($0, $1, $2) => {
              result.push({
                "time": this.formatTimetoSecond($1),
                "lyric": $2
              })
            })
            this.lyric = result
          }
          if (res[4][1].statusCode === 200) {
            // #ifdef MP-WEIXIN
            this.bgAudio = uni.getBackgroundAudioManager()
            this.bgAudio.title = this.songName
            // #endif

            // #ifdef H5
            if (!this.bgAudio) {
              this.bgAudio = uni.createInnerAudioContext()
            }
            this.Isplay = 'iconbofang1'
            this.IsRotate = false
            // #endif


            this.bgAudio.src = res[4][1].data.data[0].url

            this.listenLyric()
            this.bgAudio.onPlay(() => {
              this.Isplay = 'iconpause'
              this.IsRotate = true
              this.listenLyric()
            })
            this.bgAudio.onPause(() => {
              this.Isplay = 'iconbofang1'
              this.IsRotate = false
              clearInterval(this.timer)
            })
            this.bgAudio.onEnded(() => {
              let nextid = this.$store.state.nextId
              if (!!nextid) {
                this.getMusic(nextid)
                this.bgAudio.autoplay = true
              }

            })
          }
          this.isLoading = false
          uni.hideLoading()
        })

      }
    },
    components: {
      musciHeader
    },
    onLoad(options) {
      // this.songName = options.name
      uni.showLoading({
        title: "正在加载中......"
      })
      this.getMusic(options.songId)

    },
    onUnload() {
      clearInterval(this.timer)
      // #ifdef H5

      this.bgAudio.destroy()
      // #endif
    },
    onShow() {

      // #ifdef H5
      this.listenLyric()
      // #endif
    },
    onHide() {


      clearInterval(this.timer)
    }
  }
</script>

<style scoped>
  .detail-play {
    width: 580rpx;
    height: 580rpx;
    background-image: url('~@/static/disc.png');
    background-size: cover;
    margin: 214rpx auto 0 auto;
    position: relative;
  }

  .detail-play image {
    width: 370rpx;
    height: 370rpx;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    animation: 10s linear move infinite;
    animation-play-state: paused;
  }

  .detail-play .detail-play-run {
    animation-play-state: running;
  }

  @keyframes move {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .detail-play text {
    width: 100rpx;
    height: 100rpx;
    font-size: 100rpx;
    color: white;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }

  .detail-play view {
    width: 230rpx;
    height: 360rpx;
    background-image: url('~@/static/needle.png');
    background-size: cover;
    position: absolute;
    left: 100rpx;
    right: 0;
    margin: auto;
    top: -200rpx
  }

  .detail-lyric {
    line-height: 82rpx;
    height: 246rpx;
    text-align: center;
    overflow: hidden;
    color: #6f6e73;
    font-size: 32rpx;
  }

  .detail-lyric-wrap {
    font-size: 32rpx;
    transition: .5s;
  }

  .detail-lyric-item {
    height: 82rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 100rpx;
  }

  .detail-lyric-item.active {
    color: white;
  }

  .detail-like {
    margin: 0 30rpx;
  }

  .detail-like-head {
    font-size: 36rpx;
    color: white;
    margin: 50rpx 0;
  }

  .detail-like-item {
    display: flex;
    align-items: center;
    margin: 20rpx 0;
  }

  .detail-like-img {
    width: 82rpx;
    height: 82rpx;
    border-radius: 20rpx;
    overflow: hidden;
    margin-right: 20rpx;
  }

  .detail-like-img image {
    width: 100%;
    height: 100%;

  }

  .detail-like-song {
    flex: 1;
    color: #c6c2bf;
  }

  .detail-like-song view:nth-child(1) {
    font-size: 28rpx;
    color: white;
    margin-bottom: 12rpx;
  }

  .detail-like-song view:nth-child(2) {
    font-size: 22rpx;
  }

  .detail-like-song image {
    width: 26rpx;
    height: 20rpx;
    margin-right: 10rpx;
  }

  .detail-like-item text {
    font-size: 50rpx;
    color: #c6c2bf;
  }

  .detail-comment {
    margin: 0 30rpx;
  }

  .detail-comment-head {
    font-size: 36rpx;
    color: white;
    margin: 50rpx 0;
  }

  .detail-comment-img {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 18rpx;
  }

  .detail-comment-img image {
    width: 100%;
    height: 100%;


  }

  .detail-comment-item {
    display: flex;
    margin-bottom: 28rpx;
  }

  .detail-comment-content {
    flex: 1;
    color: #cbcacf;
  }

  .detail-comment-content-title {
    display: flex;
    justify-content: space-between;
  }

  .detail-comment-content-name {}

  .detail-comment-content-name view:nth-child(1) {
    font-size: 26rpx;
  }

  .detail-comment-content-name view:nth-child(2) {
    font-size: 18rpx;
  }

  .detail-comment-like {
    font-size: 28rpx;
  }

  .detail-comment-text {
    font-size: 28rpx;
    line-height: 40rpx;
    color: white;
    margin-top: 20rpx;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 30rpx;
  }
</style>
