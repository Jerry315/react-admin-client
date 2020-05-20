import React, {Component} from 'react'
import {Card, Icon, List} from 'antd'
import './product.less'
import {BaseImgUrl} from '../../utils/constants'
import {reqCategory} from '../../api/index'


const Item = List.Item

// 查看商品详情子路由组件
export default class ProductDetail extends Component {
    state = {
        pName: '',
        cName: ''
    }

    async componentDidMount() {
        const {categoryId} = this.props.location.state.product
        console.log(categoryId)
        const result = await reqCategory(categoryId)

        const {parentId, name} = result.data
        if (parentId === '0') {
            this.setState({
                pName: name
            })
        } else {
            const result1 = await reqCategory(parentId)
            const pName = result1.data.name
            this.setState({
                pName,
                cName: name
            })
        }

    }

    render() {
        const title = (
            <span>
                <Icon type="arrow-left" style={{color: 'green'}} onClick={() => this.props.history.goBack()}/>
                <span style={{marginLeft: 15}}>商品详情</span>
            </span>
        )
        const {name, desc, price, imgs, detail} = this.props.location.state.product
        const {cName, pName} = this.state

        return (


            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>{pName} {cName ? ' --> ' + cName : ''}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            {imgs.map(img => <img src={BaseImgUrl + img} key={img} alt="img"/>)}
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}