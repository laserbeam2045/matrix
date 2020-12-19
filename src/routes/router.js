import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const routes = [
  {
    path: '/foo',
    component: Foo,
  },
  {
    path: '/bar',
    component: Bar,
  },
]

export default new VueRouter({
  routes,
})