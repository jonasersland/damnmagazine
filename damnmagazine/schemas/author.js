import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Name',
      type: 'string',
    },
    {
        name:'text',
        title:'Author info',
        type:'blockContent'
    },
  ],
    preview: {
        select: {
        title: 'title',
        }
    }
}