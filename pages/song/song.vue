<template>
	<view class='song-con' :style="{height: screenHeight + 'px' }">
		<view class="image-con">
			<u--image id='img' class='image-shape' src="https://cdn.uviewui.com/uview/album/1.jpg"></u--image>
		</view>
		<view class="song-center">
			<view class="song-left">
				<u--text class='song-name' :text='song.name'></u--text>
				<view class="song-info">
					<u--text :text='song.author'></u--text>
					<u--text class='follew' :text="song.follow ? '已关注' : '关注'"></u--text>
					<u--text :text='song.quality'></u--text>
				</view>
				<view class='lyric' ref='lyric'>
					<u--text :class="{each:true, choose: (index==lyricIndex)}"
						v-for='(item,key,index) in currentMUsicLyric' :text='item' :key='key'></u--text>
				</view>
			</view>
			<view class="song-right">
				<u-button :icon="song.isCollection ? 'heart' : 'heart-fill' "></u-button>
			</view>
		</view>
		<view class='song-foot'>
			<view class='slide-con'>
				<view> {{current == 0 ? '00:00' : format(current)}}</view>
				<u-slider @moving="moveing" @end="endMove" v-model="slideWidth" @start="startMove" :unidirectionalDatatTransfer="true">
				</u-slider>
				<view>{{format(duration)}}</view>
			</view>
			<view class='song-tool'>
				<u-button icon='reload' @click='playMusic(songId)'></u-button>
				<u-button icon='rewind-left-fill' @click='prev()'></u-button>
				<u-button :icon="paused ?   'play-circle-fill':'pause-circle-fill' "
					@click="audio.paused ? play() : audio.pause()"></u-button>
				<u-button icon='rewind-right-fill' @click='next()'></u-button>
				<u-button icon='list' @click='openList()'></u-button>
			</view>
		</view>
		<u-popup :show="ifShowList" mode="bottom">
			<view class="song-length">播放列表（{{songList.length}}首）</view>
			<view v-for="item in songList" :key='item._id' class="song-list">
				<div class='song-header' @click='playClick(item._id)'>
					<view class="song-title">{{item.title}}</view>
					<view class='song-author'>- {{item.author}}</view>
				</div>
				<u-button icon='close'></u-button>
			</view>
			<view class='song-close' @click='ifShowList = false'>关闭</view>
		</u-popup>
	</view>
</template>

<script>
	// import {encodedlyric}from '../../static/lyric.js'
	export default {
		data() {
			return {
				song: {},
				screenHeight: '',
				audio: uni.createInnerAudioContext(),
				slideWidth: '',
				paused: true, //是否处于暂停状态
				current: 0, //当前进度(s)
				duration: 0, //总时长(s),
				currentMUsicLyric: {},
				lyricIndex: 0,
				rotateval: 0,
				seek: false, //是否处于拖动状态
				Interval: null, // 定时器
				loadding: false,
				ifShowList: false,
				songList: [],
				songId: ''
			}
		},
		onLoad(option) {
			this.songId = option.id
			this.read(option.id || '5f64c4cca2a89f21dbd4fd66')
		},
		methods: {
			endMove() {
				const pr = (this.slideWidth / 100) * this.duration
				this.audio.seek(pr)
				this.play()
			},
			moveing() {
				console.log(this.seek)
				this.play()
				this.seek = true
				const pr = (this.slideWidth / 100) * this.duration
				this.current = pr
				console.log(this.seek)
			},
			startMove(){
			 console.log("move")
			},
			//返回prev事件
			prev() {
				// 找歌曲
				let targetIndex = this.songList.findIndex((item) =>
					item._id == this.songId
				)
				console.log('targetIndex', targetIndex)
				if (targetIndex == 0) {
					// 第一首的时候播放最后一首,循环
					this.songId = this.songList[this.songList.length - 1]._id

				} else {
					this.songId = this.songList[targetIndex - 1]._id

				}
				this.playMusic(this.songId)
				
			},
			//返回next事件
			next() {
				// 找歌曲
				let targetIndex = this.songList.findIndex((item) =>
					item._id == this.songId
				)
				console.log('targetIndex', targetIndex)
				if (targetIndex == this.songList.length - 1) {
					// 已经是最后一首播放第一首,循环
					this.songId = this.songList[0]._id

				} else {
					this.songId = this.songList[targetIndex + 1]._id

				}
				this.playMusic(this.songId)
			},

			play() {
				this.audio.play()
				this.audio.autoplay = true
				
			},
			//格式化时长
			format(num) {
				if (num) {
					return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(Number(num) / 60) +
						':' + '0'
						.repeat(2 - String(Math.floor(num % 60)).length) + Math.floor(num % 60)

				}
			},
			getLyric(encodedlyric) {
				let lyric = decodeURIComponent(escape(atob(encodedlyric)))

				// 处理歌词，转化成key为时间，value为歌词的对象
				let lyricArr = lyric.split('[').slice(1); // 先以[进行分割
				let lrcObj = {};
				lyricArr.forEach(item => {
					let arr = item.split(']'); // 再分割右括号
					// 时间换算成秒
					let m = parseInt(arr[0].split(':')[0])
					let s = parseInt(arr[0].split(':')[1])
					arr[0] = m * 60 + s;
					if (arr[1] != '\n') { // 去除歌词中的换行符
						lrcObj[arr[0]] = arr[1];
					}
				})
				// 存储数据
				this.currentMUsicLyric = lrcObj;
			},
			rotate() {
				let that = this
				if (!that.paused) {
					that.Interval = setInterval(function() {
						var img = document.getElementById('img');
						that.rotateval++;
						img.style.transform = 'rotate(' + that.rotateval + 'deg)'
						img.style.transition = '0.1s linear'
					}, 100)
				} else {
					clearInterval(that.Interval)
					that.Interval = null
				}
			},
			read(id) {
				this.loading = true

				uni.showLoading({
					title: '加载中'
				});
				uniCloud
					.callFunction({
						name: 'read',
						data: {
							id
						}
					})
					.then(res => {
						this.song = res.result.data[0] || {}
						console.log("this.song", this.song)
						this.getLyric(this.song.lyric)
						// this.src = 
						this.audio.src = this.song.src
						uni.setNavigationBarTitle({
							title: `${this.song.title} - ${this.song.author}`
						})
						this.loading = false
						uni.hideLoading();
					})
			},
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
			openList() {
				console.log('open')
				this.ifShowList = true
			},
			
			playMusic(id){
				this.currentMUsicLyric = {}
				this.read(id)
				// 进度条清0
				this.play()
				// 歌词到最上面
				this.lyricIndex = 0
				// 图片旋转
				this.rotateval = 0
				clearInterval(this.Interval)
				this.Interval = null
			},
			playClick(id){
				this.playMusic(id)
				this.ifShowList = false
			}
		},

		mounted() {
			// 获取歌曲列表
			this.list()
			this.screenHeight = uni.getSystemInfoSync().windowHeight
			this.audio.onCanplay(() => {
				this.current = this.audio.currentTime
				this.duration = this.audio.duration
				this.play()
				
				console.log('音频能够播放了', this.current)
				
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
			//音频播放事件
			this.audio.onPlay(() => {
				console.log('音频播放')
				this.paused = false
				this.rotate()
			})
			// 音频暂停事件
			this.audio.onPause(() => {
				console.log('音频暂停播放')
				this.paused = true
				this.rotate()
			})
			//音频完成更改进度事件
			this.audio.onSeeked(() => {
				// console.log('音频进度条完成')
				this.seek = false
				this.$forceUpdate()
			})

		},
		watch: {
			current(value) {
				if (this.duration > 0) {
					if (this.current === this.duration) {
						this.slideWidth = 100
						return
					}
					this.slideWidth = Number(((value / this.duration) * 100).toFixed(4))
					let i = 0
					// 循环歌词对象
					for (let key in this.currentMUsicLyric) {
						// key表示歌词对象中的时间，如果key等于歌曲进度value，改变当前歌词进度		lyricIndex
						// console.log("value",key,parseInt(value))
						if (+key == parseInt(value)) {
							this.lyricIndex = i;
							// 当歌词进度大于5，即播放到了第5句歌词，开始滚动
							if (i > 3) {
								this.$refs.lyric.$el.scrollTop = this.lyricIndex * 30;
							}
						}
						i++;
					}
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
			background: url('../../static/bg.jpeg');
			background-position: center;
			background-size: 100%;
			width: 100%;
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
						font-weight: 600 !important;
						padding: 10px 0;
					}
				}

				.song-info {
					display: flex;
					padding: 10px 0;

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

				.lyric {
					// width: 400px;
					height: 110px;
					// position: absolute;
					// top: 360px;
					// left: 20px;
					background-color: #fff;
					// 滚动条
					overflow: auto;
					color: #ddd;
					font-size: 10px;
					font-weight: normal;
					padding: 5px 10px;

					.each {
						height: 30px;
						// border: 1px solid #000;
						line-height: 30px;
						text-align: center;

					}

					.choose ::v-deep .u-text__value {
						height: 30px;
						line-height: 30px;
						font-size: 20px;
						color: #31c27c !important;
					}
				}
			}

			.song-right {
				padding: 10px;

				.u-button {
					border: none;
				}
			}
		}

		.song-foot {
			padding: 30px 0;

			.slide-con {
				display: flex;
				justify-content: center;

				.u-slider {
					width: 80%;
				}

				::v-deep .uni-slider-track {
					background: #31c27c !important;
				}
			}

			.song-tool {
				display: flex;

				.u-button {
					border: none;
				}
			}
		}

		/deep/.u-popup__content {
			display: flex;
			background-color: #2e2c2c !important;
			opacity: 0.8;
			padding: 15px 0 0 15px;

			.song-length {
				color: #fff;

			}

			.song-list {
				display: flex;

				border-bottom: 1px solid #3c3a3a;

				.song-header {
					display: flex;
					align-items: center;
					width: 90%;

					.song-title {
						font-size: 12px;
						color: #fff;
						padding-right: 10px;
					}

					.song-author {
						color: #898686;
						font-size: 8px;
					}
				}

				.u-button {
					width: 10%;
					background-color: #2e2c2c;
					opacity: 0.8;
					border: none;

					.uicon-close {
						color: #898686 !important;
					}
				}
			}

			.song-close {
				padding: 20px;
				text-align: center;
				color: #fff
			}
		}
	}
</style>
