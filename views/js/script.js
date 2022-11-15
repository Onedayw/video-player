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
    document.querySelector('.main-video-container .main-vid-title').innerHTML = title;
    document.querySelector('.main-video-container .main-video').src = src;
    document.querySelector('.main-video-container .main-video').play();

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

// function setRepeat(element, x) {
//   document.querySelector('.main-video-container .main-video').playbackRate = x;
//   let selected = document.querySelector('.selected-button');
//   selected.classList.add('unselected-button');
//   selected.classList.remove('selected-button');
//
//   element.classList.add('selected-button');
//   element.classList.remove('unselected-button');
// }

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
