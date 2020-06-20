// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db= cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()

  const {partyId,own} = event;
  return new Promise((resolve, reject) => {
  db.collection('party_member').where({
    partyId: partyId,
    openid: OPENID
  }).get().then(res => {
    const { data } = res
    const member = data[0]
    const profit = own - member.amount;
    db.collection('party_member').doc(member._id).update({
      data: {
        profit: profit,
        complete: true,
        commission: 0
      }
    }).then(res=>{
      resolve(profit)
    });
  }
  )});
}