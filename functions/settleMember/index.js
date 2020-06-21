// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'product-us5v2'
})
const db= cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let { OPENID, APPID, UNIONID } = cloud.getWXContext()
    const {partyId,own} = event;
    let odb = await db.collection('party_member')
      .where({
      partyId: partyId,
      openid: OPENID
    }).get();
    if(odb.data.length!=0) {
      let member = odb.data[0]
      let profit = own - member.amount;
      await db.collection('party_member').doc(member._id).update({
        data: {
          profit: profit,
          complete: true,
          commission: 0
        }
      })
      return {
        profit
      }
    }
    } catch (err) {
      console.log(err);
    }
  
}