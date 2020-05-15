import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {Modal} from 'antd';

import './index.less'
import {reqWeather} from '../../api/index'
import {formatDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import menuList from "../../config/menuConfig";
import LinkButton from "../link-button";


class Header extends Component {

    state = {
        currentTime: formatDate(Date.now()),
        dayPictureUrl: '', // 天气图片url
        weather: '' // 天气图片文字
    }

    getWeather = (async city => {
        const {dayPictureUrl, weather} = await reqWeather(city)
        this.setState({dayPictureUrl, weather})
    })

    // 根据url获取url的title
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                // 在子路由没有嵌套的情况下
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = () => {

        Modal.confirm({
            content: '确定退出吗',
            onOk: () => {
                memoryUtils.user = {};
                storageUtils.removeUser();
                this.props.history.replace('/login')
            }
        })
    }

    // 第一次render()之后执行，一般在此执行异步操作：发ajax请求/启动定时器
    componentDidMount() {
        this.timer = setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        })
        this.getWeather('深圳')


    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        const {currentTime, dayPictureUrl, weather} = this.state
        const user = memoryUtils.user
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)