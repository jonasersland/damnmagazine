import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  icon,
  groups: [
    {
      name: 'media',
      title: 'Media and text',
      default: true
    },
    {
      name: 'metaContent',
      title: 'Meta content',
    },
    {
      name: 'advancedContent',
      title: 'Advanced',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group:'media',
    },
    {
        group:'metaContent',
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
        group:'media',
        name: 'startingTime',
        title: 'Starting time',
        type: 'datetime',
        options:{
            timeStep: 15
        },
        validation: Rule => Rule.required() 
    },
    {
        group:'media',
        name: 'endingTime',
        title: 'Ending time',
        type: 'datetime',
        options:{
            timeStep: 15
        }
    },
    {
        group:'media',
        name:'city',
        title:'City',
        type:'tags',
        options: {
            includeFromRelated: 'city'
          },
          description:'The city where the event takes place.',
          validation: Rule => Rule.required() 
    },
    {
        group:'media',
        name:'place',
        title:'Place',
        type:'tags',
        options: {
            includeFromRelated: 'place'
          },
        description:'The venue or location where the event takes place.',
        validation: Rule => Rule.required() 
    },
    {
        group:'media',
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
      group:'media',
      name:'thumbnail',
      title:'Thumbnail image for video',
      description: 'The best way to define a thumbnail for the video is by uploading it here.',
      type:'image',
      // hidden: ({ parent }) => !parent?.video
    },
    {
        group:'metaContent',
        type:'string',
        name:'doubleWidth',
        title:'Column width',
        options:{
            list:['Single column', 'Double column', 'Triple column'],
            layout:'radio',
            direction: 'horizontal'
        }
    },
    {
        group:'media',
        name:'text',
        title:'text',
        type:'blockContent'
    },
    {
        group:'metaContent',
        name:'meta',
        title:'Meta-info',
        type:'string',
        // description: 'Example: "DAMN80 Winter 2022 / 5 mins" Read"'
    },
    {
        group:'media',
        name: 'slideshow',
        title: 'Media slideshow',
        type: 'array',
        description:'The slideshow that appears above the text. If only a single video or image is uploaded, this will appear as a static image instead of as a slideshow.',
        of:[
            {
            type:'image',
            name:'image',
            title:'Image',
            fields: [
                {
                  name: 'caption',
                  type: 'blockContent',
                  title: 'Caption',
                  options: {
                    isHighlighted: true // <-- make this field easily accessible
                  }
                },
                ]
            },
            {
                title: "Video file",
                name: "video",
                type: "mux.video"
            },
        ]
    },
    {
        group:'metaContent',
        name:'author',
        title:'Author',
        type:'reference',
        to:[{type:'author'}]
    },
    {
        name:'hideRelated',
        title:'Hide related content',
        type:'boolean',
        group:'advancedContent',
        description: "Set whether to hide related articles at the bottom of the article."
      },
      {
        name: 'trackingCode',
        title: 'Advanced - tracking code',
        type: 'string',
        description:'For special cases where the client requires implementing a tracking code to measure the performance of an ad.',
        group:'advancedContent',
      },
  ],
    preview: {
        select: {
        title: 'title',
        date: 'startingTime',
        },
        prepare(selection) {
            const {title, date} = selection;
            let formattedDate = new Date(date);
            // console.log(formattedDate)

            return {
              title: title,
              subtitle: formattedDate.toLocaleDateString()
            }
          }
    }
}