// src/App.js

import React, { Component } from "react";
import Constants from "./constants";
import Card from "./components/cards";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      errorVisible: false,
      message: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getAllCreditCardList();
  }

  getAllCreditCardList() {
    fetch(Constants.API_URL)
      .then(res => res.json())
      .then(data => {
        this.setState({ cards: data });
      })
      .catch(e => console.log(e));
  }

  handleSubmit(event) {
    event.preventDefault();
    let data = {};
    data["name"] = document.getElementById("name").value;
    data["cardNumber"] = document.getElementById("cardNumber").value;
    data["limit"] = document.getElementById("limit").value;

    if (!this.checkValidation(data)) {
      return;
    }
    fetch(Constants.API_URL, {
      headers: new Headers({ "content-type": "application/json" }),
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 1) {
          this.setState({ errorVisible: false, message: data.message });
          this.getAllCreditCardList();
        } else {
          this.setState({ errorVisible: true, message: data.message });
        }
      })
      .catch(e => console.log(e));
  }

  checkValidation(data) {
    if (data.cardNumber.length !== 10) {
      this.setState({ errorVisible: true, message: Constants.INVALID_CARD });
      return false;
    }
    if (data.limit < 0) {
      this.setState({
        errorVisible: true,
        message: "limit should be more than 0"
      });
      return false;
    }
    return true;
  }

  render() {
    return (
      <div class="parentDiv">
        <h2>Credit Card System</h2>
        <h4 class="addDiv"> Add</h4>
        <div>
          <form id="form1" onSubmit={this.handleSubmit}>
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" id="name" required />
            </div>
            <div class="form-group">
              <label for="cardNumber">Card Number</label>
              <input
                type="number"
                class="form-control"
                id="cardNumber"
                required
              />
            </div>
            <div class="form-group">
              <label for="limit">Limit</label>
              <input type="number" class="form-control" id="limit" required />
            </div>
            <button type="submit" class="btn btn-dark">
              Add
            </button>
          </form>
        </div>
        {this.state.errorVisible ? (
          <h4 class="errorDiv"> {this.state.message}</h4>
        ) : null}

        <div></div>
        <h4 class="existingDiv">Existing Cards</h4>

        <Card cards={this.state.cards} />
      </div>
    );
  }
}

export default App;
