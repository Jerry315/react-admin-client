import React, {Component} from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategories, reqCategory, reqAddOrUpdateProduct} from "../../api";
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'


const {Item} = Form
const {TextArea} = Input


// 修改和更新子路由组件
class AddUpdate extends Component {
    constructor(props) {
        super(props);
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    state = {
        options: [],
        category: {}
    };

    submit = () => {
        // 数据验证通过后，发送ajax请求
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const {categoriesIds, name, desc, price} = values
                let product = {desc, detail, imgs, name, price}
                if (categoriesIds.length > 1) {
                    const categoryId = categoriesIds[1]
                    product.categoryId = categoryId
                } else {
                    const categoryId = categoriesIds[0]
                    product.categoryId = categoryId
                }
                if (this.isUpdate) {
                    product._id = this.product._id
                }
                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
                }
            } else {
                message.error("获取数据失败")
            }


        })
    }

    initOptions = async (categories) => {
        let options = categories.map(category => ({
            value: category._id,
            label: category.name,
            isLeaf: false,
        }))

        // 是否是修改模式，如果是修改模式，则获取商品当前所处分类级别，默认选中分类
        const {isUpdate} = this
        const {category} = this.state
        if (isUpdate) {
            const parentId = category.parentId
            if (parentId !== '0') {
                const subCategories = await this.getCategories(parentId)
                const targetOption = options.find(option => option.value === parentId)
                const childOptions = subCategories.map(c => ({
                    label: c.name,
                    value: c._id,
                    isLeaf: true
                }))
                targetOption.children = childOptions

            }
        }

        this.setState({options})
    }

    getCategories = async (parentId) => {
        const result = await reqCategories(parentId)
        if (parentId === '0') {
            this.initOptions(result.data)
        } else {
            return result.data
        }

    }

    getCategory = async (categoryId) => {
        const result = await reqCategory(categoryId)
        this.setState({category: result.data})
    }

    validatePrice = (rule, value, callback) => {
        // 验证价格的自定义函数
        if (value * 1 > 0) {
            callback()
        } else {
            callback("价格必须大于0")
        }
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        // 根据选中的分类，请求获取二级分类
        const subCategories = await this.getCategories(targetOption.value)
        targetOption.loading = false;

        if (subCategories && subCategories.length > 0) {
            const childOptions = subCategories.map(c => ({
                label: c.name,
                value: c._id,
                isLeaf: true
            }))
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options],
        });

    };

    componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
        if (product) {
            this.getCategory(product.categoryId)
        }
    }

    componentDidMount() {
        this.getCategories("0")
    }

    render() {
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type="arrow-left" style={{fontSize: 20}}/>
                </LinkButton>

                <span>添加商品</span>
            </span>
        )

        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 8},
        };

        const {getFieldDecorator} = this.props.form

        const {isUpdate, product} = this

        const categoriesIds = []
        if (isUpdate) {
            const categoryId = product.categoryId
            const {category} = this.state

            if (category.parentId === '0') {
                categoriesIds.push(categoryId)
            } else {
                categoriesIds.push(category.parentId)
                categoriesIds.push(categoryId)
            }
        }


        return (
            <Card title={title}>
                <Form {...formItemLayout} >
                    <Item label="商品名称：">
                        {getFieldDecorator("name", {
                            initialValue: product.name,
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }]
                        })(<Input placeholder="请输入商品名称"/>)}

                    </Item>
                    <Item label="商品描述：">
                        {getFieldDecorator("desc", {
                            initialValue: product.desc,
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }]
                        })(<TextArea placeholder="请输入商品描述" autoSize/>)}
                    </Item>
                    <Item label="商品价格：">
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }, {validator: this.validatePrice}]
                        })(<Input type="number" placeholder="请输入商品价格" addonAfter="元"/>)}
                    </Item>
                    <Item label="商品分类：">
                        {getFieldDecorator('categoriesIds', {
                            initialValue: categoriesIds,
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }]
                        })(<Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />)}
                    </Item>
                    <Item label="商品图片：">
                        <PicturesWall ref={this.pw} imgs={product.imgs}/>
                    </Item>
                    <Item label="商品详情：" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={product.detail}/>
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(AddUpdate)

/*
1.子组件调用父组件的方法：将父组件的方法一函数属性的形式传递给子组件，子组件就可以调用
2.父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
*/

/*
使用ref
1.创建ref容器：this.pw = React.createRef()
2.将ref容器交给需要获取的标签元素：<PictureWall ref={this.pw} />
3.通过ref容器读取标签元素：this.pw.current
*/