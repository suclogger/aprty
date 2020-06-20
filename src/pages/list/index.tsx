import Taro, { Component, useState, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtLoadMore } from 'taro-ui'
import { IPartyList }  from './../../utils/interface'
import { loading, hiddenLoading, toast } from './../../utils/modal'
import './index.scss'

const PAGE_SIZE: number = 10

function List(props): JSX.Element {
  const [partyList, setPartyList] = useState<Array<IPartyList>>([])
  const [curPage, setCurPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchPartyList = () => {
    !hasMore && toast('没有更多了', 'none', 2000)
    loading('加载中')
    setIsLoading(true)
    const db = wx.cloud.database()
    db.collection('party').skip(curPage * PAGE_SIZE).limit(10).get().then(res => {
      hiddenLoading()
      setIsLoading(false)
      const { data } = res
      setPartyList([...partyList, ...data])
      if (data.length < 10) {
        setHasMore(false)
      }
    }).catch(() => {
      toast('出了点问题', 'none', 1000)
    })
  }

  const joinParty  = (partyId) => {
    return Taro.navigateTo({
      url: '/pages/party/index?id=' + partyId
    })
  }

  useEffect(() => {
    fetchPartyList()
  }, [curPage])

  const loadMore = () => {
    hasMore && setCurPage(curPage + 1)
  }

  return (
    <View className="list-apge">
      
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
                onClick = {() => {joinParty(item._id)}}
                />
              )
            })
          }
        </AtList>
        <AtLoadMore
          customStyle={isLoading ? {display: 'none'} : {}}
          onClick={loadMore}
          status={hasMore ? 'more' : 'noMore'}
        />
      </View>
    </View>
  )
}

export default List
