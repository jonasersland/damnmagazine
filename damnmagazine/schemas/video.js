import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'video',
  title: 'Video',
  type: 'document',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
        name: 'slug',
        title: 'Url',
        type: 'slug',
        options: {
            source: 'title',
            maxLength: 200, // will be ignored if slugify is set
            slugify: input => input
                                 .toLowerCase()
                                 .replace(/(?!\w|\s)./g, '')
                                 .replace(/\s+/g, '-')
                                 .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2')
                                 .slice(0, 200)
        },
        description: 'The unique string that comes after "damnmagazine.com/"'
    },
    {
        title: "Video file",
        name: "video",
        type: "mux.video"
    },
    {
        type:'string',
        name:'doubleWidth',
        title:'Column width',
        options:{
            list:['Single column', 'Double column'],
            layout:'radio',
            direction: 'horizontal'
        }
    },
    {
        name:'text',
        title:'text',
        type:'blockContent'
    },
    {
        name:'meta',
        title:'Meta-info',
        type:'string',
        description: 'Example: "DAMN80 Winter 2022 / 5 mins" Read"'
    },
    {
        name:'tags',
        title:'Tags',
        type:'tags',
        options: {
            includeFromRelated: 'tags'
          },
    },
    {
        name: 'images',
        title: 'Images',
        type: 'array',
        of:[
            {type:'image',
            name:'image',
            title:'Image',
            fields: [
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                  options: {
                    isHighlighted: true // <-- make this field easily accessible
                  }
                },
            ]
            }
        ]
    },
    {
        name:'author',
        title:'Author',
        type:'reference',
        to:[{type:'author'}]
    }
  ],
    preview: {
        select: {
        title: 'title',
        media: 'highlightImage'
        }
    }
}