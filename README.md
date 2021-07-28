# slideShow.js
使用原生JS编写的PC端轮播图插件
## 前言
轮播图部分是网站开发中经常需要实现的部分，所以将实现代码封装成一个插件使用。作者正处于JS学习阶段所以插件使用原生JS编写，借插件编写的过程巩固自己所学的知识。
## 功能&介绍
* 目前实现的功能有：自动轮播、左右按钮点击切换、底部小圆点点击切换
* 没有引用第三方插件库，原生js，封装一个Slideshow构造函数，在实例化对象时动态生成轮播图，代码量200行
*  作者预设置了轮播图部分的CSS样式，可以在此基础上修改为自己喜欢的样式
## 展示界面&源码获取
- 演示地址：[在线浏览地址](https://eatpear.github.io/slideShow/test.html)
- github地址：[仓库地址](https://github.com/eatpear/slideShow/tree/master)
## 使用
1.复制github仓库下面，js文件下的slideShow.js放到自己项目文件中

2.复制github仓库下面，css文件下的slideShow.css放到自己项目文件中

3.在页面中引入

   ``` html
   <!DOCTYPE html>
   <html lang="zh-CN">

   <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>slideShow轮播图插件</title>
    <!-- 引入slideShow.css -->
    <link rel="stylesheet" href="css/slideShow.css">
   </head>

   <body>
    <!-- 引入slideShow.js，要放在实例化对象代码的前面 -->
    <script src="js/slideShow.js"></script>
   </body>

   </html>
   ```
   
   4.需要轮播图，则实例化slideShow对象
   
   ``` javascript
   var box = document.querySelector("#box");
        var imagesUrlAndHref = [{
            imgSrc: 'images/1.webp',
            linkHref: "#"
        }, {
            imgSrc: 'images/2.webp',
            linkHref: '#'
        }, {
            imgSrc: 'images/3.webp',
            linkHref: '#'
        }, {
            imgSrc: 'images/4.webp',
            linkHref: '#'
        }, {
            imgSrc: 'images/5.webp',
            linkHref: '#'
        }];
        var slideShow = new Slideshow(box, imagesUrlAndHref, {
            duration: 800, // 动画过渡时间，默认为800ms
            intervalTime: 5000, // 图片切换时间，默认为5s
            timingFunction: 'linear',//动画运动函数
        });
   ```
   
   ## API
   ``` javascript
   //构造的对象
   new Slideshow (ele,imagesUrlAndHref,JSON)
   ```
   
   | 属性           | 说明                                       | 备注备注                        |
| ------------ | :--------------------------------------- | --------------------------- |
| ele           | 对象，你需要创建轮播图的包裹(父级)元素                        | 必须传递一个对象否则报错                        |
| imagesUrlAndHref | 数组,成员为对象  linkHref => 图片点击链接；imgSrc => 图片地址 | 必须传递一个数组，数组中每个成员必须为对象，对象必须设置imgSrc属性否则报错，linkHref为可选属性                        |
| JSON         | 对象，duration => 动画过渡时间， intervalTime => 动画切换时间，timingFunction => 动画运动函数 | 可选参数，默认:过渡时间 => 800ms 切换时间 => 5000ms 动画运动函数 => 'ease'|
