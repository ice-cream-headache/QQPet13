var pet;                                         //部分无用
(function (pet) {
    var JSUtils = (function () {
        function JSUtils() {
        }
        JSUtils.init = function () {
                pet.Global.PETDATA = {
                    "pet_sex":"GG",
                };
                if (!pet.Global.Login) {
                    pet.Global.Login = new pet.BeforeEnterGame();
                }
        };
        JSUtils._sdkReady = false;
        JSUtils.friendList = [];
        JSUtils.factionList = [];
        JSUtils.wxReady = false;
        return JSUtils;
    }());
    pet.JSUtils = JSUtils;
})(pet || (pet = {}));
//# sourceMappingURL=JSUtils.js.map
var pet;
(function (pet_1) {
    var Handler = laya.utils.Handler;
    var Loader = laya.net.Loader;
    var Animation = Laya.Animation;
    var Tween = laya.utils.Tween;
    var Ease = laya.utils.Ease;
    var Home = (function () {
        function Home() {
            this._aniFlag = false;
            this._pageindex = 0;
            this._pagemax = 8;
            this._pageText = [];
            this._onPageAni = false;
            this._words = [
                "",
                "Hello，主人。今天你能多陪陪我么~",
                "今天天气好晴朗，处处好风光♫~",
                "摩擦摩擦，似魔鬼的步伐♫~",
                "最重要是吃饭，现在暂别减肥,哈哈~~",
                "我们一起玩吧，不要烦恼，开心就好~",
                "洗澡好舒服，浑身轻了很多呢",
                "我觉得我很帅，但帅得还不明显。",
                "钱不是问题，问题是没钱。",
                "冰冻三尺非一日之寒，肚腩三层非一日之馋。",
                "小样儿~来戳我啊！",
                "今天天气好晴朗，处处好风光♫~"
            ];
            this._assets = [];
            //加载所有动画和图片资源
            var sexStr = pet_1.Global.PETDATA["pet_sex"];
            //var sexStr = "GG";
            this._assets.push({ url: "res/atlas/ui/main.json", type: Loader.ATLAS });
            this._assets.push({ url: "res/atlas/ui/ani/" + sexStr + "/zayan.json", type: Loader.ATLAS });
            this._assets.push({ url: "res/atlas/ui/ani/" + sexStr + "/zhaoshou.json", type: Loader.ATLAS });
            this._assets.push({ url: "res/atlas/ui/ani/" + sexStr + "/huaban.json", type: Loader.ATLAS });
            this._assets.push({ url: "res/atlas/ui/ani/" + sexStr + "/chifan.json", type: Loader.ATLAS });
            this._assets.push({ url: "res/atlas/ui/ani/" + sexStr + "/xiuxian.json", type: Loader.ATLAS });
            this._assets.push({ url: "res/atlas/ui/ani/" + sexStr + "/xizao.json", type: Loader.ATLAS });
            Laya.loader.load(this._assets, Handler.create(this, this.resLoadComplete));
        }
        Home.prototype.init = function () {
            if (this._display) {
                this._display.visible = true;
                this.initPageText();
            }
        };
        //隐藏
        Home.prototype.boxHide = function () {
            this._display.visible = false;
        };
        //资源和企鹅动画加载完毕
        Home.prototype.resLoadComplete = function () {
            this._display = new ui.MainUI();
            Laya.stage.addChild(this._display);
            this.init();
            this._display.pageBox.visible = false;
            this._display.xizao.on(Laya.Event.CLICK, this, this.showAnimation, [6, this._display.xizao]);
            this._display.xiuxian.on(Laya.Event.CLICK, this, this.showAnimation, [5, this._display.xiuxian]);
            this._display.chifan.on(Laya.Event.CLICK, this, this.showAnimation, [4, this._display.chifan]);
            this._display.huiyi.on(Laya.Event.CLICK, this, this.showPetLog);
            this._display.pageBox.on(Laya.Event.CLICK, this, this.showPageAni);
            this.showAnimation(1);
            this._display.petName.text = "咱家的小企鹅";
        };
        //播放企鹅动画
        Home.prototype.showAnimation = function (idx, sprite) {
            if (!this._ani) {
                this._ani = new Animation();
                this._display.roleBox.addChild(this._ani);
                this._ani.on(Laya.Event.COMPLETE, this, this.showAnimation, []);
                this._display.aniHit.on(Laya.Event.CLICK, this, this.showAniPanel);
            }
            if (idx > 1) {
                this.showAniPanel();
            }
            if (!idx) {
                if (Math.random() > 0.5) {
                    idx = Math.floor(Math.random() * 3 + 1);
                }
                else {
                    idx = 1;
                }
            }
            this._display.xizao.getChildAt(0)["visible"] = false;
            this._display.xiuxian.getChildAt(0)["visible"] = false;
            this._display.chifan.getChildAt(0)["visible"] = false;
            this._display.huiyi.getChildAt(0)["visible"] = false;
            if (sprite) {
                sprite.getChildAt(0)["visible"] = true;
            }
            var wordidx = Math.random() * 10;
            this._ani.loadAtlas(this._assets[idx].url);
            if (idx != 1) {
                this.sayWords(this._words[idx]);
            }
            else if (wordidx > 5 && this._display.dialog.visible == false) {
                this.sayWords(this._words[parseInt(wordidx)]);
            }
            this._ani.scaleX = 2;
            this._ani.scaleY = 2;
            this._ani.autoPlay = true;
            this._ani.interval = 95;
            this._ani.index = 1;
            this._ani.x = 0;
            this._ani.y = -0;
        };
        //显示动画控制面板
        Home.prototype.showAniPanel = function () {
            this._display.paoBox.visible = this._display.paoBox.visible == true ? false : true;
        };
        Home.prototype.sayWords = function (strMsg) {
            this._display.dialog.visible = true;
            this._display.tfWords.text = strMsg;
            Laya.timer.clear(this, this.hideWords);
            Laya.timer.once(3000, this, this.hideWords);
        };
        Home.prototype.hideWords = function () {
            this._display.dialog.visible = false;
        };
        //显示企鹅历程
        Home.prototype.showPetLog = function () {
            if (this._pageindex == 0) {
                this.showAllPage();
            }
            else {
                this.showPageAni();
            }
            this._display.pageBox.visible = true;
            this.showAniPanel();
        };
        //页面切换动画效果
        Home.prototype.showPageAni = function () {
            if (this._pageindex < this._pagemax && !this._onPageAni && this._pageindex != 0) {
                var aniRanom = Math.random() * 4 - 2;
                var len = pet_1.Global.WIDTH + pet_1.Global.HEIGHT;
                this._onPageAni = true;
                //透明度渐变并且渐出
                Tween.to(this._display["page" + this._pageindex], { alpha: 0 }, 1000, Ease.expoIn, Handler.create(this, this.showPageAniComplete));
                Tween.to(this._display["page" + this._pageindex], { x: len * aniRanom, y: len * (aniRanom - 1) }, 900, Ease.expoInOut);
            }
            else {
                console.log(this._pageindex);
            }
            if(this._pageindex == this._pagemax){
                this.pageHide();
            }
        };
        Home.prototype.pageHide = function () {
            this._display.pageBox.visible = false;
            this._pageindex = 0;
        };
        //页面切换完毕隐藏页面
        Home.prototype.showPageAniComplete = function () {
            if (this._pageindex > 0) {
                this._display["page" + this._pageindex].visble = false;
            }
            this._pageindex++;
            this._onPageAni = false;
        };
        Home.prototype.showAllPage = function () {
            this._pageindex++;
            for (var i = 1; i <= this._pagemax; i++) {
                //将所有page复位，文字写入
                this._display["page" + i].visible = true;
                this._display["page" + i].alpha = 1;
                this._display["page" + i].x = 0;
                this._display["page" + i].y = 0;
                this._display["page" + i + "Text"].text = this._pageText[i - 1];
            }
        };
        Home.prototype.initPageText = function () {
            this._pageText[0] = "还记得吗？那天是小企鹅破壳而出的日子。";
            this._pageText[1] = "在你的宠爱下，小企鹅一天天长大……";
            this._pageText[2] = "你送Ta去读书，带Ta去旅行，陪Ta玩耍，留下了弥足珍贵的回忆！";
            this._pageText[3] = "小企鹅在你的陪伴下在企鹅世界努力寻找着另一半！";
            this._pageText[4] = "这些年，你陪伴小企鹅的时光犹如白驹过隙。";
            this._pageText[5] = "Ta也曾努力成长，历经千锤百炼。";
            this._pageText[6] = "在这相伴无数的日子里,你和小企鹅一起赢得了无数星级称号！";
            this._pageText[7] = "未来，小企鹅会继续在这里陪伴着你们，想Ta了要记得来看Ta哦~";
        };
        return Home;
    }());
    pet_1.Home = Home;
})(pet || (pet = {}));
//# sourceMappingURL=Home.js.map
var pet;                                           //无用
(function (pet) {
    var Global = (function () {
        function Global() {
        }
        Global.WIDTH = 1334;
        Global.HEIGHT = 750;
        return Global;
    }());
    pet.Global = Global;
})(pet || (pet = {}));
//# sourceMappingURL=Global.js.map
var pet;                                         //部分无用
(function (pet) {
    var BeforeEnterGame = (function () {
        function BeforeEnterGame() {
            //super();
            this._display = new ui.BeforeEnterGameLoadingUI();
            Laya.stage.addChild(this._display);
            this._display.confirmBtn0.on(Laya.Event.CLICK, this, this.setGG);
            this._display.confirmBtn1.on(Laya.Event.CLICK, this, this.setMM);
        }
        BeforeEnterGame.prototype.init = function () {
            this._display.visible = true;
        };
        BeforeEnterGame.prototype.setGG = function () {
            pet.Global.PETDATA["pet_sex"]="GG";
            this._display.visible = false;
            if (!pet.Global.Home) {
                pet.Global.Home = new pet.Home();
            }
            pet.Global.Home.init();
        };
        BeforeEnterGame.prototype.setMM = function () {
            pet.Global.PETDATA["pet_sex"]="MM";
            this._display.visible = false;
            if (!pet.Global.Home) {
                pet.Global.Home = new pet.Home();
            }
            pet.Global.Home.init();
        };
        return BeforeEnterGame;
    }());
    pet.BeforeEnterGame = BeforeEnterGame;
})(pet || (pet = {}));
//# sourceMappingURL=BeforeEnterGame.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;       //登录UI
(function (ui) {
    var BeforeEnterGameLoadingUI = (function (_super) {
        __extends(BeforeEnterGameLoadingUI, _super);
        function BeforeEnterGameLoadingUI() {
            _super.call(this);
        }
        BeforeEnterGameLoadingUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.BeforeEnterGameLoadingUI.uiView);
        };
        BeforeEnterGameLoadingUI.uiView = { "type": "View", 
                                            "props": {      "width": 1334, 
                                                            "height": 750 }, 
                                            "child": [  {   "type": "Image",
                                                            "props": {  "y": 0,
                                                                        "x": 0,
                                                                        "skin": "ui/main/loginbg.jpg" } },
                                                        {   "type": "Image",
                                                                    "props": {  "y": 315,
                                                                                "x": 468,
                                                                                "width": 180,
                                                                                "var": "confirmBtn0",
                                                                                "height": 175 } },
                                                        {   "type": "Image",
                                                                    "props": {  "y": 315,
                                                                                "x": 684,
                                                                                "width": 180,
                                                                                "var": "confirmBtn1",
                                                                                "height": 175 } }
                                                    ] };
        return BeforeEnterGameLoadingUI;
    }(View));
    ui.BeforeEnterGameLoadingUI = BeforeEnterGameLoadingUI;
})(ui || (ui = {}));
var ui;
(function (ui) {
    var MainUI = (function (_super) {
        __extends(MainUI, _super);
        function MainUI() {
            _super.call(this);
        }
        MainUI.prototype.createChildren = function () {
            View.regComponent("Text", laya.display.Text);
            _super.prototype.createChildren.call(this);
            this.createView(ui.MainUI.uiView);
        };
        MainUI.uiView = {
            "type": "View",
            "props": {
                "y": 0,
                "x": 0,
                "width": 1334,
                "height": 750
            },
            "child": [{
                "type": "Image",
                "props": {
                    "y": 0,
                    "x": 0,
                    "skin": "ui/page/home.jpg"
                }
            }, {
                "type": "Text",
                "props": {
                    "y": 5,
                    "x": 5,
                    "width": 319,
                    "var": "petName",
                    "text": " ",
                    "strokeColor": "#ffff00",
                    "stroke": 3,
                    "height": 24,
                    "fontSize": "24",
                    "color": "#0000dd",
                    "bold": true,
                    "align": "left"
                }
            }, {
                "type": "Box",
                "props": {
                    "y": 178,
                    "x": 431,
                    "width": 903,
                    "var": "aniLayer2",
                    "mouseThrough": true,
                    "height": 572
                },
                "child": [{
                    "type": "Box",
                    "props": {
                        "y": 100,
                        "x": 141,
                        "width": 200,
                        "var": "roleBox",
                        "height": 217
                    },
                    "child": [{
                        "type": "Box",
                        "props": {
                            "y": 83,
                            "x": 0,
                            "width": 205,
                            "var": "aniHit",
                            "height": 197
                        }
                    }]
                }, {
                    "type": "Box",
                    "props": {
                        "y": 0,
                        "x": 400,
                        "width": 210,
                        "visible": false,
                        "var": "dialog",
                        "mouseThrough": true,
                        "mouseEnabled": true,
                        "height": 173
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "y": -56,
                            "x": -12,
                            "width": 319,
                            "skin": "ui/main/wors_bg.png",
                            "mouseEnabled": true,
                            "height": 233
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 24,
                            "x": 43,
                            "wordWrap": true,
                            "width": 222,
                            "var": "tfWords",
                            "valign": "middle",
                            "strokeColor": "#ffffff",
                            "stroke": 3,
                            "height": 105,
                            "fontSize": "24",
                            "color": "#5a152b",
                            "bold": true,
                            "align": "center"
                        }
                    }]
                }, {
                    "type": "Box",
                    "props": {
                        "y": 100,
                        "x": 344,
                        "width": 123,
                        "visible": false,
                        "var": "paoBox",
                        "height": 173
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "y": 0,
                            "x": 0,
                            "width": 130,
                            "skin": "ui/main/menubg.png",
                            "height": 173
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 8,
                            "x": 11,
                            "width": 116,
                            "var": "xizao",
                            "text": "  清  洁",
                            "strokeColor": "#206070",
                            "stroke": 4,
                            "height": 32,
                            "fontSize": "28",
                            "color": "#ddeeff",
                            "bold": true
                        },
                        "child": [{
                            "type": "Image",
                            "props": {
                                "y": -5,
                                "x": 0,
                                "width": 116,
                                "skin": "ui/main/choose.png",
                                "height": 40
                            }
                        }]
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 50,
                            "x": 11,
                            "width": 116,
                            "var": "chifan",
                            "text": "  喂  养",
                            "strokeColor": "#206070",
                            "stroke": 4,
                            "height": 32,
                            "fontSize": "28",
                            "color": "#ddeeff",
                            "bold": true
                        },
                        "child": [{
                            "type": "Image",
                            "props": {
                                "y": -5,
                                "x": 0,
                                "width": 116,
                                "skin": "ui/main/choose.png",
                                "height": 40
                            }
                        }]
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 135,
                            "x": 11,
                            "width": 116,
                            "var": "huiyi",
                            "text": "  历  史",
                            "strokeColor": "#206070",
                            "stroke": 4,
                            "height": 32,
                            "fontSize": "28",
                            "color": "#ddeeff",
                            "bold": true
                        },
                        "child": [{
                            "type": "Image",
                            "props": {
                                "y": -5,
                                "x": 0,
                                "width": 116,
                                "skin": "ui/main/choose.png",
                                "height": 40
                            }
                        }]
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 93,
                            "x": 11,
                            "width": 116,
                            "var": "xiuxian",
                            "text": "  玩  耍",
                            "strokeColor": "#206070",
                            "stroke": 4,
                            "height": 32,
                            "fontSize": "28",
                            "color": "#ddeeff",
                            "bold": true
                        },
                        "child": [{
                            "type": "Image",
                            "props": {
                                "y": -5,
                                "x": 0,
                                "width": 116,
                                "skin": "ui/main/choose.png",
                                "height": 40
                            }
                        }]
                    }]
                }, {
                    "type": "Sprite",
                    "props": {
                        "y": -178,
                        "x": -431,
                        "width": 1334,
                        "var": "aniLayer",
                        "mouseThrough": true,
                        "mouseEnabled": false,
                        "height": 750
                    }
                }]
            }, {
                "type": "Box",
                "props": {
                    "visible": false,
                    "var": "pageBox"
                },
                "child": [{
                    "type": "Box",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "var": "page8"
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "skin": "ui/page/8.jpg"
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 66,
                            "x": 110,
                            "wordWrap": true,
                            "width": 1100,
                            "var": "page8Text",
                            "strokeColor": "#ffffcc",
                            "stroke": 8,
                            "height": 100,
                            "fontSize": "48",
                            "color": "#aa5f1b",
                            "bold": true
                        }
                    }]
                }, {
                    "type": "Box",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "var": "page7"
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "skin": "ui/page/7.jpg"
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 26,
                            "x": 116,
                            "wordWrap": true,
                            "width": 1100,
                            "var": "page7Text",
                            "strokeColor": "#ffeeff",
                            "stroke": 8,
                            "height": 100,
                            "fontSize": "48",
                            "color": "#600777",
                            "bold": true
                        }
                    }]
                }, {
                    "type": "Box",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "var": "page6"
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "skin": "ui/page/6.jpg"
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 31,
                            "x": 83,
                            "wordWrap": true,
                            "width": 1071,
                            "var": "page6Text",
                            "strokeColor": "#ffffff",
                            "stroke": 8,
                            "height": 186,
                            "fontSize": "48",
                            "color": "#0e9ac6",
                            "bold": true
                        }
                    }]
                }, {
                    "type": "Box",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "var": "page5"
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "skin": "ui/page/5.jpg"
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 157,
                            "x": 42,
                            "wordWrap": true,
                            "width": 497,
                            "var": "page5Text",
                            "strokeColor": "#ffffff",
                            "stroke": 8,
                            "height": 398,
                            "fontSize": "48",
                            "color": "#ee9c22",
                            "bold": true
                        }
                    }]
                }, {
                    "type": "Box",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "var": "page4"
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "skin": "ui/page/4.jpg"
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 140,
                            "x": 52,
                            "wordWrap": true,
                            "width": 536,
                            "var": "page4Text",
                            "strokeColor": "#ee5b22",
                            "stroke": 8,
                            "height": 313,
                            "fontSize": "40",
                            "color": "#ffffff",
                            "bold": true
                        }
                    }]
                }, {
                    "type": "Box",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "var": "page3"
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "skin": "ui/page/3.jpg"
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 114,
                            "x": 54,
                            "wordWrap": true,
                            "width": 958,
                            "var": "page3Text",
                            "strokeColor": "#8e2267",
                            "stroke": 10,
                            "height": 75,
                            "fontSize": "48",
                            "color": "#ffffff",
                            "bold": true,
                            "align": "left"
                        }
                    }]
                }, {
                    "type": "Box",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "var": "page2"
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "skin": "ui/page/2.jpg"
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 94,
                            "x": 26,
                            "wordWrap": true,
                            "width": 932,
                            "var": "page2Text",
                            "strokeColor": "#ee5b22",
                            "stroke": 8,
                            "height": 143,
                            "fontSize": "48",
                            "color": "#ffffff",
                            "bold": true
                        }
                    }]
                }, {
                    "type": "Box",
                    "props": {
                        "y": 0,
                        "x": 0,
                        "var": "page1"
                    },
                    "child": [{
                        "type": "Image",
                        "props": {
                            "skin": "ui/page/1.jpg"
                        }
                    }, {
                        "type": "Text",
                        "props": {
                            "y": 112,
                            "x": 175,
                            "wordWrap": true,
                            "width": 1071,
                            "var": "page1Text",
                            "strokeColor": "#ffffff",
                            "stroke": 8,
                            "height": 143,
                            "fontSize": "48",
                            "color": "#0388c6",
                            "bold": true
                        }
                    }]
                }]
            }],
            "animations": [{
                "nodes": [{
                    "target": 429,
                    "keyframes": {
                        "y": [{
                            "value": 251,
                            "tweenMethod": "linearNone",
                            "tween": true,
                            "target": 429,
                            "key": "y",
                            "index": 0
                        }, {
                            "value": 274,
                            "tweenMethod": "linearNone",
                            "tween": true,
                            "target": 429,
                            "key": "y",
                            "index": 30
                        }],
                        "x": [{
                            "value": 237,
                            "tweenMethod": "linearNone",
                            "tween": true,
                            "target": 429,
                            "key": "x",
                            "index": 0
                        }, {
                            "value": 248,
                            "tweenMethod": "linearNone",
                            "tween": true,
                            "target": 429,
                            "key": "x",
                            "index": 30
                        }]
                    }
                }],
                "name": "ani1",
                "id": 1,
                "frameRate": 24,
                "action": 0
            }]
        };
    return MainUI;
    }(View));
    ui.MainUI = MainUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Sprite = laya.display.Sprite;
var Browser = laya.utils.Browser;
var Stat = laya.utils.Stat;
var WebGL = laya.webgl.WebGL;
var HFMain = (function () {
    function HFMain() {
        this._soundUrl = [
            "1.mp3",
            "2.mp3",
            "3.mp3",
            "4.mp3",
            "5.mp3",
            "6.mp3",
        ];
        this._soundIdx = 0;
        Laya.MiniAdpter.init();
        Laya.init(1334, 750, WebGL);
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        pet.JSUtils.init();
        Laya.SoundManager.autoStopMusic = false;
        this.playsound();
    }
    HFMain.prototype.playsound = function () {
        Laya.SoundManager.playSound("assets/sound/" + this._soundUrl[this._soundIdx], 1, laya.utils.Handler.create(this, this.playsound));
        this._soundIdx = this._soundIdx < 5 ? (this._soundIdx + 1) : 0;
    };
    return HFMain;
}());
pet.Global.GameMain = new HFMain();
//# sourceMappingURL=HFMain.js.map
/*  |xGv00|1668cb15e2af4f3b740ce61c91d66634 */