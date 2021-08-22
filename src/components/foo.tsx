// export default () => {
//   return (
//     <h1>函数式组件</h1>
//   )
// }
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    test: {
      type: String,
      require: true,
      default: ''
    }
  },
  render () {
    return (
      <div>{this.test}</div>
    )
  }
})
