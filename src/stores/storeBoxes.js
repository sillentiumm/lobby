import { computed } from 'vue'
import { defineStore } from 'pinia'
import { getDatabase, ref, set, get, child, push, update, onValue } from 'firebase/database'

export const useBoxesStore = defineStore('userStore', {
  state: () => ({
    player1: '',
    player2: '',
    playersList: [],
    team: 0,
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
    turn: 0,
    winner: ''
  }),
  actions: {
    createBoxes(gameName, room) {
      console.log('создано')
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

    reset(data) {
      console.log('reset')
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

    joinTeam(data) {
      const db = getDatabase();
      const distanceRef = ref(db, `boxes/${data.room}`)
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
      const distanceRef = ref(db, `boxes/${data.room}`)
      const distanceTurn = ref(db, `boxes/${data.room}/turn`)
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
      const distancePlayer1 = ref(db, `boxes/${data.room}/player1`)
      const distancePlayer2 = ref(db, `boxes/${data.room}/player2`)
      const distanceField = ref(db, `boxes/${data.room}/field`)
      const distanceTurn = ref(db, `boxes/${data.room}/turn`)
      const distanceWinner = ref(db, `boxes/${data.room}/winner`)

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
        this.boxesField = snapshot.val()
      })
      onValue(distanceTurn, (snapshot) => {
        this.turn = snapshot.val()
      })
      onValue(distanceWinner, (snapshot) => {
        this.winner = snapshot.val()
      })
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

    resetGame(data) {
      console.log('reset')
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
  }
})