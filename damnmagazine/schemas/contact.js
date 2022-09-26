import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'contact',
  title: 'Contact',
  type: 'document',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
        name:'leftCol',
        title:'Left column',
        type:'blockContent'
    },
    {
        name:'righttCol',
        title:'Right column',
        type:'blockContent'
    },
  ],
    preview: {
        select: {
        title: 'title',
        }
    }
}