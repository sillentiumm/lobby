<template>
  <div class="bg-wood"></div>  
  <div class="pentago-game">
    <div class="pentago-join1 flex justify-center bg-slate-600 text-white">
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

    <div class="pentago-table relative bg-slate-600">
      <div class="pentago pentago-table-bordered bg-slate-600">
        <div 
          class="pentago-table__cell bg-red-200" 
          :class="{ markPlayer1: item == 1, markPlayer2: item == 2}"
          v-for="item, idx in field"
          @click="turn1(item, idx)"
        ></div>
      </div>

      <div 
          v-if="player1Computed && player2Computed && winnerComputed" 
          class="pentago-winner"
          :class="{ pentagoWinnerWin: this.teamWinComputed == 1, pentagoWinnerLose: teamWinComputed == 2}"
        >
          <div class="text-center mb-8">Победитель: {{ winnerComputed }}</div>
          <button 
            @click="startGame()"
            class="tictactoe-winner_btn"
          >
            Новая игра
          </button>
        </div>

      <div class="pentago-arrows absolute top-0 left-0 rounded-xl z-20">
        <div @click="turn2(1,2)" class="w-[36px] h-[36px] bg-blue-200 absolute top-[6px] left-[6px] rounded p-1">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 454.833 454.833" style="enable-background:new 0 0 454.833 454.833;" xml:space="preserve"><g><path d="M220.917,112.86h111.666l-76.91-76.905c-8.252-8.254-8.252-21.698,0-29.953c7.991-8.003,21.958-8.003,29.955,0 l113.067,113.07c4.001,3.999,6.206,9.321,6.206,14.978c0,5.66-2.205,10.982-6.206,14.981L285.634,262.095 c-7.997,8.003-21.946,8.015-29.961,0c-8.252-8.257-8.252-21.698,0-29.956l76.91-76.911H220.917 c-70.917,0-128.618,57.701-128.618,128.618c0,70.923,57.701,128.618,128.618,128.618h60.526c10.03,0,18.158,8.133,18.158,18.158 v6.053c0,10.03-8.128,18.157-18.158,18.157h-60.526c-94.279,0-170.986-76.704-170.986-170.986 C49.931,189.567,126.638,112.86,220.917,112.86z"/></g></svg>
        </div>
        <div @click="turn2(1,1)" class="w-[36px] h-[36px] bg-blue-200 absolute top-[6px] left-[54px] rounded p-1 ">
          <svg id="SVGRoot" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m3 2c-.55228 0-1 .44772-1 1s.44772 1 1 1h12c3.3256 0 6 2.6744 6 6v16.586l-5.293-5.293a1 1 0 0 0 -.67773-.29297 1 1 0 0 0 -.73633.29297 1 1 0 0 0 0 1.4141l7 7a1.0001 1.0001 0 0 0 1.4141 0l7-7a1 1 0 0 0 0-1.4141 1 1 0 0 0 -1.4141 0l-5.293 5.293v-16.586c0-4.4064-3.5936-8-8-8h-12z" font-feature-settings="normal" font-variant-alternates="normal" font-variant-caps="normal" font-variant-east-asian="normal" font-variant-ligatures="normal" font-variant-numeric="normal" font-variant-position="normal" font-variation-settings="normal" inline-size="0" isolation="auto" mix-blend-mode="normal" shape-margin="0" shape-padding="0" text-decoration-color="rgb(0,0,0)" text-decoration-line="none" text-decoration-style="solid" text-indent="0" text-orientation="mixed" text-transform="none" white-space="normal"/></svg>
        </div>
        <div @click="turn2(1,3)" class="w-[36px] h-[36px] bg-blue-200 absolute top-[54px] left-[6px] rounded p-1 rotate-[-90deg]">
          <svg id="SVGRoot" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m17 2c-4.4064 0-8 3.5936-8 8v16.586l-5.293-5.293a1 1 0 0 0 -.67773-.29297 1 1 0 0 0 -.73633.29297 1 1 0 0 0 0 1.4141l7 7a1.0001 1.0001 0 0 0 1.4141 0l7-7a1 1 0 0 0 0-1.4141 1 1 0 0 0 -1.4141 0l-5.293 5.293v-16.586c0-3.3256 2.6744-6 6-6h12c.55228 0 1-.44772 1-1s-.44772-1-1-1h-12z" font-feature-settings="normal" font-variant-alternates="normal" font-variant-caps="normal" font-variant-east-asian="normal" font-variant-ligatures="normal" font-variant-numeric="normal" font-variant-position="normal" font-variation-settings="normal" inline-size="0" isolation="auto" mix-blend-mode="normal" shape-margin="0" shape-padding="0" text-decoration-color="rgb(0,0,0)" text-decoration-line="none" text-decoration-style="solid" text-indent="0" text-orientation="mixed" text-transform="none" white-space="normal"/></svg>
        </div>
      </div>

      <div class="pentago-arrows absolute top-0 right-0 rounded-xl z-20">
        <div @click="turn2(2,2)" class="w-[36px] h-[36px] bg-blue-200 absolute top-[6px] right-[6px] rounded p-1 rotate-90">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 454.833 454.833" style="enable-background:new 0 0 454.833 454.833;" xml:space="preserve"><g><path d="M220.917,112.86h111.666l-76.91-76.905c-8.252-8.254-8.252-21.698,0-29.953c7.991-8.003,21.958-8.003,29.955,0 l113.067,113.07c4.001,3.999,6.206,9.321,6.206,14.978c0,5.66-2.205,10.982-6.206,14.981L285.634,262.095 c-7.997,8.003-21.946,8.015-29.961,0c-8.252-8.257-8.252-21.698,0-29.956l76.91-76.911H220.917 c-70.917,0-128.618,57.701-128.618,128.618c0,70.923,57.701,128.618,128.618,128.618h60.526c10.03,0,18.158,8.133,18.158,18.158 v6.053c0,10.03-8.128,18.157-18.158,18.157h-60.526c-94.279,0-170.986-76.704-170.986-170.986 C49.931,189.567,126.638,112.86,220.917,112.86z"/></g></svg>
        </div>
        <div @click="turn2(2,1)" class="w-[36px] h-[36px] bg-blue-200 absolute top-[54px] right-[6px] rounded p-1 rotate-90">
          <svg id="SVGRoot" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m3 2c-.55228 0-1 .44772-1 1s.44772 1 1 1h12c3.3256 0 6 2.6744 6 6v16.586l-5.293-5.293a1 1 0 0 0 -.67773-.29297 1 1 0 0 0 -.73633.29297 1 1 0 0 0 0 1.4141l7 7a1.0001 1.0001 0 0 0 1.4141 0l7-7a1 1 0 0 0 0-1.4141 1 1 0 0 0 -1.4141 0l-5.293 5.293v-16.586c0-4.4064-3.5936-8-8-8h-12z" font-feature-settings="normal" font-variant-alternates="normal" font-variant-caps="normal" font-variant-east-asian="normal" font-variant-ligatures="normal" font-variant-numeric="normal" font-variant-position="normal" font-variation-settings="normal" inline-size="0" isolation="auto" mix-blend-mode="normal" shape-margin="0" shape-padding="0" text-decoration-color="rgb(0,0,0)" text-decoration-line="none" text-decoration-style="solid" text-indent="0" text-orientation="mixed" text-transform="none" white-space="normal"/></svg>
        </div>
        <div @click="turn2(2,3)" class="w-[36px] h-[36px] bg-blue-200 absolute top-[6px] right-[54px] rounded p-1 ">
          <svg id="SVGRoot" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m17 2c-4.4064 0-8 3.5936-8 8v16.586l-5.293-5.293a1 1 0 0 0 -.67773-.29297 1 1 0 0 0 -.73633.29297 1 1 0 0 0 0 1.4141l7 7a1.0001 1.0001 0 0 0 1.4141 0l7-7a1 1 0 0 0 0-1.4141 1 1 0 0 0 -1.4141 0l-5.293 5.293v-16.586c0-3.3256 2.6744-6 6-6h12c.55228 0 1-.44772 1-1s-.44772-1-1-1h-12z" font-feature-settings="normal" font-variant-alternates="normal" font-variant-caps="normal" font-variant-east-asian="normal" font-variant-ligatures="normal" font-variant-numeric="normal" font-variant-position="normal" font-variation-settings="normal" inline-size="0" isolation="auto" mix-blend-mode="normal" shape-margin="0" shape-padding="0" text-decoration-color="rgb(0,0,0)" text-decoration-line="none" text-decoration-style="solid" text-indent="0" text-orientation="mixed" text-transform="none" white-space="normal"/></svg>
        </div>
      </div>

      <div class="pentago-arrows absolute bottom-0 left-0 rounded-xl z-20">
        <div @click="turn2(3,2)" class="w-[36px] h-[36px] bg-blue-200 absolute bottom-[6px] left-[6px] rounded p-1 rotate-[-90deg]">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 454.833 454.833" style="enable-background:new 0 0 454.833 454.833;" xml:space="preserve"><g><path d="M220.917,112.86h111.666l-76.91-76.905c-8.252-8.254-8.252-21.698,0-29.953c7.991-8.003,21.958-8.003,29.955,0 l113.067,113.07c4.001,3.999,6.206,9.321,6.206,14.978c0,5.66-2.205,10.982-6.206,14.981L285.634,262.095 c-7.997,8.003-21.946,8.015-29.961,0c-8.252-8.257-8.252-21.698,0-29.956l76.91-76.911H220.917 c-70.917,0-128.618,57.701-128.618,128.618c0,70.923,57.701,128.618,128.618,128.618h60.526c10.03,0,18.158,8.133,18.158,18.158 v6.053c0,10.03-8.128,18.157-18.158,18.157h-60.526c-94.279,0-170.986-76.704-170.986-170.986 C49.931,189.567,126.638,112.86,220.917,112.86z"/></g></svg>
        </div>
        <div @click="turn2(3,1)" class="w-[36px] h-[36px] bg-blue-200 absolute bottom-[54px] left-[6px] rounded p-1 rotate-[-90deg]">
          <svg id="SVGRoot" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m3 2c-.55228 0-1 .44772-1 1s.44772 1 1 1h12c3.3256 0 6 2.6744 6 6v16.586l-5.293-5.293a1 1 0 0 0 -.67773-.29297 1 1 0 0 0 -.73633.29297 1 1 0 0 0 0 1.4141l7 7a1.0001 1.0001 0 0 0 1.4141 0l7-7a1 1 0 0 0 0-1.4141 1 1 0 0 0 -1.4141 0l-5.293 5.293v-16.586c0-4.4064-3.5936-8-8-8h-12z" font-feature-settings="normal" font-variant-alternates="normal" font-variant-caps="normal" font-variant-east-asian="normal" font-variant-ligatures="normal" font-variant-numeric="normal" font-variant-position="normal" font-variation-settings="normal" inline-size="0" isolation="auto" mix-blend-mode="normal" shape-margin="0" shape-padding="0" text-decoration-color="rgb(0,0,0)" text-decoration-line="none" text-decoration-style="solid" text-indent="0" text-orientation="mixed" text-transform="none" white-space="normal"/></svg>
        </div>
        <div @click="turn2(3,3)" class="w-[36px] h-[36px] bg-blue-200 absolute bottom-[6px] left-[54px] rounded p-1 rotate-180">
          <svg id="SVGRoot" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m17 2c-4.4064 0-8 3.5936-8 8v16.586l-5.293-5.293a1 1 0 0 0 -.67773-.29297 1 1 0 0 0 -.73633.29297 1 1 0 0 0 0 1.4141l7 7a1.0001 1.0001 0 0 0 1.4141 0l7-7a1 1 0 0 0 0-1.4141 1 1 0 0 0 -1.4141 0l-5.293 5.293v-16.586c0-3.3256 2.6744-6 6-6h12c.55228 0 1-.44772 1-1s-.44772-1-1-1h-12z" font-feature-settings="normal" font-variant-alternates="normal" font-variant-caps="normal" font-variant-east-asian="normal" font-variant-ligatures="normal" font-variant-numeric="normal" font-variant-position="normal" font-variation-settings="normal" inline-size="0" isolation="auto" mix-blend-mode="normal" shape-margin="0" shape-padding="0" text-decoration-color="rgb(0,0,0)" text-decoration-line="none" text-decoration-style="solid" text-indent="0" text-orientation="mixed" text-transform="none" white-space="normal"/></svg>
        </div>
      </div>

      <div class="pentago-arrows absolute bottom-0 right-0 rounded-xl z-20">
        <div @click="turn2(4,2)" class="w-[36px] h-[36px] bg-blue-200 absolute bottom-[6px] right-[6px] rounded p-1 rotate-180">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 454.833 454.833" style="enable-background:new 0 0 454.833 454.833;" xml:space="preserve"><g><path d="M220.917,112.86h111.666l-76.91-76.905c-8.252-8.254-8.252-21.698,0-29.953c7.991-8.003,21.958-8.003,29.955,0 l113.067,113.07c4.001,3.999,6.206,9.321,6.206,14.978c0,5.66-2.205,10.982-6.206,14.981L285.634,262.095 c-7.997,8.003-21.946,8.015-29.961,0c-8.252-8.257-8.252-21.698,0-29.956l76.91-76.911H220.917 c-70.917,0-128.618,57.701-128.618,128.618c0,70.923,57.701,128.618,128.618,128.618h60.526c10.03,0,18.158,8.133,18.158,18.158 v6.053c0,10.03-8.128,18.157-18.158,18.157h-60.526c-94.279,0-170.986-76.704-170.986-170.986 C49.931,189.567,126.638,112.86,220.917,112.86z"/></g></svg>
        </div>
        <div @click="turn2(4,1)" class="w-[36px] h-[36px] bg-blue-200 absolute bottom-[6px] right-[54px] rounded p-1 rotate-180">
          <svg id="SVGRoot" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m3 2c-.55228 0-1 .44772-1 1s.44772 1 1 1h12c3.3256 0 6 2.6744 6 6v16.586l-5.293-5.293a1 1 0 0 0 -.67773-.29297 1 1 0 0 0 -.73633.29297 1 1 0 0 0 0 1.4141l7 7a1.0001 1.0001 0 0 0 1.4141 0l7-7a1 1 0 0 0 0-1.4141 1 1 0 0 0 -1.4141 0l-5.293 5.293v-16.586c0-4.4064-3.5936-8-8-8h-12z" font-feature-settings="normal" font-variant-alternates="normal" font-variant-caps="normal" font-variant-east-asian="normal" font-variant-ligatures="normal" font-variant-numeric="normal" font-variant-position="normal" font-variation-settings="normal" inline-size="0" isolation="auto" mix-blend-mode="normal" shape-margin="0" shape-padding="0" text-decoration-color="rgb(0,0,0)" text-decoration-line="none" text-decoration-style="solid" text-indent="0" text-orientation="mixed" text-transform="none" white-space="normal"/></svg>
        </div>
        <div @click="turn2(4,3)" class="w-[36px] h-[36px] bg-blue-200 absolute bottom-[54px] right-[6px] rounded p-1 rotate-90">
          <svg id="SVGRoot" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m17 2c-4.4064 0-8 3.5936-8 8v16.586l-5.293-5.293a1 1 0 0 0 -.67773-.29297 1 1 0 0 0 -.73633.29297 1 1 0 0 0 0 1.4141l7 7a1.0001 1.0001 0 0 0 1.4141 0l7-7a1 1 0 0 0 0-1.4141 1 1 0 0 0 -1.4141 0l-5.293 5.293v-16.586c0-3.3256 2.6744-6 6-6h12c.55228 0 1-.44772 1-1s-.44772-1-1-1h-12z" font-feature-settings="normal" font-variant-alternates="normal" font-variant-caps="normal" font-variant-east-asian="normal" font-variant-ligatures="normal" font-variant-numeric="normal" font-variant-position="normal" font-variation-settings="normal" inline-size="0" isolation="auto" mix-blend-mode="normal" shape-margin="0" shape-padding="0" text-decoration-color="rgb(0,0,0)" text-decoration-line="none" text-decoration-style="solid" text-indent="0" text-orientation="mixed" text-transform="none" white-space="normal"/></svg>
        </div>
      </div>

      <button 
        @click="startGame()"
        v-if="player1Computed && player2Computed && !turnComputed" 
        class="absolute bottom-2 items-center text-white text-xl border rounded px-6 py-1"
      >
        start
      </button>
      <div v-if="turnComputed==1" class="absolute bottom-2 items-center text-white text-xl">
        Ход: {{ player1Computed }}(1)
      </div>
      <div v-if="turnComputed==2" class="absolute bottom-2 items-center text-white text-xl">
        Ход: {{ player1Computed }}(2)
      </div>
      <div v-if="turnComputed==3" class="absolute bottom-2 items-center text-white text-xl">
        Ход: {{ player2Computed }}(1)
      </div>
      <div v-if="turnComputed==4" class="absolute bottom-2 items-center text-white text-xl">
        Ход: {{ player2Computed }}(2)
      </div>
      <div class="pentago_reset" @click="startGame()">reset</div>
    </div>

    <div class="pentago-join2 flex justify-center bg-slate-600 text-white">
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
// import { usePentagoStore } from '../stores/storePentago';
import { useStore } from '../stores/store';

export default {
  setup() {
    const store = useStore();
    return{
      store,
    }
  },

  data() {
    const room = ''

    return {
    }
  },
  methods: {
    setNickname() {
      let promptValue = prompt('Введите ваше имя')
      if (promptValue) {localStorage.setItem('nickname', promptValue);}
      else localStorage.setItem('nickname', 'unnamed');
    },
    joinTeam(team){
      this.store.joinTeam({game: 'pentago', room: this.room, team: team})
    },

    leaveTeam(team) {
      this.store.leaveTeam({game: 'pentago', room: this.room, team: team})
    },

    async watchRoom() {
      await this.store.watchRoom({game: 'pentago', room: this.room})
    },

    startGame() {
      this.store.startPentago({game: 'pentago', room: this.room})
    },
    resetGame() {
      if(this.player1Computed == localStorage.nickname) {
        this.store.resetGamePentago({room: this.room, player: 1 })
      } else if(this.player2Computed == localStorage.nickname) {
        this.store.resetGamePentago({room: this.room, player: 2 })
      }
    },
    turn1(item, idx) {
      if(item) return false
      if(this.player1Computed == localStorage.nickname && this.turnComputed== 1) {
        this.store.pentagoTurn1({game: 'pentago', room: this.room, idx: idx})
      }
      else if(this.player2Computed == localStorage.nickname && this.turnComputed== 3) {
        this.store.pentagoTurn1({game: 'pentago', room: this.room, idx: idx})
      }
    },
    turn2(location, rotate) {
      if(this.player1Computed == localStorage.nickname && this.turnComputed== 2) {
        this.store.pentagoTurn2({game: 'pentago', room: this.room, location: location, rotate: rotate})
      }
      else if(this.player2Computed == localStorage.nickname && this.turnComputed== 4) {
        this.store.pentagoTurn2({game: 'pentago', room: this.room, location: location, rotate: rotate})
      }
    }
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
      return this.store.pentagoField
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
  .pentago::before {
    content: '';
    position: absolute;
    top: 255px;
    left: 0;
    background-color: gray;
    width: 100%;
    height: 2px;
  }
  .pentago::after {
    content: '';
    position: absolute;
    top: 0;
    left: 255px;
    background-color: gray;
    width: 2px;
    height: 100%;
  }
  .pentago-table {
    width: 100vw;
    max-width: 608px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    position: relative;
    order: 2;
    padding-top: 48px;
    padding-bottom: 48px;
  }
  .pentago-table-bordered {
    width: 512px;
    height: 512px;
    position: relative;
    border-radius: 12px;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    z-index: 30;
  }
  .pentago-table__cell {
    border-radius: 50%;
    margin: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pentago-arrows {
    width: 96px;
    height: 96px;
  }
  .pentago-join1 {
    width: 256px;
    height: 256px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12px;
    margin-right: 64px;
    padding: 16px;
  }
  .pentago-join2 {
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
  .pentago-game {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pentago_reset {
    position: absolute;
    bottom: -30px;
    left:50%;
    transform:translate(-50%, 0);
    z-index: 90;
    text-decoration: underline;
    cursor: pointer;
    color: #fff;
    font-size: 24px;
  }
  .pentago-winner {
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
    z-index: 60;
  }
  .pentagoWinnerWin {
    background-color: rgba(0, 255, 255, .15);
  }
  .pentagoWinnerLose {
    background-color: rgba(255, 0, 0, .15);
  }

  @media (max-width: 1024px) {
    .pentago-game {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;  
    }
    .pentago-table {
      order: 3;
      align-self: center;
      margin-bottom: 30px;
    }
    .pentago-join1 {
      order: 1;
      margin: 8px 48px 24px 0;
      height: 136px
    }
    .pentago-join2 {
      order: 2;
      margin: 8px 0 24px 48px;
      height: 136px
    }
  }

  @media (max-width: 624px) {
    .pentago-table {
      width: 378px;
      height: 378px;
      padding: 0;
    }
    .pentago-table-bordered {
      width: 282px;
      height: 282px;
    }
    .pentago-join1 {
      width: calc(50% - 8px);
      margin: 4px;
    }
    .pentago-join2 {
      width: calc(50% - 8px);
      margin: 4px;
    }
    .pentago::before {
      content: '';
      position: absolute;
      top: 140px;
      left: 0;
      background-color: gray;
      width: 100%;
      height: 2px;
    }
    .pentago::after {
      content: '';
      position: absolute;
      top: 0;
      left: 140px;
      background-color: gray;
      width: 2px;
      height: 100%;
    }
    .pentago-winner {
      width: 376px;
      height: 376px;
      font-size: 28px;
    }
    .pentago-winner_btn {
      font-size: 22px;
      border: 1px solid;
      border-radius: 8px;
      padding: 6px 22px;
    }
  }
</style>