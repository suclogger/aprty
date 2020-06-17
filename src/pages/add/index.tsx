import Taro, { useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtNavBar, AtForm, AtInput, AtTextarea, AtButton } from 'taro-ui'
import Panel from './../../components/panel'
import { toast, loading, hiddenLoading } from './../../utils/modal'
import './index.scss'

export default () => {
  const [text, setText] = useState('123')
  const [desc, setDesc] = useState('123')

  const goBack = () => {
    Taro.navigateBack({delta: 1})
  }

  // const onTimeChange = () => {

  // }

  // const onDateChange = () => {

  // }

  const addToDo = () => {
    if (!text.trim() || !desc.trim() ) {
      toast('信息填写不完整', 'none', 1000)
    } else {
      loading('添加中...')
      const userInfo = Taro.getStorageSync('userInfo') || '{}'
      const _openid = JSON.parse(userInfo).openid
      if (_openid) {
        const addItem = {
          'openid': _openid,
          'text': text,
          'desc': desc,
          'completed': false,
          'overDate': new Date()}
        const db = wx.cloud.database()
        db.collection('todos').add({
          data: {
            ...addItem
          },
          success: () => {
            toast('添加成功', 'none', 1000)
            hiddenLoading()
            Taro.switchTab({
              url: '/pages/home/index'
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
          url: '/pages/about/index'
        })
      }
    }
  }

  return (
    <View className="add-page">
      <AtNavBar
        onClickLeftIcon={goBack}
        leftText='返回'
        fixed
        leftIconType="chevron-left"
      />
      <View className="body">
        <AtForm>
          <Panel title="TODO ITEM" />
          <AtInput
            name='value1'
            title=''
            type='text'
            placeholder='what you want todo?'
            value={text}
            onChange={(e) => {setText(e)}}
          />
          <Panel title="TODO ITEM DESCRIPTION" />
          <AtTextarea
            value={desc}
            onChange={(e) => {
              setDesc(e)}
            }
            maxLength={200}
          />
          {/* <View className='page-section'>
            <Text>时间选择器</Text>
            <View>
              <Picker mode='time' value='123' onChange={onTimeChange}>
                <View className='picker'>
                  当前选择：{123}
                </View>
              </Picker>
            </View>
          </View>
          <View className='page-section'>
            <Text>日期选择器</Text>
            <View>
              <Picker mode='date' value={'123'} onChange={onDateChange}>
                <View className='picker'>
                  当前选择：{123}
                </View>
              </Picker>
            </View>
          </View>
           */}
          <AtButton onClick={addToDo}>添加</AtButton>
        </AtForm>
      </View>
    </View>
  )
}
