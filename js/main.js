let eventBus = new Vue()
Vue.component('card-form', {
    data() {
        return {
            title: '',
            item: ''
        }
    },
    methods: {
        onSubmit() {
            //if(this.title && this.item) 
                let newCard = {
                    id: Date.now(),
                    title: this.title,
                    item: this.item
                }
                eventBus.$emit('card-created', newCard)
                this.title = ''
                this.item = ''
            
        }
    },
    template: `
    <form class="card-form" @submit.prevent="onSubmit">
        <h3>Make a card</h3>
            <p>
                <label for="title">Title:</label>
                <input type="text" id="title" v-model="title" placeholder="title">
            </p>
            <p>
                <label for="item">Item:</label>
                <input type="text" v-model="item" placeholder="item">
            </p>
            <p>
                <input type="submit" value="Submit"> 
            </p>
    </form>
    `
})


Vue.component('card-list', {
    data() {
        return {
            cards: []
        }
    },

    created() {
        eventBus.$on('card-created', (newCard) => {
            this.cards.push(newCard)
        })
    },

    template: `
        <div class="card-list">
            <h3>All cards</h3>
            <div v-if="cards.length === 0">
                No cards yet!
            </div>
            <div v-else>
                <div v-for="card in cards" :key="card.id" class="card">
                    <h3>{{ card.title }}</h3>
                    <div class="card-item">
                        <input type="checkbox">
                        <span>{{ card.item }}</span>
                    </div>
                </div>
            </div>
        </div>
    `,
})

let app = new Vue({
    el: '#app',
})
