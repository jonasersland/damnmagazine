import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'frontpage',
  title: 'Front page',
  type: 'document',
  icon,
  fields: [
      {
        name:'title',
        title:'title',
        type:'string'
      },
      {
          name:'slideshow',
          title:'Slideshow elements',
          type:'array',
          of:[
              {
                  type:'object',
                  name:'slide',
                  title:'title',
                  fields:[
                      {
                          name:'slideImage',
                          title:'Slideshow image...',
                          type:'image'
                      },
                      {
                        title: "...or video file",
                        name: "video",
                        type: "mux.video",
                      },
                      {
                        name:'thumbnail',
                        title:'Thumbnail image for video',
                        description: 'The best way to define a thumbnail for the video is by uploading it here.',
                        type:'image',
                        hidden: ({ parent }) => !parent?.video
                      },
                      {
                        name:'slideTitle',
                        title:'Slideshow title',
                        type:'string'
                      },
                      {
                        name:'slideUrl',
                        title:'Link to',
                        type:'reference',
                        to:[
                            {type:'ad'},{type:'article'},{type:'event'},{type:'researchreality'},
                        ]
                    },
                  ]
              }
          ]
      },
    {
        name: 'blocks',
        title: 'Frontpage elements',
        type: 'array',
        of:[
            {type:'reference',
            name:'reference',
            to:[{type:'ad'},{type:'article'},{type:'event'},{type:'researchreality'}]
            }
        ],
    },
    {
      name:'popup',
      title: 'Popup #1',
      type:'object',
      fields:[
        {
          name:'image',
          type:'image',
          title:'Image'
        },
        {
          name:'text',
          type:'blockContent',
          title:'Text'
        }
      ]
    },
    {
      name:'popup2',
      title: 'Popup #1',
      type:'object',
      fields:[
        {
          name:'image',
          type:'image',
          title:'Image'
        },
        {
          name:'text',
          type:'blockContent',
          title:'Text'
        }
      ]
    },
    {
      name:'popup3',
      title: 'Popup #3',
      type:'object',
      fields:[
        {
          name:'image',
          type:'image',
          title:'Image'
        },
        {
          name:'text',
          type:'blockContent',
          title:'Text'
        }
      ]
    }
  ]
}