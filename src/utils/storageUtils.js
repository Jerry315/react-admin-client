/*
保存用户数据在本地
*/
import store from 'store'

const USER_KEY = 'user_key'

export default {
    // 保存用户信息
    saveUser(user) {
        store.set(USER_KEY, user)
    },
    // 获取用户信息
    getUser() {
        return store.get(USER_KEY) || {}
    },
    // 删除用户信息
    removeUser() {
        store.remote(USER_KEY)
    }


}