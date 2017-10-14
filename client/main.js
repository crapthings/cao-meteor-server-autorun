import cao from '/imports/cao'

TrackerHandler = null
SubscriptionHandler = null

Meteor.startup(function () {
  if (! Meteor.userId())
    Meteor.loginWithPassword('demo', 'demo')

  Tracker.autorun(function (c) {
    const data = cao.collection.find().fetch()
    console.log('cao collection data', data)
  })

  Tracker.autorun(function (c) {
    TrackerHandler = c
    const data = Test.find().fetch()
    console.log('test collection data', data)
  })

  SubscriptionHandler = Meteor.subscribe('test')
})

Template.buttons.events({
  'click #a'() {
    cao.set('a', 'a')
    console.log('click a')
  },

  'click #b'() {
    cao.set('a', 'b')
    console.log('click b')
  },

  'click #c'() {
    cao.set('a', 'c')
    console.log('click c')
  },

  'click #stop'() {
    TrackerHandler.stop()
    SubscriptionHandler.stop()
    console.log('stop track test collection')
  },
})
