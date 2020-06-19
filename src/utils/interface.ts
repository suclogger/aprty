export interface IUserList {
  avatarUrl: string,
  city: string,
  country: string,
  gender: number,
  language: string,
  nickName: string,
  province: string,
  _id: string,
  _openid: string
}

export interface IPartyList {
  name: string,
  sponsor: string,
  sponsorAvatarUrl: string,
  date: string,
  completed: boolean,
  pwd: string,
  _id: string,
  _openid: string
}
