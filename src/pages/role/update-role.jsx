import React, {Component} from 'react'
import {
    Form,
    Input,
    Tree
} from 'antd'
import PropTypes from "prop-types"
import menuList from '../../config/menuConfig'

const Item = Form.Item

const {TreeNode} = Tree


export default class UpdateFrom extends Component {

    static propTypes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props);
        const menus = this.props.role.menus
        this.state = {
            checkedKeys: menus,
        }
    }

    // 当组件接收到新的属性时自动调用
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus,
        })
    }

    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode key={item.key} {...item} />
        })


    onCheck = checkedKeys => {
        this.setState({checkedKeys})
    }

    getCheckKeys = () => {
        return this.state.checkedKeys
    }

    render() {
        const {role} = this.props
        return (
            <Form>
                <Item label="角色名称" wrapperCol={{span: 15}} labelCol={{span: 4}}>
                    <Input value={role.name} disabled/>
                </Item>
                <Item>
                    <Tree
                        checkable
                        defaultExpandAll={true}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}>
                        <TreeNode title="平台权限" key="/all">
                            {this.renderTreeNodes(menuList)}
                        </TreeNode>
                    </Tree>
                </Item>
            </Form>
        )
    }
}
