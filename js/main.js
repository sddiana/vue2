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
                items: filledItems,
                column: 1,
                completedAt: null
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
            if (savedCards) {
                try {
                    this.cards = JSON.parse(savedCards)
                } catch {
                    this.cards = []
                }
            }

        },

        deleteCard(cardId) {
            this.cards = this.cards.filter(card => card.id !== cardId)
            this.saveCards()
        },

        getPercentage(card) {
            const completedCount = card.items.filter(item => item.checked).length
            return Math.round((completedCount / card.items.length) * 100)
        },

        updateCardPosition(card) {
            const percentage = this.getPercentage(card)
            const oldColumn = card.column

            if (percentage > 50 && card.column === 1) {
                card.column = 2
            } else if (percentage === 100 && card.column === 2) {
                card.column = 3
                card.completedAt = new Date().toLocaleString()
            }

            if (oldColumn !== card.column ) {
                this.saveCards()
            }

        },

        updateCheckbox(cardId, itemIndex) {
            const card = this.cards.find(card => card.id === cardId)
            if(card) {
                card.items[itemIndex].checked = !card.items[itemIndex].checked
                this.updateCardPosition(card)  
                this.saveCards()
            }

        },

        getColumnCards(columnNumber) {
            return this.cards.filter(card => card.column === columnNumber)
        }

    },

    template: `
    <div class="card-list">
        <h3 class="title">All cards</h3>
            <div v-if="cards.length === 0">
                 No cards yet!
            </div>
            <div v-else>
                <div class="columns-container">
                    
                    <div class="column column1">
                    
                        <div v-for="card in getColumnCards(1)" :key="card.id" class="card">
                            <h3>{{ card.title }}</h3>
                            <div v-for="(item, index) in card.items" :key="index" class="item-list-string">
                                <input type="checkbox" :checked="item.checked" @change="updateCheckbox(card.id, index)">
                                <p>{{ item.name }}</p>
                            </div>
                            <button class="delete-button" @click="deleteCard(card.id)">Delete</button>
                        </div>
                    </div>
                    
                    <div class="column column2">
                        <div v-for="card in getColumnCards(2)" :key="card.id" class="card">
                            <h3>{{ card.title }}</h3>
                            <div v-for="(item, index) in card.items" :key="index" class="item-list-string">
                                <input type="checkbox" :checked="item.checked" @change="updateCheckbox(card.id, index)">
                                <p>{{ item.name }}</p>
                            </div>
                            <button class="delete-button" @click="deleteCard(card.id)">Delete</button>
                        </div>
                    </div>
                    
                    <div class="column column3">
                        <div v-for="card in getColumnCards(3)" :key="card.id" class="card">
                            <h3>{{ card.title }}</h3>
                            <div v-for="(item, index) in card.items" :key="index" class="item-list-string">
                                <input type="checkbox" :checked="item.checked" disabled>
                                <p>{{ item.name }}</p>
                            </div>
                            <div class="completed-date" v-if="card.completedAt">
                                Completed: {{ card.completedAt }}
                            </div>
                            <button class="delete-button" @click="deleteCard(card.id)">Delete</button>
                        </div>
                    </div> 
                </div>  
        </div>
    </div>
    `
})

let app = new Vue({
    el: '#app',
})
