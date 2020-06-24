import Taro, { useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { toast, loading, hiddenLoading } from './../../utils/modal'
import './index.scss'

const db = Taro.cloud.database()

export default () => {
  const [text, setName] = useState('')
  const [desc, setDesc] = useState('')
  // const [unit, setUnit] = useState('300')

  const addToDo = () => {
    if (!text.trim() ) {
      toast('信息填写不完整', 'none', 1000)
    } else {
      loading('添加中...')
      const userInfo = Taro.getStorageSync('userInfo') || '{}'
      const userInfoObject = JSON.parse(userInfo);
      const _openid = userInfoObject.openid
      if (_openid) {
        const addItem = {
          'openid': _openid,
          'name': text,
          'pwd': desc,
          // 'unit': unit,
          'sponsor': userInfoObject.nickName,
          'sponsorAvatarUrl': userInfoObject.avatarUrl,
          'complete': false,
          'date': new Date()}
        db.collection('party').add({
          data: {
            ...addItem
          },
          success: (res) => {
            toast('添加成功', 'none', 1000)
            hiddenLoading()
            const {_id} = res
            Taro.navigateTo({
              url: '/pages/party/index?id=' + _id
            })
          },
          fail: (e) => {
            hiddenLoading()
          }
        })
      } else {
        toast('重新登录', 'none', 1000)
        hiddenLoading()
        Taro.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  }

  return (
    <View className="add-page">
      <View className="body">
        <AtForm>
          {/* <Panel title="TODO ITEM" /> */}
          <AtInput
            required
            name='name'
            title='活动主题'
            type='text'
            placeholder='师出有名'
            value={text}
            onChange={(e) => {setName(e)}}
          />
          {/* <AtInput
            name='unit'
            title='一手'
            type='digit'
            value={unit}
            onChange={(e) => {setUnit(e)}}
          />  */}
          {/* <AtInput
            required
            name='pwd'
            title='口令'
            placeholder='输入若干位的数字口令'
            type='digit'
            value={desc}
            onChange={(e) => {setDesc(e)}}
          /> */}
          <AtButton type='primary' onClick={addToDo}>添加</AtButton>
        </AtForm>
      </View>
    </View>
  )
}
