import React, {Component} from 'react'
import {Card, Button, Icon, Table, message, Modal} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategories, reqUpdateCategory, reqAddCategory} from '../../api/index'
import AddForm from "./add-form";
import UpdateForm from "./update-form";

export default class Category extends Component {

    state = {
        loading: false,
        categories: [],
        parentId: '0', // 初始化为‘0’，获取一级菜单
        parentName: '', // 获取二级菜单之前，保存父级title
        subCategories: [], // 二级菜单内容
        showStatus: 0 // 默认是0，都不显示，1显示添加对话框，2显示更新对话框
    }


    getCategories = async (parentId) => {

        parentId = parentId || this.state.parentId

        this.setState({loading: true})
        const result = await reqCategories(parentId)
        if (result.status === 0) {
            // 根据parentId判断是否是一级菜单，默认是一级菜单
            if (parentId === "0") {
                this.setState({categories: result.data})
            } else {
                this.setState({subCategories: result.data})
            }

        } else {
            message.error("获取分类列表失败")
        }
        this.setState({loading: false})

    }

    // 根据一级类型获取二级类型对象列表
    showSubCategories = category => {
        // setState是异步同步数据，通过回调函数，在组件render之后在更新相应属性
        this.setState({parentId: category._id, parentName: category.name}, () => {
            this.getCategories()

        })
    }
    // 从二级类型返回到一级类型
    showCategories = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        })
    }

    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
        this.form.resetFields()
    }

    // 弹出添加对话框
    showAddCategory = () => {
        this.setState({
            showStatus: 1
        })
    }

    // 添加品类
    addCategory = () => {
        this.form.validateFields(async (error, values) => {
            if (!error) {
                // 隐藏弹出框
                this.setState({
                    showStatus: 0
                })
                // 准备数据
                const {parentId, categoryName} = values
                // 清空输入框内容
                this.form.resetFields()
                // 发送请求数据
                const result = await reqAddCategory(categoryName, parentId)
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        this.getCategories()
                    } else if (parentId === '0') {
                        this.getCategories('0')
                    }
                }
            }
        })

    }

    // 弹出添加对话框
    showUpdateCategory = (category) => {
        this.category = category
        this.setState({
            showStatus: 2
        })
    }

    // 添加品类
    updateCategory = () => {
        this.form.validateFields(async (error, values) => {
            if (!error) {
                // 1.隐藏对话框
                this.setState({
                    showStatus: 0
                })
                // 2.准备数据
                const categoryId = this.category._id
                const form = this.form
                const categoryName = values
                form.resetFields()
                const result = await reqUpdateCategory({categoryId, categoryName})
                console.log(result)
                if (result.status === 0) {
                    // 3.重新渲染数据
                    this.getCategories()
                }
            }
        })
    }

    initColumns = () => [
        {
            title: '分类名称',
            dataIndex: 'name',
        },
        {
            title: '操作',
            width: 300,
            render: (category) => {
                return (
                    <span>
                            <LinkButton onClick={() => this.showUpdateCategory(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ?
                            <LinkButton onClick={() => this.showSubCategories(category)}>查看子分类</LinkButton> : null}
                        </span>
                )
            }

        }
    ];

    componentWillMount() {
        this.columns = this.initColumns()
    }

    componentDidMount() {
        this.getCategories()
    }

    render() {
        const category = this.category || {}
        const {categories, loading, parentId, subCategories, parentName} = this.state
        const title = parentId === '0' ? '一级分类列表' : (<span>
            <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
            <Icon type="arrow-right" style={{marginRight: 5}}/>
            <span>{parentName}</span>
        </span>)


        const extra = (
            <Button type='primary' onClick={this.showAddCategory}>
                <Icon type='plus'/>
                <span>添加</span>
            </Button>
        )


        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    rowKey='_id'
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                    dataSource={parentId === '0' ? categories : subCategories} columns={this.columns}/>

                <Modal
                    title="添加分类"
                    visible={this.state.showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}>
                    <AddForm categories={categories} parentId={parentId} setForm={(form) => {
                        this.form = form
                    }}/>
                </Modal>
                <Modal
                    title="更新分类"
                    visible={this.state.showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}>
                    <UpdateForm categoryName={category.name} setForm={(form) => {
                        this.form = form
                    }}/>
                </Modal>
            </Card>
        )
    }
}