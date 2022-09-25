import {
  baseUrl
} from "./config"

const topList = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}/toplist/detail`,
      method: "GET",
      data: {},
      success: (res) => {
        resolve(res.data)
      },

    })
  })

}
const TopList = (id) => {
  return uni.request({
    url: `${baseUrl}/playlist/detail?id=${id} `,
    method: "GET"
  })
}

const SongDetail = (id) => {
  return uni.request({
    url: `${baseUrl}/song/detail?ids=${id} `,
    method: "GET"
  })
}
const SongSimi = (id) => {
  return uni.request({
    url: `${baseUrl}/simi/song?id=${id} `,
    method: "GET"
  })
}
const SongComment = (id) => {
  return uni.request({
    url: `${baseUrl}/comment/music?id=${id} `,
    method: "GET"
  })
}

const SongLyric = (id) => {
  return uni.request({
    url: `${baseUrl}/lyric?id=${id} `,
    method: "GET"
  })
}

const SongUrl = (id) => {
  return uni.request({
    url: `${baseUrl}/song/url?id=${id} `,
    method: "GET"
  })
}
const SearchHot = () => {
  return uni.request({
    url: `${baseUrl}/search/hot/detail `,
    method: "GET"
  })
}
const SearchWord = (word) => {
  return uni.request({
    url: `${baseUrl}/search?keywords=${word} `,
    method: "GET"
  })
}

const SearchSuggest = (word) => {
  return uni.request({
    url: `${baseUrl}/search/suggest?keywords=${word}&type=mobile `,
    method: "GET"
  })
}

export {
  topList,
  TopList,
  SongDetail,
  SongSimi,
  SongComment,
  SongLyric,
  SongUrl,
  SearchHot,
  SearchWord,
  SearchSuggest
}
