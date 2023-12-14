<template>
  <div class="bg-wood">
  </div>
  <div class="min-h-screen flex justify-center z-30 ">
    <div class="w-1/3 min-h-screen bg-wood-small shadow">
      <h2 class="text-center text-4xl my-4">
        Lobby
      </h2>
      <form 
        @submit.prevent="joinPentago"
        class="flex items-center flex-wrap bg-gray-100 border-2 border-gray-900 rounded-xl mx-2 p-4 pl-4 shadow-xl shadow-gray-900/50"
      >
        <div class="text-xl mr-2">
          Pentago
        </div>
        <div class="mr-4 text-xl text-gray-500 underline">
          правила
        </div>
        <div class="flex items-center">
          <input 
            type="text" placeholder="комната" 
            v-model="join_room_form.value"
            class="h-8 bg-gray-100 border border-gray-900 text-gray-900 text-lg rounded-lg block px-2.5 mr-1"
          >
          <img @click="joinPentago()" src="../assets/img/enter-icon.svg" alt="" class="w-5 h-5">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import router from '../router/index'
import { useUserStore } from '../stores/store';
// import { mapWritableState } from 'pinia'

  export default {
    setup() {
      const join_room_form = ({ref})

      const joinPentago = () => {
        const store = useUserStore();
        if(join_room_form.value) {
          store.createRoom('pentago', join_room_form.value)
          router.push({ name: 'pentago', query: {game: 'pentago', room:join_room_form.value }})
        }
      }

      const setNickname = () => {
        let promptValue = prompt('Введите ваше имя')
        if (promptValue) {localStorage.setItem('nickname', promptValue);}
        else localStorage.setItem('nickname', 'unnamed');
      }

      return {
        joinPentago,
        join_room_form,
        setNickname
      }
    },
    data() {
      return {}
    },

    beforeMount() {
      console.log(localStorage.nickname)
      if(!localStorage.nickname) this.setNickname()
    }
  }
</script>

<style>
  .bg-wood {
    width: 100vw;
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
</style>
  