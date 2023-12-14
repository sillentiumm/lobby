<template>
  <div class="bg-wood"></div>  
  <div class="w-screen min-h-screen flex justify-center items-center">
    <div class="w-[256px] h-[256px] flex flex-col justify-center items-center bg-slate-600 text-white  rounded-xl mr-8 p-2">
      <div class="text-xl mb-4">Игрок 1:</div>
      <button 
        v-if="!player1Computed"
        @click="joinTeam(1)"
        class="border border-white rounded-xl px-4 py-2"
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
    <div class="w-[608px] h-[608px] flex justify-center items-center rounded-xl bg-slate-600 relative">

      <div class="w-[512px] h-[512px] relative bg-slate-600 rounded-xl grid grid-cols-6 pentago z-30">
        <div 
          class="bg-red-200 rounded-[50%] m-2 flex justify-center items-center" 
          :class="{ markPlayer1: item == 1, markPlayer2: item == 2}"
          v-for="item, idx in filed"
          @click="turn1(item, idx)"
        ></div>
        <div class="absolute top-0 left-0"></div>
      </div>

      <div class="w-[96px] h-[96px] absolute top-0 left-0 rounded-xl z-20">
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
      <div class="w-[96px] h-[96px] absolute top-0 right-0 rounded-xl z-20">
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
      <div class="w-[96px] h-[96px] absolute bottom-0 left-0 rounded-xl z-20">
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
      <div class="w-[96px] h-[96px] absolute bottom-0 right-0 rounded-xl z-20">
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
    </div>

    <div class="w-[256px] h-[256px] flex flex-col justify-center items-center bg-slate-600 text-white  rounded-xl ml-8 p-2">
      <div class="text-xl mb-4">Игрок 2:</div>
      <button 
      v-if="!player2Computed"
        @click="joinTeam(2)"
        class="border border-white rounded-xl px-4 py-2"
      >
        Вступить
      </button>
      <div v-else>{{ player2Computed }}</div>
      <button 
        v-if="teamComputed == 2"
        @click="leaveTeam(2)"
        class="border border-white rounded-xl px-4 py-2"
      >
        выйти
      </button>
    </div>
    <div v-if="player1Computed && player2Computed && winnerComputed" class="w-[512px] h-[256px] flex flex-col justify-center items-center bg-blue-200 absolute text-4xl rounded-xl z-50">
      <div class="mb-8">Победитель: {{ winnerComputed }}</div>
      <button 
        @click="startGame()"
        class="text-xl border border-black rounded px-6 py-1"
      >
        Новая игра
      </button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/store';

export default {
  setup() {
    const store = useUserStore();
    // let playersList = store.playersList
    return {
      // playersList,
    }
  },

  data() {
    const store = useUserStore();
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
      const store = useUserStore();
      store.joinTeam({game: 'pentago', room: this.room, team: team})
    },

    leaveTeam(team) {
      const store = useUserStore();
      store.leaveTeam({game: 'pentago', room: this.room, team: team})
    },

    async watchRoom() {
      const store = useUserStore();
      await store.watchRoom({game: 'pentago', room: this.room})
    },

    startGame() {
      const store = useUserStore();
      store.startPentago({game: 'pentago', room: this.room})
    },
    turn1(item, idx) {
      const store = useUserStore();
      if(item) return false
      if(this.player1Computed == localStorage.nickname && this.turnComputed== 1) {
        store.pentagoTurn1({game: 'pentago', room: this.room, idx: idx})
      }
      else if(this.player2Computed == localStorage.nickname && this.turnComputed== 3) {
        store.pentagoTurn1({game: 'pentago', room: this.room, idx: idx})
      }
    },
    turn2(location, rotate) {
      const store = useUserStore();
      if(this.player1Computed == localStorage.nickname && this.turnComputed== 2) {
        store.pentagoTurn2({game: 'pentago', room: this.room, location: location, rotate: rotate})
      }
      else if(this.player2Computed == localStorage.nickname && this.turnComputed== 4) {
        store.pentagoTurn2({game: 'pentago', room: this.room, location: location, rotate: rotate})
      }
    }
  },
  computed: {
    player1Computed() {
    const store = useUserStore();
      return store.player1
    },
    player2Computed() {
    const store = useUserStore();
      return store.player2
    },
    teamComputed() {
      const store = useUserStore();
      return store.team
    },
    filed() {
      const store = useUserStore();
      return store.pentagoField
    },
    turnComputed() {
      const store = useUserStore();
      return store.turn
    },
    winnerComputed() {
      const store = useUserStore();
      return store.winner
    }
  },

  beforeMount() {
    const store = useUserStore();
    if(!localStorage.nickname) this.setNickname()
    this.room = this.$route.query.room
    this.watchRoom(this.$route.query.room)
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
  .markPlayer1 {
    background-color: #fff;
  }
  .markPlayer2 {
    background-color: #000;
  }
</style>