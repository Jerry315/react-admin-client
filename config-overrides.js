const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
    // 针对antd实现按需打包：根据import来打包（使用babel-plugin-import）
    fixBabelImports('antd', {
        libraryDirectory: 'es',
        style: true, // 自动打包相关的样式
    }),
    addLessLoader({
        lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
            javascriptEnabled: true,
            modifyVars: {'@primary-color': '#1DA57A'},
        },
    }),
);


