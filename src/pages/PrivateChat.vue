<script>
import { formatDate } from '@/helpers/date';
import { subscribeToAuthStateChanges } from '@/services/auth';
import { getPrivateMessages, sendPrivateChatMessage, subscribeToPrivateChatMessages } from '@/services/private-chat';
import { getUserProfileById } from '@/services/profile';

let unsubscribeFromPrivateChat = () => {};
export default {
    name: 'PrivateChat',
    data() {
        return {
            user: {
                id: null,
                email: null,
                name: null,
            },

            otherUser: {
                id: null,
                email: null,
                name: null,
            },

            messages: [],

            loadingOtherUser: false,
            loadingMessages: false,

            newMessage: {
                body: '',
            }
        }
    },
    methods: {
        async sendMessage() {
            try {
                await sendPrivateChatMessage({
                    sender_id: this.user.id,
                    receiver_id: this.otherUser.id,
                    body: this.newMessage.body
                })
                this.newMessage.body = '';
            } catch (error) {
                
            }
        },
        formatDate,
    },
    mounted() {
        try {
            this.loadingOtherUser = true;
            this.loadingMessages = true;

            subscribeToAuthStateChanges(userState => this.user = userState);

            subscribeToPrivateChatMessages(
                {
                    sender_id: this.user.id, 
                    receiver_id: this.$route.params.id
                },
                newMessage => this.messages.push(newMessage)
            ).then(unsubscribe => unsubscribeFromPrivateChat = unsubscribe);

            getUserProfileById(this.$route.params.id).then(profile => {
                this.otherUser = profile;
                this.loadingOtherUser = false;
            })

            getPrivateMessages(
                {
                    sender_id: this.user.id, 
                    receiver_id: this.$route.params.id
                }
            ).then(currentMessages => {
                this.messages = currentMessages
                this.loadingMessages = false;
            })
        } catch (error) {

        } finally {
            this.loadingOtherUser = false;
            this.loadingMessages = false;
        }
    },
    unmounted() {
        unsubscribeFromPrivateChat();
    },
}
</script>

<template>
    <h1 class="text-3xl mb-4">Chat con {{ otherUser.name }}</h1>
    <section class="border-2 border-indigo-900 rounded h-100 bg-mist-300 max-h-150 overflow-y-auto">

        <h2 class="sr-only">Listado de publicaciones</h2>

        <ol class="flex flex-col gap-2 p-2">

        <li v-for="message in messages"
            :key="message.id" 
            :class="`${message.sender_id == this.user.id ? 'self-end' : ''}`"
            class="p-2 border-2 border-indigo-800 m-2 rounded-lg bg-mist-200 max-w-xl "
            >
            <div>{{ message.body }}</div>
            <div class="text-sm text-mist-600">Enviado el {{ this.formatDate( message.created_at )}}</div>
        </li>

        </ol>

    </section>
    <section class="mt-4">

      <form action="#"
        @submit.prevent="sendMessage"
        class="flex gap-4 items-stretch"
      >
          <label for="message" class="sr-only">Mensaje</label>
          <textarea v-model="newMessage.body" 
            id="message"
            class="w-full p-2 border-2 border-indigo-800 rounded"
          ></textarea>

        <button class="bg-indigo-800 border-indigo-900 text-amber-50 px-4 py-2 rounded-lg">
          Publicar
        </button>

      </form>
    </section>
</template>