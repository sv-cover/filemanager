import { fetchData } from '../../utils'

export default {
  getConfig() {
    return fetchData('conf.json', 'GET')
  }
}
