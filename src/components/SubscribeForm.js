import React from 'react'
import { stringify } from 'qs'
import { serialize } from 'dom-form-serializer'
import './SubscribeForm.css'

class SubscribeForm extends React.Component {
  static defaultProps = {
    name: 'Subscribe Form',
    subject: '', // optional subject of the notification email
    action: '',
    successMessage: 'Success! You are subscribed.',
    errorMessage: 'There is a problem, your have not subscribed to our list.'
  }

  state = {
    alert: '',
    disabled: false
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.disabled) return

    const form = e.target
    const data = serialize(form)
    this.setState({ disabled: true })
    fetch(form.action + '?' + stringify(data), {
      method: 'POST'
    })
      .then(res => {
        if (res.ok) {
          return res
        } else {
          throw new Error('Network error')
        }
      })
      .then(() => {
        form.reset()
        this.setState({
          alert: this.props.successMessage,
          disabled: false
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          disabled: false,
          alert: this.props.errorMessage
        })
      })
  }

  render() {
    const { name, subject, action } = this.props

    return (
      <form
        className="subscribeForm"
        name={name}
        action={action}
        onSubmit={this.handleSubmit}
        data-netlify=""
        data-netlify-honeypot="confirmEmail"
      >
        {this.state.alert && (
          <div className="enquiryAlert">{this.state.alert}</div>
        )}
        <input
          className="enquiryInput"
          type="email"
          placeholder="Your Email"
          name="email"
          required
        />
        <input type="text" name="confirmEmail" style={{ display: 'none' }} />
        {!!subject && <input type="hidden" name="subject" value={subject} />}
        <input type="hidden" name="form-name" value={name} />
        <input
          className="enquirySubmit"
          type="submit"
          value="Subscribe"
          disabled={this.state.disabled}
        />
      </form>
    )
  }
}

export default SubscribeForm
