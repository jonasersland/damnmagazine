export default {
    widgets: [
      {
        name: 'google-analytics',
        layout: {
          width: 'large'
        },
        options: {
          title: 'Last 30 days',
          gaConfig: {
            reportType: 'ga',
            query: {
              dimensions: 'ga:date',
              metrics: 'ga:users, ga:sessions, ga:newUsers',
              'start-date': '30daysAgo',
              'end-date': 'yesterday'
            },
            chart: {
              type: 'LINE',
              options: {
                width: '100%',
              }
            }
          }
        }
      },
      {
        name: 'google-analytics',
        layout: {
          width: 'medium'
        },
        options: {
          title: 'World map',
          gaConfig: {
            reportType: 'ga',
            query: {
              dimensions: 'ga:country',
              metrics: 'ga:users',
              'start-date': '30daysAgo',
              'end-date': 'yesterday'
            },
            chart: {
              type: 'GEO',
              width: '100%'
            }
          }
        }
      }
    ]
    }