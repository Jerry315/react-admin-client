import React, {PureComponent} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {PageSize} from "../../utils/constants";
import {formatDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import {reqGetUsers, reqGetRoles, reqDelUser, reqAddOrUpdateUser} from '../../api'
import UserForm from './user-form'

const {confirm} = Modal

export default class User extends PureComponent {

    state = {
        isShow: false,
        users: [],
        roles: {}
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: '角色名称',
                dataIndex: 'role_id',
                render: role_id => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.editUser(user)}>修改</LinkButton>
                            <LinkButton onClick={() => this.delUser(user)}>删除</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }
    getUsers = async () => {
        const r1 = reqGetRoles()
        const r2 = reqGetUsers()
        const [result1, result2] = await Promise.all([r1, r2])
        if (result1.status === 0) {
            const roles = result1.data
            this.roleNames = roles.reduce((pre, role) => {
                pre[role._id] = role.name
                return pre
            }, {})
            this.setState({
                roles
            })
        }
        if (result2.status === 0) {
            const users = result2.data["users"]
            this.setState({
                users
            })
        }
    }
    onOk = () => {
        this.setState({isShow: false})
        // 收集数据
        // 进行表单验证，只能通过了才提交
        this.form.validateFields(async (error, values) => {
            if (!error) {
                let {user} = this
                if (user && user._id) {
                    const {email, phone, role_id} = values
                    user.email = email
                    user.phone = phone
                    user.role_id = role_id
                } else {
                    user = values
                }
                // 提交请求
                const result = await reqAddOrUpdateUser(user)
                if (result.status === 0) {
                    message.success(`${user._id ? '更新' : '添加'}用户成功`)
                    // 重新渲染列表
                    this.getUsers()
                } else {
                    message.error(`${user._id ? '更新' : '添加'}用户失败`)
                }
            }
        })
        this.form.resetFields()
    }

    delUser = (user) => {
        confirm({
            title: `确定删除${user.username}用户吗？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                const result = await reqDelUser(user._id)
                if (result.status === 0) {
                    message.success("删除用户成功！")
                    this.getUsers()
                } else {
                    message.error("用户删除失败")
                }
            }
        });

    }

    editUser = (user) => {
        this.setState({isShow: true})
        this.user = user
    }

    showAdd = () => {
        this.setState({isShow: true})
        this.user = null
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users, isShow, roles} = this.state
        const title = (
            <span>
                <Button type="primary" onClick={this.showAdd}>创建用户</Button>
            </span>
        )
        const user = this.user || {}

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey="_id"
                    pagination={{defaultPageSize: PageSize}}
                    dataSource={users}
                    columns={this.columns}
                />

                <Modal
                    title={`${user._id ? '更新' : '添加'}用户`}
                    visible={isShow}
                    onOk={this.onOk}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({isShow: false})
                    }}>
                    <UserForm setForm={(form) => this.form = form} user={user} roles={roles}/>
                </Modal>
            </Card>
        )
    }
}