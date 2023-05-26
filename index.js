import {Component} from 'react'
import {v4 as uuids4} from 'uuid'
import './index.css'

function getReminderListFromLocalStorage() {
  const stringifiedReminderList = localStorage.getItem('ReminderList')
  const parsedReminderList = JSON.parse(stringifiedReminderList)
  if (parsedReminderList === null) {
    return []
  }
  return parsedReminderList
}

class Reminder extends Component {
  state = {
    reminderList: getReminderListFromLocalStorage(),
    alertReminder: [],
    myTask: '',
    time: '',
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      const date = new Date()
      console.log('called')
      const {alertReminder} = this.state
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const presentTime = `${hours}:${minutes}`
      const {reminderList} = this.state
      const filteredList = reminderList.filter(
        each => each.time === presentTime,
      )
      filteredList.forEach(each => {
        const alreadyInclude = alertReminder.filter(
          eachItem => each.id === eachItem.id,
        )
        if (alreadyInclude.length === 0) {
          this.setState(prevState => ({
            alertReminder: [...prevState.alertReminder, each],
          }))
        }
      })
    }, 31000)
  }

  onAdd = () => {
    const {myTask, time} = this.state
    const newReminder = {task: myTask, time, id: uuids4()}
    this.setState(
      prevState => ({
        reminderList: [...prevState.reminderList, newReminder],
      }),
      this.saveOnLocalStorage,
    )
    this.setState({myTask: '', time: ''})
  }

  saveOnLocalStorage = () => {
    const {reminderList} = this.state
    localStorage.setItem('ReminderList', JSON.stringify(reminderList))
  }

  onChangeTime = event => {
    this.setState({time: event.target.value})
  }

  onChangeTask = event => {
    this.setState({myTask: event.target.value})
  }

  onClickDone = event => {
    const itemId = event.target.id
    const {alertReminder} = this.state
    const newAlerts = alertReminder.filter(each => each.id !== itemId)
    this.setState({alertReminder: newAlerts})
  }

  onClickDelete = event => {
    const itemId = event.target.id

    const {reminderList} = this.state
    const newAlerts = reminderList.filter(each => each.id !== itemId)
    this.setState({reminderList: newAlerts}, this.saveOnLocalStorage)
  }

  render() {
    const {reminderList, alertReminder, myTask, time} = this.state
    return (
      <div className="app-container">
        <div>
          <h1>Add New Reminder</h1>
          <div>
            <input
              type="text"
              onChange={this.onChangeTask}
              placeholder="Add a reminder"
              value={myTask}
            />
            <input type="time" onChange={this.onChangeTime} value={time} />
          </div>
          <button type="button" onClick={this.onAdd} className="add-button">
            Add
          </button>
        </div>
        <h1>MY ALERTS</h1>
        <div className="alertsTab">
          {alertReminder.length > 0 ? (
            <ul className="list-container">
              {alertReminder.map(each => (
                <li key={each.id} className="list-item">
                  <p className="alert">{each.task}</p>
                  <button
                    type="button"
                    id={each.id}
                    onClick={this.onClickDone}
                    className="button"
                  >
                    Done
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p>No alerts at the moment</p>
            </div>
          )}
        </div>
        <h1>MY REMINDERS</h1>
        <div className="remindersTab">
          {reminderList.length > 0 ? (
            <ul className="list-container">
              {reminderList.map(each => (
                <li key={each.id} className="list-item">
                  <p className="alert">{each.task}</p>
                  <button
                    type="button"
                    id={each.id}
                    onClick={this.onClickDelete}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p>No reminders at the moment</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Reminder
