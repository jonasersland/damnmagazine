import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'advertise',
  title: 'Advertise',
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
      type:'string'
    },
    {
      name:'contactArray',
      title:'Contact',
      type:'array',
      of:[
        {
          name:'contact',
          title:'Contact',
          type:'object',
          fields:[
            {
              name:'contact',
              title:'Contact',
              type:'blockContent',
            }
          ],
          preview:{
            // select: {
            //   title: 'contact',
            // },
            prepare() {
              // const {title, subtitle} = selection
              return {
                title: 'Contact info'
              }
            }
          }
        }
      ]
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