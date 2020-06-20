// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db= cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {partyId,commissionRate} = event;
  const wxContext = cloud.getWXContext()
  return new Promise((resolve, reject) => {
    db.collection('party').where({
      _id: partyId,
      complete: false
    }).get().then(res => {
      const { data } = res
      if(data.length > 0) {
        const party = data[0]
        if(party.openid == wxContext.OPENID) {
          db.collection('party_member').where({
            partyId: partyId
          }).get().then(res => {
            const { data } = res
            if(!data.some(d => !d.complete)) {
              let diff = data.reduce((acc, { profit }) => acc + profit, 0)
              // 结算成功，抽水
              if(diff ==0 ) {
                data.filter(member => member.profit > 0).map(member => {
                  db.collection('party_member').doc(member._id).update({
                    data: {
                      profit: member.profit * (100-commissionRate)/100,
                      commission: member.profit * commissionRate/100
                    }
                  }).then(res => {
                    resolve({
                      diff: 0
                    })
                  })
                })
                db.collection('party').doc(partyId).update({
                  data: {
                    complete: true,
                    commissionRate: commissionRate
                  }
                })
              } else {
                resolve({
                  diff: diff
                })
              }
            } else {
              let incompletes = data.reduce((acc, { nickname }) => acc + nickname, '')
              resolve({
                incompletes: incompletes
              })
            }
            
          });
        }
      } else {
        reject()
      }
      
    }
    )});
}