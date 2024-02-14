import { computed } from 'vue'
import { defineStore } from 'pinia'
import { getDatabase, ref, set, get, child, push, update, onValue } from 'firebase/database'

export const useTicTacToeStore = defineStore('userStore', {
  state: () => ({
    player1: '',
    player2: '',
    playersList: [],
    team: 0,
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
    winner: ''
  }),
  actions: {
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
    joinTeam(data) {
      const db = getDatabase();
      const distanceRef = ref(db, `tictactoe/${data.room}`)
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
      const distanceRef = ref(db, `tictactoe/${data.room}`)
      const distanceTurn = ref(db, `tictactoe/${data.room}/turn`)
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
      const distancePlayer1 = ref(db, `tictactoe/${data.room}/player1`)
      const distancePlayer2 = ref(db, `tictactoe/${data.room}/player2`)
      const distanceField = ref(db, `tictactoe/${data.room}/field`)
      const distanceFieldBig = ref(db, `tictactoe/${data.room}/fieldBig`)
      const distanceFieldNext = ref(db, `tictactoe/${data.room}/fieldNext`)
      const distanceTurn = ref(db, `tictactoe/${data.room}/turn`)
      const distanceWinner = ref(db, `tictactoe/${data.room}/winner`)

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
        this.field = snapshot.val()
      })
      onValue(distanceFieldBig, (snapshot) => {
        this.fieldBig = snapshot.val()
      })
      onValue(distanceFieldNext, (snapshot) => {
        this.fieldNext = snapshot.val()
      })
      onValue(distanceTurn, (snapshot) => {
        this.turn = snapshot.val()
      })
      onValue(distanceWinner, (snapshot) => {
        this.winner = snapshot.val()
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

    resetGame(data) {
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
      const distanceFiledNext = ref(db, `tictactoe/${data.room}/fieldNext`)

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

      if(this.fieldBig[data.idx]) {
        set(distanceFiledNext, -1)
      } else {
        set(distanceFiledNext, data.idx)
      }

    },

    miniWinnerTest(room, idxField, idx, team) {
      const db = getDatabase();
      const distanceField = ref(db, `tictactoe/${room}/field/${idxField}`)
      const distanceFieldBig = ref(db, `tictactoe/${room}/fieldBig/${idxField}`)
      const distanceWinner = ref(db, `tictactoe/${room}/winner`)

      const arrTeam = [team, team, team, team, team, team, team, team, team]
      const arrZero = [0,0,0,0,0,0,0,0,0]

      const globalWinnerTest = () => {
        if(this.fieldBig[0]==team && this.fieldBig[1]==team && this.field[2]==team) { }
        else if(this.fieldBig[3]==team && this.fieldBig[4]==team && this.fieldBig[5]==team) { }
        else if(this.fieldBig[6]==team && this.fieldBig[7]==team && this.fieldBig[8]==team) { }
        else if(this.fieldBig[0]==team && this.fieldBig[3]==team && this.fieldBig[6]==team) { }
        else if(this.fieldBig[1]==team && this.fieldBig[4]==team && this.fieldBig[7]==team) { }
        else if(this.fieldBig[2]==team && this.fieldBig[5]==team && this.fieldBig[8]==team) { }
        else if(this.fieldBig[0]==team && this.fieldBig[4]==team && this.fieldBig[8]==team) { }
        else if(this.fieldBig[2]==team && this.fieldBig[4]==team && this.fieldBig[6]==team) { }  
        else return false
        set(distanceWinner, localStorage.nickname)
      }

      const addToFirebase = (array, team) => {
        set(distanceField, array)
        set(distanceFieldBig, team)
        globalWinnerTest()
      };

      if(this.field[idxField][0]==team && this.field[idxField][1]==team && this.field[idxField][2]==team) { }
      else if(this.field[idxField][3]==team && this.field[idxField][4]==team && this.field[idxField][5]==team) { }
      else if(this.field[idxField][6]==team && this.field[idxField][7]==team && this.field[idxField][8]==team) { }
      else if(this.field[idxField][0]==team && this.field[idxField][3]==team && this.field[idxField][6]==team) { }
      else if(this.field[idxField][1]==team && this.field[idxField][4]==team && this.field[idxField][7]==team) { }
      else if(this.field[idxField][2]==team && this.field[idxField][5]==team && this.field[idxField][8]==team) { }
      else if(this.field[idxField][0]==team && this.field[idxField][4]==team && this.field[idxField][8]==team) { }
      else if(this.field[idxField][2]==team && this.field[idxField][4]==team && this.field[idxField][6]==team) { }  
      else if(this.field[idxField][0]&&this.field[idxField][1]&&this.field[idxField][2]&&this.field[idxField][3]&&this.field[idxField][4]&&this.field[idxField][5]&&this.field[idxField][6]&&this.field[idxField][7]&&this.field[idxField][8]) { }
      else return false

      addToFirebase(arrTeam, team)
    }

  }
})