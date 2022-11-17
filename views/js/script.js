let loopTimes = 0;
let iteration = 0;
let autoplay = true;
let videoList = document.querySelectorAll('.video-list-container .list');

videoList.forEach(vid => {
  vid.onclick = () => {
    videoList.forEach(remove => {
      remove.classList.remove('active');
      remove.querySelector('.delete-button').removeAttribute('hidden');
    });
    vid.classList.add('active');
    let src = vid.querySelector('.list-video').src;
    let title = vid.querySelector('.list-title').innerHTML;
    vid.querySelector('.delete-form .delete-button').setAttribute('hidden', true);
    let mainVideo = document.querySelector('.main-video-container .main-video');
    document.querySelector('.main-video-container .main-vid-title').innerHTML = title;
    mainVideo.src = src;
    mainVideo.onended = function() {
      if (loopTimes == 0) {
        // Loop the video indefinitely
        mainVideo.play();
      }
      else {
        // Play the video for certain times only
        iteration++;
        if (iteration <= loopTimes-1) {
          mainVideo.play();
        }
        else {
          iteration = 0;

          if (autoplay) {
            nextVideo = vid.nextElementSibling;
            if (nextVideo) {
              nextVideo.click();
            }
          }
        }
      }
    };
    mainVideo.play()

    let selectedButton = document.querySelector('.selected-button');
    selectedButton.classList.add('unselected-button');
    selectedButton.classList.remove('selected-button');

    let defaultButton = document.querySelector('#default-button');
    defaultButton.classList.add('selected-button');
    defaultButton.classList.remove('unselected-button');
  };
});

function setPlaySpeed(element, x) {
  document.querySelector('.main-video-container .main-video').playbackRate = x;
  let selected = document.querySelector('.selected-button');
  selected.classList.add('unselected-button');
  selected.classList.remove('selected-button');

  element.classList.add('selected-button');
  element.classList.remove('unselected-button');
}

function setRepeat() {
  loopTimes = parseInt(document.getElementById('video-repeat-times').value);

  if (loopTimes == 0) {
    document.querySelector('.main-video-container .main-video').setAttribute('loop', true);
  }
  else {
    document.querySelector('.main-video-container .main-video').removeAttribute('loop');
  }
}

function setAutoplay() {
  autoplay = document.querySelector('.autoplay-checkbox').checked;
}

function openList(listId) {
  var i;
  var x = document.getElementsByClassName('video-list-container');
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
  }
  document.getElementById('video-list-container-' + listId).style.display = "block";

  var y = document.getElementsByClassName("w3-bar-item w3-button");
  for (i = 0; i < y.length; i++) {
    y[i].classList.remove('active-nav-button');
  }
  document.getElementById('video-list-nav-button-' + listId).classList.add = "block";
}

const actualBtn = document.getElementById('actual-btn');
const fileChosen = document.getElementById('file-chosen');

actualBtn.addEventListener('change', function() {
  fileChosen.textContent = this.files[0].name
});
