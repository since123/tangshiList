<template>
  <view class="content" v-if="!loading">
    <view class="ts-search">
      <input class="ts-search__input" placeholder="请输入诗名" @input="fuzzyQuery" />
    </view>
    <view class="ts-list" v-for="item in data" :key="item._id" @click="read(item._id)">
      <view class="ts-title">
         <text class="ts-name">{{item.title.split('/')[0]}}</text>
         <text class="ts-dynasty">[{{item.dynasty}}]</text>
         <text class="ts-author">{{item.author}}</text>
      </view>
      <view class="ts-desc">{{ item.text.split('\n')[0] }}</view>
    </view>
  </view>
</template>
<script>
let data = []
export default {
  data() {
    return {
      data: [],
      loading: false
    }
  },
  onLoad() {
    this.list()
	// this.addList()
  },
  methods: {
    list(e) {
      this.loading = true
      uni.showLoading({
          title: '加载中'
      });
      uniCloud
        .callFunction({
          name: 'list',
          data: {
            limit: 300,
            offset: 0,
            keyWord: e ? e.detail.value : ''
          }
        })
        .then(res => {
          console.log(res.result.data, 0)
          data = res.result.data
          this.data = res.result.data
          uni.hideLoading();
          this.loading = false
        })
    },
    /**
     * 使用test方法实现模糊查询
     */
    fuzzyQuery(e) {
      const reg = new RegExp(e.detail.value)
      const arr = []
      for (let i = 0; i < data.length; i++) {
        if (reg.test(data[i].title)) {
          arr.push(data[i])
        }
      }
      // console.log(arr)
      this.data = arr
    },
    read(id) {
      uni.navigateTo({
        url: `/pages/read/index?id=${id}`
      })
    },
	addList(){
	  uniCloud.callFunction({
		name: 'addList',
		data: {
			title: 'k',
			text: 's',
			author:'m'
		}
	  }).then(res => console.log('res', res))
	  }
  }
}
</script>
<style lang="scss" scoped>
// @import 'style.scss';
</style>