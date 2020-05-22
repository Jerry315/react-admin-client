import React, {PureComponent} from 'react'
import {
    Form,
    Input,
    Select
} from 'antd'
import PropTypes from "prop-types"

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
    }

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }


    render() {
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 15},
        };

        const {roles, user} = this.props
        return (
            <Form {...formItemLayout}>
                <Item label="用户名">
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [
                            {required: true, message: "用户名必须输入"},
                        ]
                    })(
                        <Input placeholder="请输入用户名"  disabled={user._id ? true : false}/>
                    )}
                </Item>
                {user._id ? null : <Item label="密码">
                    {getFieldDecorator('password', {
                        initialValue: user.password,
                        rules: [
                            {required: true, message: "密码必须输入"},
                        ]
                    })(
                        <Input type="password" placeholder="请输入密码"/>
                    )}
                </Item>}
                <Item label="邮箱">
                    {getFieldDecorator('email', {
                        initialValue: user.email
                    })(
                        <Input placeholder="请输入邮箱"/>
                    )}
                </Item>
                <Item label="电话">
                    {getFieldDecorator('phone', {
                        initialValue: user.phone
                    })(
                        <Input placeholder="请输入电话"/>
                    )}
                </Item>
                <Item label="角色">
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id
                    })(
                        <Select>
                            {roles.map(role => <Option value={role._id} key={role._id}>{role.name}</Option>)}
                        </Select>
                    )}
                </Item>

            </Form>
        )
    }

}

export default Form.create()(UserForm)