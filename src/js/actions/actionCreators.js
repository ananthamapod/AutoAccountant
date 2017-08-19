import { ADD_TRANSACTION, GET_TRANSACTIONS, UPDATE_TRANSACTION, GET_ACCOUNTS, CREATE_GOAL, GET_GOALS, CHANGE_GOAL, DELETE_GOAL, CREATE_BILL, GET_BILLS, CHANGE_BILL, DELETE_BILL } from './actionTypes'

function addTransaction(transaction) {
  return {
    type: ADD_TRANSACTION,
    transaction
  }
}

function getTransactions() {
  return {
    type: GET_TRANSACTIONS
  }
}

function updateTransaction(index, transaction) {
  return {
    type: UPDATE_TRANSACTION,
    transaction,
    index
  }
}

function getAccounts() {
  return {
    type: GET_ACCOUNTS
  }
}

function createGoal(goal) {
  return {
    type: CREATE_GOAL,
    goal
  }
}

function getGoals() {
  return {
    type: GET_GOALS
  }
}

function changeGoal(index, goal) {
  return {
    type: CHANGE_GOAL,
    goal,
    index
  }
}

function deleteGoal(index) {
  return {
    type: DELETE_GOAL,
    index
  }
}

function createBill(bill) {
  return {
    type: CREATE_BILL,
    bill
  }
}

function getBills() {
  return {
    type: GET_BILLS
  }
}

function changeBill(index, bill) {
  return {
    type: CHANGE_BILL,
    bill,
    index
  }
}

function deleteBill(index) {
  return {
    type: DELETE_BILL,
    index
  }
}

export { addTransaction, getTransactions, updateTransaction, getAccounts, createGoal, getGoals, changeGoal, deleteGoal, createBill, getBills, changeBill, deleteBill }
