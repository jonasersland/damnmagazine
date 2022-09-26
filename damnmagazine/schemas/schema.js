// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

import blockContent from './blockContent'
import blockContentQuote from './blockContentQuote'
import frontpage from './frontpage'
// import settings from './settings'
import contact from './contact'
import about from './about'
import article from './feature'
import reality from './reality'
import video from './video'
import author from './author'
import issue from './issue'
import event from './event'
import ad from './ad'
import advertise from './advertise'
import settings from './settings'
import cookies from './cookies'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    blockContent,
    blockContentQuote,
    frontpage,
    settings,
    cookies,
    article,
    reality,
    video,
    author,
    event,
    ad,
    contact,
    about,
    issue,
    advertise,
  ]),
})
