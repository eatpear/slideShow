//Slideshow构造函数
function Slideshow(ele, imagesUrlAndHref, JSON) {
    //格式检查并为实例化对象设置属性部分
    if (this.checkEle(ele)) {
        this.ele = ele;
    } else {
        return;
    }
    if (this.checkImagesUrlAndHref(imagesUrlAndHref)) {
        this.imagesUrlAndHref = imagesUrlAndHref;
    } else {
        return;
    }
    this.setJSON(JSON);


    this.index = 1;                                                                     //当前处于第几张图片
    this.isLock = false;                                                                //是否为动画上锁状态
    this.init();                                                                        //初始化界面方法
}


Slideshow.prototype.checkEle = function (ele) {
    if (typeof ele === "object" && Array.isArray(ele) === false && ele !== null) {          //类型检查看ele是否为有效包裹元素
        return true;
    } else {
        console.log("传入的轮播图包裹元素有误！");
        return false;
    }
}

Slideshow.prototype.checkImagesUrlAndHref = function (imagesUrlAndHref) {
    if (Array.isArray(imagesUrlAndHref) === false) {                                        //类型检查看imagesUrlAndHref是否为数组
        console.log("传入图片地址及目标链接有误，请传入数组！");
        return false;
    }
    let isObj = imagesUrlAndHref.every(function (item) {
        return typeof item === "object" && Array.isArray(item) === false && item !== null   //类型检查看imagesUrlAndHref成员是否都为对象
    });
    if (!isObj) {
        console.log(`请确保imagesUrlAndHref数组中成员都为对象`);
        return false;
    }
    for (let i = 0; i < imagesUrlAndHref.length; i++) {                                     //类型检查看imagesUrlAndHref成员是否有imgSrc属性
        if ("imgSrc" in imagesUrlAndHref[i] === false) {
            console.log(`请为${JSON.stringify(imagesUrlAndHref[i])}设置imgSrc属性`);
            return false;
        }
    }
    return true;
}

Slideshow.prototype.setJSON = function (JSON) {
    if (typeof JSON === "object" && Array.isArray(JSON) === false && JSON !== null) {
        this.duration = typeof JSON.duration === "number" ? JSON.duration : 800;                        //动画持续时间，默认为800ms
        this.intervalTime = typeof JSON.intervalTime === "number" ? JSON.intervalTime : 5000;           //自动切换间隔时间，默认为5000ms
        this.timingFunction = JSON.timingFunction || 'ease';                                            //运动函数，默认为ease
    } else {
        this.duration = 800;
        this.intervalTime = 5000;
        this.timingFunction = 'ease';
    }
}


//把方法放在构造函数原型上使所有实例化对象共享这个方法，init方法作用是添加dom节点初始化界面
Slideshow.prototype.init = function () {
    //根据ele的宽度和图片的张数添加动态CSS
    let cssStr = `.slideShowClient .slideShowAll {width: ${this.ele.clientWidth * (this.imagesUrlAndHref.length + 2)}px}.slideShowClient .slideShowAll .slideShowItem{width:${this.ele.clientWidth}px}`;
    let styleObj = document.createElement("style");
    styleObj.innerHTML = cssStr;
    document.head.appendChild(styleObj);

    //添加dom节点初始化界面
    var html = `<div class = "slideShowClient">
                    <div class = "slideShowAll" style = "left: -${this.ele.clientWidth}px">`;
    let str = `<div class = "slideShowItem">
                    <a href = "${this.imagesUrlAndHref[this.imagesUrlAndHref.length - 1].linkHref || '#'}"><img src = "${this.imagesUrlAndHref[this.imagesUrlAndHref.length - 1].imgSrc}"></a>
               </div>`;
    this.imagesUrlAndHref.forEach((item) => {
        str += `<div class = "slideShowItem">
                    <a href = "${item.linkHref || '#'}"><img src = "${item.imgSrc}"></a>
                </div>`;
    });
    str += `<div class = "slideShowItem">
                <a href = "${this.imagesUrlAndHref[0].linkHref || '#'}"><img src = "${this.imagesUrlAndHref[0].imgSrc}"></a>
            </div>`;
    str += `</div>`;
    //添加下面圆点
    str += `<div class ="slideShowTool">
                <div class = "slideShowSpot slideShowSpot-active"></div>`;
    for (let i = 0; i < imagesUrlAndHref.length - 1; i++) {
        str += `<div class = "slideShowSpot"></div>`;
    }
    str += `</div>`;
    //添加左右2个按钮
    str += `<div class="slideShow-btn slideShow-btn-left">&lt;</div>
            <div class="slideShow-btn slideShow-btn-right">&gt;</div>`;
    html += str;
    this.ele.innerHTML = html + `</div>`;

    //调用绑定函数
    this.bindEvent();
};


Slideshow.prototype.bindEvent = function () {
    //获取要操作的元素
    this.slideShowClient = this.ele.querySelector(".slideShowClient");
    this.slideShowAll = this.ele.querySelector(".slideShowAll");
    this.slideShowTool = this.ele.querySelector(".slideShowTool");
    this.slideShowSpot = this.ele.querySelectorAll(".slideShowSpot");
    this.slideShowBtnLeft = this.ele.querySelector(".slideShow-btn-left");
    this.slideShowBtnRight = this.ele.querySelector(".slideShow-btn-right");

    //开启自动轮播
    var timer = setInterval(autoPlay.bind(this), this.intervalTime);       //在bindEvent作用域下this为Slideshow实例化对象，绑定给autoPlay函数
    this.ele.addEventListener('mouseover', () => { clearInterval(timer); });
    this.ele.addEventListener('mouseout', () => { timer = setInterval(autoPlay.bind(this), this.intervalTime); });

    //左右按钮 事件监听
    this.slideShowBtnLeft.addEventListener('click', () => {
        if (this.isLock) return;
        this.index--;
        //调用渲染函数
        this.render();
    });
    this.slideShowBtnRight.addEventListener('click', () => {
        if (this.isLock) return;
        this.index++;
        //调用渲染函数
        this.render();
    });

    //小圆点事件监听,事件委托给父元素
    this.slideShowTool.addEventListener('click', e => {
        let obj = e.target;
        if (obj.className === `slideShowSpot slideShowSpot-active`) return; //如果就是点击当前页面对应的小圆点则无需操作
        this.spotClick(obj);
    });
};

//小圆点点击事件
Slideshow.prototype.spotClick = function (obj) {
    for (let i = 0; i < this.slideShowSpot.length; i++) {
        if (this.slideShowSpot[i] === obj) {
            this.index = i + 1;
            this.render();
            break;
        }
    }
};

Slideshow.prototype.render = function () {
    if (this.isLock) return;
    //渲染过程中对其它操作上锁
    this.isLock = true;
    this.slideShowAll.style.left = (-1) * this.ele.clientWidth * this.index + 'px';
    this.slideShowAll.style.transition = `left ${this.duration / 1000}s ${this.timingFunction}`;

    //渲染下面的小圆点
    this.renderSpot();

    setTimeout(() => {
        //动画完成后添加判断，防止出界
        if (this.index === 0) {
            this.index = this.imagesUrlAndHref.length;
            this.slideShowAll.style.left = (-1) * this.ele.clientWidth * this.index + 'px';
            this.slideShowAll.style.transition = `0s`;
        } else if (this.index === this.imagesUrlAndHref.length + 1) {
            this.index = 1;
            this.slideShowAll.style.left = (-1) * this.ele.clientWidth * this.index + 'px';
            this.slideShowAll.style.transition = `0s`;
        }
        //开锁
        this.isLock = false;
    }, this.duration);
};

Slideshow.prototype.renderSpot = function () {
    //将小圆点的顺序与用户看到的图片顺序对应起来
    let flag = this.index;
    if (this.index === 0) {
        flag = this.imagesUrlAndHref.length;
    } else if (this.index === this.imagesUrlAndHref.length + 1) {
        flag = 1;
    }
    //遍历所有小圆点元素，将当前所在的图片对应顺序小圆点的CSS样式设为激活样式
    for (let i = 0; i < this.slideShowSpot.length; i++) {
        if (i === (flag - 1)) {
            this.slideShowSpot[i].className = `slideShowSpot slideShowSpot-active`;
        } else {
            this.slideShowSpot[i].className = `slideShowSpot`;
        }
    }
};

//自动轮播函数
function autoPlay() {
    if (this.isLock) return;
    this.index++;
    this.render();
}

