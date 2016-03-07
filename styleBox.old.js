/**
 * LBS styleBox 九宫格抽奖 不能确定动画持续时间 
 * Date: 2012-03-25
 * ====================================================
 * opts.idPart 集合中每一项的id中相同的部分 必需设置
 * opts.idDigit 集合中每一项的id中不同的部分 第一项开始的数字
 * opts.legnth 集合中共有几项 必需设置
 * opts.current 集合中当前项添加的类名 默认'current'
 * ====================================================
 * this.start(ZJid,fn) 开始调用动画 
 	ZJid 集合中哪一项为中奖结果 索引值 从0开始 最一项为opts.length
	fn 动画完成后
 * ====================================================
 **/
var styleBox = function(opts) {
	opts = opts || {};
	if (typeof opts.idPart === undefined || typeof opts.length === undefined) return;
	this.idPart = opts.idPart;
	this.length = opts.length;
	this.idDigit = opts.idDigit;
	this.current = opts.current || 'current';
	this.step = 50;
	this.time = 300;
	this.arr = [];
	this.index = this.oIndex = 0;
	this.timer = null;
	this.init();
};
styleBox.prototype = {
	init: function() {
		var start = this.idDigit,
			end = this.length + start - 1,
			i = start;
		for (; i <= end; i++) this.arr.push(document.querySelector('#' + this.idPart + i));
	},
	start: function(ZJid, fn) {
		var _this = this;
		this.fast(function(time) {
			_this.timer = setInterval(function() {
				_this.next();
			}, time);
			setTimeout(function() {
				clearInterval(_this.timer);
				_this.slow(function(time) {
					_this.check(time, ZJid, fn);
				});
			}, 2000);
		});
	},
	check: function(time, ZJid, fn) {
		var _this = this;
		!function check() {
			if (_this.index !== ZJid) {
				_this.next();
				setTimeout(check, time);
				time += _this.step;
			} else {
				fn && fn(ZJid);
			}
		}();
	},
	next: function() {
		this.index++;
		this.index > this.length - 1 && (this.index = 0);
		this.arr[this.index].className.indexOf(this.current) < 0 && (this.arr[this.index].className += ' ' + this.current);
		this.arr[this.oIndex].className = this.arr[this.oIndex].className.replace(this.current, '');
		this.oIndex = this.index;
	},
	fast: function(fn) {
		var maxTime = this.time,
			minTime = this.step,
			step = this.step,
			_this = this;
		!function fast() {
			if (maxTime > minTime) {
				maxTime -= step;
				_this.next();
				setTimeout(fast, maxTime);
			} else {
				fn && fn(maxTime);
			}
		}();
	},
	slow: function(fn) {
		var maxTime = this.time,
			minTime = this.step,
			step = this.step,
			_this = this;
		!function slow() {
			if (minTime < maxTime) {
				minTime += step;
				_this.next();
				setTimeout(slow, minTime);
			} else {
				fn && fn(minTime);
			}
		}();
	}
};