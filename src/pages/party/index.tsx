import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtButton, AtBadge,AtDivider } from 'taro-ui'
import { toast} from './../../utils/modal'
import './index.scss'


const db = wx.cloud.database()

export default class Party extends Component {
  constructor() {
    super()
    this.state = {
      partyMembers: [],
      openid: ''
    }
  }

  fetchPartyMembers = () => {
    const { partyId } = this.state
    const { openid } = this.state
    const { userInfoObject } = this.state
    db.collection('party_member').where({partyId: partyId}).get().then(res => {
      const { data } = res
      if(data.filter(e => e._openid === openid).length == 0) {
        const amount = 0
        db.collection("party_member").add({
          data: {
            partyId,
            amount,
            ...userInfoObject   
          }
        }).then(res => {
          data.push({
            _id: res._id,
            partyId,
            amount,
            ...userInfoObject  
          })
          this.setState({
            partyMembers: [...data]
          })
          toast('加入成功', 'none', 1000)
        }).catch(console.log)
      } else {
        this.setState({
          partyMembers: [...data]
        })
      }
    }).catch(err => {
      console.log(err)
      toast('重新登录', 'none', 1000)
    })
  }

  // doneToDoItem = (id) => {
  //   loading('切换中...')
  //   const { todos } = this.state
  //   const item = todos.find(item => item._id === id)
  //   item && db.collection('todos').doc(id).update({
  //     data: {
  //       completed: !item.completed
  //     },
  //     success: () => {
  //       const newTodos = this.state.todos.map(item => {
  //         if (item._id === id) {
  //           item.completed = !item.completed
  //         }
  //         return item
  //       })
  //       this.setState({
  //         todos: newTodos
  //       })
  //       hiddenLoading()
  //       toast('切换成功', 'success', 1000)
  //     }
  //   })
  // }

  componentDidMount() {
    const partyId = this.$router.params.id
    const userInfo = Taro.getStorageSync('userInfo') || '{}'
    const userInfoObject = JSON.parse(userInfo)
    const openid = userInfoObject.openid
    if (openid) {
      this.setState({
        openid: openid,
        partyId: partyId,
        userInfoObject: userInfoObject,
      }, ()=>{
        this.fetchPartyMembers()
      })
    }
  }

  // componentDidShow () {
  //   const partyId = this.$router.params.id
  //   const userInfo = Taro.getStorageSync('userInfo') || '{}'
  //   const userInfoObject = JSON.parse(userInfo)
  //   const openid = userInfoObject.openid
  //   if (openid) {
  //     this.setState({
  //       openid: openid,
  //       partyId: partyId,
  //       userInfoObject: userInfoObject
  //     }, () => {
  //       this.fetchPartyMembers()
  //     })
  //   }
  // }

  handleClick(id, nickName) {
    Taro.showModal({
      title: '提示',
      content: '确认要给' + nickName + '加一手吗？',
      success: function (res) {
        if (res.confirm) {
          db.collection('party_member').doc(id).update({
            data: {
              amount: db.command.inc(300)
            },
            success: () => {
              toast('成功', 'none', 1000)
            }
          })
        }
      }
    }).then((res) => {
      if(res.confirm) {
        const newPartyMembers = this.state.partyMembers.map(item => {
          if (item._id === id) {
            item.amount = item.amount+300
          }
          return item
        })
        this.setState({
          partyMembers: newPartyMembers
        })
      }
    })
  }

  render() {
    
    const { partyMembers } = this.state
    return (
      <View>
        <AtDivider/>
        <View className='at-row'>
            <View className='at-col at-col__offset-1' >
              <AtBadge value={partyMembers.length}>
                <AtButton size='small'>人数</AtButton>
              </AtBadge>
            </View>
            <View className='at-col  at-col__offset-1'>
              
            </View>
            <View className='at-col  at-col__offset-1'></View>
          </View>
        <AtDivider/>
        <View className="list-apge">
        <View className="list-body">
          
          <AtList>
            {
              partyMembers.map(item => {
                return (
                  <AtListItem
                  key={item._id}
                  title={item.nickName}
                  arrow='up'
                  note={item.amount.toString()}
                  thumb={item.avatarUrl}
                  onClick = {this.handleClick.bind(this, item._id, item.nickName)}
                  />
                )
              })
            }
          </AtList>
        </View>
      </View>
    </View>
    )
  }
}
