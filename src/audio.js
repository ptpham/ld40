

function playOuchAudio(extreme) {
  let ouchAudio = window[`ouch${_.random(0, 3)}Audio`];
  if (extreme) ouchAudio = ouch4Audio;
  ouchAudio.play();
}

module.exports = { playOuchAudio };

