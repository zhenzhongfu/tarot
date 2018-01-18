var tarot = require('waite.js')
var util = require("../../utils/util.js");
var toPinyin = require("../../utils/toPinyin.js");
// pages/card/card.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPick: 0,
    cardList: [],
    shareList: [],
    showGif: 0,
    btnLoading: false,
    btnDisabled: false,
    actionName: '开始抽牌',
    text: '',
    isShowForm: false,

    maskHidden: true,
    imagePath: "",
    canvasHidden: true,

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
    if(options.shareList === undefined) {
      return
    }

this.createNewImg();
    const cardList = []
    console.log("onload:", options.shareList)
    const t = JSON.parse(options.shareList)
    this.setData({
      cardType: options.cardType
    })
    console.log('ttttttt: cardType: ===== ', this.data.cardType)
    for(let i in t) {
      const v = t[i]
      console.log("for === ", i, v)
      cardList.push({ idx: v.idx, name: this.getUrl(v.idx), isReverse: v.reverseStyle })
    }
    
    console.log('onload:',t, options.shareList, options.cardType, cardList)

    this.setData({
      showGif: 0,
      isPick: 1,
      btnLoading: false,
      btnDisabled: false,
      actionName: '重新抽牌',
      cardList: cardList,
      shareList: options.shareList
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    let arg = ''
    let t = {
      shareList: this.data.shareList,
      cardType: parseInt(this.data.cardType)
    }
    for(let k in t) {
      const v = JSON.stringify(t[k])
      arg = arg + k + '=' + v + '&'
    }
    console.log('fzz:',arg)

    return {
      title: '当然是个好结果',
      path: "/pages/card/card?"+arg,
      desc: '手气不错',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
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
    console.log('ttttttt: cardType222: ===== ', this.data.cardType)
    if (this.data.cardType === "1") {
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
    let shareList = []
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
        shareList.push({ idx, reverseStyle })
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
      cardList: cardList,
      shareList: shareList
    })
    console.log(this.data.cardList)
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
  },    
  // 预览
  imgPreview:function(event) {
    let cardtype = event.currentTarget.dataset.cardtype
    let name = event.currentTarget.dataset.name
    let list = event.currentTarget.dataset.list
    console.log(cardtype,typeof(cardtype),name,list)
    let imgList = []
    for (let i of list) {
      if (cardtype === '1'){
        imgList.push('http://www.tarot5.cn/photo/tarotphoto/177/'+ i.name +'.jpg')
      } else {
        imgList.push('https://image.ibb.co/' + i.name + '.jpg')
      }
    }
    let src = (cardtype === '1') ? 'http://www.tarot5.cn/photo/tarotphoto/177/' + name + '.jpg' : 'https://image.ibb.co/' + name + '.jpg'
    console.log(src, imgList)
    wx.previewImage({
      current:src,
      urls: imgList
    })
  },

///////////////////////////////////
  //将金额绘制到canvas的固定
  setCard: function (context) {
    var money = util.toThousands("刷卡记录的飞机螺丝");
    console.log(money);
    context.setFontSize(60);
    context.setFillStyle("#ffffff");
    context.fillText(money, 340, 190);
    context.stroke();
  },
  //将姓名绘制到canvas的固定
  setInfo: function (context) {
    var name = toPinyin.Pinyin.getFullChars("楼上的房间哦受到警方立即，撒旦解放了涉及到法律是的，士大夫");
    context.setFontSize(30);
    context.setFillStyle("#ffffff");
    context.save();
    context.translate(170, 506);//必须先将旋转原点平移到文字位置
    context.rotate(-5 * Math.PI / 180);
    context.fillText(name, 0, 0);//必须为（0,0）原点
    context.restore();
    context.stroke();
  },
  //
  setOther: function (context) {
    context.drawImage("https://image.ibb.co/" + this.data.cardList[0].name +".jpg", 0, 0, 300, 300)
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    //var path = "/img/mine1.png";
    var path = "/img/bg.jpg"
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 375, 667);
    this.setCard(context);
    this.setInfo(context);
    this.setOther(context)
    //绘制图片
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
            imagePath: tempFilePath,
            // canvasHidden:true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },  
  onPrint: function (e) {
    // 判断cardList>1
    if(this.data.cardList.length === 0){
      wx.showToast({
        title: '请先抽牌',
        icon: 'succes',
        duration: 2000,
        mask: true
      })
      return
    }
    var that = this;
    this.setData({
      maskHidden: false,
      canvasHidden: false
    });
    wx.showToast({
      title: '装逼中...',
      icon: 'loading',
      duration: 3000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },   
  onHidden: function(e) {
    this.setData({
      canvasHidden: true
    })
  }
  ////////////////////////////////////                  
})