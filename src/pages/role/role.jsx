import React, {Component} from 'react'
import {Card, Button, Icon, Table} from 'antd'
import {PageSize} from "../../utils/constants";

export default class Role extends Component {

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time'
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }]
    }

    onRow = (record) => {
        return {
            onClick: event => {
                console.log(record)
            }, // 点击行
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    render() {
        const title = (
            <span>
                <Button>创建角色</Button>
                <Button>设置角色权限</Button>
            </span>
        )

        const roles = [
            {
                _id: '1',
                name: '测试',
                create_time: 1589969835,
                auth_time: 1589969835,
                auth_name: 'admin'
            },
            {
                _id: '2',
                name: '开发',
                create_time: 1589969435,
                auth_time: 1589965835,
                auth_name: 'admin'
            },
            {
                _id: '3',
                name: '运维',
                create_time: 1589969835,
                auth_time: 1589969135,
                auth_name: 'admin'
            }
        ];

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey="_id"
                    pagination={{defaultPageSize: PageSize}}
                    dataSource={roles}
                    columns={this.columns}
                    rowSelection={{type: "radio"}}
                    onRow={this.onRow}
                />
            </Card>
        )
    }
}