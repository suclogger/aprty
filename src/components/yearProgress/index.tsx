import Taro from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AtProgress } from 'taro-ui'
import { isLeapYear } from './../../utils/common'
import './index.scss'

const Year = new Date().getFullYear()

export default class YearProgress extends Taro.Component {
  getDayOfYear = () => {
    return isLeapYear() ? 366 : 365
  }

  days = () => {
    let start = new Date()
    start.setMonth(0)
    start.setDate(1)
    let offset = ((new Date().getTime() - start.getTime()) / 1000 / 60 / 60 / 24)
    return parseInt(String(offset)) + 1
  }

  percents = () => {
    return(this.days() * 100 / this.getDayOfYear()).toFixed(1)
  }

  render() {
    return (
        <View className="com-yearprogress">
          <AtProgress percent={Number(this.percents())}></AtProgress>
          <Text className="content">{Year}已经过去了{this.days()}天，{this.percents()}%</Text>
        </View>
    )
  }
}

// export default () => {

//   const getDayOfYear = () => {
//     return isLeapYear() ? 366 : 365
//   }

//   const days = (() => {
//     let start = new Date()
//     start.setMonth(0)
//     start.setDate(1)
//     let offset = ((new Date().getTime() - start.getTime()) / 1000 / 60 / 60 / 24)
//     return parseInt(String(offset)) + 1
//   })()

//   const percents = (() => {
//     return(days * 100 / getDayOfYear()).toFixed(1)
//   })()

//   return (
//     <div className="com-yearprogress">
//       <AtProgress percent={Number(percents)}></AtProgress>
//       <Text className="content">{Year}已经过去了{days}天，{percents}%</Text>
//     </div>
//   )
// }
