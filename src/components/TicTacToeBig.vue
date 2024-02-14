<template>
  <div class="bg-wood"></div>
  <div class="tictactoe-game">
    <div class="boxes-join1 flex justify-center bg-slate-600 text-white">
      <div class="text-xl mb-2 md">Игрок 1:</div>
      <button 
        v-if="!player1Computed"
        @click="joinTeam(1)"
        class="underline rounded-xl px-4 py-2"
      >
        Вступить
      </button>
      <div v-else> {{ player1Computed }}</div>
      <button 
        v-if="teamComputed== 1"
        @click="leaveTeam(1)"
        class="underline rounded-xl px-4 py-2"
      >
        выйти
      </button>
    </div>

    <div class="tictactoe-main relative">
      <div 
        class="tictactoe-table bg-gray-400"
      >
        <div 
          class="tictactoe-fieldBig bg-gray-500 " 
          :class="{ markFiledbig: this.filedNext == idxField, markPlayer2: fieldMini == 2}"
          v-for="fieldMini, idxField in field"
        >
          <div 
            class="tictactoe-fieldMini" 
            :class="{markPlayer0: item == 0, markX: item == 1, markO: item == 2}"
            v-for="item, idx in fieldMini"
            @click="turn(idxField, idx, item)"
          ></div>
        </div>
      </div>

      <div class="boxes-turn text-white text-center text-xl">
        <button 
          @click="startGame()"
          v-if="player1Computed && player2Computed && !turnComputed" 
          class="items-center text-white text-xl border rounded px-6 py-1 mt-2"
        >
          start
        </button>
        <div v-if="turnComputed==1 && !winnerComputed">
          Ход: {{ player1Computed }}
        </div>
        <div v-if="turnComputed==2 && !winnerComputed">
          Ход: {{ player2Computed }}
        </div>
        <div class="underline cursor-pointer" @click="startGame()">reset</div>
      </div>

      <div 
        v-if="player1Computed && player2Computed && winnerComputed" 
        class="tictactoe-winner"
        :class="{ tictactoeWinnerWin: this.teamWinComputed == 1, tictactoeWinnerLose: teamWinComputed == 2}"
      >
        <div class="text-center mb-8">Победитель: {{ winnerComputed }}</div>
        <button 
          @click="startGame()"
          class="tictactoe-winner_btn"
        >
          Новая игра
        </button>
      </div>
      
    </div>

    <div class="boxes-join2 flex justify-center bg-slate-600 text-white">
      <div class="text-xl mb-2">Игрок 2:</div>
      <button 
      v-if="!player2Computed"
        @click="joinTeam(2)"
        class="underline rounded-xl px-4 py-2"
      >
        Вступить
      </button>
      <div v-else>{{ player2Computed }}</div>
      <button 
        v-if="teamComputed == 2"
        @click="leaveTeam(2)"
        class="underline rounded-xl px-4 py-2"
      >
        выйти
      </button>
    </div>

  </div>
  
</template>

<script>


import { off } from 'firebase/database';
import { useTicTacToeStore } from '../stores/storeTicTacToe';

export default {
  data() {
    return {}
  },
  setup() {
    const store = useTicTacToeStore();
    return{
      store,
    }
  },
  methods: {
    setNickname() {
      let promptValue = prompt('Введите ваше имя')
      if (promptValue) {localStorage.setItem('nickname', promptValue);}
      else localStorage.setItem('nickname', 'unnamed');
    },
    joinTeam(team){
      this.store.joinTeam({room: this.room, team: team})
    },
    leaveTeam(team) {
      this.store.leaveTeam({room: this.room, team: team})
    },
    startGame() {
      if(this.player1Computed && this.player2Computed) {
        this.store.startTicTacToe({room: this.room})
      }
    },
    resetGame() {
      if(this.player1Computed == localStorage.nickname) {
        this.store.resetGame({room: this.room, player: 1 })
      } else if(this.player2Computed == localStorage.nickname) {
        this.store.resetGame({room: this.room, player: 2 })
      }
    },
    async watchRoom() {
      await this.store.watchRoom({room: this.room})
    },
    turn(idxField, idx, item) {
      if(item) return false
      if(this.filedNext >-1 && idxField !== this.filedNext) return false
       
      if(this.player1Computed == localStorage.nickname && this.turnComputed== 1) {
        this.store.ticTacToeTurn({room: this.room, idxField: idxField, idx: idx})
      }
      else if(this.player2Computed == localStorage.nickname && this.turnComputed== 2) {
        this.store.ticTacToeTurn({room: this.room, idxField: idxField, idx: idx})
      }
    },
  },
  computed: {
    player1Computed() {
      return this.store.player1
    },
    player2Computed() {
      return this.store.player2
    },
    teamComputed() {
      return this.store.team
    },
    field() {
      return this.store.field
    },
    filedBig() {
      return this.store.fieldBig
    },
    filedNext() {
      return this.store.fieldNext
    },
    turnComputed() {
      return this.store.turn
    },
    winnerComputed() {
      return this.store.winner
    },
    teamWinComputed() {
      if(this.store.winner == localStorage.nickname) {
        return 1
      } else if(this.store.winner) {
        return 2
      } else return 0
    }
  },
  beforeMount() {
    if(!localStorage.nickname) this.setNickname()
    this.room = this.$route.query.room
    this.watchRoom(this.$route.query.room)
  },
  created() {
    window.onbeforeunload = () => {
      this.resetGame()
    }
  }
}
</script>

<style>
  .tictactoe-game {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tictactoe-table {
    width: 100vw;
    max-width: 608px;
    height: 608px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    position: relative;
    order: 2;
  }
  .tictactoe-fieldBig{
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .tictactoe-fieldMini {
    width: 64px;
    height: 64px;
    margin: 1px;
  }
  .tictactoe-winner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 608px;
    height: 608px;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    font-size: 42px;
    color: #fff;
    /* background-color: rgba(0, 255, 255, .15); */
    /* background-color: rgba(255, 0, 0, .15); */
    padding: 8px;
  }
  .tictactoeWinnerWin {
    background-color: rgba(0, 255, 255, .15);
  }
  .tictactoeWinnerLose {
    background-color: rgba(255, 0, 0, .15);
  }
  .tictactoe-winner_btn {
    font-size: 24px;
    border: 2px solid;
    border-radius: 12px;
    padding: 8px 32px;
  }
  .markX, .markO {
    position: relative;
    background-color: #475569
  }
  .markX::before, .markO::before {
    position: absolute;
    left: 50%;
    top: 50%;
    transform:translate(-50%, -50%);
    font-size: 42px;
  }
  .markX::before {
    content: "❌";
  }
  .markO::before {
    content: "🟢";
  }
  .markFiledbig {
    background-color: lightcyan;
  }
  @media (max-width: 1124px) {
    .tictactoe-game {
      display: flex;
      flex-wrap: wrap;
    }
    .tictactoe-main {
      order: 3;
      align-self: center;
    }
    .tictactoe-join1 {
      order: 1;
      margin: 8px 48px 24px 0;
      height: 136px
    }
    .tictactoe-join2 {
      order: 2;
      margin: 8px 0 24px 48px;
      height: 136px
    }
  }

  @media (max-width: 624px) {
    .tictactoe-table {
      width: 376px;
      height: 376px;
    }
    .tictactoe-fieldBig {
      width: 124px;
      height: 124px;
    }
    .tictactoe-fieldMini {
      width: 38px;
      height: 38px;
    }
    .tictactoe-join1 {
      width: calc(50% - 8px);
      margin: 4px;
    }
    .tictactoe-join2 {
      width: calc(50% - 8px);
      margin: 4px;
    }
    .tictactoe-winner {
      width: 376px;
      height: 376px;
      font-size: 28px;
    }
    .tictactoe-winner_btn {
      font-size: 22px;
      border: 1px solid;
      border-radius: 8px;
      padding: 6px 22px;
    }
    .markX::before, .markO::before {
      position: absolute;
      left: 50%;
      top: 50%;
      transform:translate(-50%, -50%);
      font-size: 24px;
    }

  }
</style>