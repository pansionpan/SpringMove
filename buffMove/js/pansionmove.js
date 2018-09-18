//弹性运动v1.0
/**
 * 参数:
 * 运动元素名:obj
 * 运动方式:type
 * 运动时间:tm
 * 缓冲运动参数:value
 * 运动距离:target
 * 运动方向:dir
 * 弹性系数:buff(越大越快)
 * 弹性运动最远距离:far
 * @param {Object} obj
 * @param {Object} style
 */

function getCss(obj, style) {
	//兼容获取元素的css样式
	//在IE中获取到的颜色是16进制的,在火狐谷歌中获取的颜色是rgb模式的
	//getComputedStyle:获取元素css样式，只兼容火狐谷歌浏览器
	if(window.getComputedStyle) {
		return getComputedStyle(obj)[style];
	}
	//currentStyle:获取元素css样式，只兼容IE浏览器
	return obj.currentStyle[style];
}

//定义调用JSON数组
function panmove(json) {
	var obj = json.obj;
	var dir = json.dir;
	var tm = json.tm;
	tm = Number(tm) || 20;
	//样式默认值为'left'
	dir = dir || 'left';
	var value = json.value;
	//移动距离
	var target = json.target;
	target = Number(target) || 200;
	if(isNaN(Number(target))){
        target = 200;
    }else{
        target = Number(target);
    }
	//弹性运动中声明元素从目标点到最远点的距离
	var far = target;
	//声明步长值step
	var step = 0;
	//声明元素当前位置值cur
	var cur = parseFloat(getCss(obj, dir));
	if(cur == target) return;
	var type = json.type;
	var fn = json.fn;
	//弹性系数
	var buff = json.buff;
	buff = Number(buff) || 0.7;
	//损耗系数
	var buffs = json.buffs;
	buffs = Number(buffs) || 0.7;
	
	
	
	
	//如果没有建立定时器对象，则在obj下建立定时器对象
	if(!obj.timer) {
		obj.timer = {};
	}
	//清除定时器
	if(obj.timer[dir]) {
		return;
	}
	//开启定时器
	obj.timer[dir] = setInterval(function() {
		//更新当前值
		cur = parseFloat(getCss(obj, dir));
		//定义两种运动方式
		switch(type) {
			case 'linear':
				step = Number(step) || 10;
				//元素运动
				obj.style[dir] = cur + step + 'px';
				
				
				//如果元素位置超过target值停止运动
				if(parseFloat(getCss(obj, dir)) > target) {
					obj.style[dir] = cur - step + 'px';
				}
				
				if(parseFloat(getCss(obj, dir)) == target){
					obj.style[dir] = target + 'px';
					clearInterval(obj.timer[dir]);
					obj.timer[dir] = 0;
				}
				break;
			case 'ease':
				//处理到不了目标点的问题 大于零向上舍入，小于零向下舍入
				cur = cur > 0 ? Math.ceil(cur) : Math.floor(cur);
				//将value赋值为0.1
				value = Number(value) || 0.1;
				//更新步长值
				step = (target - cur) * value;
				//元素运动
				obj.style[dir] = cur + step + 'px';
				//如果元素位置超过target值停止运动
				if(parseFloat(getCss(obj, dir)) > target) {
					step = (target - cur) * (-value);
					obj.style[dir] = cur - step + 'px';
				}
				
				if(parseFloat(getCss(obj, dir)) == target){
					obj.style[dir] = target + 'px';
					clearInterval(obj.timer[dir]);
					obj.timer[dir] = 0;
				}
				break;
			case 'buffer':
				 //更新弹性距离
		        far= target - cur;
		        //弹力影响
		        step += far * buff;
		        //阻力影响
		        step = step * buffs;
		        //防止弹性过界
		        //IE8-浏览器存在弹性过界问题，当宽度width或高度height等不能出现负值的样式出现负值时将会报错。所以，需要判断样式为高度或宽度时，样式值小于0时，等于0
		        if((dir == 'height' || dir == 'width') && (cur + step) < 0){
		            obj.style[dir] = 0;
		        }else{
		            obj.style[dir] = cur + step + 'px';
		        }
		        if(parseFloat(getCss(obj, dir)) > target) {
		        	far= cur - target;
		      		step += far * (-buff);
		        	step = step * (-buffs);
					if((dir == 'height' || dir == 'width') && (cur + step) < 0){
			            obj.style[dir] = 0;
			        }else{
			            obj.style[dir] = cur - step + 'px';
		        }
				}
		        
		        //当元素的步长值接近于0，并且弹性距离接近于0时，停止定时器
		        if(Math.round(step) == 0 && Math.round(far) == 0){
		            obj.style[dir] = target + 'px';
		            clearInterval(obj.timer[dir]);
		            obj.timer[dir] = 0;
		            fn && fn.call(obj);    
		        }    
				break;
			default:
				step = 10;
		}

	}, tm);
}
