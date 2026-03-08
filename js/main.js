let eventBus = new Vue()
Vue.component('card-form', {
    data() {
        return {
            title: '',
            items: ['', '', '', '', ''],
            errorMessage: ''
        }
    },
    methods: {
        countFilledItems() {
            return this.items.filter(item => item).length
        },

        onSubmit() {
            if(!this.title) {
                this.errorMessage = "Enter a list title!"
                return
            }
            const filledItems = this.items.filter(item => item).map(item => ({name: item, checked: false}))

            if(filledItems.length < 3) {
                return this.errorMessage = 'You need at least 3 points!'
            }

            let newCard = {
                id: Date.now(),
                title: this.title,
                items: filledItems
            }
            eventBus.$emit('card-created', newCard)
            this.title = ''
            this.items = ['', '', '', '', '']
            
        }
    },
    template: `
    <form class="card-form" @submit.prevent="onSubmit">
        <h3>Make a card</h3>
            <p class="form-group">
                <label for="title">Title:</label>
                <input type="text" id="title" v-model="title" placeholder="title">
            </p>
            <p class="form-group">
                 <div v-for="(item, index) in items" :key="index">
                    <span>{{ index + 1 }}.</span>
                    <input type="text" v-model="items[index]" class="item-form-text">
                </div>
                
            </p>
            <p v-if="errorMessage" id="error-message">{{ errorMessage }}</p>
            <p>
                <input type="submit" value="Submit" id="submit"> 
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
        this.loadCards()
        
        eventBus.$on('card-created', (newCard) => {
            this.cards.push(newCard)
            this.saveCards()
        })
    },

    methods: {

        saveCards() {
            localStorage.setItem('cards', JSON.stringify(this.cards))
        },

        loadCards() {
            const savedCards = localStorage.getItem('cards')
            this.cards = JSON.parse(savedCards)

        },

        deleteCard(cardId) {
            this.cards = this.cards.filter(card => card.id !== cardId)
            this.saveCards()
        },

        updateCheckbox(cardId, itemIndex) {
            const card = this.cards.find(card => card.id === cardId)
            if(card) {
                card.items[itemIndex].checked = !card.items[itemIndex].checked
                this.saveCards()
            }

        }

    },

    template: `
        <div class="card-list">
            <h3>All cards</h3>
            <div v-if="cards.length === 0">
                No cards yet!
            </div>
            <div v-else>
                <div class="card-list-boxes">
                    <div v-for="card in cards" :key="card.id" class="card">
                        <h3>{{ card.title }}</h3>
                        <div v-for="(item, index) in card.items" :key="index" class="item-list-string">
                            <input type="checkbox" :checked="item.checked" @change="updateCheckbox(card.id, index)">
                            <p>{{ item.name }}</p>
                        </div>
                        <button class="delete-card" @click="deleteCard(card.id)">x</button>
                    </div>
                </div>
            </div>
        </div>
    `,
})

let app = new Vue({
    el: '#app',
})
