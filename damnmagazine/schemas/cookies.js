import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'cookies',
  title: 'Cookies',
  type: 'document',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
        name: 'initialText',
        title: 'Initial text',
        type: 'blockContent',
    },
    {
        name: 'necessaryText',
        title: 'Explanation text - necessary cookies',
        type: 'blockContent',
    },
    {
        name: 'preferenceText',
        title: 'Explanation text - preference cookies',
        type: 'blockContent',
    },
    {
        name: 'statisticText',
        title: 'Explanation text - statistic cookies',
        type: 'blockContent',
    },
    {
        name: 'marketingText',
        title: 'Explanation text - marketing cookies',
        type: 'blockContent',
    },
    
  ],
    preview: {
        select: {
            title: 'title',
        }
    },
}