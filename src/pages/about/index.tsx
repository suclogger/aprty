import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { inject, observer } from '@tarojs/mobx'
import { AtDivider, AtButton } from 'taro-ui'
import { toast, loading, hiddenLoading } from './../../utils/modal'
import { isEmptyObject, loginAndGetOpenid } from './../../utils/common'
import YearProgress from './../../components/yearProgress'
import './index.scss'

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
    {/*wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        const { openid } = res
        const db = wx.cloud.database()
        db.collection("users").where({
          openid
        }).get({
          success: res => {
            const { data } = res
            // if (data.length === 0) {
              db.collection("users").add({
                data: {
                  openid,
                  ...userInfo
                },
                success: () => {
                  toast('登录成功', 'success', 1000)
                  const val = JSON.stringify({openid, ...userInfo})
                  Taro.setStorage({ key: 'userInfo', data: val })
                }
              })
            // }
            hiddenLoading()
          },
          fail: () => {
            toast('出了点状况', 'none', 1000)
          }
        })
      }
    })*/}
    loading('登录中...')
    loginAndGetOpenid(userInfo).then(res => {
      hiddenLoading()
      toast('登录成功', 'success', 1000)
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

  enterAddPage = () => {
    Taro.navigateTo({
      url: '/pages/add/index'
    })
  }


  render() {
    const { userInfo } = this.props.appStore
    const { logged } = this.props.appStore
    const avatar = userInfo.avatarUrl ? userInfo.avatarUrl : 'https://i.loli.net/2019/11/17/GAYyzeKsiWjP5qO.jpg'
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
              style={{ backgroundImage: "url(" + avatar + ")" }}
            ></Button>
            <View className="info-list">
              <Text>{userInfo.nickName}</Text>
            </View>
          </View>
        </View>
        <YearProgress />
        <AtDivider customStyle={logged ? {display: 'none'} : {}} content='你还未登录，点击上方头像登录' fontColor='#ed3f14' lineColor='#ed3f14' />
        <View className="about-opration" style={logged ? {} : {display: 'none'}}>
          <AtButton onClick={this.enterAddPage}>添加事项</AtButton>
        </View>
      </View>
    )
  }
}
