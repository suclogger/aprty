import Taro, { Component } from '@tarojs/taro'


export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0
}

// 平闰年
export const isLeapYear = () => {
  const year = new Date().getFullYear()
  if (year % 400 === 0) {
    return true
  } else if (year % 4 === 0 && year % 100 !== 0) {
    return true
  } else {
    return false
  }
}

// 换取_openid
export const loginAndGetOpenid = (userInfo) => {
  return new Promise((resolve, reject) => [
    wx.cloud.callFunction({
      name: 'test',
      data: {},
      success: res => {
        const { openid } = res.result
        const db = wx.cloud.database()
        db.collection("users").where({
          openid
        }).get({
          success: res => {
            const { data } = res
            if (data.length === 0) {
              db.collection("users").add({
                data: {
                  openid,
                  ...userInfo
                },
                success: () => {
                  resolve({openid, ...userInfo})
                }
              })
            } else {
              resolve({openid, ...userInfo})
            }
          },
          fail: (err) => {
            // toast('出了点状况', 'none', 1000)
            reject({openid, ...userInfo})
          }
        })
      },
      fail: (err) => {
        reject(err)
      }
    })
  ])
}
