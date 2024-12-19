import axios from 'axios'

export const getData = async () => {
  return axios
    .get(`https://site-qa.asteriobid.com/testtask/presentation.json`)
    .then((response: any) => {
      return response
    })
}
