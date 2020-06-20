import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import appStore from './store/counter'
import { Provider } from '@tarojs/mobx'
import { loginAndGetOpenid } from './utils/common';



import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

// declare const wx

const store = {
  appStore
}


class App extends Component {

  componentDidMount () {
    wx.cloud.init({
      env: 'product-us5v2',
      traceUser: true
    });

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              appStore.setUserInfo(res.userInfo)
              loginAndGetOpenid(res.userInfo).then(ret => {
                Taro.setStorageSync('userInfo', JSON.stringify(ret))
              }).catch(err => {
                console.log('app err', err)
              })
            }
          })
        }
      }
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/list/index',
      'pages/about/index',
      'pages/add/index',
      'pages/party/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '素可乐™️工具箱',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#626567',
      selectedColor: '#2A8CE5',
      backgroundColor: '#FBFBFB',
      borderStyle: 'white',
      list: [{
        pagePath: 'pages/index/index',
        text: '素可乐™️',
        iconPath: './assets/images/scan-circle-outline.png',
        selectedIconPath: './assets/images/scan-circle.png'
      },{
        "pagePath": "pages/list/index",
        "text": "插秧",
        iconPath: './assets/images/cash-outline.png',
        selectedIconPath: './assets/images/cash.png'
      },{
        "pagePath": "pages/about/index",
        "text": "我",
        iconPath: './assets/images/person-circle-outline.png',
        selectedIconPath: './assets/images/person-circle.png'
      }]
    }
    // ,
    // plugins: {
    //   sdkPlugin: {
    //     version: '3.9.0',
    //     provider: 'wxc6b86e382a1e3294'
    //   }
    // }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
