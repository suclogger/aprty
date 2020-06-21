import Taro, { Component} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtLoadMore } from 'taro-ui'
import { toast } from './../../utils/modal'
import './index.scss'

const db = Taro.cloud.database()

export default class PartyListView extends Component {
  constructor(){
    super()
    this.state = {
      partyList: [],
      curIdx: 0
    }
  }

  fetchPartyList = () => {
    Taro.showLoading({
      title: '加载中',
    })
    db.collection('party').skip(this.state.curIdx).limit(20).get().then(res => {
      Taro.hideLoading()
      const { data } = res
      let newList = this.state.partyList
      newList.push.apply(newList, data)
      this.setState(
        {
          partyList: newList
        }
      )
    }).catch(() => {
      toast('出了点问题', 'none', 1000)
    })
  }

  joinParty  = (partyId) => {
    return Taro.navigateTo({
      url: '/pages/party/index?id=' + partyId
    })
  }

  loadMore = () => {
    const ci = this.state.curIdx
    this.setState({
      curIdx : ci+10
    })
    this.fetchPartyList()
  }

  componentDidMount() {
    this.fetchPartyList()
  }

  render () {
    const { partyList } = this.state

    return (<View className="list-apge">
      
      <View className="list-body">
        <AtList>
          {
            partyList.map(item => {
              return (
                <AtListItem
                key={item._id}
                title={item.name}
                arrow='right'
                note={item.date.toLocaleString()}
                thumb={item.sponsorAvatarUrl}
                disabled={item.complete}
                onClick = {() => {this.joinParty(item._id)}}
                />
              )
            })
          }
        </AtList>
        <AtLoadMore
          onClick={this.loadMore}
          status='more'
        />
      </View>
    </View>
    )
  }

}