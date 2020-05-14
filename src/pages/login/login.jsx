import React, {Component} from "react";
import {Redirect} from 'react-router-dom'
import './login.less'
import logo from '../../assets/images/logo.png'
import {Form, Icon, Input, Button, message} from 'antd';
import {reqLogin} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from "../../utils/storageUtils";


// 登录路由组件
class Login extends Component {


    handleSubmit = (event) => {
        // 阻止表单默认事件
        event.preventDefault();

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {username, password} = values
                const result = await reqLogin(username, password)
                if (result.status === 0) {
                    console.log("登录成功")
                    memoryUtils.user = result.data
                    storageUtils.saveUser(result.data)
                    this.props.history.replace("/")
                } else {
                    message.error(result.msg)
                }

            } else {
                console.log("校验失败")
            }
        });
    };

    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback("密码必须输入")
        } else if (value.length < 4) {
            callback("密码长度不能小于4")
        } else if (value.length > 12) {
            callback("密码长度不能大于12")
        } else if (!/^[A-Za-z0-9_]+$/.test(value)) {
            callback("密码必须是英文、数字或者下划线组成")
        } else {
            callback()
        }
    }

    render() {

        const user = memoryUtils.user
        if (user._id){
            return <Redirect to="/"/>
        }

        const form = this.props.form
        const {getFieldDecorator} = form
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [
                                    {required: true, whiteSpace: true, message: "用户名必须输入"},
                                    {min: 4, message: "用户名至少4位"},
                                    {max: 12, message: "用户名不能超过12位"},
                                    {pattern: /^[a-zA-Z0-9_]+$/, message: "用户名必须是英文、数字或者下划线组成"}
                                ],
                                initialValue: 'admin'
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="用户名"/>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{validator: this.validatePwd}]
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="password"
                                    placeholder="密码"/>
                            )}
                        </Form.Item>
                        <Form.Item>

                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

// 高阶函数
// 1）一类特别的函数
//      接受函数类型的参数
//      返回值是函数
// 2）常见
//      定时器：setTimeout()/setInterval()
//      Promise: Promise(() => {}) then(value => {},reason =>{})
//      数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
//      函数对象的bind()
//      Form.create()
// 3）高阶函数更新动态，更加具有扩展性
// 高阶组件
// 1) 本质就是一个函数
// 2）接受一个组件（被包装组件），返回一个新的组件，新组件内部渲染被包装组件，包装组件会向被包装组件传入特定属性
// 3）作用：扩展组件的功能
// 4）高阶组件也是高阶函数：接受一个组件函数，返回是一个新的组件函数
// 包装Form组件，生成一个新的组件：Form(Login)
// 新组件回想Form组件穿戴一个强大的对象属性：form
const WrappedLogin = Form.create()(Login)
export default WrappedLogin


// 前台表单验证

/*
async和await
1.作用？
    简化promise对象的使用：不用再使用then()来指定成功/失败的回调函数
    以同步编码（没有回调函数）方式实现异步流程

2.那里写await？
    在返回promise的表达式左侧写await：不想要promist，想要promise异步执行的成功的value数据

3.那里写async
    await所在函数（最近的）定义的左侧写async
*/