var tarot = require('waite.js')
// pages/card/card.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPick: 0,
    cardList: [],
    showGif: 0,
    btnLoading: false,
    btnDisabled: false,
    actionName: '开始抽牌',
    text: '',
    isShowForm: false,

    cardType: '1',
    cardTypeItems: [
      { name: '1', value: '韦特', checked: 'true' },
      { name: '2', value: '领航者' }
      // { name: '5', value: '5' }
    ],

    drawTypeItems: [
      { name: '1', value: '1', checked: 'true' },
      { name: '3', value: '3'}
      // { name: '5', value: '5' }
    ],
    drawType: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  rd: function (n, m) {
    let c = m - n + 1
    return Math.floor(Math.random() * c + n)
  },
  reverse: function () {
    return this.rd(0, 1)
  },
  onPick: function () {
    this.setData({
      showGif: 1,
      isPick: 0,
      btnLoading: true,
      btnDisabled: true,
      actionName: '洗牌中。。。',
      cardList: []
    })
    let that = this
    setTimeout(that.pick, 2000)
  },
  getName: function (idx) {
    return tarot.default.img[idx]
  },
  getUrl: function (idx) {
    if (this.data.cardType === '1') {
      return tarot.default.url[idx]
    } else {
      console.log(tarot.default.url2[idx])
      return tarot.default.url2[idx] 
    }
  },
  pick: function (){
    //console.log(tarot.default.img)
    let i = 0
    let cardList = []
    let idxList = []
    let loop = 1
    //console.log(this.data.drawType)
    if (this.data.drawType === '3') {
      loop = 3
    } else if (this.data.drawType === '5') {
      loop = 5
    }
    for (; i < loop; i++) {
      let idx = this.rd(0, 77)
      if (idxList.indexOf(idx) === -1) {
        idxList.push(idx)

        let reverseStyle = ""
        if (this.rd(0, 1) === 1) {
          reverseStyle = "transform: rotate(180deg);"
        }
        cardList.push({ idx: idx, name: this.getUrl(idx), isReverse: reverseStyle })
      } else {
        i--
      }
    }
    this.setData({
      showGif: 0,
      isPick: 1,
      btnLoading: false,
      btnDisabled: false,
      actionName: '重新抽牌',
      cardList: cardList
    })
    //console.log(this.data.cardList)
  },
  bindFormSubmit: function (e) {
    if (this.data.cardList.length === 0 || e.detail.value.textarea === "") {
      wx.showToast({
        title: '请补充信息',
        icon: 'succes',
        duration: 2000,
        mask: true
      })
      return
    }
    //console.log(e.detail.value.textarea)
    let storage = wx.getStorageSync('record') || []
    
    let date = new Date();  
    let record = [{ time: date.toLocaleDateString() + " " + date.toLocaleTimeString(), cardType: this.data.cardType, card: this.data.cardList, text: e.detail.value.textarea }]
    storage = record.concat(storage)
    try {
      wx.setStorageSync('record', storage)
      wx.showToast({
        title: '成功',
        icon: 'succes',
        duration: 2000,
        mask: true
      })
      this.setData({
        text: ''
      })
    } catch (e) {
      console.log(e)
    }
  },
  formatTime: function (date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },
  onShowForm: function () {
    this.setData({
      isShowForm: !this.data.isShowForm
    })
  },
  checkboxChange: function (e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      drawType: e.detail.value
    })
  },
  cardChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      cardType: e.detail.value,
      cardList: [],
      isPick: 0
    })
  }                                
})