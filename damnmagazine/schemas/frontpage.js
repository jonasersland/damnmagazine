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
      name:'popupArray',
      title:'Popup',
      type:'array',
      description:'Click the button below to define the popup currently showing on the website.',
      validation: Rule => Rule.max(1).warning('Click on the button to edit the current popup.'),
      of:[
        {
          name:'popups',
          title:'Popup',
          type:'object',
          fields:[
            {
              name:'chosenPopup',
              title:'Current popup in use',
              type:'string',
              options: {
                list:[
                  {title: 'No popup', value: 'noPopup'},
                  {title: 'Popup #1', value: 'firstPopup'},
                  {title: 'Popup #2', value: 'secondPopup'},
                  {title: 'Popup #3', value: 'thirdPopup'}
                ]
              }
              },
            {
              name:'firstPopup',
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
                },
                {
                  name:'links',
                  title:'Links',
                  type:'array',
                  of:[
                    {
                      name:'link',
                      title:'Link',
                      type:'object',
                      fields:[
                        {
                          name:'urlTitle',
                          title:'URL title',
                          type:'string',
                        },
                        {
                          name:'urlString',
                          title:'URL string',
                          type:'url',
                        },
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name:'secondPopup',
              title: 'Popup #2',
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
                },
                {
                  name:'links',
                  title:'Links',
                  type:'array',
                  of:[
                    {
                      name:'link',
                      title:'Link',
                      type:'object',
                      fields:[
                        {
                          name:'urlTitle',
                          title:'URL title',
                          type:'string',
                        },
                        {
                          name:'urlString',
                          title:'URL string',
                          type:'url',
                        },
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name:'thirdPopup',
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
                },
                {
                  name:'links',
                  title:'Links',
                  type:'array',
                  of:[
                    {
                      name:'link',
                      title:'Link',
                      type:'object',
                      fields:[
                        {
                          name:'urlTitle',
                          title:'URL title',
                          type:'string',
                        },
                        {
                          name:'urlString',
                          title:'URL string',
                          type:'url',
                        },
                      ]
                    }
                  ]
                }
              ]
            },
          ]
        }
      ]
    },
  ]
}