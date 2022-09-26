import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'issue',
  title: 'Issue',
  type: 'document',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
        name: 'number',
        title: 'Issue number',
        type: 'number',
    },
    {
      name: 'url',
      title: 'Purchase url',
      type: 'url',
    },
    {
      name: 'slug',
      title: 'Url',
      type: 'slug',
      validation: Rule => Rule.required(),
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
      description: 'The unique string that comes after "damnmagazine.com/issue/" used to link to this issue.'
  },
    {       type:'image',
            name:'coverImage',
            title:'Cover image',
            description: 'The thumbnail image of '
    },
    {
        name:'text',
        title:'text',
        type:'blockContent'
    },
    {
        name: 'images',
        title: 'Images',
        type: 'array',
        of:[
            {type:'image',
            name:'image',
            title:'Image',
            }
        ]
    },
  ],
    preview: {
        select: {
        title: 'title',
        subtitle: 'number'
        },
        prepare(selection) {
            const {title, subtitle} = selection
            return {
              title: title,
              subtitle: 'Issue ' + subtitle
            }
          }
    },
}