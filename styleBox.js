/**
 * LBS styleBox 
 * Date: 2014-12-20
 * ==================================
 * opts.idPart 集合中每一项的id中相同的部分 必需设置
 * opts.idDigit 集合中每一项的id中不同的部分 第一项开始的数字 必需设置
 * opts.legnth 集合中共有几项 必需设置
 * opts.current 集合中当前项添加的类名 默认'current'
 * opts.index 从哪一项开始 索引值 从0开始 最后一项为opts.length-1
 * opts.count 滚动的圈数 默认10圈
 * opts.duration 持续时间 默认3000(毫秒)
 * opts.easing 动画效果 (easeInOutCubic默认 easeInOutQuad  easeInOutSine easeInOutCirc)
 * ====================================================
 * this.start(index, fn) 开始调用动画 
 	index 集合中哪一项为中奖结果 索引值 从0开始 最后一项为opts.length-1
	fn 动画完成后
 * ==================================
 **/
(function(window, document) {
	'use strict';
	var styleBox = function(opts) {
		opts = opts || {};
		this.idPart = opts.idPart;
		this.idDigit = opts.idDigit;
		this.length = opts.length;
		this.current = opts.current || 'current';
		this.duration = opts.duration || 3000;
		this.easing = (opts.easing && this.tween[opts.easing]) || this.tween.easeInOutCubic;
		this.count = opts.count || 10;
		this.index = opts.index || 0;
		this.index > this.length - 1 && (this.index = 0);
		this.oIndex = 0;
		this.els = [];
		this.animated = false;
		this.init();
	};
	styleBox.prototype = {
		init: function() {
			var start = this.idDigit,
				end = this.length + start - 1,
				i = start;
			for (; i <= end; i++) this.els.push(document.getElementById(this.idPart + i));
		},
		start: function(index, fn) {
			this.animate(index, function() {
				fn && fn();
			});
		},
		animate: function(index, fn) {
			if (this.animated) return;
			var start = this.index,
				end = index + this.length * this.count,
				change = end - start,
				duration = this.duration,
				startTime = +new Date(),
				ease = this.easing,
				_this = this;
			this.animated = true;
			!function animate() {
				var nowTime = +new Date(),
					timestamp = nowTime - startTime,
					delta = ease(timestamp / duration),
					result = start + delta * change;
				result > end && (result = end);
				_this.scroll(result);
				if (duration <= timestamp) {
					_this.scroll(end);
					_this.animated = false;
					fn && fn();
				} else {
					setTimeout(animate, 20);
				}
			}();
		},
		scroll: function(v) {
			// console.log(v + '=======================01')
			this.index = Math.round(v) % this.length;
			if (this.index === this.oIndex) return;
			// console.log(this.index + '=============02')
			// this.index < 0 && (this.index = 0);
			this.index > this.length - 1 && (this.index = 0);
			this.next();
		},
		next: function() {
			this.els[this.index].className.indexOf(this.current) < 0 && (this.els[this.index].className += ' ' + this.current);
			this.els[this.oIndex].className = this.els[this.oIndex].className.replace(this.current, '');
			this.oIndex = this.index;
		},
		tween: {
			easeInOutQuad: function(pos) {
				if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2);
				return -0.5 * ((pos -= 2) * pos - 2);
			},
			easeInOutCubic: function(pos) {
				if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3);
				return 0.5 * (Math.pow((pos - 2), 3) + 2);
			},
			easeInOutSine: function(pos) {
				return (-0.5 * (Math.cos(Math.PI * pos) - 1));
			},
			easeInOutCirc: function(pos) {
				if ((pos /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
				return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
			}
		}
	};
	if (typeof define === 'function' && define.amd) {
		define('styleBox', [], function() {
			return styleBox;
		});
	} else {
		window.styleBox = styleBox;
	}
}(window, document));