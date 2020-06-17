import { observable } from 'mobx'

// interface IUserInfo {
//   avatar: string,
//   nickname: string
// }

const appStore = observable({
  counter: 0,
  userInfo: {

  },
  logged: false,
  counterStore() {
    this.counter++
  },
  increment() {
    this.counter++
  },
  decrement() {
    this.counter--
  },
  incrementAsync() {
    setTimeout(() => {
      this.counter++
    }, 1000)
  },
  setUserInfo(val) {
    this.userInfo = val
    this.logged = true
  }
})
export default appStore