// /deskStructure.js
import S from '@sanity/desk-tool/structure-builder'


import {BiHomeAlt as frontPageIcon} from 'react-icons/bi';
import {BiMessageRoundedDetail as featuresIcon} from 'react-icons/bi';
import {BiChair as realitiesIcon} from 'react-icons/bi';
import {BiCalendarStar as eventsIcon} from 'react-icons/bi';
import {BiShoppingBag as adsIcon} from 'react-icons/bi';
import {BiBookOpen as issuesIcon} from 'react-icons/bi';
import {BiMailSend as contactIcon} from 'react-icons/bi';
import {BiStoreAlt as advertiseIcon} from 'react-icons/bi';
import {BiBulb as aboutIcon} from 'react-icons/bi';
import {BiWrench as settingsIcon} from 'react-icons/bi';



export default () =>
  S.list()
    .title('DAMN Magazine')
    .items([
        S.listItem()
        .title('Home')
        .icon(frontPageIcon)
        .child(
            S.document()
            .schemaType('frontpage')
            .documentId('frontpage')
        ),
        S.divider(),
        S.listItem()
          .title('Features')
          .icon(featuresIcon)
          .child(
              S.documentList()
              .title('Features')
              .filter('_type == "article"')
              .params({ type: "article" })
              .menuItems([
                ...S.documentTypeList("article").getMenuItems()
              ])
          ),
          S.divider(),
          S.listItem()
          .title('Research & Reality')
          .icon(realitiesIcon)
          .child(
              S.documentList()
              .title('Research & Reality')
              .filter('_type == "researchreality"')
              .params({ type: "researchreality" })
              .menuItems([
                ...S.documentTypeList("researchreality").getMenuItems(),
              ])
          ),
          S.divider(),
          S.listItem()
            .title('Calendar')
            .icon(eventsIcon)
            .child(
              S.documentList()
              .title('Calendar')
              .filter('_type == "event"')
                .params({ type: "event" })
                .menuItems([
                  ...S.documentTypeList("event").getMenuItems(),
                  S.orderingMenuItem({title: 'Starting time (ascending)', by: [{field: 'startingTime', direction: 'asc'}]}),
                  S.orderingMenuItem({title: 'Starting time (descending)', by: [{field: 'startingTime', direction: 'desc'}]})
                ])
            ),
            S.divider(),
            S.listItem()
              .title('Ads')
              .icon(adsIcon)
              .child(
                  S.documentList()
                  .title('Ads')
                  .filter('_type == "ad"')
              ),
            S.divider(),
            S.listItem()
            .title('Issues')
            .icon(issuesIcon)
            .child(
                S.documentList()
                .title('Issues')
                .filter('_type == "issue"')
                .params({ type: "issue" })
                .menuItems([
                  ...S.documentTypeList("issue").getMenuItems(),
                  S.orderingMenuItem({title: 'Issue number ascending', by: [{field: 'number', direction: 'asc'}]}),
                  S.orderingMenuItem({title: 'Issue number descending', by: [{field: 'number', direction: 'desc'}]})
                ])
            ),
            S.divider(),
            S.listItem()
            .title('Contact')
            .icon(contactIcon)
            .child(
                S.document()
                .schemaType('contact')
                .documentId('contact')
            ),
            S.divider(),
            S.listItem()
            .title('About')
            .icon(aboutIcon)
            .child(
                S.document()
                .schemaType('about')
                .documentId('about')
            ),
            S.divider(),
            S.listItem()
            .title('Media kit')
            .icon(advertiseIcon)
            .child(
                S.document()
                .schemaType('advertise')
                .documentId('advertise')
            ),
            S.divider(),
            S.listItem()
            .title('Page settings')
            .icon(settingsIcon)
            .child(
                S.document()
                .schemaType('settings')
                .documentId('settings')
            ),
            S.divider(),
            S.listItem()
            .title('Cookie settings')
            .icon(settingsIcon)
            .child(
                S.document()
                .schemaType('cookies')
                .documentId('cookies')
            ),
    ])