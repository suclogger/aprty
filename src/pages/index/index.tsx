import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'

type PageStateProps = {
  appStore: {
    counter: number,
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
}

interface Index {
  props: PageStateProps;
}

@inject('appStore')
@observer
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '建设中...',
    usingComponents: {
      // wemark: '../../wemark/wemark'
    }
  }
  state = {
    md: '# heading\n\nText'
  }
  increment = () => {
    const { appStore } = this.props
    appStore.increment()
  }

  decrement = () => {
    const { appStore } = this.props
    appStore.decrement()
  }

  incrementAsync = () => {
    const { appStore } = this.props
    appStore.incrementAsync()
  }

  render () {
    const { appStore: { counter } } = this.props
    return (
      <View className='index'>
        {/* <wemark md={this.state.md} link highlight type='wemark' /> */}
        <Text>正在建设...</Text>
      </View>
    )
  }
}

export default Index  as ComponentType
