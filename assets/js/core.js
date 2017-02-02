// Core

var divContainer = document.querySelector('.container')

var currentLevel

// 3d level array, start positions of element
// outer array is for levels, inner array for elements in each level

var levelArray = [
  [
    [11, 21, 13],
    [11, 23, 13]
  ],
  [
    [32, 42, 42, 34]
  ],
  [
    [0, 32, 0, 34, 0],
    [32, 24, 0, 22, 34],
    [0, 32, 0, 34, 0]
  ],
  [
    [0, 14, 23, 11, 0],
    [0, 22, 51, 24, 0],
    [31, 13, 41, 12, 33],
    [0, 0, 33, 0, 0]
  ],
  [
    [32, 34],
    [22, 24],
    [12, 13]
  ],
  [
    [0, 32, 0, 34, 0],
    [0, 22, 42, 24, 0],
    [0, 41, 33, 41, 0],
    [0, 22, 51, 24, 0],
    [31, 12, 31, 13, 31]
  ]
]

// solution array for level
var solutionArray = [
  [
    [12, 21, 13],
    [11, 23, 14]
  ],
  [
    [34, 41, 41, 32]
  ],
  [
    [0, 31, 0, 31, 0],
    [34, 22, 0, 24, 32],
    [0, 33, 0, 33, 0]
  ],
  [
    [0, 12, 21, 13, 0],
    [0, 24, 51, 22, 0],
    [34, 14, 42, 11, 32],
    [0, 0, 33, 0, 0]
  ],
  [
    [31, 31],
    [24, 22],
    [11, 14]
  ],
  [
    [0, 31, 0, 31, 0],
    [0, 24, 41, 22, 0],
    [0, 42, 31, 42, 0],
    [0, 24, 51, 22, 0],
    [34, 14, 33, 11, 32]
  ]
]

// test level for checking elements line up
// levelArray = [
//   [
//     [51, 34]
//     // [11, 21, 32, 41, 51],
//     // [34, 22, 24, 51, 22]
//   ],
//   [
//     [51, 34]
//     // [11, 21, 32, 41, 51],
//     // [34, 22, 24, 51, 22]
//   ]
// ]
//
// solutionArray = [
//   [
//     [51, 32]
//     // [11, 21, 32, 41, 51],
//     // [34, 22, 24, 51, 22]
//   ],
//   [
//     [51, 32]
//     // [11, 21, 32, 41, 51],
//     // [34, 22, 24, 51, 22]
//   ]
// ]

// array for monitoring element orientation status
var playArray = []

function init() {
  // console.log(divContainer)
  currentLevel = 0 // start at level 1
  clearGrids()
  clearInstruction()
  showInstruction()
  loadLevel(currentLevel)
}

function showInstruction() {
  $('.instruction').append('<h2>How to play:</h2>')
  $('.instruction').append('<p>Click on any graphics element to rotate it. Connect all the lines and corners to make perfect connections.</p>')
}

function clearInstruction() {
  $('.instruction').empty()
}

function displayGameOver() {
  $('.levelText').text('')
  $('.instruction').append('<h2>Game Over.<br>Thank you for playing</h2>')
  $('.instruction').append('<button class=\'btn large\'>Start Again</button>')
  $('.btn').on('click', init)
}

function deepClone(arr) {
  var len = arr.length
  var newArr = new Array(len)
  for (var i = 0; i < len; i++) {
    if (Array.isArray(arr[i])) {
      newArr[i] = deepClone(arr[i])
    } else {
      newArr[i] = arr[i]
    }
  }
  return newArr
}

function loadLevel(levelNum) {
  // show instruction only at level 1
  if (levelNum === 1) {
    clearInstruction()
  }

  $('.levelText').text('# ' + (currentLevel + 1))
  // get level array length and initialise playArray
  playArray = deepClone(levelArray[levelNum])

  // for each row
  var element1Index = 0
  levelArray[levelNum].forEach(function(curLevel) {
    // console.log('row: ' + curLevel)
    // create row div here
    var divRow = document.createElement('div')
    divRow.classList.add('parent')
    divContainer.appendChild(divRow)
    // init
    var element2Index = 0
    curLevel.forEach(function(item) {
      // console.log('level :' + item)
      // create div for each image
      var newDiv = document.createElement('div')
      newDiv.classList.add('child')

      var newImg = document.createElement('img')
      newImg.setAttribute('src', './assets/images/' + item + '.png')
      newImg.setAttribute('data-arrayRowIndex', element1Index)
      newImg.setAttribute('data-flag', 'false')
      newImg.setAttribute('data-arrayIndex', element2Index)
      newImg.addEventListener('click', rotate)
      newImg.addEventListener('animationend', myEndFunction)

      newDiv.appendChild(newImg)
      element2Index += 1
      // console.log(divContainer)
      divRow.appendChild(newDiv)
    })

    element1Index += 1
  })
}

function displaySolution(levelNum) {
  // for each row
  solutionArray[levelNum].forEach(function(solLevel) {
    // console.log('row: ' + solLevel)
    // create row div here
    var divRow = document.createElement('div')
    divRow.classList.add('parent')
    divContainer.appendChild(divRow)
    // init
    solLevel.forEach(function(item) {
      // console.log('level :' + item)
      // create div for each image
      var newDiv = document.createElement('div')
      newDiv.classList.add('child')

      var newImg = document.createElement('img')
      newImg.setAttribute('src', './assets/images/' + item + '-soln.png')

      newDiv.appendChild(newImg)
      // console.log(divContainer)
      divRow.appendChild(newDiv)
    })
  })
  // append button for going to next level
  $('.buttonDiv').append('<button class=\'btn\'>Next Level</button>')
  $('button').on('click', buttonNextLevel)
}

function buttonNextLevel() {
  clearGrids()
  currentLevel += 1
  if (solutionArray.length == currentLevel) {
    displayGameOver()
  } else loadLevel(currentLevel)
}

function updatePlayArray(elm) {
  // eg: 2d array [[11, 21, 13], [11, 23, 13]]
  // playArray index to change to new rotated element
  var next2ndDigit = null
  var element1Index = parseInt(elm.getAttribute('data-arrayRowIndex')) // get row index
  var element2Index = parseInt(elm.getAttribute('data-arrayIndex')) // get index within row
  var elementId = playArray[element1Index][element2Index].toString().split('')
  var element1stDigit = elementId.shift() // get the first digit of elementType
  var element2ndDigit = elementId.pop() // get the second digit of elementType

  // check 2nd digit, then put into playArray
  // eg: 11 -> 12, 12 -> 13 , 13 -> 14, 14 -> 11, goes round robin
  // and type 5 elements
  if (element1stDigit === '0' || element1stDigit === '5') {
    // do nothing
  } else {
    switch (element2ndDigit) {
      case '1':
        next2ndDigit = '2'
        break
      case '2':
        // need special handling for type 42
        // toggle between 42 and 41
        if (element1stDigit === '4') {
          next2ndDigit = '1'
        } else next2ndDigit = '3'
        break
      case '3':
        next2ndDigit = '4'
        break
      case '4':
        next2ndDigit = '1'
        break

      default:

    }
    playArray[element1Index][element2Index] = parseInt(element1stDigit + next2ndDigit)
  }
}

function clearGrids() {
  // clear solution div and graphics
  while (divContainer.hasChildNodes()) {
    divContainer.removeChild(divContainer.firstChild)
  }
  $('.buttonDiv').empty()
}

function checkSolution() {
  var result = []
  var levelPlay = playArray

  var levelSolution = solutionArray[currentLevel]
  var countLength = levelSolution.length // row array length
  for (var i = 0; i < countLength; i++) {
    // iterate thro each row array
    var innerLength = levelSolution[0].length
    for (var j = 0; j < innerLength; j++)
    // comparison elements played against solution  => add one/any value to the result
    {
      if (levelPlay[i][j] === levelSolution[i][j]) {
        result.push(j)
      }
    }
  }

  // count result length against total number of elements  => true
  if (result.length === countLength * innerLength) {
    return true
  } else return false
}

function rotate() {
  var flag = this.getAttribute('data-flag')
  console.log(flag)
  if (flag === 'false') {
    switch (this.className) {
      case 'spin0to90':
        this.className = 'spin90to180'
        console.log(this.className)
        console.log(this)
        // updatePlayArray
        updatePlayArray(this)
        this.setAttribute('data-flag', 'true')
        break
      case 'spin90to180':
        this.className = 'spin180to270'
        console.log(this.className)
        console.log(this)
        updatePlayArray(this)
        this.setAttribute('data-flag', 'true')
        break
      case 'spin180to270':
        this.className = 'spin270to360'
        console.log(this.className)
        console.log(this)
        updatePlayArray(this)
        this.setAttribute('data-flag', 'true')
        break
      case 'spin270to360':
        this.className = 'spin0to90'
        console.log(this.className)
        console.log(this)
        updatePlayArray(this)
        this.setAttribute('data-flag', 'true')
        break
      default:
        this.className = 'spin0to90'
        console.log(this.className)
        console.log(this)
        updatePlayArray(this)
        this.setAttribute('data-flag', 'true')
        break
    }
  }
  // note check code
  if (checkSolution() === true) {
    clearGrids()
    displaySolution(currentLevel)
    console.log('Solved!!!!!!')
  }
}

function myEndFunction() {
  console.log('transistion ends')
  this.setAttribute('data-flag', 'false')
}

$(document).ready(function() {
  console.log('ready!')
  init()
})
