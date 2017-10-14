import cao from '/imports/cao'

Meteor.startup(function () {

  if (! Meteor.users.findOne())
    Accounts.createUser({ username: 'demo', password: 'demo' })

})

Meteor.publish('test', function () {

  if (! this.userId) return this.ready()

  const autorunHandler = cao.autorun((current, previous) => {
    console.log(current, previous)
    this.added('test', Random.id(), { ...current })
  })

  this.ready()

  this.onStop(() => {
    autorunHandler.stop()
    this.stop()
  })

})
