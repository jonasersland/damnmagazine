import React from 'react'

import {BiDetail as footnoteIcon} from 'react-icons/bi'
import {RiSuperscript as superscriptIcon} from 'react-icons/ri'

const superscriptRender =props=>(
  <sup>{props.children}</sup>
)


 export default {
    title: 'Block Content Quote',
    name: 'blockContentQuote',
    type: 'array',
    of: [
      {
        title: 'Block',
        type: 'block',
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
        }
      },
    ],
  }
  