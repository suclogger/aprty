import { View, Text, Button } from '@tarojs/components'
import { inject, observer } from '@tarojs/mobx'
import { AtNoticebar, AtGrid } from 'taro-ui'
import Taro, { Component } from '@tarojs/taro'


import { toast, loading, hiddenLoading } from './../../utils/modal'
import { isEmptyObject, loginAndGetOpenid } from './../../utils/common'
import './index.scss'
const defaultIcon = require('./../../assets/images/suclogger-talk.png')
const cashIcon = require('./../../assets/images/color-wand-outline.png')
const personIcon = require('./../../assets/images/person-circle-outline.png')
const rankIcon = require('./../../assets/images/ribbon-outline.png')


interface IProps {
  appStore: {
    userInfo: {
      avatarUrl: string,
      nickName: string
    },
    setUserInfo: Function,
    logged: boolean
  }
}

@inject('appStore')
@observer
export default class About extends Component<IProps> {

  componentWillMount() {
    let data
    try {
      const userInfo = Taro.getStorageSync('userInfo') || '{}'
      data =  JSON.parse(userInfo) || {}
    } catch (error) {
    }
    !isEmptyObject(data) && this.saveToLocal(data)
  }

  public login = (userInfo) => {
    loading('登录中...')
    loginAndGetOpenid(userInfo).then(res => {
      hiddenLoading()
      toast('登录成功', 'none', 1000)
      const val = JSON.stringify(res)
      Taro.setStorageSync('userInfo', val)
    }).catch(() => {
      hiddenLoading()
      toast('登录失败', 'none', 1000)
    })
  }

  public saveToLocal = (data) => {
    const { appStore } = this.props
    appStore.setUserInfo(data)
  }

  public getUserInfo = (e) => {
    const { userInfo } = e.detail
    const { logged } = this.props.appStore
    if (userInfo) {
      if (!logged) {
        this.saveToLocal(userInfo)
        this.login(userInfo)
      }
    } else {
      toast('授权失败！', 'none', 1000)
    }
  }

  onClick(item: object, index: number) {
    switch (index) {
      case 0:
        Taro.navigateTo({
          url: '/pages/add/index'
        });
        break;
      case 1:
        toast('建设中', 'none', 1000)
        break;
      case 2:
        toast('建设中', 'none', 1000)
        break;
      default:
    }
  }

  render() {
    const { userInfo } = this.props.appStore
    const { logged } = this.props.appStore
    const avatar = userInfo.avatarUrl ? userInfo.avatarUrl : defaultIcon
    return (
      <View className='about-page'>
        <View className="userinfo"
          style={{ backgroundImage: "url(" + avatar + ")" }}
        >
          <View className="userinfo-avatar-wrapper">
            <Button
              open-type="getUserInfo"
              onGetUserInfo={this.getUserInfo}
              className="userinfo-avatar"
              style={{ backgroundImage: "url(" + avatar + ")" }}></Button>
            <View className="info-list">
              <Text>{userInfo.nickName}</Text>
            </View>
          </View>
        </View>
        <AtNoticebar icon='volume-plus' customStyle={logged ? {display: 'none'} : {}}>你还未登录，点击上方头像登录</AtNoticebar>
        <View className="about-opration" style={logged ? {} : {display: 'none'}}>
          {/* <AtButton onClick={this.enterAddPage}>添加事项</AtButton> */}
          <AtGrid
            onClick={this.onClick.bind(this)}
            mode="square"
            data={[
              {
                image: cashIcon,
                value: "发起插秧"
              },
              {
                image: personIcon,
                value: "我的战绩"
              },
              {
                image: rankIcon,
                value: "天梯"
              }
            ]}
          />
        </View>
      </View>
    )
  }
}
