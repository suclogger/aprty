import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

const style = {
  // 'margin': '24px',
  'margin': '10px',
  'padding-left': '10px',
  'border-left': '5px solid #6190e8'
}

export default ({title}) => {
  return (
    <View className="com-panel" style={style}>
      <Text>{title}</Text>
    </View>
  )
}
