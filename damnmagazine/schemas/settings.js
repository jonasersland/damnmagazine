import {BiShow as icon} from 'react-icons/bi'

export default {
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'color',
      title: 'Current theme color',
      type: 'color'
    },
    {
      name: 'latestIssueNumber',
      title: 'Number of the latest issue',
      type: 'number'
    },
    {
      name: 'latestIssueUrl',
      title: 'Link to the purchase page of the latest issue',
      type: 'url'
    },
    {
      name:'privacyText',
      title: 'Privacy policy text',
      type:'blockContent'
    },
    {
      name:'termsConditionsText',
      title: 'Terms and Conditions text',
      type:'blockContent'
    },
    {
      name:'articleAd',
      title:'Article ad - horizontal',
      type:'object',
      fields:[
        {
        type:'image',
        title:'Image',
        name:'image',
        description:'The ad that will appear in the footer of articles'
        },
        {
        type:'url',
        title:'Url',
        name:'url',
        description:'The url that visitors will be sent to when they click the ad'
        },
        {
          name: 'trackingCode',
          title: 'Advanced - tracking code',
          type: 'string',
          description:'For special cases where the client requires implementing a tracking code to measure the performance of an ad.',
        },
      ]
    },
    {
      name:'newsletterSignup',
      title:'Newsletter signup page',
      type:'object',
      fields:[
        {
          type:'string',
          title:'Title',
          name:'title'
        },
        {
        type:'image',
        title:'Image',
        name:'image',
        description:'The image that will show up above the text.'
        },
        {
          name:'text',
          title: 'Text',
          type:'blockContent'
        },
      ]
    }
    
  ],
    preview: {
        select: {
            title: 'title',
        }
    },
}