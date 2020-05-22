import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {PageSize} from "../../utils/constants";
import AddForm from "./add-role";
import {reqAddRole, reqGetRoles, reqUpdateRole} from '../../api/'
import UpdateForm from "./update-role";
import memoryUtils from '../../utils/memoryUtils'
import {formatDate} from '../../utils/dateUtils'


export default class Role extends Component {

    constructor(props) {
        super(props);
        this.updateRef = React.createRef()
        this.state = {
            roles: [],
            role: {},
            isShowAdd: false,
            isShowAuth: false

        }

    }


    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formatDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }]
    }

    getRoles = async () => {
        const result = await reqGetRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({roles})
        }
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({role})
            }, // 点击行
        }
    }
    addRole = () => {
        // 进行表单验证，只能通过了才提交
        this.form.validateFields(async (error, values) => {
            if (!error) {

                // 收集输入数据
                const {roleName} = values

                // 添加请求
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    message.success("添加角色成功")
                    const role = result.data
                    // 如果是修改state中对象的内容，建议使用函数方法
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                } else {
                    message.error("添加角色失败")
                }
                this.form.resetFields()
            } else {
                message.error("表单数据验证失败")
            }
        })


        // 根据结果提示/更新列表显示

        this.setState({isShowAdd: false})

    }

    updateRole = async () => {
        const user = memoryUtils.user
        const {role} = this.state
        let menus
        menus = this.updateRef.current.getCheckKeys()
        role.menus = menus
        role.auth_name = user.username
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            message.success("角色权限更新成功")
            this.getRoles()
        } else {
            message.error("角色权限更新失败")
        }
        this.setState({isShowAuth: false})

    }

    componentWillMount() {
        this.initColumns()
        this.getRoles()
    }

    render() {
        const {role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type="primary" disabled={!role._id}
                        onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        const {roles} = this.state

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey="_id"
                    pagination={{defaultPageSize: PageSize}}
                    dataSource={roles}
                    columns={this.columns}
                    rowSelection={{type: "radio", selectedRowKeys: [role._id],onSelect: (role)=>{
                        this.setState({role})
                        }}}
                    onRow={this.onRow}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => (this.setState({isShowAdd: false}, this.form.resetFields()))}>
                    <AddForm setForm={(form) => {
                        this.form = form
                    }}/>
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => this.setState({isShowAuth: false})}>
                    <UpdateForm role={role} ref={this.updateRef}/>
                </Modal>
            </Card>
        )
    }
}