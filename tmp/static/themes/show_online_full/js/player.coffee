
class Player
  #@formats: {src: '', quality_tag: '', type: ''}
  constructor: (@player_orig, @formats)->
    self = @

    @volumeUpdateTimeout = 130
    @elems =
      player: $('.video-js')
      controlBar: $(".video-js .vjs-control-bar")
      quality:
        bar: $('<div class="vjs-quality-bar"></div>')
        items: $()
      volume:
        control: $('.video-js .vjs-volume-control')
        wrapper:  $('<div class="vjs-volume-wrapper">')
        items: $()
        cf: $('<div style="clear: both; width: 100%;">')
      fullScreenControl: $('.video-js .vjs-fullscreen-control')
      duration: $('.video-js .vjs-duration')
      progress:
        wrapper: $('<div class="vjs-progress-wrapper">')
        holder: $('.vjs-progress-holder')
      circlePlayButton: $('<div class="vjs-circle-play-btn">')

    @resize()
    @qualityNames =
      sd: 'LQ'
      hd: 'SQ'
      fullhd: 'HQ'

    for key in ['sd', 'hd', 'fullhd']
      item = $('<div class="vjs-quality-btn vjs-control">').data(
        'quality', key
      ).text(@qualityNames[key]).appendTo @elems.quality.bar
      @elems.quality.items.push item[0]

    for i in [1..6]
      item = $('<div class="vjs-volume-level">').appendTo @elems.volume.wrapper
      @elems.volume.items.push item[0]

    @elems.volume.cf.appendTo @elems.volume.wrapper
    @elems.volume.wrapper.appendTo @elems.volume.control

    #Выставляем правильный порядок элементов
    @elems.progress.wrapper.appendTo @elems.controlBar
    @elems.fullScreenControl.detach().appendTo @elems.controlBar
    @elems.quality.bar.appendTo @elems.controlBar
    @elems.volume.control.detach().appendTo @elems.controlBar
    @elems.duration.detach().appendTo @elems.controlBar

    #Удаляем оригинальный регулятор громкости
    $(".video-js .vjs-volume-bar").remove()

    #Делаем свою большую кнопку, чтобы не бороться со стилями
    @elems.circlePlayButton.appendTo(@elems.player).on 'click', ()->
      self.play()
      self.elems.circlePlayButton.hide()

    playBtnSize = @elems.circlePlayButton.height()
    @elems.circlePlayButton.css 'left', (@elems.player.width() - playBtnSize)/2
    @elems.circlePlayButton.css 'top', (@elems.player.height() - playBtnSize)/2

    @player_orig.on 'playing', ()->
      self.elems.circlePlayButton.hide()

    $('.video-js .vjs-big-play-button').remove()

    #Только для разработки: панель активируется, ставим на паузу
    setTimeout(
      ()->
        $("video")[0].pause();
      500)

    @elems.volume.wrapper.on "mousedown", (ev) ->
     self.volUpdateAllowed = true

    @elems.volume.wrapper.on "mousemove", (ev) ->
      el = $(@);
      setTimeout(
        ()->
          if( self.volUpdateAllowed )
            self.updateVolumeLevel(ev, el)
        self.volumeUpdateTimeout)

    @elems.volume.wrapper.on "mouseup", (ev)->
      self.volUpdateAllowed = false

    @elems.volume.wrapper.on "click", (ev)->
      el = $(@)
      self.updateVolumeLevel(ev, el)

    @elems.volume.wrapper.on "mouseenter", (ev)->
      if ev.which != 1
        self.volUpdateAllowed = false

    @elems.quality.bar.on 'click', '.vjs-quality-btn', (ev)->
      el = $(@)
      self.setQuality el.data('quality')

    @updateQualityBar()

    volIntegerLevel = Math.round( @player_orig.volume() * @elems.volume.items.length )
    @updateVolumeBar(volIntegerLevel);
    $(window).resize(=> @resize())

    @player_orig.ads()
    @player_orig.vast({url: window.mi_conf.vast.rolls.pre})

  updateVolumeLevel: (ev, el)->
    offset = 4
    wrp_padding = 12
    x = ev.pageX - @elems.volume.wrapper.offset().left - wrp_padding
    #6 levels with 6px width+padding
    integerLevel = Math.floor( (x+offset) / 6 )
    @updateVolumeBar(integerLevel)
    width = @elems.volume.wrapper.width();
    floatLevel = (x+wrp_padding)/width
    floatLevel = 1 if floatLevel > 1
    floatLevel = 0 if floatLevel < 0
    @player_orig.volume(floatLevel)

  updateVolumeBar: (integerLevel)->
    $(@elems.volume.items).each (i, el)->
      if i < integerLevel
        $(el).addClass("is-activated")
      else
        $(el).removeClass("is-activated")

  getCurrentQuality: ()->
    @parseURI(@player_orig.currentSrc()).fileWOExt

  parseURI: (uriStr)->
    uri = {}
    uri.hierPart = uriStr.split('?')[0]
    uriStrSplitted = uriStr.split('?')
    uri.query = if uriStrSplitted.length > 1 then uriStrSplitted[1].split('#')[0] else undefined
    uri.fragment = uriStr.split('#')[1]
    uri.file = uri.hierPart.split('/').slice(-1)[0]
    fileNameSplitted = uri.file.split('.')
    if fileNameSplitted.length > 1
      uri.ext = fileNameSplitted.slice(-1)[0]
      uri.fileWOExt = fileNameSplitted.slice(0, -1).join('.')
    else
      uri.ext = undefined
      uri.fileWOExt = uri.file
    uri.schemeHostPath = uri.hierPart.split('/').slice(0,-1).join('/')
    if uri.hierPart[uri.schemeHostPath.length] == '/'
      uri.schemeHostPath += '/'
    return uri

  getSourceExt: ()->
    this.parseURI(@player_orig.currentSrc()).ext

  getSourceDir: ()->
    this.parseURI(@player_orig.currentSrc()).schemeHostPath

  setQuality: (qualityTag)->
    self = @
    currTime = @player_orig.currentTime()
    isPaused = @player_orig.paused();
    if !isPaused
      @player_orig.pause()
    uri = @parseURI(@player_orig.currentSrc())
    newSrc = uri.schemeHostPath + qualityTag + '.' + uri.ext
    if uri.query
      newSrc += '?' + uri.query
    if uri.fragment
      newSrc += '#' + uri.fragment

    @player_orig.src newSrc
    #Should be load() there, but because of FireFox bug it is not working
    @player_orig.play()
    @player_orig.on 'loadedmetadata', ()->
      self.player_orig.currentTime currTime
      self.player_orig.on 'canplay', ()->
        if isPaused
          self.player_orig.pause()
        else
          self.player_orig.play()
        self.updateQualityBar()

  updateQualityBar: ()->
    qualityTag = @getCurrentQuality()
    @elems.quality.items.each (i, el)->
      $(el).toggleClass 'is-activated', $(el).data('quality') == qualityTag

  play: ()->
    @player_orig.play()
    return false

  pause: ()->
    @player_orig.pause()
    return false

  resize: ->
    width = @elems.player.parent().outerWidth()
    height = @elems.player.parent().outerHeight()
    @player_orig.width(width).height(height)

window.Player = Player