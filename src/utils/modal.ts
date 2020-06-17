export const loading = (text: string) => {
  wx.showLoading({
    title: text
  })
}

export const hiddenLoading = () => {
  wx.hideLoading()
}

export const toast = (title: string, icon: string, duration: number) => {
  wx.showToast({
    title,
    icon,
    duration
  })
}

