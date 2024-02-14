<template>
  <div class="bg-wood"></div>

  <div class="boxes-game">
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

    <div class="boxes-main relative">
      <div 
        class="boxes-table bg-gray-500"
      >
        <div 
          class="boxes-table__cell w-4 h-4 bg-slate-600" 
          :class="{ box1_bg: item == 1, box2_bg: item == 2}"
          v-for="item, idx in field"
          @click="turn(item, idx)"
        ></div>

        <div 
          v-if="player1Computed && player2Computed && winnerComputed" 
          class="boxes-winner"
          :class="{ boxesWinnerWin: this.teamWinComputed == 1, boxesWinnerLose: teamWinComputed == 2}"
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


// import { useBoxesStore } from '../stores/storeBoxes';
import { useStore } from '../stores/store';

  export default {
    data() {
      return {}
    },
    setup() {
      // const store = useBoxesStore();
      const store = useStore();
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
      this.store.joinTeam({game: 'boxes', room: this.room, team: team})
    },
    leaveTeam(team) {
      this.store.leaveTeam({game: 'boxes', room: this.room, team: team})
    },
    startGame() {
      this.store.startBoxes({room: this.room})
    },
    async watchRoom() {
      await this.store.watchRoom({game: 'boxes', room: this.room})
    },

    turn(item, idx) { 
      if(item) return false
      if(idx > 89 || this.store.boxesField[idx + 10] ) {
        if(this.player1Computed == localStorage.nickname && this.turnComputed== 1) {
          this.store.boxesTurn({room: this.room, idx: idx})
        }
        else if(this.player2Computed == localStorage.nickname && this.turnComputed== 2) {
          this.store.boxesTurn({room: this.room, idx: idx})
        }
      } else { return false }
    },
    resetGame() {
      if(this.player1Computed == localStorage.nickname) {
        this.store.resetGameBoxes({room: this.room, player: 1 })
      } else if(this.player2Computed == localStorage.nickname) {
        this.store.resetGameBoxes({room: this.room, player: 2 })
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
        return this.store.boxesField
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
    if(!localStorage.nickname)  this.setNickname()
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
  .boxes-game {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .boxes-main {
      order: 2;
    }
  .boxes-table {
    width: 100vw;
    max-width: 612px;
    height: 612px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .boxes-table__cell {
    width: 59px;
    height: 59px;
    border-radius: 4px;
    margin: 1px;
  }
  .boxes-join1 {
    width: 256px;
    height: 256px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12px;
    margin-right: 64px;
    padding: 16px;
  }
  .boxes-join2 {
    width: 256px;
    height: 256px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12px;
    margin-left: 64px;
    padding: 16px;
    order: 3;
  }
  .boxes-winner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 612px;
    height: 612px;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    font-size: 42px;
    color: #fff;
    padding: 8px;
  }
  .boxesWinnerWin {
    background-color: rgba(0, 255, 255, .15);
  }
  .boxesWinnerLose {
    background-color: rgba(255, 0, 0, .15);
  }
  .box1_bg {
    background: brown url(../assets/img/box1.jpg);
    background-size: 100%;
  }
  .box2_bg {
    background: brown url(../assets/img/box2.jpg);
    background-size: 100%;
  }

  @media (max-width: 1124px) {
    .boxes-game {
      display: flex;
      flex-wrap: wrap;
    }
    .boxes-main {
      order: 3;
      align-self: center;
    }
    .boxes-join1 {
      order: 1;
      margin: 8px 48px 24px 0;
      height: 136px
    }
    .boxes-join2 {
      order: 2;
      margin: 8px 0 24px 48px;
      height: 136px
    }
  }

  @media (max-width: 624px) {
    .boxes-table {
      width: 376px;
      height: 376px;
    }
    .boxes-table__cell {
      width: 35px;
      height: 35px;
    }
    .boxes-join1 {
      width: calc(50% - 8px);
      margin: 4px;
    }
    .boxes-join2 {
      width: calc(50% - 8px);
      margin: 4px;
    }
    .boxes-winner {
      width: 376px;
      height: 376px;
      font-size: 28px;
    }
    .boxes-winner_btn {
      font-size: 22px;
      border: 1px solid;
      border-radius: 8px;
      padding: 6px 22px;
    }
  }
</style>
