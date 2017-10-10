window.onload = function() {
  var
    ctx           = new AudioContext()
    audio         = document.getElementById('audio-element')
    audioSrc      = ctx.createMediaElementSource(audio)
    analyser      = ctx.createAnalyser()
    frequencyData = new Uint8Array(analyser.frequencyBinCount)
    durator       = document.querySelector('.duration')
    svgPath       = document.querySelector('svg path')
    pathLenght = svgPath.getTotalLength()
    svgPath.style.strokeDasharray   = pathLenght
    svgPath.style.strokeDashoffset  = pathLenght

  audioSrc.connect(analyser)
  audioSrc.connect(ctx.destination)

  audio.ontimeupdate = function(){
    if (this.currentTime) {
      durator.textContent = Math.floor(this.currentTime/60)+'.'+ Math.floor(this.currentTime%60) +" / "+ Math.floor(this.duration/60) +'.'+ Math.floor(this.duration%60)
      svgPath.style.strokeDashoffset = ((this.currentTime/this.duration)*pathLenght)+pathLenght+'px'
    } else {
      durator.textContent = '-/-'
    }

  }

  function renderFrame() { //loop the loop for each tick
     requestAnimationFrame(renderFrame)
     analyser.getByteFrequencyData(frequencyData)
     var
      divs   = document.querySelectorAll('div.sound')
     for (var i = 0; i < divs.length; i++) {
       divs[i].setAttribute('style', 'height:'+Math.floor(((frequencyData[i+1]/256)*divs[i].parentElement.clientHeight))+'px; opacity: ' + ((frequencyData[i+1]/256) + .1)) //Calculate bar height. (revisit with d3?)
     }
  }
  audio.volume = 0.3;
  renderFrame()


  var
    divs = document.querySelectorAll('div.sound')
    txtBx= document.querySelector('.textBox')
    main = document.querySelector('main')
    play = false
    data =
      {
      'songs':[
      {
        'title':'shelteR',
        'artist':'Porter Robinson',
        'song':'song.mp3'
      },{
        'title':'Schwifty',
        'artist':'Rick n\' Morty',
        'song':'swift.mp3'
      },{
        'title':'ok x LionheaRted',
        'artist':'Porter Robinson',
        'song':'OK.mp3'
      },{
        'title':'Ocean Man',
        'artist':'Ween',
        'song':'ocean.mp3'
      },{
        'title':'Flyers',
        'artist':'Bradio',
        'song':'flyers.mp3'
      },{
        'title':'Falling',
        'artist':'Marcus James',
        'song':'falling.mp3'
      },{
        'title':'Chiisana',
        'artist':'Kio No Uta',
        'song':'chiisana.mp3'
      },{
        'title':'Paper Planes',
        'artist':'Virtual Riot',
        'song':'virtual.mp3'
      }
      ]
    }

  txtBx.addEventListener('click',function(){
    var
      audio = document.getElementById('audio-element')


    //Toggle playstate of the audio
    if (play) {
      audio.pause()
      play = false
      main.classList.toggle('play')
    }else{
      audio.play()
      play = true
      main.classList.toggle('play')
    }

  })

  window.addEventListener('resize',function(){
    if (window.innerWidth < 500) {
      divs[0].classList.remove('sound')
      divs[divs.length-1].classList.remove('sound')
    } else{
      divs[0].classList.add('sound')
      divs[divs.length-1].classList.add('sound')
    }
  })

  //Make selection buttons
  var
    previous = document.querySelector('#previous'),
    next     = document.querySelector('#next'),
    controls = document.querySelector('#controls'),
    current  = 0

    document.querySelector('main').appendChild(controls)
    document.querySelector('#controls').appendChild(previous)
    document.querySelector('#controls').appendChild(next)

    next.addEventListener('click',function next(){
      if (current < (data.songs.length - 1)) {
        var
          audio = document.getElementById('audio-element')
          txtBx = document.querySelector('.textBox')
          txtH1 = txtBx.querySelector('h1')
          txtH2 = txtBx.querySelector('h2')
          current += 1

        audio.src = 'assets/sound/'+data.songs[current].song
        txtH1.textContent = data.songs[current].title
        txtH2.textContent = data.songs[current].artist

        audio.play()
        document.querySelector('main').classList.add('play')
        play = true
      }else{
        current = -1
        next()
      }
    })
    previous.addEventListener('click',function previous(){
      if (current > 0) {
        var
          audio = document.getElementById('audio-element')
          txtBx = document.querySelector('.textBox')
          txtH1 = txtBx.querySelector('h1')
          txtH2 = txtBx.querySelector('h2')
          current -= 1

        audio.src = 'assets/sound/'+data.songs[current].song
        txtH1.textContent = data.songs[current].title
        txtH2.textContent = data.songs[current].artist

        audio.play()
        document.querySelector('main').classList.add('play')
        play = true
      }else{
          current = data.songs.length
          previous()
        }
    })
    var
      audio = document.getElementById('audio-element')
      txtBx = document.querySelector('.textBox')
      txtH1 = txtBx.querySelector('h1')
      txtH2 = txtBx.querySelector('h2')

    audio.src = 'assets/sound/'+data.songs[current].song
    txtH1.textContent = data.songs[current].title
    txtH2.textContent = data.songs[current].artist

  //Make random colors
  var
    clrs = ['#475B5A','#EDCB96','#474448','#C4AD83','#2E2E2E','#5A64AD']
    rndmclr = clrs[Math.floor(Math.random()*(clrs.length-1))]

  main.setAttribute('style', 'background-color:' + rndmclr + ';')
  document.querySelector('.license').setAttribute('style','color:' + rndmclr + ';')
  document.querySelector('.duration').setAttribute('style','color:' + rndmclr + ';')
  document.querySelector('#controls').setAttribute('style','color:' + rndmclr + ';')
  document.querySelector('#volume').setAttribute('style','color:' + rndmclr + ';')

  //Make volume options
  var
    volUp   = document.querySelector('#up')
    volDwn  = document.querySelector('#down')

  volUp.addEventListener('click', function(){
    if (audio.volume < 1) {
      audio.volume += .05
      audio.volume = Math.round(audio.volume * 100) / 100
        document.querySelector('#volume h3').textContent = Math.floor((audio.volume*100)) + '%'
    }
  })
  volDwn.addEventListener('click', function(){
    if (audio.volume > 0) {
      audio.volume -= .05
      audio.volume = Math.round(audio.volume * 100) / 100
      document.querySelector('#volume h3').textContent = Math.floor((audio.volume*100)) + '%'
    }
  })

};
