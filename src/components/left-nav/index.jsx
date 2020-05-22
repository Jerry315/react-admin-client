import React, {Component} from 'react'
import './index.less'
import logo from '../../assets/images/logo.png'
import {Link, withRouter} from 'react-router-dom'
import menuList from "../../config/menuConfig";
import memoryUtils from '../../utils/memoryUtils'

import {Menu, Icon} from 'antd';

const {SubMenu} = Menu;


class LeftNav extends Component {


    /*
    判断当前登录用户对item是否有权限
    1.如果当前用户是admin，则不用判断
    2.如果当前item是公开的，不用过滤
    3.当前用户有此item的权限，key有没有在menus
    4.如果当前用户有此item的某个子item的权限
    */

    hasAuth = (item) => {
        const user = memoryUtils.user
        const menus = user.menus

        if (user.level === 1 || item.public || menus.indexOf(item.key) !== -1) {
            return true
        } else if (item.children) {
            return !!item.children.find(citem => menus.indexOf(citem.key) !== -1)
        }
        return false

    }

    // 根据menu的数据生成对应的标签数据
    // 使用map() + 递归调用
    // getMenuNodesMap = (menuList) => {
    //     return menuList.map(item => {
    //         if (this.hasAuth(item)) {
    //
    //             if (!item.children) {
    //                 return (
    //                     <Menu.Item key={item.key}>
    //                         <Link to={item.key}>
    //                             <Icon type={item.icon}/>
    //                             <span>{item.title}</span>
    //                         </Link>
    //                     </Menu.Item>
    //                 )
    //             } else {
    //                 return (
    //                     <SubMenu key={item.key}
    //                              title={<span> <Icon type={item.icon}/> <span>{item.title}</span> </span>}>
    //                         {this.getMenuNodesMap(item.children)}
    //                     </SubMenu>
    //                 )
    //             }
    //         }
    //
    //     })
    // }
    // 根据menu的数据生成对应的标签数据
    // 使用reduce() + 递归调用
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    const cItem = item.children.find(citem => path.indexOf(citem.key) === 0)
                    if (cItem) {
                        this.openKey = item.key
                    }
                    pre.push((
                        <SubMenu key={item.key}
                                 title={<span> <Icon type={item.icon}/> <span>{item.title}</span> </span>}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        }, [])
    }

    // 第一次render()之前执行一次
    // 为第一次render()准备数据（必须同步的）
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        const openKey = this.openKey
        let path = this.props.location.pathname
        if (path.indexOf("/product") === 0) {
            path = "/product"
        }

        const menuNodes = this.menuNodes
        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>

                <Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[openKey]}>
                    {menuNodes}
                </Menu>
            </div>
        )
    }
}

/*
widthRouter高阶组件，讲一个非路由组件变为路由组件
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递三个属性：history/location/match
*/

export default withRouter(LeftNav)