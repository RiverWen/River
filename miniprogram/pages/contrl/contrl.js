// pages/contrl/contrl.js
const db= wx.cloud.database()
const message=db.collection('message')
const app=getApp()
import Toast from '../../vant-weapp/toast/toast.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageActiveNames: [],
        contrlActiveNames:[],
        messageSw:true,
        tempFilePaths:[]
        
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    messageOnChange: function (e) {
        this.setData({
            messageActiveNames: e.detail
        })
    },
    contrlOnChange: function (e) {
        this.setData({
            contrlActiveNames: e.detail
        })
    },
    onSwitchChange: function(event){
        let id = event.currentTarget.dataset.id
        var obj={}
        obj[id] = event.detail
        this.setData(obj)
    },

    themeContrlSubmit: function(e){
        // console.log(e.detail.value)
        if(e.detail.value.theme){
            wx.cloud.callFunction({
                name:'updateTheme',
                data: {theme:e.detail.value.theme}
            }).then(res =>{
                console.log(res)
                this.themeContrlReset()
                })
            .catch(err =>{console.log(err)})
        }else{
            Toast('必需选一个主题！')
        }
    },
    themeContrlReset: function(e){
        this.setData({ contrlActiveNames:[]})
    },
    addThemeReset: function(e){
        this.setData({ contrlActiveNames:[]})
    },

    addThemeSubmit: function(e){
        let theme=e.detail.value
        for(let key in theme){
            if(theme[key] == ''){
                Toast(key + '不能为空！')
                return
            }
        }
        if( ['1','2'].indexOf(theme.themeId) == -1){
            Toast( 'themeId字段只能是1或2')
            return
        }
        theme['name']='theme'
        db.collection('contrl').where({
            themeId: theme.themeId
        }).count().then(res=>{
            if(res.total==0){
                db.collection('contrl').add({
                    data: theme
                }).then(res2 => {
                    Toast('上传成功！')
                    this.addThemeReset()
                    this.setData({ fill: "" })
                }).catch(err => { console.log(err) })
            }else{
                Toast('themeId already exists！')
            }
        })
        
    },
    

    newMessageSubmit: function (event){
        var obj=event.detail.value
        if(!this.data.tempFilePaths[0]){
            Toast('必需配有一张图片！')
        }else if(!obj.title){
            Toast('必需有标题！')
        }else if(!obj.content){
            Toast('必需有内容！')
        }else{
            Toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                message: '正在上传...'
            })
            wx.cloud.uploadFile({
                filePath: this.data.tempFilePaths[0], // 文件路径
                cloudPath: "photos/" + "message" + this.getRandom() + "." +
                    this.getFileType(this.data.tempFilePaths[0]),
            }).then(res=>{
                obj['fileId']= res.fileID
                obj['date']= new Date()
                message.add({
                    data:obj
                }).then(res2=>{
                    Toast.clear()
                    Toast('上传成功！')
                    this.newMessageReset()
                    this.setData({title:'',content:''})

                }).catch( err =>{console.log(err)})

            }).catch( err =>{console.log(err)})
        }
    },
    getRandom: function (e) {
        return (Math.random() * 100000000).toFixed()
    },
    getFileType: function (e) {
        var t = e.split(".");
        return t[t.length - 1]
    },

    newMessageReset: function(event){
        this.setData({ messageSw: true,tempFilePaths:[]})
    },

    selectImage: function(event){
        if (!this.data.tempFilePaths[0]){
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            success:res=> {
                // tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                this.setData({
                    tempFilePaths:tempFilePaths
                })
            },
            fail: err=>{console.log(err)}
        })
        }else{
            Toast('只能上传一张图片！')
        }
    },
    clearImage :function(event){
        this.setData({tempFilePaths:[]})
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

    }
})