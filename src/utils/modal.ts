import Taro from '@tarojs/taro'

export const loading = (text: string) => {
  Taro.showLoading({
    title: text
  })
}

export const hiddenLoading = () => {
  Taro.hideLoading()
}

export const toast = (title: string, icon: string, duration: number) => {
  Taro.showToast({
    title: title,
    icon: icon,
    duration: duration
  })
}

