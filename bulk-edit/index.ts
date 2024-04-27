import {DashboardIcon} from '@sanity/icons'
import BulkEdit from './components'

export const bulkEdit = () => {
  return {
    title: 'Bulk edit',
    name: 'bulk-edit', // localhost:3333/my-custom-tool
    icon: DashboardIcon,
    component: (props) => BulkEdit(),
  }
}
