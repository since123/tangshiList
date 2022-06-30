<template>
	<view class="my-collection">
		<u-tabs :activeStyle="{
        color: '#31c27c',
        fontWeight: 'bold',
        transform: 'scale(1.05)'
    }" :scrollable='false' :list="collectionList" @click="click"></u-tabs>
		<view class="song-con">
			<view class='song-list'>
				<view class="play-btn">
					<u-button class="play-btn" type="primary" color="#fff" text='播放全部' icon="play-circle-fill"></u-button>
				</view>
				<view class='song-btn'>
					<u-button type="primary" color="#fff" icon="list-dot"></u-button>
					<u-button type="primary" color="#fff"icon="arrow-downward"></u-button>
					<u-button type="primary" color="#fff" icon="share-square"></u-button>
				</view>
			</view>
			<view class='song-list' v-for="song in songList" :key='song._id'>
				<view class="play-btn">
					<u-button  type="primary" color="#fff" :text='song.title' @click='handleSongClick(song._id)'></u-button>
				</view>
				<view class='song-btn'>
					<u-button type="primary" color="#fff" icon="eye"></u-button>
					<u-button type="primary" color="#fff"icon="download"></u-button>
					<u-button type="primary" color="#fff" icon="more-dot-fill"></u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collectionList: [
					{
						name: '歌曲83',
					}, {
						name: '专辑4',
					}, {
						name: '歌单21'
					}, {
						name: '视频3'
					},
				],
				songList:[
					{
						id: '1',
						name: '错乱底线',
						
					},
					{
						id: '2',
						name: '扎心',
						
					}
				],
				loading: false
			}
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
			      
			      this.songList = res.result.data
			      uni.hideLoading()
			      this.loading = false
			    })
			},
			handleSongClick(id){
				uni.navigateTo({
				  url: `/pages/song/song?id=${id}`
				})
			}
		},
		created(){
			this.list()
		}
	}
</script>

<style lang="scss" scoped>
.my-collection{
	.u-tabs {
		background: #fff;
		::v-deep .u-tabs__wrapper__nav__line {
			background: #31c27c !important;
		}
	}
	.song-con{
		padding: 10px;
		background: #fff;
	    margin-top: 10px;
		.song-list{
			display: flex;
			justify-content: space-between;
			.play-btn {
				justify-content: left;
			}
			::v-deep .u-icon__icon {
				color : gray !important;
			}
			::v-deep .u-button__text {
				color: gray;
			}
			.song-btn {
				display: flex;
				width:40%;
			}
		}
		
	}
}

</style>
