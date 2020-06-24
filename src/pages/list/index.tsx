import Taro, { Component} from '@tarojs/taro'
import { View, Image } from "@tarojs/components";

import { AtList, AtListItem, AtLoadMore } from 'taro-ui'
import ListView from "taro-listview";
import { toast } from './../../utils/modal'
import './index.scss'

const db = Taro.cloud.database()

let curIdx = 0;

export default class PartyListView extends Component {
  constructor(){
    super()
    this.state = {
      isLoaded: false,
      error: false,
      hasMore: true,
      isEmpty: false,
      partyList: [],
    }
  }

  pullDownRefresh = async () => {
    curIdx = 0
    const res = await this.fetchPartyList();
    this.setState(res);
  }

  onScrollToLower = async fn => {
    const { partyList } = this.state;
    const { partyList: newList, hasMore } = await this.fetchPartyList();
    this.setState({
        partyList: partyList.concat(newList),
        hasMore
    });
    fn();
  }

  fetchPartyList = async () => {
    if (curIdx === 0) this.setState({ isLoaded: false });
    const { data } = await db.collection('party').skip(curIdx).limit(20).orderBy('date', 'desc').get().catch(() => {
      toast('出了点问题', 'none', 1000)
    })

    curIdx += data.length

    const {  total } = await db.collection('party').count().catch(() => {
      toast('出了点问题', 'none', 1000)
    })

    return { partyList: data, hasMore: total>curIdx, isLoaded: curIdx === 0 }
  }

  joinParty  = (partyId) => {
    return Taro.navigateTo({
      url: '/pages/party/index?id=' + partyId
    })
  }

  refList = {};

  insRef = node => {
      this.refList = node;
  };

  componentDidMount() {
    this.refList.fetchInit();
  }

  render () {
    const { isLoaded, error, hasMore, isEmpty, partyList } = this.state;
        return (
            <View className="skeleton lazy-view">
                <ListView
                    autoHeight
                    ref={node => this.insRef(node)}
                    isLoaded={isLoaded}
                    isError={error}
                    hasMore={hasMore}
                    isEmpty={isEmpty}
                    style={{ height: '100vh' }}
                    onPullDownRefresh={this.pullDownRefresh}
                    onScrollToLower={fn => this.onScrollToLower(fn)}
                >
          {
            partyList.map((item,index) => {
              return (
                
                <View className="item skeleton-bg" >
                   <AtListItem
                        key={item._id}
                        title={item.name}
                        arrow='right'
                        note={item.date.toLocaleString()}
                        thumb={item.sponsorAvatarUrl}
                        disabled={item.complete}
                        onClick = {() => {this.joinParty(item._id)}}
                        />
                    </View>
              )
            })
          }
        </ListView>
            </View>
    )
  }

}