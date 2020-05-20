/*
https://github.com/jpuri/react-draft-wysiwyg

*/

import React, {Component} from 'react';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from 'prop-types'
import {BaseImgUrl} from '../../utils/constants'


export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props)
        const html = this.props.detail
        if (html) {
            const contentBlock = htmlToDraft(html)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            this.state = {
                editorState,
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
            }
        }
    }

    // 输入过程中实时回调
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    const name = response.data.name
                    resolve({data: {link: BaseImgUrl + name}});
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render() {
        const {editorState} = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: "1px solid black", minHeight: 200, paddingLeft: 10}}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: {uploadCallback: this.uploadImageCallBack, alt: {present: true, mandatory: true}},
                }}
            />

        );
    }
}