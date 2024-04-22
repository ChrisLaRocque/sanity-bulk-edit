import {DashboardIcon} from '@sanity/icons'
import BulkEdit from './components'

export const myCustomTool = () => {
  return {
    title: 'My Custom Tool',
    name: 'my-custom-tool', // localhost:3333/my-custom-tool
    icon: DashboardIcon,
    component: (props) => BulkEdit(),
  }
}
