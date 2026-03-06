
Vue.component('card', {
    data() {
        return {
            title: 'Тестовая карточка 1',
            items: [
                {name: "пункт 1", checked: false},
                {name: "пункт 2", checked: false},
                {name: "пункт 3", checked: false}
            ]
        }
    },
    template: `
    <div class="card">
        <h3>{{ title }}</h3>
        <div v-for="(item, index) in items" :key="index">
            <input type="checkbox" v-model="item.checked">
            <span>{{ item.name }}</span>
        </div>
    </div>
    `,
})

let app = new Vue({
    el: '#app',
})
