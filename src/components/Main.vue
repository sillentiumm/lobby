<template>
  <div class="bg-wood">
  </div>
  <div class="min-h-screen flex justify-center z-30 ">
    <div class="w-[580px] min-h-screen bg-wood-small shadow">
      <h2 class="text-center text-4xl my-4">
        Lobby
      </h2>
      <form 
        @submit.prevent="joinPentago"
        class="flex flex-col flex-wrap bg-gray-100 border-2 border-gray-900 rounded-xl mx-2 p-4 pl-4 shadow-xl shadow-gray-900/50 mb-4"
      >
        <div class="flex items-center flex-wrap">
          <div class="text-xl mr-2">
            Pentago
          </div>
          <div @click="changeRulesPentago" class="mr-4 text-xl text-gray-500 underline cursor-pointer">
            правила
          </div>
          <div class="flex items-center">
            <input 
              type="text" placeholder="комната" 
              v-model="join_room_form.value"
              class="h-8 bg-gray-100 border border-gray-900 text-gray-900 text-lg rounded-lg block px-2.5 mr-1"
            >
            <img @click="joinPentago()" src="../assets/img/enter-icon.svg" alt="" class="w-5 h-5 cursor-pointer">
          </div>
        </div>
        <div v-if="rulesPentago">
          <span>Ход состоит из 2 частей:</span> <br>
          <span>1. Игрок выбирает любую свободную ячейку</span> <br>
          <span>2. Игрок вращает одно из 4 полей в любом направлении</span> <br>
          <span>Далее ход переходит ко второму игроку</span> <br>
          <span>Цель игры:</span> <br>
          <span>Собрать линию из 5 по вертикали, горизонтали или диагонали</span>
        </div>
      </form>

      <form 
        @submit.prevent="joinBoxes"
        class="flex flex-col flex-wrap bg-gray-100 border-2 border-gray-900 rounded-xl mx-2 p-4 pl-4 shadow-xl shadow-gray-900/50 mb-4"
      >
        <div class="flex items-center flex-wrap">
          <div class="text-xl mr-2">
            Boxes
          </div>
          <div @click="changeRulesBoxes" class="mr-4 text-xl text-gray-500 underline cursor-pointer">
            правила
          </div>
          <div class="flex items-center">
            <input 
              type="text" placeholder="комната" 
              v-model="join_room_form.value"
              class="h-8 bg-gray-100 border border-gray-900 text-gray-900 text-lg rounded-lg block px-2.5 mr-1"
            >
            <img @click="joinBoxes()" src="../assets/img/enter-icon.svg" alt="" class="w-5 h-5 cursor-pointer">
          </div>
        </div>
        <div v-if="rulesBoxes">
          <span>Игроки по очереди ставят ящики</span> <br>
          <span>Ящик можно ставить на другой ящик или на основание</span> <br>
          <span>Цель игры:</span> <br>
          <span>Собрать линию из 4 по вертикали, горизонтали или диагонали</span>
        </div> 
      </form>

      <form 
        @submit.prevent="joinTicTacToe"
        class="flex flex-col flex-wrap bg-gray-100 border-2 border-gray-900 rounded-xl mx-2 p-4 pl-4 shadow-xl shadow-gray-900/50 mb-4"
      >
        <div class="flex items-center flex-wrap">
          <div class="text-xl mr-2">
            Tic Tac Toe
          </div>
          <div @click="changeRulesTicTacToe" class="mr-4 text-xl text-gray-500 underline cursor-pointer">
            правила
          </div>
          <div class="flex items-center">
            <input 
              type="text" placeholder="комната" 
              v-model="join_room_form.value"
              class="h-8 bg-gray-100 border border-gray-900 text-gray-900 text-lg rounded-lg block px-2.5 mr-1"
            >
            <img @click="joinTicTacToe()" src="../assets/img/enter-icon.svg" alt="" class="w-5 h-5 cursor-pointer">
          </div>
        </div>
        <div v-if="rulesTicTacToe">
          <span>Правила игры такие же как в крестиках-ноликах</span> <br>
          <span>Когда игрок собирает линию в маленьком поле</span> <br>
          <span>то получает все маленькое поле под свой контроль</span> <br>
          <span>также игрок получает контроль над полем, </span> <br>
          <span>если закрывает последнюю ячейку в поле </span> <br>
          <span>Игрок может ходить только в то поле, которое выбрал предыдущий игрок</span> <br>
          <span>Если это поле недоступно, то он выбирает любое другое поле</span> <br>
          <span>Побеждает тот, кто соберет линию из 3 в большом поле</span>
        </div>  
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import router from '../router/index'
import { usePentagoStore } from '../stores/storePentago';
import { useBoxesStore } from '../stores/storeBoxes';
import { useTicTacToeStore } from '../stores/storeTicTacToe';

  export default {
    setup() {
      const join_room_form = ({ref})

      const joinPentago = () => {
        const store = usePentagoStore();
        if(join_room_form.value) {
          store.createPentago('pentago', join_room_form.value)
          router.push({ name: 'pentago', query: {game: 'pentago', room:join_room_form.value }})
        }
      }

      const joinBoxes = () => {
        const store = useBoxesStore();
        if(join_room_form.value) {
          store.createBoxes('boxes', join_room_form.value)
          router.push({ name: 'boxes', query: {game: 'boxes', room:join_room_form.value }})
        }
      }

      const joinTicTacToe = () => {
        const store = useTicTacToeStore();
        if(join_room_form.value) {
          store.createTicTacToe('tictactoe', join_room_form.value)
          router.push({ name: 'tictactoe', query: {game: 'ticTacToe', room:join_room_form.value }})
        }
      }

      const setNickname = () => {
        let promptValue = prompt('Введите ваше имя')
        if (promptValue) {localStorage.setItem('nickname', promptValue);}
        else localStorage.setItem('nickname', 'unnamed');
      }

      return {
        joinPentago,
        joinBoxes,
        joinTicTacToe,
        join_room_form,
        setNickname
      }
    },
    data() {
      return {
        rulesPentago: false,
        rulesBoxes: false,
        rulesTicTacToe: false,
      }
    },
    methods: {
      changeRulesPentago() {
        this.rulesPentago =!this.rulesPentago
      },
      changeRulesBoxes() {
        this.rulesBoxes =!this.rulesBoxes
      },
      changeRulesTicTacToe() {
        this.rulesTicTacToe =!this.rulesTicTacToe
      }
    },

    beforeMount() {
      if(!localStorage.nickname) this.setNickname()
    }
  }
</script>

<style>
  .bg-wood {
    width: 100%;
    min-width: 100vw;
    min-height: 100vh;
    position: absolute;
    background: brown url(../assets/img/images.jpg);
    background-size: 100% 40%; 
    filter: brightness(25%);
    z-index: -1;
  }
  .bg-wood-small {
    background: brown url(../assets/img/images.jpg);
    background-size: 100%;
  }
  .markPlayer0 {
    background-color: #475569
  }
  .markPlayer1 {
    background-color: #fff;
  }
  .markPlayer2 {
    background-color: #000;
  }

  .green {
    background-color: lightgreen;
  }
  .red {
    background-color: lightcoral;
  }
</style>
  