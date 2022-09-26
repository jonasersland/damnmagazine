import { object } from 'prop-types'
import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'researchreality',
  title: 'Research / Realities',
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
      validation: Rule => Rule.required(),
      group:'media',
    },
    {
        name: 'slug',
        title: 'Url',
        type: 'slug',
        group:'metaContent',
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
        description: 'The unique string that comes after "damnmagazine.com/" used to link to this page.'
    },
    
    {
        type:'string',
        name:'doubleWidth',
        group:'metaContent',
        title:'Column width',
        options:{
            list:['Single column', 'Double column', 'Triple column'],
            layout:'radio',
            direction: 'horizontal'
        }
    },
    {
        name:'meta',
        title:'Meta-info',
        type:'string',
        group:'metaContent',
        // validation: Rule => Rule.required(),
        // description: 'Example: "DAMN°80 Winter 2022 / 5 mins Read". Please note that "DAMN°80" will show up automatically if you connect the article to a specific issue (further below).'
    },
    {
      name: 'originallyPublished',
      title: 'Originally published',
      type: 'datetime',
      group:'metaContent',
      options:{
          timeStep: 15
      },
      description: 'For keeping old content in chronological order.'
    },
    {
        name:'text',
        title:'Text',
        group:'media',
        // validation: Rule => Rule.required(),
        type:'blockContent'
    },
    {
        type:'array',
        name:'highlightItem',
        title: 'Highlight item',
        group:'media',
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
        name: 'slideshow',
        title: 'Media slideshow',
        type: 'array',
        description:'The slideshow that appears above the text. If only a single video or image is uploaded, this will appear as a static image instead of as a slideshow.',
        group:'media',
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
        name:'tags',
        title:'Tags',
        type:'tags',
        group:'metaContent',
        options: {
            includeFromRelated: 'tags'
          },
    },
    {
        name:'author',
        title:'Author',
        type:'reference',
        group:'metaContent',
        to:[{type:'author'}]
    },
    {
        name:'issue',
        title:'Belongs to issue:',
        type:'reference',
        group:'metaContent',
        to:[{type:'issue'}],
        description: "Makes it easy to discover other articles from the same issue."
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
      description:'For special cases where the client requires implementing an iframe tracking code to measure the performance of an ad. The tracking code must be an iFrame tag (e.g. start with "<IFRAME" )',
      group:'advancedContent',
    },
  ],
    preview: {
        select: {
        title: 'title',
        // media: 'highlightImage'
        }
    }
}