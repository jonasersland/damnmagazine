import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'about',
  title: 'About',
  type: 'document',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
        name:'text',
        title:'Text',
        type:'blockContent'
    },
    {
      name:'bottomtext',
      title:'Bottom text',
      type:'blockContent'
    },
    {
        type:'image',
        name:'image',
        title:'Image',
    },
  ],
    preview: {
        select: {
        title: 'title',
        }
    }
}