import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'ad',
  title: 'Advertisement',
  type: 'document',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
        name: 'url',
        title: 'Url',
        type: 'url',
        description:'The link a user is sent to when clicking the ad. In some cases the client will need to implement a unique click tag as a link. This can also go here.',
    },
    {
      type:'array',
      name:'highlightItem',
      title: 'Highlight item',
      // group:'media',
      validation: Rule => Rule.required().max(1),
      options: {
          // collapsible: true, // Makes the whole fieldset collapsible
          // collapsed: false, // Defines if the fieldset should be collapsed by default or not
          editModal:'popover'
        },
      description:'The highlight item is the image or video that shows up on the front page grid.',
      of:[
          {       
              type:'image',
              name:'highlightImage',
              title:'Image',
          },
          {
              title: "Video",
              name: "highlightVideo",
              type: "mux.video"
          },
      ]
  },
  {
    name: 'trackingCode',
    title: 'Advanced - tracking code',
    type: 'string',
    description:'For special cases where the client requires implementing a tracking code to measure the performance of an ad.'
  },
  ],
    preview: {
        select: {
        title: 'title',
        media: 'highlightImage'
        }
    }
}