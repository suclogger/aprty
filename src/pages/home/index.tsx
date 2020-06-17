import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { inject, observer } from '@tarojs/mobx'
import { AtButton, AtCalendar, AtBadge, AtDivider } from 'taro-ui'
import ToDoItem from './../../components/todoItem/index'
import { toast, loading, hiddenLoading } from './../../utils/modal'
import './index.scss'

const db = wx.cloud.database()

interface IProps {
  appStore: {
    userInfo: {
      avatarUrl: string
    },
    setUserInfo: Function,
    logged: boolean
  }
}

type todos = {
  _id: string,
  _openid: string,
  completed: boolean,
  desc: string,
  text: string,
  overDate: string
}

interface IState {
  todos: Array<todos>,
  openid: string
}

@inject('appStore')
@observer
export default class About extends Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      openid: ''
    }
  }

  notFinish = () => {
    return this.state.todos.filter(item => !item.completed).length
  }

  finish = () => {
    return this.state.todos.filter(item => item.completed).length
  }

  fetchToDos = () => {
    const { openid } = this.state
    // const { todos, openid } = this.state
    // let curDate =new Date()
    // const _ = db.command
    db.collection('todos').where({_openid: openid}).get().then(res => {
      const { data } = res
      data.forEach(item => {
        item.overDate = item.overDate.toLocaleString()
      })
      this.setState({
        // todos: [...todos, ...data]
        todos: [...data]
      })
    }).catch(err => {
      console.log(err)
      toast('重新登录', 'none', 1000)
    })
  }

  doneToDoItem = (id) => {
    loading('切换中...')
    const { todos } = this.state
    const item = todos.find(item => item._id === id)
    item && db.collection('todos').doc(id).update({
      data: {
        completed: !item.completed
      },
      success: () => {
        const newTodos = this.state.todos.map(item => {
          if (item._id === id) {
            item.completed = !item.completed
          }
          return item
        })
        this.setState({
          todos: newTodos
        })
        hiddenLoading()
        toast('切换成功', 'success', 1000)
      }
    })
  }

  componentDidMount() {
    const userInfo = Taro.getStorageSync('userInfo') || '{}'
    const openid = JSON.parse(userInfo).openid
    if (openid) {
      this.setState({
        openid: openid
      }, () => {
        this.fetchToDos()
      })
    }
  }

  componentDidShow () {
    const userInfo = Taro.getStorageSync('userInfo') || '{}'
    const openid = JSON.parse(userInfo).openid
    if (openid) {
      this.setState({
        openid: openid
      }, () => {
        this.fetchToDos()
      })
    }
  }


  render() {
    const { todos } = this.state
    const { logged } = this.props.appStore
    return (
      <View className='home-page'>
        <AtCalendar />
        <View className="todo-list">
          <View className="panel__title">
            <AtBadge value={this.notFinish()} maxValue={99}>
              <AtButton size='small'>未完成事项</AtButton>
            </AtBadge>
            <AtBadge value={this.finish()} maxValue={99} customStyle={{margin: "0 10px"}}>
              <AtButton size='small'>已完成事项</AtButton>
            </AtBadge>
            <AtBadge maxValue={99}>
              <AtButton size='small' onClick={() => toast('(⊙o⊙)？,不可以~~', 'none', 1000)}>清除已完成事项</AtButton>
            </AtBadge>
          </View>
          {
            todos.map(item => (
              <ToDoItem
                key={item._id}
                _id={item._id}
                text={item.text}
                desc={item.desc}
                overDate={item.overDate}
                completed={item.completed}
                done={this.doneToDoItem}
              />
            ))
          }
        </View>
        <AtDivider customStyle={logged ? {display: 'none'} : {}} content='你还未登录,登录后可以添加代办事项' fontColor='#ed3f14' lineColor='#ed3f14' />        
      </View>
    )
  }
}
