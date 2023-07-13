import React from 'react'
import axios from 'axios'
import Form from './Form'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleted: true,
  }
  onInputChange = e => {
    const { value } = e.target
    this.setState({ ...this.state, todoNameInput: value })
  }
  resetForm = () => {
    this.setState({ ...this.state, todoNameInput: '' })
  }
  setAxiosResponseError = err => {
    this.setState({ ...this.state, error: err.response.data.message })
  }
  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
    .then(res => {
      this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data) })
      this.resetForm();
    })
    .catch(this.setAxiosResponseError)
  }
  onTodoFormSubmit = e => {
    e.preventDefault();
    this.postNewTodo();
  }
  fetchAllTodos = () => {
    axios.get(URL)
    .then(res => {
      this.setState({ ...this.state, todos: res.data.data })
    })
    .catch(this.setAxiosResponseError)
  }
  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
    .then(res => {
      this.setState({ ...this.state, todos: this.state.todos.map(td => {
        if (td.id !== id) return td
        return res.data.data
      })})
    })
    .catch(this.setAxiosResponseError)
  }
  toggleDisplayCompleted = () => {
    this.setState({ ...this.state, displayCompleted: !this.state.displayCompleted })
  }
  componentDidMount() {
    this.fetchAllTodos();
  }
  render() {
    return (
      <div>
        <div id='error'>Error: {this.state.error}</div>
        <div id='todos'>  
          <h2>Todos:</h2>
            {
              this.state.todos.reduce((acc, td) => {
                if (this.state.displayCompleted || !td.completed) return acc.concat(
                  <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name}{td.completed ? ' ✔️' : ''}</div>
                )
                return acc
              }, [])
            }
        </div>
            <Form 
              onTodoFormSubmit={this.onTodoFormSubmit}
              todoNameInput={this.state.todoNameInput}
              onInputChange={this.onInputChange}
              toggleDisplayCompleted={this.toggleDisplayCompleted}
              toggleCompleted={this.state.toggleCompleted}
            />
      </div>
    )
  }
}
