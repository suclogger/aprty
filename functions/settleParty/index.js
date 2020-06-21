// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db= cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {partyId,commissionRate} = event;
  const wxContext = cloud.getWXContext()
  let { data } = await db.collection('party').where({
    _id: partyId,
    complete: false
  }).get()
  if(data.length > 0) {
    const party = data[0]
    if(party.openid == wxContext.OPENID) {
      let members = await db.collection('party_member').where({
        partyId: partyId
      }).get()
      if(!members.data.some(d => !d.complete)) {
        let diff = members.data.reduce((acc, { profit }) => acc + profit, 0)
        // 结算成功，抽水
        if(diff ==0 ) {
          let winners = members.data.filter(member => member.profit > 0)
          for(const idx in winners){
            let winner = winners[idx]
            const rate = commissionRate ? commissionRate/100 : 0
            const cut = Math.round(winner.profit*rate)
            await db.collection('party_member').doc(winner._id).update({
              data: {
                profit: db.command.inc(-cut),
                commission: db.command.inc(cut)
              }
            })
          }
          await db.collection('party').doc(partyId).update({
            data: {
              complete: true,
              commissionRate: commissionRate
            }
          })
          return {
            diff: 0
          }
        } else {
          return {
            diff: diff
          }
        }
      } else {
        let incompletes = data.reduce((acc, { nickname }) => acc + nickname, '')
        return({
          incompletes: incompletes
        })
      }
    }
  }

}