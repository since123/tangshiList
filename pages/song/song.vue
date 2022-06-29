<template>
	<view class='song-con' :style="{height: screenHeight + 'px' }">
		<view class="image-con">
			<u--image   id='img' class='image-shape' src="https://cdn.uviewui.com/uview/album/1.jpg" ></u--image>
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
					<u--text :class="{each:true, choose: (index==lyricIndex)}" v-for='(item,key,index) in currentMUsicLyric' :text='item' :key='key'></u--text>
				</view>
			</view>
			<view class="song-right" >
				<u-button :icon="song.isCollection ? 'heart' : 'heart-fill' "></u-button>
			</view>
		</view>
		<view class='song-foot'>
			<view class='slide-con'>
				<view>{{format(current)}}</view>
				<u-slider 
					@moving="moveing"
					@end="endMove"
					v-model="slideWidth"
					:unidirectionalDatatTransfer="true"
				></u-slider>
				<view>{{format(duration)}}</view>
			</view>
			<view class='song-tool'>
				<u-button icon='reload' ></u-button>
				<u-button icon='rewind-left-fill' ></u-button>
				<u-button :icon="paused ?   'play-circle-fill':'pause-circle-fill' " @click="audio.paused ? play() : audio.pause()"></u-button>
				<u-button icon='rewind-right-fill' ></u-button>
				<u-button icon='list' ></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {encodedlyric}from '../../static/lyric.js'
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
				paused: true, //是否处于暂停状态
				current: 0, //当前进度(s)
			    duration: 0, //总时长(s),
				currentMUsicLyric: {},
				lyricIndex:0,
				rotateval:0,
			    seek: false, //是否处于拖动状态
				Interval:null // 定时器
			}
		},
		methods: {
			endMove() {
				this.play()
				const pr = (this.slideWidth / 100) * this.duration
				// this.current = pr
				this.audio.seek(pr)
			},
			moveing() {
				console.log(this.seek)
				this.play()
				this.seek = true
				const pr = (this.slideWidth / 100) * this.duration
				this.current = pr
				console.log(this.seek)
			},
			//返回prev事件
			prev() {
				this.slideWidth = 0
				// this.$emit('prev')
			},
			//返回next事件
			next() {
				this.slideWidth = 0
				// this.$emit('next')
			},
			
			play(){
				this.audio.play()
				// this.rotate()
			},
			//格式化时长
			format(num) {
				if(num){
					return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(Number(num) / 60) + ':' + '0'.repeat(2 - String(Math.floor(num % 60)).length) + Math.floor(num % 60)
					
				}
			},
			getLyric(){
				let lyric = decodeURIComponent(escape(atob(encodedlyric)))
				
				// 处理歌词，转化成key为时间，value为歌词的对象
				    let lyricArr = lyric.split('[').slice(1); // 先以[进行分割
				     let lrcObj = {};
				     lyricArr.forEach(item => {
				         let arr = item.split(']');	// 再分割右括号
				         // 时间换算成秒
				         let m = parseInt(arr[0].split(':')[0])
				         let s = parseInt(arr[0].split(':')[1])
				         arr[0] = m*60 + s;
				         if (arr[1] != '\n') { // 去除歌词中的换行符
				             lrcObj[arr[0]] = arr[1];
				         }
				     })
				     // 存储数据
				     this.currentMUsicLyric = lrcObj;
			},
			rotate(){
				let that = this
				if(!that.paused){
					that.Interval=setInterval(function(){
						var img=document.getElementById('img');
						that.rotateval++;
						img.style.transform='rotate('+that.rotateval+'deg)'
						img.style.transition = '0.1s linear'
					},100)
				}else {
					clearInterval(that.Interval)
					that.Interval = null
				}
			}
		},
		mounted(){
			if (this.src) {
				this.audio.src = this.src
				// this.autoplay && this.play()
			}
			this.screenHeight = uni.getSystemInfoSync().windowHeight
			this.audio.onCanplay(() => {
				this.duration = this.audio.durationrotate
				// this.audio.src = this.src
				console.log(this.audio.duration, '音频能够播放了')
				// this.audio.play()
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
			this.getLyric()	
		},
		watch: {
			current(value) {
				if (this.duration > 0) {
					if (this.current === this.duration) {
						this.slideWidth = 100
						return
					}
					// this.slideWidth = parseInt(((parseInt(value) / parseInt(this.duration)) * 100).toFixed(2))
					this.slideWidth = Number(((value / this.duration) * 100).toFixed(4))
					let i = 0
					// 循环歌词对象
					for (let key in this.currentMUsicLyric) {
					// key表示歌词对象中的时间，如果key等于歌曲进度value，改变当前歌词进度		lyricIndex
						// console.log("value",key,parseInt(value))
						if (+key == parseInt(value) ) {
							this.lyricIndex = i;
							// 当歌词进度大于5，即播放到了第5句歌词，开始滚动
							if (i > 3) {
							 this.$refs.lyric.$el.scrollTop =this.lyricIndex  * 30;
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
		background:url('../../static/bg.jpeg');
		background-position: center;
		background-size: 100%;
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
				.choose ::v-deep .u-text__value
				{
					height: 30px;
					line-height: 30px;
					font-size: 20px;
					color: #31c27c !important;
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
				width:80%;
			}
			::v-deep .uni-slider-track {
				background:#31c27c !important;
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
