const fetch = require('isomorphic-fetch')
const url = process.env.REACT_APP_API
const toJSON = res => res.json()

const data = function () {
  const setHeader = (header = {}) => {
    header.Authorization = `Bearer ${localStorage.getItem('id_token')}`
    return header
  }
  const list = model => fetch(`${url}/${model}`, {
    headers: setHeader()
  })
    .then(res => {
      if (res.status === 401) {
        throw new Error('Auth Denied')
      }
      return res
    })
    .then(toJSON)


  const get = (model, id) => fetch(`${url}/${model}/${id}`, {
    headers: setHeader()
  }).then(toJSON)

  const post = (model, doc) => fetch(`${url}/${model}`, {
    method: "post",
    body: JSON.stringify(doc),
    headers: setHeader({
      'Content-Type': 'application/json'
    })
  }).then(toJSON)

  const put = (model, id, doc) => fetch(`${url}/${model}/${id}`, {
    method: "PUT",
    body: JSON.stringify(doc),
    headers: setHeader({
      'Content-Type': 'application/json'
    })
  }).then(toJSON)

  const remove = (model, id, doc) => fetch(`${url}/${model}/${id}`, {
    method: "DELETE",
    body: JSON.stringify(doc),
    headers: setHeader()
  }).then(toJSON)

  return {
    list,
    get,
    post,
    put,
    remove
    //,
    //query,
    //subscribe
  }
}

module.exports = data
