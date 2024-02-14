import { computed } from 'vue'
import { defineStore } from 'pinia'
import { getDatabase, ref, set, get, child, push, update, onValue } from 'firebase/database'

export const useStore = defineStore('userStore', {
  state: () => ({
    player1: '',
    player2: '',
    playersList: [],
    team: 0,
    turn: 0,
    winner: '',
    pentagoField: [
      0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,1,1,0,0,0,
      0,0,0,0,0,0,0,2,0,0,0,0
    ],
    boxesField: [
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0
    ],
    ticTacToeField: [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ],
    ticTacToeFieldBig: [0,0,0,0,0,0,0,0,0],
    ticTacToeFieldNext: -1,
  }),
  actions: {
    createPentago(gameName, room) {
      const db = getDatabase();
      const dbRef = ref(getDatabase());
      const referenceRoom = ref(db, gameName +'/' + room + '/field')
  
      get(child(dbRef, `${gameName}/${room}/field`)).then((snapshot) => {
        if(snapshot.exists()) {
        }
        else {
          set(referenceRoom, [
            0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0
          ])
        } 
      })
    },
    joinTeam(data) {
      const db = getDatabase();
      const distanceRef = ref(db, `${data.game}/${data.room}`)
      if(!this.team) {
        if(data.team == 1) {
          update(distanceRef, {
            player1: localStorage.nickname
          })
        }
        else {
          update(distanceRef, {
            player2: localStorage.nickname
          })
        }
      }
    },

    leaveTeam(data) {
      const db = getDatabase();
      const distanceRef = ref(db, `${data.game}/${data.room}`)
      const distanceTurn = ref(db, `${data.game}/${data.room}/turn`)
      if(data.team == 1) {
        update(distanceRef, {
          player1: null
        })
      }
      else {
        update(distanceRef, {
          player2: null
        })
      }
      this.team = 0
      set(distanceTurn, 0)
    },

    async watchRoom(data) {
      const db = getDatabase();
      const distancePlayer1 = ref(db, `${data.game}/${data.room}/player1`)
      const distancePlayer2 = ref(db, `${data.game}/${data.room}/player2`)
      const distanceField = ref(db, `${data.game}/${data.room}/field`)
      const distanceFieldBoxes = ref(db, `boxes/${data.room}/field`)
      const distanceTicTacToeField = ref(db, `tictactoe/${data.room}/field`)
      const distanceTicTacToeFieldBig = ref(db, `tictactoe/${data.room}/fieldBig`)
      const distanceTicTacToeFieldNext = ref(db, `tictactoe/${data.room}/fieldNext`)
      const distanceTurn = ref(db, `${data.game}/${data.room}/turn`)
      const distanceWinner = ref(db, `${data.game}/${data.room}/winner`)
      onValue(distancePlayer1, (snapshot) => {
        this.player1 = snapshot.val()
        if(this.player1 == localStorage.nickname) {
          this.team = 1
        }
      })
      onValue(distancePlayer2, (snapshot) => {
        this.player2 = snapshot.val()
        if(this.player2 == localStorage.nickname) {
          this.team = 2
        }
      })
      onValue(distanceField, (snapshot) => {
        this.pentagoField = snapshot.val()
      })
      onValue(distanceFieldBoxes, (snapshot) => {
        this.boxesField = snapshot.val()
      })
      onValue(distanceTicTacToeField, (snapshot) => {
        this.ticTacToeField = snapshot.val()
      })
      onValue(distanceTicTacToeFieldBig, (snapshot) => {
        this.ticTacToeFieldBig = snapshot.val()
      })
      onValue(distanceTicTacToeFieldNext, (snapshot) => {
        this.ticTacToeFieldNext = snapshot.val()
      })
      onValue(distanceTurn, (snapshot) => {
        this.turn = snapshot.val()
      })
      onValue(distanceWinner, (snapshot) => {
        this.winner = snapshot.val()
      })
    },

    //PENTAGO
    startPentago(data) {
      const db = getDatabase();
      const distanceField = ref(db, `${data.game}/${data.room}`)
      update(distanceField, {
        field: [
          0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0
        ],
        turn: 1,
        winner:''
      })
    },

    resetPentago(data) {
      const db = getDatabase();
      const distanceField = ref(db, `pentago/${data.room}`)

      update(distanceField, {
        field: [
          0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0
        ],
        turn: 0,
        winner:''
      })

      if(data.player == 1) {
        update(distanceField, {
          player1: ''
        })
      } else if(data.player == 2) {
        update(distanceField, {
          player2: ''
        })
      }
    },

    pentagoTurn1(data){
      const db = getDatabase();
      const distanceField = ref(db, `pentago/${data.room}/field/${data.idx}`)
      const distanceTurn = ref(db, `pentago/${data.room}/turn`)

      if(this.turn == 1) {
        set(distanceField, 1)
        set(distanceTurn, 2)
        this.pentagoWinnerTest1(data.room, data.idx, 1)
      }
      else if(this.turn == 3) {
        set(distanceField, 2)
        set(distanceTurn, 4)
        this.pentagoWinnerTest1(data.room, data.idx, 2)
      }
    },

    pentagoTurn2(data){
      const db = getDatabase();
      const distanceField = ref(db, `pentago/${data.room}/field`)
      const distanceTurn = ref(db, `pentago/${data.room}/turn`)

      function rotate(arr, rotateCount) {
        const clone = arr.slice(0);
        for(let j = 0; j<rotateCount * 2; j++ ) {
          clone.unshift(clone.at(-1))
          clone.pop()
        }
        return clone
      }

      function addToField(oldArr, oldIdx, newIdx) {
        for(let i =0; i<8; i++) {
          const distanceFieldIdx = ref(db, `pentago/${data.room}/field/${oldIdx[i]}`)
          set(distanceFieldIdx, oldArr[newIdx[i]])
        }
      }

      const arrIndexes = []
      if(data.location == 1) { arrIndexes.push(0,1,2,8,14,13,12,6)}
      else if(data.location == 2) { arrIndexes.push(3,4,5,11,17,16,15,9)}
      else if(data.location == 3) { arrIndexes.push(18,19,20,26,32,31,30,24)}
      else { arrIndexes.push(21,22,23,29,35,34,33,27) }

      const arrIndexesNew = rotate(arrIndexes, data.rotate)
      addToField(this.pentagoField, arrIndexes, arrIndexesNew)

      if(this.turn == 2) {
        set(distanceTurn, 3)
        this.pentagoWinnerTest2(1, data.room)
      }
      else if(this.turn == 4) {
        set(distanceTurn, 1)
        this.pentagoWinnerTest2(2, data.room)
      }
    },

    pentagoWinnerTest1(room, idx, team) {
      const db = getDatabase();
      const distanceWinner = ref(db, `pentago/${room}/winner`)

      if((this.pentagoField[Math.floor(idx/6)*6 + 1]==team && this.pentagoField[Math.floor(idx/6)*6 + 2]==team && this.pentagoField[Math.floor(idx/6)*6 + 3]==team && this.pentagoField[Math.floor(idx/6)*6 + 4]==team)) {
        if((this.pentagoField[Math.floor(idx/6)*6]) || this.pentagoField[Math.floor(idx/6)*6 + 5]) { set(distanceWinner, localStorage.nickname) } 
      }

      else if((this.pentagoField[6 + idx % 6]==team && this.pentagoField[12 + idx % 6]==team && this.pentagoField[18 + idx % 6]==team && this.pentagoField[24 + idx % 6]==team)) {
        if((this.pentagoField[idx % 6]==team ) || this.pentagoField[30 + idx % 6]==team) { set(distanceWinner, localStorage.nickname) }
      }
      else {this.pentagoWinnerDiagonals(team, room)}
    },

    pentagoWinnerTest2(team,room) {
      const db = getDatabase();
      const distanceWinner = ref(db, `pentago/${room}/winner`)

      for(let i =0; i<36; i+=6) {
        if((this.pentagoField[i+ 1]==team && this.pentagoField[i + 2]==team && this.pentagoField[i + 3]==team && this.pentagoField[i + 4]==team)) {
          if((this.pentagoField[i]) || this.pentagoField[i + 5]) { set(distanceWinner, localStorage.nickname) } 
        }
      }
      for(let j =0; j<6; j++) {
        if((this.pentagoField[6 + j]==team && this.pentagoField[12 + j]==team && this.pentagoField[18 + j]==team && this.pentagoField[24 + j]==team)) {
          if((this.pentagoField[j]==team) ||  this.pentagoField[30+ j]==team) { set(distanceWinner, localStorage.nickname) } 
        }
      }
      this.pentagoWinnerDiagonals(team, room)
    },

    pentagoWinnerDiagonals(team,room) {
      const db = getDatabase();
      const distanceWinner = ref(db, `pentago/${room}/winner`)

      if(this.pentagoField[6]==team && this.pentagoField[13]==team && this.pentagoField[20]==team && this.pentagoField[27]==team && this.pentagoField[34]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[0]==team && this.pentagoField[7]==team && this.pentagoField[14]==team && this.pentagoField[21]==team && this.pentagoField[28]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[7]==team && this.pentagoField[14]==team && this.pentagoField[21]==team && this.pentagoField[28]==team && this.pentagoField[35]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[1]==team && this.pentagoField[8]==team && this.pentagoField[15]==team && this.pentagoField[22]==team && this.pentagoField[29]==team) {set(distanceWinner, localStorage.nickname)}

      else if(this.pentagoField[4]==team && this.pentagoField[9]==team && this.pentagoField[14]==team && this.pentagoField[19]==team && this.pentagoField[24]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[5]==team && this.pentagoField[10]==team && this.pentagoField[15]==team && this.pentagoField[20]==team && this.pentagoField[25]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[10]==team && this.pentagoField[15]==team && this.pentagoField[20]==team && this.pentagoField[25]==team && this.pentagoField[30]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[11]==team && this.pentagoField[16]==team && this.pentagoField[21]==team && this.pentagoField[26]==team && this.pentagoField[31]==team) {set(distanceWinner, localStorage.nickname)}
    },

    //BOXES
    createBoxes(gameName, room) {
      const db = getDatabase();
      const dbRef = ref(getDatabase());
      const referenceRoom = ref(db, 'boxes/' + room + '/field')
  
      get(child(dbRef, `boxes/${room}/field`)).then((snapshot) => {
        if(snapshot.exists()) {
        }
        else {
          set(referenceRoom, [
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0
          ])
        } 
      })
    },

    resetBoxes(data) {
      const db = getDatabase();
      const distanceField = ref(db, `boxes/${data.room}`)

      update(distanceField, {
        field: [
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0
        ],
        turn: 0,
        winner:''
      })

      if(data.player == 1) {
        update(distanceField, {
          player1: ''
        })
      } else if(data.player == 2) {
        update(distanceField, {
          player2: ''
        })
      }
    },

    startBoxes(data) {
      const db = getDatabase();
      const distanceField = ref(db, `boxes/${data.room}`)
      update(distanceField, {
        field: [
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0
        ],
        turn: 1,
        winner:''
      })
    },

    boxesTurn(data){
      const db = getDatabase();
      const distanceField = ref(db, `boxes/${data.room}/field/${data.idx}`)
      const distanceTurn = ref(db, `boxes/${data.room}/turn`)

      if(this.turn == 1) {
        set(distanceField, 1)
        set(distanceTurn, 2)
        this.boxesWinnerTest(data.room, data.idx, 1)
      }
      else if(this.turn == 2) {
        set(distanceField, 2)
        set(distanceTurn, 1)
        this.boxesWinnerTest(data.room, data.idx, 2)
      }
    },

    resetGameBoxes(data) {
      const db = getDatabase();
      const distanceField = ref(db, `boxes/${data.room}`)

      update(distanceField, {
        field: [
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0
        ],
        turn: 0,
        winner:''
      })

      if(data.player == 1) {
        update(distanceField, {
          player1: ''
        })
      } else if(data.player == 2) {
        update(distanceField, {
          player2: ''
        })
      }
    },

    boxesWinnerTest(room, idx, team) {
      const db = getDatabase();
      const distanceWinner = ref(db, `boxes/${room}/winner`)
      // vertical
      if(this.boxesField[idx + 10] == team && this.boxesField[idx + 20] == team && this.boxesField[idx + 30] == team ) {
        set(distanceWinner, localStorage.nickname)
      }
      
      // horizontal
      let count = 0
      for(let i =0; i<10; i++) {
        if(this.boxesField[Math.floor(idx/10)*10+i] == team) {
          count++
          if(count == 4) {
            set(distanceWinner, localStorage.nickname)
          }
        } else {
          count = 0
        }
      }

      // diagonal1
      count = 0 
      if(((Math.floor(idx/10)*10) + 10 == Math.floor((idx + 11)/10)*10) && this.boxesField[idx+11] == team ) {
        count++
        if(((Math.floor(idx/10)*10) + 20 == Math.floor((idx + 22)/10)*10) && this.boxesField[idx+22] == team ) {
          count++
          if(((Math.floor(idx/10)*10) + 30 == Math.floor((idx + 33)/10)*10) && this.boxesField[idx+33] == team ) {
            count++
            set(distanceWinner, localStorage.nickname)
          }
        }
      }
      if(((Math.floor(idx/10)*10) - 10 == Math.floor((idx - 11 )/10)*10) && this.boxesField[idx-11] == team ) {
        count++
        if(count==3) { set(distanceWinner, localStorage.nickname) }
        if(((Math.floor(idx/10)*10) - 20 == Math.floor((idx - 22 )/10)*10) && this.boxesField[idx-22] == team ) {
          count++
          if(count==3) { set(distanceWinner, localStorage.nickname) }
          if(((Math.floor(idx/10)*10) - 30 == Math.floor((idx - 33 )/10)*10) && this.boxesField[idx-33] == team ) {
            count++
            set(distanceWinner, localStorage.nickname)
          }
        }
      }

      // diagonal2
      count = 0 
      if(((Math.floor(idx/10)*10) + 10 == Math.floor((idx + 9)/10)*10) && this.boxesField[idx+9] == team ) {
        count++
        if(((Math.floor(idx/10)*10) + 20 == Math.floor((idx + 18)/10)*10) && this.boxesField[idx+18] == team ) {
          count++
          if(((Math.floor(idx/10)*10) + 30 == Math.floor((idx + 27)/10)*10) && this.boxesField[idx+27] == team ) {
            count++
            set(distanceWinner, localStorage.nickname)
          }
        }
      }
      if(((Math.floor(idx/10)*10) - 10 == Math.floor((idx - 9 )/10)*10) && this.boxesField[idx-9] == team ) {
        count++
        if(count==3) { set(distanceWinner, localStorage.nickname) }
        if(((Math.floor(idx/10)*10) - 20 == Math.floor((idx - 18 )/10)*10) && this.boxesField[idx-18] == team ) {
          count++
          if(count==3) { set(distanceWinner, localStorage.nickname) }
          if(((Math.floor(idx/10)*10) - 30 == Math.floor((idx - 27 )/10)*10) && this.boxesField[idx-27] == team ) {
            count++
            set(distanceWinner, localStorage.nickname)
          }
        }
      }
    },


    //TicTacToe
    createTicTacToe(gameName, room) {
      const db = getDatabase();
      const dbRef = ref(getDatabase());
      const referenceRoom = ref(db, 'tictactoe/' + room + '/field')
  
      get(child(dbRef, `tictactoe/${room}/field`)).then((snapshot) => {
        if(snapshot.exists()) {
        }
        else {
          set(referenceRoom, [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
          ])
        } 
      })
    },

    startTicTacToe(data) {
      const db = getDatabase();
      const distanceField = ref(db, `tictactoe/${data.room}`)
      update(distanceField, {
        field: [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        fieldBig: [0,0,0,0,0,0,0,0,0],
        fieldNext: -1,
        turn: 1,
        winner:''
      })
    },

    resetGameTicTacToe(data) {
      const db = getDatabase();
      const distanceField = ref(db, `tictactoe/${data.room}`)

      update(distanceField, {
        field: [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        fieldBig: [0,0,0,0,0,0,0,0,0],
        fieldNext: -1,
        turn: 0,
        winner:''
      })

      if(data.player == 1) {
        update(distanceField, {
          player1: ''
        })
      } else if(data.player == 2) {
        update(distanceField, {
          player2: ''
        })
      }
    },

    ticTacToeTurn(data){
      const db = getDatabase();
      const distanceField = ref(db, `tictactoe/${data.room}/field/${data.idxField}/${data.idx}`)
      const distanceTurn = ref(db, `tictactoe/${data.room}/turn`)
      const distanceFieldNext = ref(db, `tictactoe/${data.room}/fieldNext`)

      if(this.turn == 1) {
        set(distanceField, 1)
        set(distanceTurn, 2)
        this.miniWinnerTest(data.room, data.idxField, data.idx, 1)
      }
      else if(this.turn == 2) {
        set(distanceField, 2)
        set(distanceTurn, 1)
        this.miniWinnerTest(data.room, data.idxField, data.idx, 2)
      }

      if(this.ticTacToeFieldBig[data.idx]) {
        set(distanceFieldNext, -1)
      } else {
        set(distanceFieldNext, data.idx)
      }

    },

    miniWinnerTest(room, idxField, idx, team) {
      const db = getDatabase();
      const distanceField = ref(db, `tictactoe/${room}/field/${idxField}`)
      const distanceFieldBig = ref(db, `tictactoe/${room}/fieldBig/${idxField}`)
      const distanceWinner = ref(db, `tictactoe/${room}/winner`)

      const arrTeam = [team, team, team, team, team, team, team, team, team]

      const globalWinnerTest = () => {
        if(this.ticTacToeFieldBig[0]==team && this.ticTacToeFieldBig[1]==team && this.ticTacToeFieldBig[2]==team) { }
        else if(this.ticTacToeFieldBig[3]==team && this.ticTacToeFieldBig[4]==team && this.ticTacToeFieldBig[5]==team) { }
        else if(this.ticTacToeFieldBig[6]==team && this.ticTacToeFieldBig[7]==team && this.ticTacToeFieldBig[8]==team) { }
        else if(this.ticTacToeFieldBig[0]==team && this.ticTacToeFieldBig[3]==team && this.ticTacToeFieldBig[6]==team) { }
        else if(this.ticTacToeFieldBig[1]==team && this.ticTacToeFieldBig[4]==team && this.ticTacToeFieldBig[7]==team) { }
        else if(this.ticTacToeFieldBig[2]==team && this.ticTacToeFieldBig[5]==team && this.ticTacToeFieldBig[8]==team) { }
        else if(this.ticTacToeFieldBig[0]==team && this.ticTacToeFieldBig[4]==team && this.ticTacToeFieldBig[8]==team) { }
        else if(this.ticTacToeFieldBig[2]==team && this.ticTacToeFieldBig[4]==team && this.ticTacToeFieldBig[6]==team) { }  
        else return false
        set(distanceWinner, localStorage.nickname)
      }

      const addToFirebase = (array, team) => {
        set(distanceField, array)
        set(distanceFieldBig, team)
        globalWinnerTest()
      };

      if(this.ticTacToeField[idxField][0]==team && this.ticTacToeField[idxField][1]==team && this.ticTacToeField[idxField][2]==team) { }
      else if(this.ticTacToeField[idxField][3]==team && this.ticTacToeField[idxField][4]==team && this.ticTacToeField[idxField][5]==team) { }
      else if(this.ticTacToeField[idxField][6]==team && this.ticTacToeField[idxField][7]==team && this.ticTacToeField[idxField][8]==team) { }
      else if(this.ticTacToeField[idxField][0]==team && this.ticTacToeField[idxField][3]==team && this.ticTacToeField[idxField][6]==team) { }
      else if(this.ticTacToeField[idxField][1]==team && this.ticTacToeField[idxField][4]==team && this.ticTacToeField[idxField][7]==team) { }
      else if(this.ticTacToeField[idxField][2]==team && this.ticTacToeField[idxField][5]==team && this.ticTacToeField[idxField][8]==team) { }
      else if(this.ticTacToeField[idxField][0]==team && this.ticTacToeField[idxField][4]==team && this.ticTacToeField[idxField][8]==team) { }
      else if(this.ticTacToeField[idxField][2]==team && this.ticTacToeField[idxField][4]==team && this.ticTacToeField[idxField][6]==team) { }  
      else if(this.ticTacToeField[idxField][0]&&this.ticTacToeField[idxField][1]&&this.ticTacToeField[idxField][2]&&this.ticTacToeField[idxField][3]&&this.ticTacToeField[idxField][4]&&this.ticTacToeField[idxField][5]&&this.ticTacToeField[idxField][6]&&this.ticTacToeField[idxField][7]&&this.ticTacToeField[idxField][8]) { }
      else return false

      addToFirebase(arrTeam, team)
    }
  }
})