import Taro, { useState, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtLoadMore } from 'taro-ui'
import { IUserList }  from './../../utils/interface'
import { loading, hiddenLoading, toast } from './../../utils/modal'
import './index.scss'

const PAGE_SIZE: number = 10

function List(props): JSX.Element {
  const [userList, setUserList] = useState<Array<IUserList>>([])
  const [curPage, setCurPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchUserList = () => {
    !hasMore && toast('没有更多了', 'none', 2000)
    loading('加载中')
    setIsLoading(true)
    const db = wx.cloud.database()
    db.collection('users').skip(curPage * PAGE_SIZE).limit(10).get().then(res => {
      hiddenLoading()
      setIsLoading(false)
      const { data } = res
      setUserList([...userList, ...data])
      if (data.length < 10) {
        setHasMore(false)
      }
    }).catch(() => {
      toast('出了点问题', 'none', 1000)
    })
  }

  useEffect(() => {
    fetchUserList()
  }, [curPage])

  const loadMore = () => {
    hasMore && setCurPage(curPage + 1)
  }
  
  return (
    <View className="list-apge">
      <View className="list-body">
        <AtList>
          {
            userList.map(item => {
              return (
                <AtListItem
                key={item._id}
                title={item.nickName}
                arrow='right'
                thumb={item.avatarUrl}
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
