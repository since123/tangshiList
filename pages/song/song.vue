<template>
	<view class='song-con' :style="{height: screenHeight + 'px' }">
		<view class="image-con">
			<u--image class='image-shape' src="https://cdn.uviewui.com/uview/album/1.jpg" ></u--image>
		</view>
		<view class="song-center">
			<view class="song-left">
				<u--text class='song-name' :text='song.name'></u--text>
				<view class="song-info">
					<u--text :text='song.author'></u--text>
					<u--text class='follew' :text="song.follow ? '已关注' : '关注'"></u--text>
					<u--text :text='song.quality'></u--text>
				</view>
				<view>
					<u--text text='我们好像两条平行的线'></u--text>
				</view>
			</view>
			<view class="song-right">
				<u-button :icon="song.isCollection ? 'heart' : 'heart-fill' "></u-button>
			</view>
		</view>
		<view class='song-foot'>
			<view class='slide-con'>
				<view>{{format(current)}}</view>
				<u-slider v-model="slideWidth"></u-slider>
				<view>{{format(duration)}}</view>
			</view>
			<view class='song-tool'>
				<u-button icon='reload' ></u-button>
				<u-button icon='rewind-left-fill' ></u-button>
				<u-button :icon="isPlay ? 'pause-circle-fill' : 'play-circle-fill' " @click='play()'></u-button>
				<u-button icon='rewind-right-fill' ></u-button>
				<u-button icon='list' ></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				song:{
					name:'错乱情迷',
					author: '浆糊音乐',
					follow: '1',
					quality:'HQ',
					isCollection: '1'
				},
				screenHeight: '',
				audio: uni.createInnerAudioContext(),
				slideWidth:'',
				src: '../../static/浆糊音乐 - 错乱底线.mp3',
				isPlay: false,
				current: 0, //当前进度(s)
			    duration: 0, //总时长(s)
			}
		},
		methods: {
			play(){
				this.isPlay = !this.isPlay
				this.audio.src = this.src
				this.audio.play()
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(Math.floor(num % 60)).length) + Math.floor(num % 60)
			}
		},
		mounted(){
			this.screenHeight = uni.getSystemInfoSync().windowHeight
			this.audio.onCanplay(() => {
				this.duration = this.audio.duration
				console.log(this.audio.duration, '音频能够播放了')
			})
			//音频进度更新事件
			this.audio.onTimeUpdate(() => {
				// console.log('音频进度条发生更新')
				if (!this.seek) {
					// console.log('重新更新')
					this.current = this.audio.currentTime
				}
				if (!this.duration) {
					this.duration = this.audio.duration
				}
			})
					
		},
		watch: {
			current(value) {
				console.log('value', value)
				if (this.duration > 0) {
					if (this.current === this.duration) {
						this.slideWidth = 100
						return
					}
					// this.slideWidth = parseInt(((parseInt(value) / parseInt(this.duration)) * 100).toFixed(2))
					this.slideWidth = Number(((value / this.duration) * 100).toFixed(4))
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.song-con {
	background-color: #fff;
	padding: 10px 20px;
	display: flex;
	flex-direction: column;
	.image-con {
		display: flex;
		flex: 0 0 auto;
		justify-content: center;
		align-items: center;
		background:gray;
		width:100%;
		height: 250px;
		border-radius: 15px;
		::v-deep .u-image {
			width: 150px !important;
			height: 150px !important;
			.u-image__image {
				width: 150px !important;
				height: 150px !important;
				border-radius: 50% !important;
			}
		}
	}
	.song-center {
		display: flex;
		flex: 1 0 auto;
		justify-content: space-between;
		padding: 10px 5px;
		.song-left {
			.song-name {
				::v-deep .u-text__value {
					font-size: 20px !important;
					white-space: nowrap;
					font-weight:600 !important;
					padding:10px 0;
				}
			}
			.song-info {
				display: flex;
				padding:10px 0;
				::v-deep .u-text__value {
					font-size: 13px !important;
					white-space: nowrap;
				}
				.follew {
					::v-deep .u-text__value {
						padding: 2px 4px;
						margin: 0 5px;
						border: 1px solid gray !important;
						border-radius: 10px !important;
						font-size: 12px !important;
					}
				}
			}
		}
		.song-right {
			padding:10px;
			.u-button {
				border:none;	
			}
		}
    }
	.song-foot {
		
		padding:30px 0;
		.slide-con {
			display: flex;
			justify-content: center;
			.u-slider {
				width:80%
			}
		}
		.song-tool {
			display: flex;
			.u-button {
				border:none;	
			}
		}
	}
}
</style>
