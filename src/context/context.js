import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'
const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  // requests loading
  const [requests, setRequests] = useState(0)
  const [loading, setIsLoading] = useState(false)
  const [error, setError] = useState({ show: false, msg: '' })

  const searchGithubUser = async (user) => {
    toggleError()
    setIsLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    )
    if (response) {
      setGithubUser(response.data)
      const { followers_url, repos_url } = response.data
      await Promise.allSettled([
        axios(`${followers_url}?per_page=100`),
        axios(`${repos_url}?per_page=100`),
      ])
        .then((results) => {
          const [followers_list, repos] = results
          if (followers_list.status === 'fulfilled') {
            setFollowers(followers_list.value.data)
          }
          if (repos.status === 'fulfilled') {
            setRepos(repos.value.data)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      toggleError(true, 'No such user exists')
    }

    checkRequests()
    setIsLoading(false)
  }
  // error
  function toggleError(show = false, msg = '') {
    setError({ show, msg })
  }
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data
        setRequests(remaining)
        if (remaining === 0) {
          // throw error
          toggleError(true, 'sorry your horuly request limit has been exceeded')
        }
      })
      .catch((err) => console.log(err))
  }
  useEffect(checkRequests, [])
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}
export { GithubContext, GithubProvider }
