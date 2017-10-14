const collection = new Mongo.Collection('wocao')

const cao = {}

cao.collection = collection

cao.init = function () {
  if (! Package['accounts-password'])
    return console.log('cao has to be used with accounts-password, meteor add accounts-password')

  if (Meteor.isClient) {
    Meteor.subscribe('wocao')
    if (Meteor.isDevelopment)
      console.log('subscribe wocao')
  }

  if (Meteor.isServer) {
    collection._ensureIndex('userId', { unique: 1 })

    Meteor.publish('wocao', function () {
      if (! this.userId) return this.ready()

      const isExist = collection.findOne({ userId: this.userId })

      if (! isExist)
        collection.insert({ userId: this.userId })

      return collection.find({ userId: this.userId })
    })
  }

  Meteor.methods({
    'cao.set'(k, v) {
      const isExist = collection.findOne({ userId: this.userId })
      if (isExist && isExist.userId === this.userId)
        return collection.update({ userId: Meteor.userId() }, { $set: { [k]: v } })
    },

    'cao.clear'() {
      return collection.remove({})
    },
  })
}

cao.autorun = function (fn, ctx) {
  if (Meteor.isClient)
    return console.log('cao.autorun is server only')

  // support old meteor version, will remove later
  const _ctx = ctx || DDP._CurrentPublicationInvocation.get()

  const cursor = collection.find({ userId: _ctx.userId })

  const observeHandler = cursor.observe({
    changed(current, previous) {
      fn(current, previous)
    }
  })

  _ctx.onStop(function () {
    observeHandler.stop()
  })

  return observeHandler
}

cao.set = function (k, v) {
  return Meteor.call('cao.set', k, v)
}

cao.clear = function () {
  return Meteor.call('cao.clear')
}

cao.init()

export default cao
