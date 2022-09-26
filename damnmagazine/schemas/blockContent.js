import React from 'react'

import {BiDetail as footnoteIcon} from 'react-icons/bi'
import {BiMessageRoundedDetail as quoteIcon} from 'react-icons/bi'
import {MdOutlineContentCopy as contentRowIcon} from 'react-icons/md'
import {RiSuperscript as superscriptIcon} from 'react-icons/ri'
import {BiMoviePlay as videoIcon} from 'react-icons/bi'
import {BiCodeAlt as embedIcon} from 'react-icons/bi'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

//  const dotRender = props => (
//   <span style={{ backgroundColor: 'yellow' }}>{props.children}</span>
// )
const superscriptRender =props=>(
  <sup>{props.children}</sup>
)


 const footnoteRender = props => (
  <span>{props.children}</span>
)
const quotePreview = (value) => {
// console.log(value.value, value.value.quote, value.value.person)
	return (
    <span>
      <span style={{fontWeight:'bold'}}>{value.value.quote}</span>
      <span style={{textTransform:'uppercase'}}> - {value.value.person}</span>
    </span>
  )
}

 export default {
    title: 'Block Content',
    name: 'blockContent',
    type: 'array',
    of: [
      {
        title: 'Block',
        type: 'block',
        // Styles let you set what your user can mark up blocks with. These
        // correspond with HTML tags, but you can set any title or value
        // you want and decide how you want to deal with it where you want to
        // use your content.
        styles: [
          {title: 'Normal', value: 'normal'},
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
          {title: 'H3', value: 'h3'},
          {title: 'H4', value: 'h4'},
          {title: 'Quote', value: 'blockquote'},
        ],
        lists: [{title: 'Bullet', value: 'bullet'}],
        // Marks let you mark up inline text in the block editor.
        marks: {
          // Decorators usually describe a single property – e.g. a typographic
          // preference or highlighting by editors.
          decorators: [
            {title: 'Strong', value: 'strong'},
            {title: 'Emphasis', value: 'em'},
            {title:'Superscript', value: 'sup',
            blockEditor: {
              icon:superscriptIcon,
              render: superscriptRender
            }}
          ],
          // Annotations can be any object structure – e.g. a link or a footnote.
          annotations: [
            {
              title: 'URL',
              name: 'link',
              type: 'object',
              fields: [
                {
                  title: 'URL',
                  name: 'href',
                  type: 'url',
                  validation: (Rule) =>
                  Rule.required().uri({
                    allowRelative: true, // Allow relative links
                    relativeOnly: false, // Force only relative links
                    scheme: ["https", "http", "mailto"], // Default is ["https", "http"]
                  }),
                },
              ],
            },
            {
                title:'Footnote',
                name:'footnote',
                type:'object',
                fields: [
                    {type:'blockContent',
                    name:'content',
                title:'Footnote content'}
                ],
                blockEditor: {
                    icon: footnoteIcon,
                    render: footnoteRender
                  }
            },
          ],
        },
      },
      // {
      //   type: 'image',
      //   options: {hotspot: true},
      // },
      {
        title:'Quote',
        name:'quote',
        type:'object',
        fields: [
            {
            type:'blockContentQuote',
            name:'content',
            title:'Quote text'
          },
          {
            name:'quotePerson',
            type:'string',
            title:'Quote attributed to',
          },
        ],
        preview: {
          select: {
            quote: 'content',
            person:'quotePerson'
          },
          component: quotePreview
          // prepare(selection) {
          //   const {person} = selection
          //   return {
          //     media: quoteIcon,
          //     title: 'Quote by ' + person
          //   }
          // }
        },
      },
      {
        title:'Content row',
        name:'contentRow',
        type:'object',
        fields: [
            {
              type:'array',
              name:'contentRowItem',
              title:'Content item',
              description:'Here you can add a group of images or quotes to appear in the middle of the content. We recommend max. 5 items in one row.',
              of:[
                {
                  title:'Content row',
                  name:'contentRow',
                  type:'object',
                  description:'Add an image a quote, a video or another embedded item',
                  groups: [
                    {
                      name: 'image',
                      title: 'Image',
                      default: true
                    },
                    {
                      name: 'quote',
                      title: 'Quote',
                    },
                    {
                      name: 'video',
                      title: 'Video',
                    },
                    {
                      name: 'embed',
                      title: 'Embed',
                    },
                  ],
                  fields: [
                    {
                      name:'image',
                      type:'image',
                      title:'Image',
                      group:'image',
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
                      name:'quote',
                      type:'blockContentQuote',
                      title:'Quote',
                      group:'quote',
                    },
                    {
                      name:'quotePerson',
                      type:'string',
                      title:'Quote attributed to',
                      group:'quote',
                    },
                    {
                      name:'video',
                      type:'mux.video',
                      title:'Video',
                      group:'video'
                    },
                    {
                      group:'video',
                      name:'thumbnail',
                      title:'Thumbnail image for video',
                      description: 'The best way to define a thumbnail for the video is by uploading it here.',
                      type:'image',
                      hidden: ({ parent }) => !parent?.video
                    },
                    {
                      name:'embed',
                      type:'string',
                      title:'Embed code',
                      group:'embed',
                      description:'Embed any online item like a soundcloud player, an instagram post or a youtube video by pasting the embed code below. Supported embeds are: Youtube, Vimeo, Twitter, SoundCloud, Spotify, Instagram and Tiktok.'
                    }
                  ],
                  preview: {
                    select: {
                    media: 'image',
                    quote:'quote',
                    video:'video',
                    embed:'embed'
                    },
                    prepare(selection) {
                      const {media, quote, video} = selection
                      // console.log(media, quote)
                      return {
                        // title:'title',
                        media: quote ? quoteIcon : media ? media : video ? videoIcon : embedIcon,
                        title: quote ? 'Quote' : media ? 'Image' : video ? 'Video' : 'Embed',
                      }
                    }
                  },
                },
              ],
              validation: Rule => Rule.max(5).error('There can be max five items in one content row.')
            }
        ],
        preview: {
          // select: {
          // media: 'image',
          // quote:'quote'
          // },
          prepare() {
            // const {media, quote} = selection
            // console.log(media, quote)
            return {
              title:'Content row',
              media: contentRowIcon
              // media: quote ? dotIcon : media,
              // title: quote ? 'Quote' : 'Image',
            }
          }
        },
        blockEditor: {
            icon: footnoteIcon,
            render: footnoteRender
          }
    }
    ],
  }
  