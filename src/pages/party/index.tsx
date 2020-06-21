import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtButton, AtBadge,AtDivider,AtForm,AtInput } from 'taro-ui'
import { toast} from './../../utils/modal'
import './index.scss'


const db = wx.cloud.database()

export default class Party extends Component {
  constructor() {
    super()
    this.state = {
      partyMembers: [],
      party: {},
      openid: '',
      own: 0,
      commissionRate: 0
    }
  }

  fetchPartyMembers = () => {
    Taro.showLoading({
      title: '加载中',
    })
    const { partyId,openid,userInfoObject } = this.state

    db.collection('party_member').where({partyId: partyId}).get().then(res => {
      const { data } = res
      if(data.filter(e => e._openid === openid).length == 0) {
        const amount = 0
        const commission = 0
        const profit = 0
        const complete = false
        db.collection("party_member").add({
          data: {
            partyId,
            amount,
            commission,
            profit,
            complete,
            ...userInfoObject   
          }
        }).then(res => {
          data.push({
            _id: res._id,
            partyId,
            amount,
            commission,
            profit,
            complete,
            ...userInfoObject  
          })
          this.setState({
            partyMembers: [...data]
          })
          Taro.hideLoading()
          toast('加入成功', 'none', 1000)
        }).catch(console.log)
      } else {
        Taro.hideLoading()
        toast('欢迎回来', 'none', 1000)
        this.setState({
          partyMembers: [...data]
        })
      }
    }).catch(err => {
      console.log(err)
      toast('重新登录', 'none', 1000)
    })
    db.collection('party').where({_id: partyId}).get().then(res => {
      const { data } = res
      console.log(data)
      this.setState({
        party: data[0],
        commissionRate: data[0].commissionRate
      })
    })
  }

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

  handleClick(id, nickName) {
    Taro.showModal({
      title: '提示',
      content: '确认要给' + nickName + '加秧苗吗？',
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

  handleChange (value) {
    this.setState({
      own: value
    })
  }

  handleCommissionRateChange (value) {
    this.setState({
      commissionRate: value
    })
  }
  
  onSubmit (event) {
    Taro.cloud.callFunction({
      name: 'settleMember',
      data: {
        partyId: this.state.partyId,
        own: this.state.own
      }
    }).then(res=> {
      console.log(res)
      const {profit} = res.result;
      const newPartyMembers = this.state.partyMembers.map(item => {
        if (item.openid === this.state.openid) {
          item.profit = profit,
          item.complete = true
        }
        return item
      })
      this.setState({
        partyMembers: newPartyMembers
      })
      toast('汇总成功', 'none', 1000)
    })
  }

  onSettleParty (event) {
    wx.cloud.callFunction({
      name: 'settleParty',
      data: {
        partyId: this.state.partyId,
        commissionRate: this.state.commissionRate
      }
    }).then((res)=> {
      const {diff, incompletes} = res.result;
      if(diff!=0) {
        toast('汇总失败，差额：' + diff, 'none', 2000)
      } else if (incompletes) {
        toast('汇总失败，下列用户未汇总：' + incompletes, 'none', 2000)
      } else {
        let newParty = this.state.party
        newParty.complete = true
        this.setState({
          party: newParty
        })
        toast('汇总完成！', 'none', 1000)
      }
    })
  }

  render() {
    const { partyMembers,openid,party } = this.state
    const memberComplete = !(partyMembers.some(member =>member.openid=openid && !member.complete));
    return (
      <View>
        <AtDivider/>
        <View className='at-row'>
            <View className='at-col at-col__offset-1' >
              <AtBadge value={partyMembers.reduce((acc, { complete }) => acc+ (complete ? 0 : 1), 0)}>
                <AtButton size='small'>人数</AtButton>
              </AtBadge>
            </View>
            <View className='at-col  at-col__offset-1'>
              <AtBadge maxValue={9999} value={partyMembers.reduce((acc, { profit }) => acc + (profit < 0 ? -profit : 0), 0)}>
                <AtButton size='small'>总秧</AtButton>
              </AtBadge>
            </View>
            <View className='at-col  at-col__offset-1'>
            </View>
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
                  disabled={item.complete}
                  arrow='up'
                  note={'总秧苗：'+item.amount + ' ｜ 结余：' + item.profit}
                  thumb={item.avatarUrl}
                  onClick = {this.handleClick.bind(this, item._id, item.nickName)}
                  extraText='加👋秧苗 '
                  />
                )
              })
            }
          </AtList>
        </View>
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
        >
          <AtInput 
            name='own' 
            title='持有秧苗' 
            type='digit' 
            value={this.state.own} 
            onChange={this.handleChange.bind(this)} 
            disabled={memberComplete}
          />
          <AtButton size='normal' formType='submit' 
          type='primary' 
          disabled={memberComplete}
          >我要汇总</AtButton>
          
        </AtForm>
        <View style={ party.openid==openid ? {} : {display: 'none'}}>
            <AtInput 
              name='commissionRate' 
              title='公共 (单位%)' 
              type='digit' 
              value={this.state.commissionRate} 
              onChange={this.handleCommissionRateChange.bind(this)} 
            />
            <AtButton size='normal' 
            onClick = {this.onSettleParty.bind(this)}
            type='primary' 
            disabled={party.complete}
            >全部汇总</AtButton>
          </View>

        
      </View>
    </View>
    )
  }
}
