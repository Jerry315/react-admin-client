/*
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/
import ajax from "./ajax"
import jsonp from 'jsonp'
import {message} from "antd";

export const reqLogin = (username, password) => ajax("/login", {username, password}, 'POST')
export const reqAddUser = (user) => ajax("/manage/user/add", user, 'POST')

/*
jsonp请求的接口请求函数
*/

export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // jsonp请求数据
        jsonp(url, {}, (error, data) => {
            // 返回结果错误为空，且数据状态为"success"
            if (!error && data.status === "success") {
                // 结构获取天气图片和天气状态
                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                // 成功返回数据
                resolve({dayPictureUrl, weather})
            } else {
                message.error(error)
            }
        })
    })
}

/*
jsonp解决ajax跨域的原理
    jsonp只能解决get类型的ajax请求跨域问题
    jsonp请求不是ajax请求，而是一般的get请求
基本原理：
    浏览器端：
        动态生成<script>来请求后台接口（src就是接口的url）
        定义好用于接收响应数据的函数，并将函数名通过请求参数提交给后台（如：callback=fn）
     服务器端：
        接收到请求处理产生结果数据后，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用
     浏览器端：
        收到响应自动执行函数调用的js代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据
*/

// 获取一级/二级分类的列表
export const reqCategories = (parentId) => ajax("/manage/category/list", {parentId})
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax("/manage/category/add", {categoryName, parentId}, "POST")
// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax("/manage/category/update", {
    categoryId,
    categoryName
}, "POST")

// 根据分类id获取分类信息
export const reqCategory = (categoryId) => ajax("/manage/category/info", {categoryId: categoryId})

// 获取商品列表
export const reqProducts = (pageNum, pageSize, searchName, searchType) => ajax("/manage/product/list", {
    pageNum,
    pageSize,
    searchName,
    searchType
})

// 添加或更新商品
export const reqAddOrUpdateProduct = (product) => ajax("/manage/product/" + (product._id ? 'update' : 'add'), {product}, "POST")

// 更新商品状态
export const reqUpdateProduct = (productId, status) => ajax("/manage/product/updateStatus", {productId, status}, "POST")

// 删除图片
export const reqDelPicture = (name) => ajax("/manage/img/delete", {name}, "POST")

// 获取所有角色列表
export const reqGetRoles = () => ajax("/manage/role/list")

// 添加角色
export const reqAddRole = (roleName) => ajax("/manage/role/add", {roleName}, "POST")

// 更新角色权限
export const reqUpdateRole = (role) => ajax("/manage/role/update", {role}, "POST")

// 获取用户
export const reqGetUsers = () => ajax("/manage/user/list")

// 删除用户
export const reqDelUser = (uid) => ajax("/manage/user/delete", {uid}, "POST")

// 添加或更新用户
export const reqAddOrUpdateUser = (user) => ajax("/manage/user/" + (user._id ? 'update' : 'register'), user, "POST")