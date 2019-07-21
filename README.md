# chat-translator
Chat translator is Javascript translation addon for chats.

  ### Install
  Script uses [Tampermonkey](https://www.tampermonkey.net), [Violentmonkey](https://violentmonkey.github.io) or [Greasemonkey](https://www.greasespot.net/) script manager for its installation. 
  After manager installation
  [click here to install.](https://raw.githubusercontent.com/liimaa/chat-translator/master/main.user.js)
  
  
## Supported sites
- twitch
- youtube
- mixer
- afreecatv
- huya
- instagib
- bilibili
- nicovideo
- pixiv
- periscope

# Faq

  ### Adding new site
      name : site name
      match : url | site url that chat is in
      chat : .element | chat
      chatnode : .element | chat textline
      obsconfig : 'optional'  | MutationObserver config default is, childList : true
      button : 'optional' .element | prepend's to element'
      user : 'optional' .element
      badge :  'optional' .element
      
      example below >
  
      name: "twitch.tv",
      match: "twitch.tv/",
      chat: ".chat-list [role='log']",
      chatline: "span[data-a-target='chat-message-text']",
      button: ".top-nav__menu > div:nth-child(3)",
      user: ".chat-line__username",
      badge: ".chat-line__message > span"
      
  ### Supported languages
  [language list](https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#api-overview__languages).
  ### Api Key
  Get your apikey by registering to yandex [in here](https://translate.yandex.com/developers/keys)
  ### Max characters
  Maxinium volume of translated characters, 1,000,000/day, 10,000,000/month [info](https://yandex.com/legal/translate_api/)
       
