import React from "react";
import {Upload, Icon, Modal, message} from 'antd';
import PropTypes from 'prop-types'
import {BaseImgUrl} from '../../utils/constants'
import {reqDelPicture} from "../../api";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array // imgs为数组，非必传
    }

    constructor(props) {
        super(props);
        // 初始化fileList，
        let fileList = []

        const {imgs} = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BaseImgUrl + img
            }))
        }

        this.state = {
            previewVisible: false, // 是否显示大图
            previewImage: '', // 大图的url
            fileList,
        };
    }


    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({file, fileList}) => {
        console.log("handleChange(): ", file, fileList)
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success("上传图片成功")
                file = fileList[fileList.length - 1]
                file.url = BaseImgUrl + file.name
            } else {
                message.error("图片上传失败")
            }
        } else if (file.status === 'removed') {
            const result = await reqDelPicture(file.name)
            if (result.status === 0) {
                message.success("图片删除成功")
            } else {
                message.error("图片删除失败")
            }
        }
        this.setState({fileList})
    };

    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload" // 上传图片地址
                    accept="image/*" // 只接受图片格式
                    listType="picture-card" // 卡片样式
                    name="image" // 请求参数名
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

