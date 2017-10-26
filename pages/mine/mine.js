Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],
    //
    rmIdx: 0,
    // 
    infoHidden: true,
    // modal
    tip: '',
    buttonDisabled: false,
    modalHidden: true,
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let storage = wx.getStorageSync('record')
    let infoHidden = storage.length === 0 ? false : true;
    this.setData({
      recordList: storage,
      infoHidden: infoHidden
    })
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
    let storage = wx.getStorageSync('record')
    let infoHidden = storage.length === 0 ? false : true;
    this.setData({
      recordList: storage,
      infoHidden: infoHidden
    })
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

  onRemove: function (event) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否删除此项记录？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let storage = wx.getStorageSync('record')
          let idx = event.target.dataset.record
          storage.splice(idx, 1)
          that.setData({
            recordList: storage
          })
          wx.setStorageSync('record', storage)
          wx.showToast({
            title: '删除成功',
            icon: 'succes',
            duration: 2000,
            mask: true
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }


})