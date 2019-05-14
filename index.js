// 通过id获取元素
function $(id) {
    return document.getElementById(id)
}

// 最外层盒子
let box = $("box")

// 箭头盒子
let arr_box = $("arr")

// 左箭头
let left_arr = $("left")

// 右箭头
let right_arr = $("right")

// 轮播图片区域宽度
let screenWidth = document.querySelector(".screen").offsetWidth

// 轮播ul
let ul_banner = document.querySelector(".screen > ul")

// 页码
let ol_banner_current = document.querySelectorAll(".screen > ol > li")

// 克隆轮播第一张图片 => 无缝轮播
ul_banner.appendChild(ul_banner.children[0].cloneNode(true))

//定时器
let timeId
timeId = setInterval(nextPage, 3000)

// 鼠标移入移除显示隐藏 箭头
box.onmouseover = function() {
    // 清除定时器 用户操作
    clearInterval(timeId)
    arr_box.style.display = "block"
}
box.onmouseout = function() {
    // 继续轮播 开启定时器
    timeId = setInterval(nextPage, 3000)
    arr_box.style.display = "none"
}

// 左右箭头事件 下一张 上一张
// 图片索引值
let index = 0

// 页码索引
let pageIndex = 0
right_arr.onclick = function() {
    nextPage()
}
left_arr.onclick = function() {
    // 判断是否是第一张 并且继续往左移动
    if (index == 0) {
        // 直接闪现到图片的倒数第二张(克隆前最后一张)
        index = ul_banner.children.length - 1
        ul_banner.style.left = `${-index*screenWidth}px`
    }
    // 索引每次减一
    index--
    pageIndex--
    // 判断是否页码在第一个 并且继续往左走 => 直接去最后一个页码
    if (pageIndex == -1) {
        pageIndex = ul_banner.children.length - 2
        setPageClass(ol_banner_current, pageIndex)
    }
    setPageClass(ol_banner_current, pageIndex)
    bannerAnimation(ul_banner, -index * screenWidth)
}

// 页码功能
for (let i = 0; i < ol_banner_current.length; i++) {
    // 设置自定义属性 存放索引
    ol_banner_current[i].setAttribute("index", i)
        // 设置点击事件 触发排他设置页码样式
    ol_banner_current[i].onclick = function() {
        // 轮播区域跟着页码点击一起移动
        index = +this.getAttribute("index")
        bannerAnimation(ul_banner, -index * screenWidth)
        setPageClass(ol_banner_current, +this.getAttribute("index"))
    }
}

/**
 * 设置页码样式
 * @param {*} el 页码
 * @param {*} thisIndex 高亮的元素索引
 */
function setPageClass(el, thisIndex) {
    // 循环排它
    for (let i = 0; i < el.length; i++) {
        el[i].removeAttribute("class")
    }
    // 设置高亮
    el[thisIndex].className = "current"
}

/**
 * 移动动画
 * @param {element} el 移动的元素
 * @param {number} target 目标位置
 */
function bannerAnimation(el, target) {
    // 设定定时器前先清理定时器
    clearInterval(el.timeId)

    // 将定时器id给元素里面的属性 定时器id唯一化 不会影响其他移动元素
    el.timeId = setInterval(() => {
        // 元素当前位置
        let count = el.offsetLeft

        // 每次走10 判断左走还是右走
        count += target > count ? 10 : -10

        // 判断是否还能继续走10 不能直接跳到目标位置 取绝对值 可能是负数
        count = Math.abs(target - count) > 10 ? count : target

        // 设置元素位置
        el.style.left = `${count}px`

        // 达到目标位置 结束定时器 => 结束动画
        if (target == count) {
            clearInterval(el.timeId)
        }
    }, 20)
}

/**
 * 下一张 => 定时轮播
 */
function nextPage() {
    // 判断是否是最后一张 => 闪现到第一张 => 无缝轮播
    if (index == ul_banner.children.length - 1) { // 5 = 5
        // 直接闪现到第一张图片即可
        index = 0
        ul_banner.style.left = `${-index*screenWidth}px`
    }
    // 索引每次加一
    index++
    // 页码索引加一
    pageIndex++
    // 判断是否页码到了最后一个 => 直接去第一个页码
    if (pageIndex == ul_banner.children.length - 1) {
        pageIndex = 0
        setPageClass(ol_banner_current, pageIndex)
    }

    // 页码样式
    setPageClass(ol_banner_current, pageIndex)

    // 调用动画函数
    bannerAnimation(ul_banner, -index * screenWidth)
}