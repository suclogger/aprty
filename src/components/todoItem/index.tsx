import Taro from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AtCard } from 'taro-ui'
const ToDoItemIcon = require('./../../assets/images/cash.png')
import './index.scss'

interface IProps {
  _id: string,
  text: string,
  overDate: string,
  completed: boolean,
  desc: string,
  done: Function
}

function ToDoItem({_id, text, overDate, completed, desc, done}:IProps) {
  return (
    <View className="com-todoitem" onClick={() => {done(_id)}}>
      <View className="mask" style={ completed ? {} : {display: 'none'}}></View>
      <AtCard
        note={overDate}
        extra={completed ? '已完成|切换状态' : '未完成|切换状态'}
        title={text}
        thumb={ToDoItemIcon}
        
      >
        待做事情描述：{desc}
      </AtCard>
    </View>
  )
}

export default ToDoItem
