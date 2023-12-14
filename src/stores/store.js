import { computed } from 'vue'
import { defineStore } from 'pinia'
import { getDatabase, ref, set, get, child, push, update, onValue } from 'firebase/database'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    player1: '',
    player2: '',
    playersList: [],
    abcTest: [1,2,3,4],
    team: 0,
    pentagoField: [
      0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,1,1,0,0,0,
      0,0,0,0,0,0,0,2,0,0,0,0
    ],
    turn: 0,
    winner: ''
  }),
  actions: {
    createRoom(gameName, room) {
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
      onValue(distanceTurn, (snapshot) => {
        this.turn = snapshot.val()
      })
      onValue(distanceWinner, (snapshot) => {
        this.winner = snapshot.val()
      })
    },

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

    pentagoTurn1(data){
      const db = getDatabase();
      const distanceField = ref(db, `${data.game}/${data.room}/field/${data.idx}`)
      const distanceTurn = ref(db, `${data.game}/${data.room}/turn`)

      if(this.turn == 1) {
        set(distanceField, 1)
        set(distanceTurn, 2)
        this.pentagoWinnerTest(data.room, data.idx, 1)
      }
      else if(this.turn == 3) {
        set(distanceField, 2)
        set(distanceTurn, 4)
        this.pentagoWinnerTest(data.room, data.idx, 2)
      }

    },

    pentagoTurn2(data){
      const db = getDatabase();
      const distanceField = ref(db, `${data.game}/${data.room}/field`)
      const distanceTurn = ref(db, `${data.game}/${data.room}/turn`)

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
          const distanceFieldIdx = ref(db, `${data.game}/${data.room}/field/${oldIdx[i]}`)
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
      }
      else if(this.turn == 4) {
        set(distanceTurn, 1)
      }
    },

    pentagoWinnerTest(room, idx, team) {
      const db = getDatabase();
      const distanceWinner = ref(db, `pentago/${room}/winner`)
      //horizontal
      if(!(this.pentagoField[Math.floor(idx/6)*6 + 2]==team && this.pentagoField[Math.floor(idx/6)*6 + 3]==team)) {}
      else if(this.pentagoField[Math.floor(idx/6)*6]==team && this.pentagoField[Math.floor(idx/6)*6 + 1]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[Math.floor(idx/6)*6 + 1]==team && this.pentagoField[Math.floor(idx/6)*6 + 4]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[Math.floor(idx/6)*6 + 4]==team && this.pentagoField[Math.floor(idx/6)*6 + 5]==team) {set(distanceWinner, localStorage.nickname)}
      //vertical
      if(!(this.pentagoField[12 + idx % 6]==team && this.pentagoField[18 + idx % 6]==team)) {}
      else if(this.pentagoField[idx % 6]==team && this.pentagoField[6 + idx % 6]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[6+ idx % 6]==team && this.pentagoField[24 + idx % 6]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[24+ idx % 6]==team && this.pentagoField[30 + idx % 6]==team) {set(distanceWinner, localStorage.nickname)}
      // diagonal1
      if(this.pentagoField[12]==team && this.pentagoField[19]==team && this.pentagoField[26]==team && this.pentagoField[33]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[6]==team && this.pentagoField[13]==team && this.pentagoField[20]==team && this.pentagoField[27]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[13]==team && this.pentagoField[20]==team && this.pentagoField[27]==team && this.pentagoField[34]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[0]==team && this.pentagoField[7]==team && this.pentagoField[14]==team && this.pentagoField[21]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[7]==team && this.pentagoField[14]==team && this.pentagoField[21]==team && this.pentagoField[28]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[14]==team && this.pentagoField[21]==team && this.pentagoField[28]==team && this.pentagoField[35]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[1]==team && this.pentagoField[8]==team && this.pentagoField[15]==team && this.pentagoField[22]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[8]==team && this.pentagoField[15]==team && this.pentagoField[22]==team && this.pentagoField[29]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[2]==team && this.pentagoField[9]==team && this.pentagoField[16]==team && this.pentagoField[23]==team) {set(distanceWinner, localStorage.nickname)}
      //diagonal 2
      else if(this.pentagoField[18]==team && this.pentagoField[13]==team && this.pentagoField[8]==team && this.pentagoField[3]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[24]==team && this.pentagoField[19]==team && this.pentagoField[14]==team && this.pentagoField[9]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[19]==team && this.pentagoField[14]==team && this.pentagoField[9]==team && this.pentagoField[4]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[30]==team && this.pentagoField[25]==team && this.pentagoField[20]==team && this.pentagoField[15]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[25]==team && this.pentagoField[20]==team && this.pentagoField[15]==team && this.pentagoField[10]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[20]==team && this.pentagoField[15]==team && this.pentagoField[10]==team && this.pentagoField[5]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[31]==team && this.pentagoField[26]==team && this.pentagoField[21]==team && this.pentagoField[16]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[26]==team && this.pentagoField[21]==team && this.pentagoField[16]==team && this.pentagoField[11]==team) {set(distanceWinner, localStorage.nickname)}
      else if(this.pentagoField[32]==team && this.pentagoField[27]==team && this.pentagoField[22]==team && this.pentagoField[17]==team) {set(distanceWinner, localStorage.nickname)}
    }
  }
})