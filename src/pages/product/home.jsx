import React, {Component} from 'react'
import {Select, Icon, Table, Input, Card, Button, message} from 'antd'
import LinkButton from "../../components/link-button";
import {reqProducts, reqUpdateProduct} from '../../api/index'
import {PageSize} from '../../utils/constants'

const Option = Select.Option

// 默认子路由组件
export default class ProductHome extends Component {

    state = {
        total: 0,
        products: [],
        searchName: '',
        searchType: 'productName'
    }

    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => "￥" + price
            },
            {
                width: 100,
                title: '状态',
                render: (product) => {
                    const {status} = product
                    return (
                        <span>
                        <Button
                            type="primary"
                            onClick={() => this.changeProductStatus(product._id, status)}
                        >
                            {status === 1 ? '下架' : '上架'}
                        </Button>
                        <span>{status === 1 ? '在售' : '停售'}</span>
                    </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                        <LinkButton
                            onClick={() => this.props.history.push("/product/detail", {product})}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push("/product/addUpdate",product)}>修改</LinkButton>
                    </span>
                    )
                }
            },
        ];
    }

    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        const {searchName, searchType} = this.state
        let request
        if (searchName === '') {
            request = await reqProducts(pageNum, PageSize)
        } else {
            request = await reqProducts(pageNum, PageSize, searchName, searchType)
        }
        if (request.status === 0) {
            const {total, list} = request.data
            this.setState({
                total,
                products: list
            })
        }
    }

    changeProductStatus = async (productId, status) => {
        if (status === 1) {
            status = 2
            message.success("商品下架成功")
        } else {
            status = 1
            message.success("商品上架成功")
        }
        await reqUpdateProduct(productId, status)
        this.getProducts(this.pageNum)
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const {total, products, searchName, searchType} = this.state
        const title = (
            <span>
                <Select value={searchType} style={{width: 150}} onChange={value => this.setState({searchType: value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder="请输入关键字" style={{width: 150, margin: "0 15px"}} value={searchName}
                       onChange={event => this.setState({searchName: event.target.value})}/>
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>

            </span>

        )

        const extra = (
            <Button onClick={() => this.props.history.push("/product/addUpdate")} type="primary">
                <Icon type="plus"/>
                添加商品
            </Button>
        )


        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey="_id"
                    pagination={{
                        pageSize: PageSize,
                        total: total,
                        defaultPageSize: PageSize,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                    dataSource={products}
                    columns={this.columns}/>
            </Card>
        )
    }
}