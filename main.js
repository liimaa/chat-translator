
(function () {

    'use strict';

    var Conf = {};

    var $ = (() => {

        //var docbody = !document.body ? parent.document.body : document.body;
        //var doc = !document.body ? parent.document.documentElement : document.documentElement;
        var doc = document.documentElement;

        var $ = function(selector, root) {
            var el = (root || document).querySelector(selector);
            // if(el === null) {
            //     el = parent.document.querySelector(selector);
            //     el ? console.log("parent", el) : 1;
            //     console.log(el, selector);
            // }
            return el;
        };
        $.$ = function(selector, root){
            return (root || document).querySelectorAll(selector);
        }
        $.el = function(tag, class_name, text) {
            var el = document.createElement(tag);
			if (class_name !== undefined) {
                el.className = class_name;
            }
			if (text !== undefined) {
				el.textContent = text;
            }
            return el;
        };
        $.add = function(parent, el) {
            return parent.appendChild(el);
        };
        $.on = function(el, events, handler) {
            //console.log(el, events, handler);
            var event, j, len, ref;
            ref = events.split(' ');
            for (j = 0, len = ref.length; j < len; j++) {
              event = ref[j];
              el.addEventListener(event, handler, false);
            }
        };
        $.tgl = function(el, class_name) {
            for (let i = 0; i < arguments.length; i++) {
                if(typeof arguments[i] === "string") {
                    //console.log(el, arguments[i]);
                    el.classList.toggle(arguments[i]);
                }
            }
            // el.classList.toggle(class_name);
        };
        $.drag = function(el, container) {
            var isDragReady = false,
                dragoffset = {
                    x: 0,
                    y: 0
                };
            $.on(el, 'mousedown', function (e) {
                isDragReady = true;
                if(container) {
                    dragoffset.x = e.pageX - container.offsetLeft;
                    dragoffset.y = e.pageY - container.offsetTop;
                } else {
                    dragoffset.x = e.pageX - el.offsetLeft;
                    dragoffset.y = e.pageY - el.offsetTop;
                }
            });
            $.on(document, 'mouseup', function () {
                isDragReady = false;
            });
            $.on(document, 'mousemove', function (e) {
                if (isDragReady) {
                    e.pageX || e.clientX + (doc.scrollLeft ? doc.scrollLeft : docbody.scrollLeft);
                    e.pageY || e.clientY + (doc.scrollTop ? doc.scrollTop : docbody.scrollTop);
                    if(container) {
                        container.style.top = (e.pageY - dragoffset.y) + "px";
                        container.style.left = (e.pageX - dragoffset.x) + "px";
                    } else {
                        el.style.top = (e.pageY - dragoffset.y) + "px";
                        el.style.left = (e.pageX - dragoffset.x) + "px";
                    }
                }
            });
        };
        $.load = {
            option: function() {
                //console.log(this, Conf[this.name]);
                if(this.multiple) {
                    for (var i = 0; i < this.options.length; i++) {
                        this.options[i].selected = Conf[this.name].indexOf(this.options[i].value) >= 0;
                    }
                } else {
                    this.value = Conf[this.name];
                }
            }
        }
        $.save = {
            tgl: function() {
                Conf[this.name] = this.toggle = !this.toggle;
                $.save.save();
            },
            option: function() {
                if(this.multiple) {
                    var arr = [];
                    Array.from(this.selectedOptions).forEach(el => arr.push(el.value));
                    Conf[this.name] = arr
                } else {
                    Conf[this.name] = [this.selectedOptions[0].value];
                }
                $.save.save()
            },
            input: function() {
                //console.log("this", this.name, this.value, Conf);
                if(!this.value) return;
                for (var i = 0; i < Conf[this.name].length; i++) {
                    Conf[this.name][0] = this.value;
                }
                this.placeholder = this.value;
                this.value = null;
                $.save.save();
            },
            checkbox: function() {
                //console.log(this, this.name, this.checked, Conf);
                for (var i = 0; i < Conf[this.name].length; i++) {
                    Conf[this.name][0] = this.checked;
                }
                $.save.save();
            },
            save: function() {
                localStorage.setItem("ct-config-test", JSON.stringify(Conf));
            }
        };
        $.wait = function(selector, callback) {
            setTimeout(() => {
                var el = $(selector);
                if(el) {
                    callback(el);
                } else {
                    $.wait(selector, callback);
                }
            },1000);
        };
        $.link = function(link, class_name, text) {
            var a = document.createElement("a");
            a.href = link;
            a.target = "_blank";
            if (class_name !== undefined) {
                a.className = class_name;
            }
            if(text !== undefined) {
                a.textContent = text;
            }
            return a
        }

        return $;
    })();

    /*
     *   how to add site;
     *
     *   name : site name
     *   match : url | site url that chat is in
     *   chat : .element | chat
     *   chatnode : .element | chat textline
     *   obsconfig : 'optional'  | MutationObserver config default is, childList : true
     *   button : 'optional' .element | prepend's to element
     *   iframe : 'optional' .element | if chat is located inside iframe this is needed
     *   user : 'optional' .element
     *   badge :  'optional' .element
    */ 

    var Site = {
        Languages: [ 
            { lang: "Azerbaijan", value: "az" },
            { lang: "Albanian", value: "sq" },
            { lang: "Amharic", value: "am" },
            { lang: "English", value: "en" },
            { lang: "Arabic", value: "ar" },
            { lang: "Armenian", value: "hy" },
            { lang: "Afrikaans", value: "af" },
            { lang: "Basque", value: "eu" },
            { lang: "Bashkir", value: "ba" },
            { lang: "Belarusian", value: "be" },
            { lang: "Bengali", value: "bn" },
            { lang: "Burmese", value: "my" },
            { lang: "Bulgarian", value: "bg" },
            { lang: "Bosnian", value: "bs" },
            { lang: "Welsh", value: "cy" },
            { lang: "Hungarian", value: "hu" },
            { lang: "Vietnamese", value: "vi" },
            { lang: "Haitian (Creole)", value: "ht" },
            { lang: "Galician", value: "gl" },
            { lang: "Dutch", value: "nl" },
            { lang: "Hill Mari", value: "mrj" },
            { lang: "Greek", value: "el" },
            { lang: "Georgian", value: "ka" },
            { lang: "Gujarati", value: "gu" },
            { lang: "Danish", value: "da" },
            { lang: "Hebrew", value: "he" },
            { lang: "Yiddish", value: "yi" },
            { lang: "Indonesian", value: "id" },
            { lang: "Irish", value: "ga" },
            { lang: "Italian", value: "it" },
            { lang: "Icelandic", value: "is" },
            { lang: "Spanish", value: "es" },
            { lang: "Kazakh", value: "kk" },
            { lang: "Kannada", value: "kn" },
            { lang: "Catalan", value: "ca" },
            { lang: "Kyrgyz", value: "ky" },
            { lang: "Chinese", value: "zh" },
            { lang: "Korean", value: "ko" },
            { lang: "Xhosa", value: "xh" },
            { lang: "Khmer", value: "km" },
            { lang: "Laotian", value: "lo" },
            { lang: "Latin", value: "la" },
            { lang: "Latvian", value: "lv" },
            { lang: "Lithuanian", value: "lt" },
            { lang: "Luxembourgish", value: "lb" },
            { lang: "Malagasy", value: "mg" },
            { lang: "Malay", value: "ms" },
            { lang: "Malayalam", value: "ml" },
            { lang: "Maltese", value: "mt" },
            { lang: "Macedonian", value: "mk" },
            { lang: "Maori", value: "mi" },
            { lang: "Marathi", value: "mr" },
            { lang: "Mari", value: "mhr" },
            { lang: "Mongolian", value: "mn" },
            { lang: "German", value: "de" },
            { lang: "Nepali", value: "ne" },
            { lang: "Norwegian", value: "no" },
            { lang: "Punjabi", value: "pa" },
            { lang: "Papiamento", value: "pap" },
            { lang: "Persian", value: "fa" },
            { lang: "Polish", value: "pl" },
            { lang: "Portuguese", value: "pt" },
            { lang: "Romanian", value: "ro" },
            { lang: "Russian", value: "ru" },
            { lang: "Cebuano", value: "ceb" },
            { lang: "Serbian", value: "sr" },
            { lang: "Sinhala", value: "si" },
            { lang: "Slovakian", value: "sk" },
            { lang: "Slovenian", value: "sl" },
            { lang: "Swahili", value: "sw" },
            { lang: "Sundanese", value: "su" },
            { lang: "Tajik", value: "tg" },
            { lang: "Thai", value: "th" },
            { lang: "Tagalog", value: "tl" },
            { lang: "Tamil", value: "ta" },
            { lang: "Tatar", value: "tt" },
            { lang: "Telugu", value: "te" },
            { lang: "Turkish", value: "tr" },
            { lang: "Udmurt", value: "udm" },
            { lang: "Uzbek", value: "uz" },
            { lang: "Ukrainian", value: "uk" },
            { lang: "Urdu", value: "ur" },
            { lang: "Finnish", value: "fi" },
            { lang: "French", value: "fr" },
            { lang: "Hindi", value: "hi" },
            { lang: "Croatian", value: "hr" },
            { lang: "Czech", value: "cs" },
            { lang: "Swedish", value: "sv" },
            { lang: "Scottish", value: "gd" },
            { lang: "Estonian", value: "et" },
            { lang: "Esperanto", value: "eo" },
            { lang: "Javanese", value: "jv" },
            { lang: "Japanese", value: "ja" }
            ],
        Sites: [{
            name: "localhost",
            match: "localhost",
            chat: ".chat",
            chatline: ".chatline",
        },{
            name: "twitch.tv",
            match: "twitch.tv/",
            chat: ".chat-list [role='log']",
            chatline: "span[data-a-target='chat-message-text']",
            button: ".top-nav__menu > div:nth-child(3)",
            user: ".chat-line__username",
            badge: ".chat-line__message > span"
        }, {
            name: "youtube.com",
            match: "youtube.com/watch?", //live_chat?
            chat: "#item-offset #items",
            chatline: "#message",
            button: "#buttons .ytd-masthead",
            iframe: "#chatframe"
        }, {
            name: "smashcast",
            match: "smashcast.tv/",
            chat: ".tse-scroll-content",
            chatline: "" //literally no chatters
        }, {
            name: "mixer.com",
            match: "mixer.com/",
            chat: "div[class^='ChatMessages__'] > div",
            chatline: 'span[class^="textComponent__"]'
        },{
            name: "bigo.tv",
            match: "bigo.tv/",
            chat: "#chat_content_list_e",
            chatline: ".user_text_content"
        }, {
            name: "afreecatv.com",
            match: "play.afreecatv.com/",
            chat : "#chat_area",
            chatline : "dd"
        }, {
            name: "huya.com",
            match: "huya.com/",
            chat: "#chat-room__list",
            chatline: ".msg"
        }, {
            name: "instagib.tv",
            match: "instagib.tv/*",
            chat: "#vn_list_box",
            chatline: "span.chatline",
        }, {
            name: "bilibili",
            match: "live.bilibili.com/",
            chat: "#chat-history-list",
            chatline: ".danmaku-content"
        },{
            name: "nicovideo",
            match: "nicovideo.jp/",
            chat: "div[class^='___table___']",
            chatline: "span[class^='___comment-text___']"
        },{
            name: "pixiv.net",
            match: "sketch.pixiv.net/",
            chat: "#LiveSidebarLog",
            chatline: ".TextFragment > span"
        },{
            name: "livestream.com",
            match: "",
            chat: ".comments_list_wrapper",
            chatline: ".commenter_content"
        },{
            name: "periscope.tv", //needs cors policy fix or someting
            match: "periscope.tv/w/",
            chat: ".Chat > div > div",
            chatline: ".SystemMessage-message > span"
        }],
    };

    var Config = {
        details: {
            version: "1.0.0"
        },
        ui: {
            "settings": false,
            "keybinds": false,
            "stats": false,
            "info": false
            //"changelog": false,
        },
        settings: {
            "translate text": [false, "translates chat"],
            "replace text": [false, "Replaces translated text with whitespace"],
            "ignore spam": [true, "Ignore's spamlike messages"]
        },
        inputSettings: {
            "apikey": ["trnsl.1.1.20190123T075015Z.16e7f20b61b0463d.7a0405224ebdc152dbe31bcb3c34262a74e2b170", "Yandex api key"],
        },
        languageSettings: {
            "language1": ["fi"],
            "language2": ["ko", "ja", "zh"]
        },
        keybinds: {
            "toggle": ["Shift Q", "toggles panel visibility"],
            "translate": ["Shift T", "translates chat"]
        },
        stats: {
            "characters": 0,
            "words": 0
            //"api requests": 0,
            //"filtered messages": 0
        },
        info: {
            "Supported sites": ["list", "https://example.com"],
            "Supported languages": ["language list", "https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#api-overview__languages"],
            "Api Key": ["Get your apikey by registering to yandex in here", "https://translate.yandex.com/developers/keys"],
            "Max characters": ["Maxinium volume of translated characters, 1,000,000/day, 10,000,000/month.", "https://yandex.com/legal/translate_api/"]
        }
    };
    
    const Chat = (() => {

        const init = () => {

            Site.Sites.some((site) => {
                //console.log(site.match && (new RegExp(site.match, 'i')).test(window.location.href));
                if (site.match && (new RegExp(site.match, 'i')).test(window.location.href)) {
                                 
                    if(site.iframe) {
                        $.wait(site.iframe, (e) => 
                            $.on(e, "load", () => {
                                site.doc = e.contentDocument || e.contentWindow.document
                                console.log(site, site.doc.body);
                                translator(site)
                            })
                        )
                    } else {
                        $.wait(site.chat, (e) => {
                            console.log(site);
                            translator(site);
                        });
                    }
                }
            });
        };

        const translator = (site) => {    

            if(site.button) {
                $.wait(site.button, (e) => { 
                    //console.log("button", e);
                    var ct = $.el("div", "ct-button", "CT");
                    ct.style.cursor = 'pointer'; 
                    ct.style.fontSize = "14px";
                    ct.style.margin = "auto 10px";
                    e.insertBefore(ct, e.childNodes[0])
                    $.on(ct, "click", () => $.tgl($(".ct-ct"), "ct-hidden"))

                });
            }

            observe(site, (props) => {
                const {node, user, badge} = props
                
                if(!node) return


                if(site.badge) {
                    const {users} = App.addon()
                    if(users.developer.indexOf(user.textContent) !== -1) { 
                        var el;
                        $.add(badge, el = $.el("img", "ct-badge"))
                        el.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAFRJREFUOE/NjEEOwCAMw/j/pzskRx1NuTBxmE+NSRhxyK8HoyLb0MO2hEwk84E8IQIRDxtlfBmshdsDa080MJt0r7xu7OZI3kwPpOoY/IPO8aAQ8QAVLnamZKyidwAAAABJRU5ErkJggg=="
                        el.setAttribute("title", "chat translator developer")
                        el.style.cursor = 'help'; 
                    }
                }

                if(!Conf["translate text"][0]) return

                const detect = fetcher("https://translate.yandex.net/api/v1.5/tr.json/detect",
                    "key=" + Conf["apikey"][0] + "&text=");
    
                const translate = fetcher("https://translate.yandex.net/api/v1.5/tr.json/translate",
                    "key=" + Conf["apikey"][0] + "&lang=" + Conf["language1"] + "&text=");   

                //console.log(node, node.textContent);

                if(!Conf["apikey"][0]) {
                    alert("Error no apikey. Insert Yandex apikey to start translator.")
                }

                // translate(node.textContent).then(json => {
                //     console.log(json);
                // });

                if(Conf["ignore spam"][0]) {
                    if(spamFilter(node)) {
                        console.log(`filtered ${node.innerText}`)
                        return;
                    }
                }

                //do...
                stats(node);
                
                return
                
                //no detection if all languages are selected
                if(Conf["language2"].length < 93) {

                    detect(node.textContent).then(json => {
                        //console.log(json);

                        if(Conf["language2"].indexOf(json.lang) !== -1) {
                            translate(node.textContent).then(json => {
                                //console.log("in", json.text, node);
                                if(Conf["replace text"][0]) {
                                    node.innerHTML = json.text;
                                } else {
                                    node.innerHTML = node.innerHTML + " | " + json.text;
                                }
                            });
                        }
                    });

                } else {
                    //console.log("asd", node.textContent);
                    translate(node.textContent).then(json => {
                        //console.log(json, json.text);
                        if(Conf["replace text"][0]) {
                            node.innerHTML = json.text;
                        } else {
                            node.innerHTML = node.innerHTML + " | " + json.text;
                        }
                    });
                }
            });
        };

        const stats = (node) => {
            var text = node.textContent;

            // "api requests": "0",
            // "filtered messages": "0",

            //console.log(
            //    text,
                Conf["characters"] += text.length
                Conf["words"] += text.split(" ").length
            //);

            //do..
        }

        const spamFilter = (node) => {
            node = node.textContent;
            
            //Max lenght of one character spam like > text here haha spam > wwwwwwwwwww < hahaha
            let maxLenght = 6; //ㅋㅋㅋㅋㅋㅋ
            let maxCharacter = `(.)\\1{${maxLenght},}`;
            let oneCharacter = "^(.)\\1*$";
            let numbers = "^[0-9]*$";
            let whitespace = "^[\\S]:$";
            let randomAcii = "^[\\u2800-\\u28FF]*$";

            const filter = new RegExp(oneCharacter || maxCharacter || numbers || whitespace || randomAcii, "gim");
            //console.log(filter.test(node));
            return filter.test(node);
        };
    
        const observe = (site, callback) => {

            let nodes, node, chatline, user, badge;
            const doc = site.iframe ? site.doc : document;
            const obsconfig = site.obsconfig ? site.obsconfig : { childList: true};

            //console.log("check frame", doc, $(site.chat, doc));

            new MutationObserver((mutations) => {

                mutations.forEach((mutation) => {

                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        //console.log(mutation.addedNodes);
                        nodes = mutation.addedNodes[i];
                        chatline = $(site.chatline, nodes);

                        try {
                            user = $(site.user, nodes)
                            badge = $(site.badge, nodes)
                            node = chatline.innerText ? chatline : nodes

                        } catch (error) {
                            //console.log("chatline error", error);
                        }
                    }

                });
                
                //console.log(user, node, badge);
                return callback({ user, node, badge });

            }).observe($(site.chat, doc), obsconfig);

            //chat testing
            // setInterval(() => {
            //     $.add($(site.chat), $.el("div", "chatline", "oispa kaljaa"));
            // }, 3000);
        };

        const fetcher = (url, data) => {
            return (text) => {
                //console.log("fetch" + data + text);
                return fetch(url, {
                    method: "post",
                    mode: "cors",
                    body: data + text,
                    
                    headers : {
                        // "Content-Security-Policy": null,
                        // "Access-Control-Allow-Origin": "*",
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                })
                .then((response) => {
                    return response.json();
                }).catch(err => console.log("fetch err", err));
            };
        };

        return { init };

    })();

    const Ui = (() => {

        const init = () => {

            container()
            
            //temp
            Array.from($.$(".ct-click")).map(el =>
                $.on(el, "click", (e) =>
                    $.tgl(e.target, "ct-active")))

        };

        const alert = (text, stay, time) => {

            var el1;

            var container = $.el("div", "ct-alert")
                $.add(container, el1 = $.el("div", "", text))
                $.add(container, el1 = $.el("div", "", "X"))
                $.on(el1, "click", () => container.remove())

            $.add( $(".ct-ct"), container)
 
            if(!stay) {
                setTimeout(() => container.remove(), time || 2000)
            }

            //...

        }

        const theme = (() => {
            var asdf = `
                .ct-ct {
                    top: 35vh;
                    right: 80vh;
                    z-index: 9998;
                    position: absolute;
                    width: 500px;
                    background-color: #1f1f1f;
                    border: 1px solid #383a3b;

                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-areas: 
                        "header header"
                        "nav main";
                }

                .ct-header {
                    display: grid;
                    grid-area: header;
                }

                .ct-end {
                    justify-self: end;
                }

                .ct-nav {
                    grid-area: nav;
                }

                .ct-main {
                    grid-area: main;
                }

                .ct-colum {
                    display: grid;
                }

                .ct-colum3 > *{
                    display: grid;
                    grid-template-columns: 25% auto 30%;
                }

                .ct-colum2 > *{
                    display: grid;
                    grid-template-columns: 25% auto;
                }

                .ct-text {
                    color: #fff;
                    margin: 0 0 0 0;
                    padding: 0 5px 0 5px;
                    /*
                    padding: 0 0px 0 0px;
                    margin: 0 0 3px 0;
                    */
                }
                .ct-text::first-letter {
                    text-transform: uppercase;
                }

                .ct-hr {
                    border-bottom: 2px solid #383a3b;
                    margin-block-start: 0.5em;
                    margin-block-end: 0.5em;
                }

                .ct-badge {
                    margin-bottom: .2rem;
                    margin-right: .3rem;
                    vertical-align: middle;
                }
                
                .ct-alert {
                    top: 0;
                }

                .ct-click {
                    cursor: pointer;
                }

                .ct-move {
                    cursor: move;
                }

                .ct-active {
                    color: gray;
                }

                .ct-hidden {
                    display:none; 
                }

                .ct-ct * {
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: -moz-none;
                    -o-user-select: none;
                    user-select: none;
                }

                .ct-ct option,
                .ct-ct select,
                .ct-ct input {
                    color: #000;
                }
                .ct-ct input[type="checkbox"] {
                    -webkit-appearance: checkbox;
                }
                .ct-output {
                    overflow-wrap: break-word;
                    width: 380px;
                    height: 28px;
                    overflow-y: scroll;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .ct-output::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }

            `;

            if($(".ct-css")) $(".ct-css").remove();
            var el1;
            // $.wait("head", function(e) {
            $.add(document.head, el1 = $.el('style', "ct-css", asdf));
            //    console.log(e, el1);
            //})


        })();

        const container = () => {

            var el1, el2, el3, el4, move;

            var container = $.el("div", "ct-ct ct-hidden");

            //header
            $.add(container, move = $.el("div", "ct-header ct-move"));
                $.add(move, el2 = $.el("p", "ct-text ct-click ct-end", "X"));
                $.on(el2, "click", () => $.tgl(container, "ct-hidden"));

            //nav
            $.add(container, el1 = $.el("div", "ct-nav"));
            $.add(el1, el2 = $.el("p", "ct-text", "chat translator"));
            $.add(el1, el2 = $.el("p", "ct-text ct-hr", "version: " + Conf["version"]));
            for (var key in Config.ui) {
                $.add(el1, el2 = $.el("div", "ct-text ct-click", key));
                el2.name = key;
                el2.toggle = Config.ui[key];

                //...
                if(Config.ui[key] === false) {
                    $.wait(".ct-" + el2.name, (el) => {
                        $.tgl(el, "ct-hidden")
                    });
                } else {
                    $.tgl(el2, "ct-active")
                }
                $.on(el2, "click", function() {
                    $.save.tgl.call(this);
                    $.tgl($(".ct-" + this.name), "ct-hidden");
                })

            }

            $.add(el1, el2 = $.el("div", "ct-colum2 ct-reload"));
            $.add(el2, el3 = $.el("div", "ct-text", "reset"));
            $.on(el3, "click", () => { 
                localStorage.removeItem("ct-config-test");
                window.location.reload();
            })

            //body
            $.add(container, el1 = $.el("div", "ct-main"));

                $.add(el1, el2 = $.el("div", "ct-colum ct-language"));
                    $.add(el2, $.el("p", "ct-text ct-output", Conf["language2"]));
                    for (var key in Config.languageSettings) {
                        $.add(el2, el3 = $.el("select", undefined, key));
                        el3.name = key;

                        //...
                        el3.multiple = key === "language1" ? false : true 

                        $.on(el3, "change", $.save.option)
                        
                        for (let i = 0; i < Site.Languages.length; i++) {
                            el4 = $.el("option", undefined, Site.Languages[i].lang);
                            el4.value = Site.Languages[i].value;
                            el3.append(el4);
                        }

                        $.on(el3, "change", () => $(".ct-output").innerHTML = Conf["language2"])
                        $.load.option.call(el3)
                    }        

                $.add(el1, el2 = $.el("div", "ct-colum3 ct-settings"));
                    $.add(el2, $.el("div", "ct-title ct-hr ct-text", "Settings"));
                    for (var key in Config.settings) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.el("span", "ct-text", Config.settings[key][1]));
                        $.add(el3, el4 = $.el("input"));
                        el4.type = "checkbox";
                        el4.checked = Config.settings[key][0];
                        el4.name = key;
                        $.on(el4, "change", $.save.checkbox);
                    }

                    for (var key in Config.inputSettings) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.el("span", "ct-text", Config.inputSettings[key][1]));
                        $.add(el3, el4 = $.el("input"));
                        el4.placeholder = Config.inputSettings[key][0]
                        el4.name = key;
                        $.on(el4, "blur", $.save.input);
                    }

                $.add(el1, el2 = $.el("div", "ct-colum3 ct-keybinds"));
                $.add(el2, $.el("div", "ct-text ct-hr ct-title", "Keybinds"));
                    for (var key in Config.keybinds) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.el("span", "ct-text", Config.keybinds[key][1]));
                        $.add(el3, el4 = $.el("input"));
                        el4.placeholder = Config.keybinds[key][0];
                        el4.name = key;
                        $.on(el4, "keyup keydown", function() {
                            this.value = Keybind.modifier();
                            $.save.input.call(this);
                        });
                    }

                $.add(el1, el2 = $.el("div", "ct-colum2 ct-stats"));
                $.add(el2, $.el("div", "ct-text ct-hr ct-title", "Stats"));
                for (var key in Config.stats) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.el("span", "ct-text", Config.stats[key]));
                    }  

                $.add(el1, el2 = $.el("div", "ct-colum2 ct-info"));
                $.add(el2, $.el("div", "ct-text ct-hr ct-title", "Info"));
                for (var key in Config.info) {
                        $.add(el2, el3 = $.el("div", "ct-text", key));
                        $.add(el3, $.link(Config.info[key][1], "ct-text", Config.info[key][0])  );
                    }

                // $.add(el1, el2 = $.el("div", "ct-colum2 ct-changelog"));
                // $.add(el2, $.el("div", "ct-text ct-hr ct-title", "Changelog"));
                // for (var key in Config.changelog) {
                //         $.add(el2, el3 = $.el("div", "ct-text", key));
                //         $.add(el3, $.link(Config.info[key][1], "ct-text", Config.info[key][0])  );
                //     }
                
            $.drag(move, container)
            $.add(document.body, container);
            //console.log(container);
        };

        return { init };

    })();

    const Keybind = (() => {
        
        const init = () => {
            $.on(document, 'keydown', keybinds);
        };

        const modifier = () => {
            event.stopPropagation();
            //event.preventDefault();

            const keyStr = ["Control", "Shift", "Alt", "Meta"].includes(event.key) ? "" : event.key + " ";

            const key =
                ( event.ctrlKey  ? "Control " : "" ) +
                ( event.shiftKey ? "Shift "   : "" ) +
                ( event.altKey   ? "Alt "     : "" ) +
                ( event.metaKey  ? "Meta "    : "" ) +
                keyStr
            ;
            
            return key.trim();
        };
       
        const keybinds = () => {

            try {
                
                var mod = modifier();

                switch (mod) {
                    case Conf["toggle"][0]:
                        $.tgl($(".ct-ct"), "ct-hidden")
                       //modal(Conf["toggle"])
                    break;
                    case Conf["translate"][0]:
                        Conf["translate text"][0] = Conf["translate text"][0] = !Conf["translate text"][0] 
                        //console.log(Conf["translate text"][0]);
                    break;
                }
            } catch (error) {
                console.log("Keybind:", error);
            }
        };

        return { init, modifier };
        
    })();

    const App = (() => {

        const addon = () => {

            var users = {
                "developer": ["l_iima"],
                "supporter": []
            }
            
            return { users }
        }

        const loadConfig = () => {
            var ctct = JSON.parse(localStorage.getItem("ct-config-test"));
            if(!ctct) {

                for (const obj in Config) {

                    const configObj = Config[obj];

                    for (const key in configObj) {

                        Conf[key] = configObj[key][0]

                        if(typeof configObj[key][1] === "object") {

                            const configObj2 = configObj[key][1];

                            for (const key in configObj2) {
                                //console.log(key, configObj2[key]);
                                Conf[key] = configObj2[key];
                            }

                        } else {
                            Conf[key] = configObj[key]
                        }
                    }
                }

            } else {

                for (const obj in Config) {

                    const configObj = Config[obj];

                    for (const key in configObj) {

                        if(typeof configObj[key][1] === "object") {

                            const configObj2 = configObj[key][1];

                            for (const key in configObj2) {
                                //console.log(key, configObj2[key]);
                                Conf[key] = ctct[key];
                                configObj2[key] = ctct[key];
                            }

                        } else {
                            Conf[key] = ctct[key]
                            configObj[key] = ctct[key];
                        }                      
                    }
                }
                Conf = ctct;
            }
            
            //$.save.save()
            // console.log(Config);
            // console.log(Conf);
            // console.log(ctct);
        }

        const init = () => {
            loadConfig()
            Keybind.init()
            Chat.init()
            $.on(document, "DOMContentLoaded", () => {
                Ui.init()
            }) 
        };

        return { init, addon };

    })();

    App.init();

})();