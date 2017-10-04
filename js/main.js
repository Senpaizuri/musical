window.onload = function() {
  var
    ctx           = new AudioContext(),
    audio         = document.getElementById('audio-element'),
    audioSrc      = ctx.createMediaElementSource(audio),
    analyser       = ctx.createAnalyser()
    frequencyData = new Uint8Array(analyser.frequencyBinCount)

  audioSrc.connect(analyser)
  audioSrc.connect(ctx.destination)

  function renderFrame() {
     requestAnimationFrame(renderFrame)
     analyser.getByteFrequencyData(frequencyData)

     var
      divs   = document.querySelectorAll('div.sound')
      percent= (frequencyData[0]/256)

     for (var i = 0; i < divs.length; i++) {
       divs[i].setAttribute('style', 'height:'+((frequencyData[i+1]/256)*divs[i].parentElement.clientHeight)+'px;')
     }
  }
  audio.volume = 0.05;
  renderFrame()
};

var
  clrs = ['#52D1DC','#475B5A','#EDCB96','#474448','#EBCC19','#C4AD83','#DD6031','#2E2E2E','#5A64AD']
  divs = document.querySelectorAll('div.sound')
  main = document.querySelector('main')
  play = false
  rndmclr = clrs[Math.floor(Math.random()*(clrs.length-1))]

main.addEventListener('click',function(){
  var
    audio = document.getElementById('audio-element')

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


main.setAttribute('style', 'background-color:' + rndmclr + ';')
document.querySelector('.license').setAttribute('style','color:' + rndmclr + ';')
